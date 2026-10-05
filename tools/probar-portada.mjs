#!/usr/bin/env node
/**
 * Pruebas automáticas de la portada (index.html).
 *
 *   1) node tools/servidor-local.mjs        (en una terminal)
 *   2) npm install jsdom                    (solo la primera vez)
 *      node tools/probar-portada.mjs        (en otra terminal)
 *
 * Simula un navegador y comprueba que el catálogo, la ventana de lección,
 * el asistente Sion, la ruleta bíblica y el buscador siguen funcionando.
 * Conviene ejecutarlo después de agregar o editar lecciones.
 */
import { JSDOM, VirtualConsole } from 'jsdom';
const BASE = 'http://127.0.0.1:8000';
const errores = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => { const m = String(e.message || e); if (!/Not implemented|Could not parse CSS/.test(m)) errores.push(m); });
vc.on('error', (...a) => errores.push(a.join(' ')));

const dom = await JSDOM.fromURL(BASE + '/', { runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc });
const { window } = dom;
// jsdom no implementa <dialog>; lo suplimos para poder probar la ventana de lección.
window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
window.HTMLDialogElement.prototype.close = function () { this.open = false; };
await new Promise(r => window.addEventListener('load', r, { once: true }));
await new Promise(r => setTimeout(r, 1200));
const d = window.document;
let fallos = 0;
const prueba = (n, c, extra = '') => { if (!c) fallos++; console.log(`${c ? '✅' : '❌'} ${n}${extra ? ' — ' + extra : ''}`); };

const cat = window.Semillitas?.lessons;
prueba('catálogo global con 31 lecciones', cat?.length === 31, `${cat?.length}`);
prueba('los 31 títulos son únicos', new Set(cat.map(l => l.title)).size === 31);
prueba('todas tienen emoji y pasaje', cat.every(l => l.emoji && l.reference));
prueba('el catálogo interno se renderiza', d.querySelectorAll('#grid .card').length === 31, `${d.querySelectorAll('#grid .card').length} tarjetas`);
prueba('la ruleta bíblica lista los 31 temas', d.querySelectorAll('#rouletteTheme option').length === 31);

window.Semillitas.openLesson('16');
const titulo = d.getElementById('title')?.textContent || '';
const cuerpo = d.getElementById('body')?.textContent || '';
prueba('abrir una lección llena la ventana', /jon[áa]s/i.test(titulo), `título: "${titulo}"`);
prueba('la ventana trae objetivo, dinámica y oración', /Objetivo/.test(cuerpo) && /Dinámica/.test(cuerpo) && /Oración/.test(cuerpo));

const form = d.querySelector('#jerubiForm'), input = d.querySelector('#jerubiInput');
input.value = 'dame una dinámica';
form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
await new Promise(r => setTimeout(r, 600));
prueba('el asistente Sion responde', d.querySelectorAll('#jerubiMessages .jerubi-bubble').length >= 2,
  `${d.querySelectorAll('#jerubiMessages .jerubi-bubble').length} burbujas`);

d.getElementById('spinWheel').click();
await new Promise(r => setTimeout(r, 3200));
prueba('la ruleta entrega una pregunta', (d.getElementById('questionText')?.textContent || '').length > 12,
  `"${(d.getElementById('questionText')?.textContent || '').slice(0, 45)}…"`);

const buscador = d.getElementById('search');
buscador.value = 'jonás'; buscador.dispatchEvent(new window.Event('input', { bubbles: true }));
await new Promise(r => setTimeout(r, 200));
prueba('el buscador filtra', d.querySelectorAll('#grid .card').length < 31, `${d.querySelectorAll('#grid .card').length} tras buscar`);

console.log(errores.length ? '\n❌ errores JS:\n  ' + errores.join('\n  ') : '\n✅ sin errores de JavaScript');
console.log(fallos ? `\n${fallos} prueba(s) fallida(s)` : '\n🎉 todas las pruebas pasaron');
window.close();
process.exit(fallos || errores.length ? 1 : 0);
