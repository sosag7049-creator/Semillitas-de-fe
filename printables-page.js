import { PRINTABLES } from '/printables-data.js';
const preschool = await fetch('/preschool-data.json').then(response => response.ok ? response.json() : []).catch(() => []);

const root = document.querySelector('#printRoot');
const selector = document.querySelector('#lessonSelect');
const download = document.querySelector('#downloadPdf');
const tabs = document.querySelector('#pageTabs');
const safe = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const lessonId = new URLSearchParams(location.search).get('leccion');
let current = PRINTABLES.find(item => item.id === lessonId) || PRINTABLES[0];

function header(lesson, badge, page) {
  return `<div class="sheet-header"><span class="sheet-badge">${safe(badge)}</span><div class="sheet-brand"><strong>SEMILLITAS DE FE</strong><small>Lección ${lesson.number} · ${safe(lesson.reference)}</small></div></div><h1 class="sheet-title">${safe(lesson.title)}</h1><p class="sheet-reference">${safe(lesson.category)} · ${safe(lesson.reference)}</p>`;
}

function footer(page) {
  const credit = page === 5 ? `Creado por Gerardo Sosa · ${page}/6` : `${page}/6`;
  return `<footer class="sheet-footer"><span>Material basado en la lectura indicada en una Biblia Reina-Valera.</span><span>${credit}</span></footer>`;
}

function extraQuestions(lesson) {
  return [
    ...lesson.questions,
    `¿Cuál es la verdad principal de ${lesson.title}?`,
    '¿Qué parte de la historia recuerdas mejor?',
    `¿Cómo puedes practicar esta enseñanza esta semana?`
  ].slice(0, 6);
}

function render(lesson) {
  const questions = extraQuestions(lesson);
  const cards = Array.from({length: 4}, () => `<article class="bible-card"><span class="mini-bible">📖</span><h2>${safe(lesson.title)}</h2><div class="verse-ref">Lee ${safe(lesson.reference)}</div><p class="mini-truth">${safe(lesson.objective)}.</p><div class="challenge-line">Mi reto esta semana: ____________________</div></article>`).join('');
  root.innerHTML = `
    <section class="print-page print-target" data-page="guide">${header(lesson,'GUÍA DEL MAESTRO',1)}
      <div class="truth">Verdad central · ${safe(lesson.objective)}.</div>
      <div class="two-columns">
        <article class="content-box"><h2>📖 Cómo contarla</h2><p>${safe(lesson.narration)}</p><p><strong>Antes de la clase:</strong> lee completo ${safe(lesson.reference)} en una Biblia Reina-Valera.</p></article>
        <article class="content-box sky"><h2>🎯 Objetivo</h2><p>Al terminar, los niños podrán expresar con sus palabras que ${safe(lesson.objective).toLowerCase()}.</p></article>
        <article class="content-box"><h2>🎲 Dinámica</h2><p>${safe(lesson.dynamic)}</p></article>
        <article class="content-box"><h2>🎨 Manualidad</h2><p>${safe(lesson.craft)}</p></article>
      </div>
      <article class="content-box sun"><h2>💬 Tres preguntas para conversar</h2><ol>${lesson.questions.map(q => `<li>${safe(q)}</li>`).join('')}</ol></article>
      <article class="content-box"><h2>⏱ Plan sugerido · 45 minutos</h2><div class="schedule-grid"><div class="schedule-item"><strong>5 min</strong>Bienvenida</div><div class="schedule-item"><strong>5 min</strong>Oración</div><div class="schedule-item"><strong>15 min</strong>Historia</div><div class="schedule-item"><strong>10 min</strong>Dinámica</div><div class="schedule-item"><strong>7 min</strong>Manualidad</div><div class="schedule-item"><strong>3 min</strong>Aplicación</div></div></article>
      <article class="content-box mint"><h2>👧🏽👦🏻 Todos juntos, de 3 a 10 años</h2><p><strong>Participación sencilla:</strong> ${safe(lesson.simple)}</p><p><strong>Para profundizar:</strong> ${safe(lesson.deep)}</p></article>${footer(1)}
    </section>
    <section class="print-page" data-page="activity">${header(lesson,'HOJA INFANTIL',2)}
      <div class="name-row"><span>Nombre: ______________________________</span><span>Fecha: ______________</span></div>
      <p class="outline-title">${safe(lesson.title)}</p><div class="truth">${safe(lesson.objective)}.</div>
      <div class="drawing-box"><strong>${safe(lesson.draw_prompt)}</strong></div>
      <article class="content-box sky"><h2>PARA LOS PEQUEÑOS</h2><p>Cuenta tu dibujo con tus propias palabras. Después repite la verdad central con el grupo.</p><p>Hoy aprendí que Dios ____________________________________</p></article>
      <article class="content-box sun"><h2>PARA LOS MAYORES</h2><p>Escribe una decisión que puedes tomar esta semana al recordar esta historia.</p><div class="writing-lines"></div></article>${footer(2)}
    </section>
    <section class="print-page" data-page="cards">${header(lesson,'TARJETAS BÍBLICAS',3)}
      <p>Recorta por las líneas, entrega una tarjeta a cada niño y anímalo a leer el pasaje con su familia.</p><div class="card-grid">${cards}</div>${footer(3)}
    </section>
    <section class="print-page" data-page="questions">${header(lesson,'REPASO BÍBLICO',4)}
      <div class="truth">Primero escucha la respuesta; después ayúdales a buscarla en ${safe(lesson.reference)}.</div>
      <ol class="question-list">${questions.map(q => `<li>${safe(q)}</li>`).join('')}</ol>
      <article class="content-box sky"><h2>Cómo usar esta hoja</h2><p><strong>3 a 5 años:</strong> pueden responder hablando, señalando o dibujando. <strong>6 a 10 años:</strong> pueden escribir y explicar por qué.</p></article>${footer(4)}
    </section>
    <section class="print-page" data-page="family">${header(lesson,'PARA COMPARTIR EN FAMILIA',5)}
      <div class="family-hero"><div class="family-icon">🏠📖</div><h2>Esta semana aprendimos</h2><p>${safe(lesson.objective)}.</p></div>
      <article class="content-box"><h2>Lean juntos</h2><p>${safe(lesson.reference)} en una Biblia Reina-Valera. Dejen que el niño cuente primero lo que recuerda.</p></article>
      <article class="content-box sky"><h2>Conversen</h2><ol>${lesson.questions.map(q => `<li>${safe(q)}</li>`).join('')}</ol></article>
      <article class="content-box sun"><h2>Reto familiar</h2><p>${safe(lesson.application)}</p></article>
      <article class="content-box prayer"><h2>Oración sencilla</h2><p>“Señor, gracias por tu Palabra. Ayúdanos a recordar que ${safe(lesson.objective).toLowerCase()}. Enséñanos a vivirlo esta semana. En el nombre de Jesús, amén.”</p></article>
      <article class="content-box mint"><h2>Nota para la familia</h2><p>Escuchen las preguntas con cariño. Ningún niño debe ser obligado a hablar. Ante una preocupación de seguridad, busquen ayuda de un adulto responsable.</p></article>${footer(5)}
    </section>
    <section class="print-page preschool-sheet" data-page="preschool">${header(lesson,'DIBUJO Y TRAZOS · 3 A 5 AÑOS',6)}
      <p class="name-row">Mi nombre: ______________________________</p>
      <h2>1. Dibuja y colorea a tu manera</h2>
      <p>${safe(preschool[lesson.number - 1]?.[0] || lesson.draw_prompt)}</p>
      <div class="preschool-frame" role="img" aria-label="Marco vacío para dibujar y colorear"></div>
      <h2>2. Sigue los caminos</h2><p>Primero con el dedo, luego con un crayón.</p>
      <svg class="tracing-paths" viewBox="0 0 540 135" role="img" aria-label="Líneas punteadas recta, ondulada y en zigzag para repasar"><g fill="none" stroke="black" stroke-width="2.5" stroke-dasharray="3 7" stroke-linecap="round"><path d="M20 20 H520"/><path d="M20 65 Q45 30 70 65 T170 65 T270 65 T370 65 T470 65 T520 65"/><path d="M20 120 l40 -25 40 25 40 -25 40 25 40 -25 40 25 40 -25 40 25 40 -25 40 25 40 -25 40 25"/></g></svg>
      <h2>3. Conversa con tu maestro</h2><p>${safe(preschool[lesson.number - 1]?.[1] || lesson.questions[0])}</p>
      <p class="preschool-note">Adulto: lee la consigna y ofrece crayones gruesos. No hace falta escribir ni copiar un dibujo perfecto. Celebra su esfuerzo.</p>
      <button class="toolbar-button secondary preschool-download" data-print-sheet="preschool">🖨️ Imprimir esta hoja</button>
      ${footer(6)}
    </section>`;
  document.title = `${lesson.title} · Material imprimible · Semillitas de Fe`;
}

selector.innerHTML = PRINTABLES.map(item => `<option value="${item.id}">${String(item.number).padStart(2,'0')} · ${safe(item.title)} — ${safe(item.reference)}</option>`).join('');
selector.value = current.id;
selector.addEventListener('change', () => {
  current = PRINTABLES.find(item => item.id === selector.value) || PRINTABLES[0];
  history.replaceState(null, '', `/printables.html?leccion=${current.id}`);
  render(current);
  selectPage('guide', false);
  window.scrollTo({top: 0, behavior: 'smooth'});
});

function selectPage(page, scroll = true) {
  document.querySelectorAll('.print-page').forEach(sheet => sheet.classList.toggle('print-target', sheet.dataset.page === page));
  tabs.querySelectorAll('button').forEach(button => button.classList.toggle('active', button.dataset.page === page));
  if (scroll) document.querySelector(`[data-page="${page}"]`)?.scrollIntoView({behavior:'smooth', block:'start'});
}

tabs.addEventListener('click', event => {
  const button = event.target.closest('[data-page]');
  if (button) selectPage(button.dataset.page);
});
// 'Guardar como PDF' usa el dialogo de impresion del navegador, que ofrece
// "Guardar como PDF". Antes apuntaba a /imprimibles/*.pdf, que no existe.
download.addEventListener('click', () => { document.body.classList.remove('print-one'); window.print(); });
// Boton 'Imprimir esta hoja' dentro de la hoja de 3 a 5 anos.
document.addEventListener('click', event => {
  const button = event.target.closest('[data-print-sheet]');
  if (!button) return;
  selectPage(button.dataset.printSheet, false);
  document.body.classList.add('print-one');
  window.print();
});
document.querySelector('#printPage').addEventListener('click', () => { document.body.classList.add('print-one'); window.print(); });
document.querySelector('#printAll').addEventListener('click', () => { document.body.classList.remove('print-one'); window.print(); });
window.addEventListener('afterprint', () => document.body.classList.remove('print-one'));
render(current);
if (new URLSearchParams(location.search).get('hoja') === 'pequenos') selectPage('preschool');
// Los enlaces que antes bajaban un PDF ahora llegan con ?imprimir=1 y abren el dialogo.
if (new URLSearchParams(location.search).get('imprimir') === '1') {
  window.addEventListener('load', () => setTimeout(() => window.print(), 700), {once:true});
}
