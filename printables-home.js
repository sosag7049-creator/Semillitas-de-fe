import { PRINTABLES } from '/printables-data.js';

const css = document.createElement('link');
css.rel = 'stylesheet';
css.href = '/printables-home.css';
document.head.append(css);
const safe = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const videos = document.querySelector('#videos');

if (videos && !document.querySelector('#imprimibles')) {
  const section = document.createElement('section');
  section.id = 'imprimibles';
  section.className = 'printables-home';
  section.innerHTML = `<div class="wrap"><div class="head"><div><span class="kicker">Listo para imprimir</span><h2>Centro de materiales</h2></div><p>Cada una de las ${PRINTABLES.length} lecciones incluye seis hojas preparadas para maestros, niños y familias.</p></div><div class="printable-console"><article class="printable-showcase"><div class="printable-icon">🖨️</div><h3>Un cuadernillo completo por lección</h3><p>Guía del maestro, actividad infantil, cuatro tarjetas bíblicas, preguntas de repaso y resumen familiar, más una hoja de dibujo y trazos para los pequeños de 3 a 5 años. Pensado para una sola clase de 3 a 10 años.</p></article><article class="printable-picker"><label for="homePrintableSelect">Elige la lección de hoy</label><select id="homePrintableSelect"></select><div class="printable-choice"><strong id="homePrintableTitle"></strong><span id="homePrintableRef"></span><p id="homePrintableTruth"></p></div><div class="printable-actions"><a class="printable-action" id="homePrintableOpen" target="_blank" rel="noopener">Ver e imprimir</a><a class="printable-action alt" id="homePrintableDownload" target="_blank" rel="noopener">Guardar como PDF</a></div></article></div></div>`;
  videos.before(section);
  const select = section.querySelector('#homePrintableSelect');
  const title = section.querySelector('#homePrintableTitle');
  const reference = section.querySelector('#homePrintableRef');
  const truth = section.querySelector('#homePrintableTruth');
  const open = section.querySelector('#homePrintableOpen');
  const download = section.querySelector('#homePrintableDownload');
  select.innerHTML = PRINTABLES.map(item => `<option value="${item.id}">${String(item.number).padStart(2,'0')} · ${safe(item.title)}</option>`).join('');
  function update() {
    const item = PRINTABLES.find(entry => entry.id === select.value) || PRINTABLES[0];
    title.textContent = item.title;
    reference.textContent = `📖 ${item.reference}`;
    truth.textContent = item.objective;
    open.href = `/printables.html?leccion=${item.id}`;
    // Abre el generador y lanza el dialogo de impresion ("Guardar como PDF").
    download.href = `/printables.html?leccion=${item.id}&imprimir=1`;
  }
  select.addEventListener('change', update);
  update();
  const navLink = document.createElement('a');
  navLink.href = '#imprimibles';
  navLink.textContent = 'Imprimibles';
  document.querySelector('.links')?.insertBefore(navLink, document.querySelector('.links a[href="#videos"]'));
}

function decorateCards() {
  document.querySelectorAll('#grid .card').forEach(card => {
    const button = card.querySelector('.open[data-i]');
    if (!button || card.querySelector('.printable-card-action')) return;
    const item = PRINTABLES.find(entry => entry.id === button.dataset.i);
    if (!item) return;
    const link = document.createElement('a');
    link.className = 'printable-card-action';
    link.href = `/printables.html?leccion=${item.id}`;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = '🖨️ Material imprimible';
    card.append(link);
  });
}

const grid = document.querySelector('#grid');
if (grid) {
  decorateCards();
  new MutationObserver(decorateCards).observe(grid, {childList:true});
}

document.addEventListener('semillitas:lesson-open', event => {
  const item = PRINTABLES.find(entry => entry.id === String(event.detail?.id));
  const body = document.querySelector('#body');
  if (!item || !body) return;
  body.querySelector('.lesson-print-tools')?.remove();
  const tools = document.createElement('div');
  tools.className = 'lesson-print-tools';
  tools.innerHTML = `<a href="/printables.html?leccion=${item.id}" target="_blank" rel="noopener">🖨️ Ver material imprimible</a><a href="/printables.html?leccion=${item.id}&imprimir=1" target="_blank" rel="noopener">📄 Guardar cuadernillo en PDF</a>`;
  body.append(tools);
});
