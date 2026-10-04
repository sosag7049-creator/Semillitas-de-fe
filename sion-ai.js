// Sion en la nube. WebLLM se retiró para evitar descargas pesadas y respuestas
// demasiado limitadas en teléfonos. La función segura de Supabase mantiene la
// clave del proveedor fuera del navegador y deja el Sion bíblico como respaldo.
const form = document.getElementById("jerubiForm");
const messages = document.getElementById("jerubiMessages");
const input = document.getElementById("jerubiInput");
const quick = document.querySelector(".jerubi-quick");

if (form && messages && input && quick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "sion-ai-toggle";
  button.textContent = "Sion inteligente";
  button.title = "Respuestas más naturales mediante la IA segura de Semillitas";
  button.setAttribute("aria-label", "Activar o desactivar Sion inteligente");
  button.setAttribute("aria-pressed", "false");
  quick.append(button);

  const say = (html, who = "bot") => {
    const item = document.createElement("div");
    item.className = "jerubi-bubble" + (who === "user" ? " user" : "");
    item.innerHTML = html;
    messages.append(item);
    messages.scrollTop = messages.scrollHeight;
    return item;
  };
  const escape = value => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
  let enabled = false;
  let busy = false;

  button.addEventListener("click", () => {
    enabled = !enabled;
    button.textContent = enabled ? "Sion inteligente activo" : "Sion inteligente";
    button.setAttribute("aria-pressed", String(enabled));
    say(enabled
      ? "✅ Sion inteligente está listo. Pregúntame sobre la Biblia, una lección o una dinámica."
      : "Sion inteligente desactivado. Continuaré con la biblioteca bíblica rápida.");
  });

  form.addEventListener("submit", async event => {
    if (!enabled || busy) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const question = input.value.trim();
    if (!question) return;
    say(escape(question), "user");
    input.value = "";
    const pending = say("Sion está pensando…");
    busy = true;
    try {
      const response = await fetch("https://wadfxtlbznxmbutkihkr.supabase.co/functions/v1/sion-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          lessons: (window.Semillitas?.lessons || []).slice(0, 80).map(lesson => ({
            title: lesson.title, reference: lesson.reference, objective: lesson.objective
          }))
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "La IA no está disponible todavía.");
      pending.innerHTML = escape(data.answer || "No encontré una respuesta. Prueba con una pregunta bíblica.").replace(/\n/g, "<br>");
    } catch (error) {
      pending.innerHTML = `No pude conectar con la IA en este momento. Sion seguirá disponible con sus respuestas bíblicas. <small>${escape(error.message)}</small>`;
    } finally {
      busy = false;
    }
  }, true);
}
