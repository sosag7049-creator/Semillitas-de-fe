/**
 * printables-home.js — Imprimibles dentro de la portada
 * ---------------------------------------------------------------------------
 * Antes este archivo insertaba en la portada una sección entera («Centro de
 * materiales») con su propio selector de lección. Al acortar la portada esa
 * sección desapareció: ahora hay un acceso rápido y una tarjeta en
 * «Herramientas para maestros» que llevan directo a /printables.html.
 *
 * Lo que sigue aquí es lo que no tiene otro sitio: el enlace al material
 * imprimible dentro de la ventana de lección (la que abre Sion) y en las
 * tarjetas del catálogo interno.
 */
import { PRINTABLES } from '/printables-data.js';

const css = document.createElement('link');
css.rel = 'stylesheet';
css.href = '/printables-home.css';
document.head.append(css);

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
