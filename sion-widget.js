// Sion dentro de la clase.
// Antes el asistente solo existia en la portada y en el catalogo: desaparecia
// justo donde el maestro pasa la mayor parte del tiempo. Este modulo inyecta el
// mismo panel (reutiliza sion-ui.css) y lo hace consciente de la leccion abierta.
import { LESSONS, lessonBySlug } from '/lesson-data.js?v=11';

if (!document.querySelector('.jerubi-launch')) {
  // sion-widget.css trae la geometria base del panel; sion-ui.css va despues
  // porque reestiliza el lanzador y debe ganar.
  if (!document.querySelector('link[href^="/sion-widget.css"]')) {
    document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="/sion-widget.css?v=2">');
  }
  if (!document.querySelector('link[href^="/sion-ui.css"]')) {
    document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="/sion-ui.css?v=3">');
  }

  const slug = document.body.dataset.lesson || location.pathname.split('/').filter(Boolean).at(-1);
  const lesson = lessonBySlug(slug);
  const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  // sion-ai.js envia este catalogo como contexto a la funcion segura de Supabase.
  if (!window.Semillitas) {
    window.Semillitas = Object.freeze({
      lessons: Object.freeze(LESSONS.map((item, index) => Object.freeze({
        id: String(item.id), index, title: item.title, reference: item.reference,
        category: item.category, emoji: item.icon || '📖', objective: item.objective
      }))),
      openLesson: id => { const l = LESSONS.find(x => String(x.id) === String(id)); if (l) location.href = `/lecciones/${l.slug}/`; }
    });
  }

  const saludo = lesson
    ? `¡Dios te bendiga! Soy <strong>Sion</strong>. Veo que estás en <strong>${esc(lesson.title)}</strong> (${esc(lesson.reference)}). Puedo explicarte la historia para los más pequeños, darte una dinámica o ayudarte si los niños se distraen.`
    : '¡Dios te bendiga! Soy <strong>Sion</strong>. Pídeme una lección, una dinámica o un consejo para tu clase.';

  const acciones = lesson
    ? [['simple','Explícalo a un niño de 4'],['dinamica','Dinámica'],['preguntas','Preguntas'],['versiculo','Versículo'],['oracion','Oración'],['distraen','Se distraen']]
    : [['lesson','Dame una lección'],['dinamica','Dinámica'],['distraen','Se distraen']];

  document.body.insertAdjacentHTML('beforeend', `
<button class="jerubi-launch" id="jerubiLaunch" aria-controls="jerubiPanel" aria-expanded="false" aria-label="Abrir asistente bíblico Sion">📖</button>
<aside class="jerubi-panel" id="jerubiPanel" aria-hidden="true" aria-label="Asistente bíblico Sion">
<div class="jerubi-head"><div class="jerubi-title"><span class="jerubi-avatar" aria-hidden="true">📖</span><div><strong>Sion</strong><small>Compañero bíblico · Reina-Valera</small></div></div><button class="jerubi-close" id="jerubiClose" aria-label="Cerrar Sion">✕</button></div>
<div class="jerubi-messages" id="jerubiMessages" aria-live="polite"><div class="jerubi-bubble">${saludo}</div></div>
<div class="jerubi-quick">${acciones.map(([a, t]) => `<button data-j-action="${a}">${t}</button>`).join('')}</div>
<form class="jerubi-form" id="jerubiForm"><input id="jerubiInput" aria-label="Habla con Sion" placeholder="Pregúntame sobre esta clase…" autocomplete="off"><button>Enviar</button></form>
</aside>`);

  const panel = document.getElementById('jerubiPanel');
  const launch = document.getElementById('jerubiLaunch');
  const messages = document.getElementById('jerubiMessages');
  const form = document.getElementById('jerubiForm');
  const input = document.getElementById('jerubiInput');

  const say = (html, who = 'bot') => {
    const bubble = document.createElement('div');
    bubble.className = 'jerubi-bubble' + (who === 'user' ? ' user' : '');
    bubble.innerHTML = html;
    messages.append(bubble);
    messages.scrollTop = messages.scrollHeight;
  };

  const toggle = open => {
    panel.classList.toggle('is-open', open);
    panel.setAttribute('aria-hidden', String(!open));
    launch.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
  };
  launch.addEventListener('click', () => toggle(!panel.classList.contains('is-open')));
  document.getElementById('jerubiClose').addEventListener('click', () => toggle(false));
  // Cerrar con Escape y devolver el foco al boton, igual que en la portada.
  document.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Escape') return;
    var panel = document.getElementById('jerubiPanel');
    if (panel && panel.classList.contains('is-open')) {
      toggle(false);
      var l = document.querySelector('.jerubi-launch');
      if (l) l.focus();
    }
  });

  // Respuestas locales basadas en la leccion abierta. Si el maestro activa
  // "Sion inteligente", sion-ai.js intercepta el envio y responde con la IA.
  function responder(accion) {
    if (!lesson) {
      if (accion === 'lesson') {
        const r = LESSONS[Math.floor(Math.random() * LESSONS.length)];
        say(`Te propongo <strong>${esc(r.title)}</strong> — ${esc(r.reference)}.<br>${esc(r.objective)}.<button data-ir="${esc(r.slug)}">Abrir esta clase</button>`);
      } else {
        say('Abre una clase y podré ayudarte con su historia, dinámica y preguntas.');
      }
      return;
    }
    if (accion === 'simple') {
      say(`<strong>Para los más pequeños (3 a 5 años):</strong><br>${esc(lesson.story[0][1])}<br><br>Repite con ellos esta frase: <em>“${esc(lesson.takeaways?.[0] || lesson.objective)}”</em>. Usa gestos y deja que señalen la ilustración.`);
    } else if (accion === 'dinamica') {
      say(`<strong>${esc(lesson.activity.title)}</strong><ol>${lesson.activity.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>`);
    } else if (accion === 'preguntas') {
      say(`<strong>Preguntas para conversar:</strong><ul>${lesson.questions.map(q => `<li>${esc(q)}</li>`).join('')}</ul>Los más pequeños pueden responder señalando o con gestos.`);
    } else if (accion === 'versiculo') {
      say(`<strong>${esc(lesson.memory.reference)} · RVR1960</strong><br><em>“${esc(lesson.memory.text)}”</em><br><br>Divídelo en tres partes y añade un movimiento a cada una.`);
    } else if (accion === 'oracion') {
      say(esc(lesson.prayer));
    } else if (accion === 'distraen') {
      say('Tres recursos rápidos:<ol><li>Baja la voz en vez de subirla: los niños se callan para oírte.</li><li>Haz una pausa de movimiento de 30 segundos y retoma.</li><li>Dales un papel: que uno sostenga la Biblia y otro pase las ilustraciones.</li></ol>');
    }
  }

  function buscar(texto) {
    const t = texto.toLocaleLowerCase('es');
    if (/pequen|peque|3 a 5|cuatro|4 anos|4 años|simple|sencill/.test(t)) return responder('simple');
    if (/dinamic|dinámic|activid|juego|manualid/.test(t)) return responder('dinamica');
    if (/pregunt|conversa/.test(t)) return responder('preguntas');
    if (/versicul|versícul|memoriz/.test(t)) return responder('versiculo');
    if (/oracion|oración|orar|rezar/.test(t)) return responder('oracion');
    if (/distra|inquiet|portan mal|desorden|ruido|controlar/.test(t)) return responder('distraen');
    if (lesson && /historia|relato|resumen|cuenta/.test(t)) {
      return say(`<strong>${esc(lesson.title)}</strong> — ${esc(lesson.reference)}<ol>${lesson.story.map(p => `<li><strong>${esc(p[0])}:</strong> ${esc(p[1])}</li>`).join('')}</ol>`);
    }
    const hallazgos = LESSONS.filter(l => [l.title, l.reference, l.objective, l.category].join(' ').toLocaleLowerCase('es').includes(t)).slice(0, 4);
    if (hallazgos.length) {
      return say(`<strong>Estas clases se relacionan con tu pregunta:</strong>${hallazgos.map(l => `<button data-ir="${esc(l.slug)}">${esc(l.title)} · ${esc(l.reference)}</button>`).join('')}`);
    }
    say('Puedo ayudarte con la <strong>historia, una dinámica, las preguntas, el versículo, la oración</strong> o qué hacer si los niños se distraen. También puedes activar <strong>Sion inteligente</strong> aquí abajo para conversar con libertad.');
  }

  document.querySelector('.jerubi-quick').addEventListener('click', e => {
    const b = e.target.closest('[data-j-action]');
    if (b) responder(b.dataset.jAction);
  });
  messages.addEventListener('click', e => {
    const b = e.target.closest('[data-ir]');
    if (b) location.href = `/lecciones/${b.dataset.ir}/`;
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    say(esc(q), 'user');
    input.value = '';
    setTimeout(() => buscar(q), 160);
  });

  // Activa el interruptor "Sion inteligente" (IA segura vía Supabase).
  import('/sion-ai.js?v=2').catch(() => {});
}
