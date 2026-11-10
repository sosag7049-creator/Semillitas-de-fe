// Sion inteligente · capa de IA del asistente bíblico.
//
// Este archivo se carga igual en la portada (su chat propio) y en el resto del
// sitio (sion-widget.js). No reemplaza las respuestas locales: las complementa
// cuando el maestro enciende el interruptor.
//
// Lo que hace distinto a la versión anterior:
//   · Manda la lección abierta completa, así Sion habla de la clase de verdad.
//   · Recuerda los últimos turnos: se puede repreguntar sin repetir contexto.
//   · Los enlaces a otras lecciones los decide el servidor sobre el catálogo
//     real, no el modelo (que inventaría rutas).
//   · Los botones rápidos también pasan por la IA cuando está encendida.
//   · Si falla, explica qué pasó y deja reintentar en un toque.
//
// La clave del proveedor no está aquí: vive en los secretos de Supabase.

const ENDPOINT = "https://wadfxtlbznxmbutkihkr.supabase.co/functions/v1/sion-chat";
const AVISO_NOTE = "Sion usa inteligencia artificial sobre el material Reina-Valera de este sitio. Verifica siempre el pasaje completo y la enseñanza de tu iglesia.";
const CLAVE_ESTADO = "semillitas.sion.ia";

const form = document.getElementById("jerubiForm");
const messages = document.getElementById("jerubiMessages");
const input = document.getElementById("jerubiInput");
const quick = document.querySelector(".jerubi-quick");

if (form && messages && input && quick) {
  const esc = (value) =>
    String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  // Texto que Sion recibe cuando el maestro toca un botón rápido. Cubre los
  // botones de la portada y los del widget: comparten el mismo atributo.
  const INTENCIONES = {
    simple: "Explícame la historia de esta lección para un niño de 4 años, con palabras muy sencillas.",
    dinamica: "Dame una dinámica con pocos materiales para esta lección.",
    dynamic: "Dame una dinámica con pocos materiales para esta lección.",
    preguntas: "Dame preguntas para conversar con niños de 3 a 10 años sobre esta lección.",
    versiculo: "¿Cómo enseño el versículo para memorizar de esta lección?",
    oracion: "Escríbeme una oración corta para cerrar esta clase.",
    distraen: "Se están distrayendo los niños. ¿Qué hago ahora mismo en el salón?",
    lesson: "Recomiéndame una lección para mi próxima clase.",
    prepare: "Ayúdame a preparar una clase de 60 minutos.",
    recommend: "Recomiéndame una lección para lo que necesito enseñar.",
    tip: "Dame un consejo práctico para mi clase con niños.",
    theme: "¿Qué temas puedo enseñar a niños de 3 a 10 años?",
  };

  /* ------------------------------------------------------------ estado --- */

  let habilitada = false;
  try {
    habilitada = localStorage.getItem(CLAVE_ESTADO) === "1";
  } catch {
    habilitada = false;
  }

  const historial = []; // { role, content }
  let ocupado = false;
  let ultimaPregunta = null;

  if (!document.querySelector(".sion-ai-toggle")) {
    const estilo = document.createElement("style");
    estilo.textContent = `
      .sion-ai-toggle{white-space:nowrap}
      .jerubi-quick .sion-ai-toggle[aria-pressed="true"]{background:linear-gradient(135deg,#3d826b,#5c3c9a);border-color:transparent;color:#fff}
      .sion-ai-typing{display:inline-flex;gap:4px;align-items:center;height:1em}
      .sion-ai-typing i{width:7px;height:7px;border-radius:50%;background:#6b7f8d;animation:sionDot 1s infinite ease-in-out}
      .sion-ai-typing i:nth-child(2){animation-delay:.15s}
      .sion-ai-typing i:nth-child(3){animation-delay:.3s}
      @keyframes sionDot{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
      .sion-ai-muestras{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
      .sion-ai-muestras button{width:auto;flex:0 0 auto;font-weight:700;padding:7px 10px}
      .jerubi-bubble .sion-ai-reintentar{margin-top:8px;background:#fff4e5;border-color:#e8c79a;color:#7a4b12}
      @media (prefers-reduced-motion:reduce){.sion-ai-typing i{animation:none;opacity:.6}}
    `;
    document.head.append(estilo);
  }

  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "sion-ai-toggle";
  boton.setAttribute("aria-label", "Activar o desactivar Sion inteligente");
  quick.append(boton);

  const pintarBoton = () => {
    boton.textContent = habilitada ? "✨ Sion inteligente activo" : "✨ Sion inteligente";
    boton.setAttribute("aria-pressed", String(habilitada));
    boton.title = habilitada
      ? "Respuestas abiertas con IA. Toca para volver a la biblioteca rápida."
      : "Respuestas más naturales con IA, basadas en esta lección";
  };

  /* ------------------------------------------------------------ dibujo --- */

  const alFinal = () => {
    messages.scrollTop = messages.scrollHeight;
  };

  const burbuja = (html, quien = "bot") => {
    const item = document.createElement("div");
    item.className = "jerubi-bubble" + (quien === "user" ? " user" : "");
    item.innerHTML = html;
    messages.append(item);
    alFinal();
    return item;
  };

  /** Markdown mínimo y seguro: se escapa primero, se formatea después. */
  const formatear = (texto) => {
    const lineas = esc(String(texto || "")).split(/\r?\n/);
    const trozos = [];
    let lista = null; // "ul" | "ol" | null
    let hayTexto = false;

    const cerrarLista = () => {
      if (lista) {
        trozos.push(`</${lista}>`);
        lista = null;
        hayTexto = false;
      }
    };
    const enLinea = (linea) =>
      linea
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>")
        .replace(/`([^`]+)`/g, "<code>$1</code>");

    for (const cruda of lineas) {
      const linea = cruda.replace(/^#{1,6}\s*/, "").trim();
      if (!linea) {
        cerrarLista();
        trozos.push("<br>");
        continue;
      }
      const vineta = linea.match(/^[-•*]\s+(.*)$/);
      const numerada = linea.match(/^\d+[.)]\s+(.*)$/);
      if (vineta || numerada) {
        const tipo = vineta ? "ul" : "ol";
        if (lista !== tipo) {
          cerrarLista();
          trozos.push(`<${tipo}>`);
          lista = tipo;
        }
        trozos.push(`<li>${enLinea((vineta || numerada)[1])}</li>`);
        continue;
      }
      cerrarLista();
      if (hayTexto) trozos.push("<br>");
      trozos.push(enLinea(linea));
      hayTexto = true;
    }
    cerrarLista();
    return trozos.join("").replace(/^(?:<br>)+|(?:<br>)+$/g, "");
  };

  const botonesLecciones = (relacionadas) => {
    if (!Array.isArray(relacionadas) || !relacionadas.length) return "";
    return (
      `<div class="sion-ai-muestras">` +
      relacionadas
        .slice(0, 3)
        .map(
          (item) =>
            `<button type="button" data-sion-ir="${esc(item.slug)}">${esc(item.title)}${
              item.reference ? ` · ${esc(item.reference)}` : ""
            }</button>`
        )
        .join("") +
      `</div>`
    );
  };

  const escribiendo = () => {
    const item = burbuja(
      `<span class="sion-ai-typing" role="status" aria-label="Sion está escribiendo"><i></i><i></i><i></i></span>`
    );
    messages.setAttribute("aria-busy", "true");
    return item;
  };

  /* ---------------------------------------------------------- contexto --- */

  let catalogo = null;
  let leccion = null;
  const slug = (() => {
    if (document.body.dataset.lesson) return document.body.dataset.lesson;
    const partes = location.pathname.split("/").filter(Boolean);
    return partes[0] === "lecciones" && partes[1] ? partes[1] : "";
  })();

  const cargarContexto = async () => {
    if (catalogo) return;
    try {
      const mod = await import("/lesson-data.js?v=17");
      catalogo = (mod.LESSONS || []).map((item) => ({
        slug: item.slug,
        title: item.title,
        reference: item.reference,
        objective: item.objective,
        category: item.category,
      }));
      const actual = slug ? mod.lessonBySlug(slug) : null;
      leccion = actual
        ? {
            slug: actual.slug,
            title: actual.title,
            reference: actual.reference,
            category: actual.category,
            objective: actual.objective,
            story: actual.story,
            activity: actual.activity,
            questions: actual.questions,
            memory: actual.memory,
            prayer: actual.prayer,
            takeaways: actual.takeaways,
          }
        : null;
    } catch {
      catalogo = [];
      leccion = null;
    }
  };

  /* ------------------------------------------------------------ pedido --- */

  const preguntar = async (pregunta, etiqueta) => {
    if (!pregunta || ocupado) return;
    if (!navigator.onLine) {
      burbuja("Parece que no hay conexión. Mientras tanto puedo responderte con la biblioteca del sitio: desactiva <strong>Sion inteligente</strong> y vuelve a preguntar.", "bot");
      return;
    }

    ocupado = true;
    ultimaPregunta = pregunta;
    burbuja(esc(etiqueta || pregunta), "user");
    input.value = "";
    const pendiente = escribiendo();

    await cargarContexto();

    const control = new AbortController();
    const reloj = setTimeout(() => control.abort(), 25_000);

    try {
      const respuesta = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: control.signal,
        body: JSON.stringify({
          question: pregunta,
          lesson: leccion || undefined,
          lessons: catalogo || [],
          history: historial.slice(-6),
        }),
      });

      const datos = await respuesta.json().catch(() => ({}));
      if (!respuesta.ok && !datos.answer) {
        const mensaje =
          datos.code === "limite"
            ? datos.error
            : datos.code === "sin_clave"
              ? "El asistente todavía no está activo en el sitio. Mientras se configura, sigo respondiendo con la biblioteca."
              : datos.error || "No pude responder ahora mismo.";
        pendiente.innerHTML = `${esc(mensaje)}${
          datos.code === "limite" ? "" : `<button type="button" class="sion-ai-reintentar" data-sion-reintentar>Reintentar</button>`
        }`;
        return;
      }

      const texto = datos.answer || datos.error || "No encontré una respuesta.";
      pendiente.innerHTML = formatear(texto) + botonesLecciones(datos.related);

      historial.push({ role: "user", content: pregunta });
      historial.push({ role: "assistant", content: String(texto).slice(0, 600) });
      while (historial.length > 8) historial.shift();
    } catch (error) {
      const sinTiempo = error?.name === "AbortError";
      pendiente.innerHTML = `${esc(
        sinTiempo
          ? "Sion tardó demasiado en contestar. Revisa tu conexión o prueba con una pregunta más corta."
          : "No pude conectar con Sion. La biblioteca del sitio sigue disponible si desactivas el interruptor."
      )}<button type="button" class="sion-ai-reintentar" data-sion-reintentar>Reintentar</button>`;
    } finally {
      clearTimeout(reloj);
      messages.setAttribute("aria-busy", "false");
      ocupado = false;
      alFinal();
    }
  };

  /* ------------------------------------------------------------- eventos --- */

  const muestras = () => {
    const preguntas = leccion
      ? ["Explícamela para un niño de 4 años", "Dame una dinámica sin materiales", "¿Cómo cierro con oración?"]
      : ["Dame una lección para esta semana", "¿Cómo enseño el perdón?", "Ideas para niños que se distraen"];
    return (
      `<div class="sion-ai-muestras">` +
      preguntas.map((texto) => `<button type="button" data-sion-ask="${esc(texto)}">${esc(texto)}</button>`).join("") +
      `</div>`
    );
  };

  boton.addEventListener("click", () => {
    habilitada = !habilitada;
    pintarBoton();
    try {
      localStorage.setItem(CLAVE_ESTADO, habilitada ? "1" : "0");
    } catch {
      /* modo privado: se recuerda solo en esta página */
    }
    if (habilitada) {
      burbuja(
        "✨ <strong>Sion inteligente</strong> listo. Ahora puedo explicarte la historia, adaptarla por edades, armar dinámicas y conversar contigo." +
          muestras() +
          `<small>${esc(AVISO_NOTE)}</small>`
      );
    } else {
      burbuja("Volvemos a la biblioteca rápida del sitio. Puedes encender la IA cuando quieras.");
    }
  });

  // Los botones rápidos también conversan cuando la IA está encendida. Se
  // intercepta en captura para que el manejador local no responda dos veces.
  document.addEventListener(
    "click",
    (evento) => {
      const objetivo = evento.target;
      if (!(objetivo instanceof Element) || objetivo.closest(".sion-ai-toggle")) return;
      const accion = objetivo.closest("[data-j-action]");
      if (!accion || !habilitada) return;
      evento.preventDefault();
      evento.stopPropagation();
      evento.stopImmediatePropagation();
      const intencion = INTENCIONES[accion.dataset.jAction];
      if (intencion) preguntar(intencion, accion.textContent.trim());
    },
    true
  );

  document.addEventListener(
    "click",
    (evento) => {
      const objetivo = evento.target;
      if (!(objetivo instanceof Element)) return;
      const reintentar = objetivo.closest("[data-sion-reintentar]");
      if (reintentar && ultimaPregunta) {
        reintentar.closest(".jerubi-bubble")?.remove();
        preguntar(ultimaPregunta);
        return;
      }
      const pregunta = objetivo.closest("[data-sion-ask]");
      if (pregunta) {
        preguntar(pregunta.dataset.sionAsk, pregunta.dataset.sionAsk);
        return;
      }
      const ir = objetivo.closest("[data-sion-ir]");
      if (ir) {
        location.href = `/lecciones/${encodeURIComponent(ir.dataset.sionIr)}/`;
      }
    },
    true
  );

  // En captura sobre el documento: así corre antes que el manejador local del
  // chat (que está en el propio formulario) y no responde dos veces.
  document.addEventListener(
    "submit",
    (evento) => {
      if (!habilitada || evento.target !== form) return;
      evento.preventDefault();
      evento.stopImmediatePropagation();
      const pregunta = input.value.trim();
      if (pregunta) preguntar(pregunta);
    },
    true
  );

  // Enter dentro del campo también envía en los chats que no usan <form>.
  input.addEventListener("keydown", (evento) => {
    if (evento.key !== "Enter" || !habilitada || evento.isComposing) return;
    evento.preventDefault();
    const pregunta = input.value.trim();
    if (pregunta) preguntar(pregunta);
  });

  pintarBoton();
}
