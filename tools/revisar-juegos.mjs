#!/usr/bin/env node
/**
 * revisar-juegos.mjs
 * ---------------------------------------------------------------------------
 * Comprueba que los juegos de `/juegos/` estén bien armados, sin instalar
 * nada y sin levantar el servidor:
 *
 *   1. La memoria ofrece 6, 8 y 10 parejas y tiene al menos 10 figuras
 *      bíblicas para no repetir ilustraciones.
 *   2. Cada figura 'art' existe de verdad como clase .avatar-art-<clave> en
 *      alguna hoja de estilos del sitio (si no, la tarjeta se ve en blanco).
 *   3. Cada personaje de «¿Quién soy?» tiene exactamente tres pistas
 *      progresivas, escritas y distintas entre sí.
 *   4. El dado del tablero es un cubo 3D completo: seis caras con sus puntos
 *      en la página, las seis orientaciones show-1…show-6 en el CSS, la
 *      animación de giro y la salida para prefers-reduced-motion.
 *   5. Las versiones ?v= de juegos.css, juegos.js, board-game.css y
 *      board-game.js coinciden entre juegos/index.html y sw.js; si no, el
 *      service worker guardaría una copia vieja de los juegos.
 *
 * Uso:
 *     node tools/revisar-juegos.mjs
 *
 * Devuelve código de salida 1 si encuentra algo, para poder usarlo como
 * barrera antes de publicar.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const leer = rel => readFileSync(join(RAIZ, rel), 'utf8');

const html = leer('juegos/index.html');
const juegosJs = leer('juegos.js');
const boardJs = leer('board-game.js');
const juegosCss = leer('juegos.css');
const boardCss = leer('board-game.css');
const cuentaCss = readFileSync(join(RAIZ, 'account-ui.css'), 'utf8');
const sw = leer('sw.js');
const juego3dJs = leer('juegos-3d.js');
const juego3dCss = leer('juegos-3d.css');

let fallos = 0;
const prueba = (nombre, ok, extra = '') => {
  if (!ok) fallos++;
  console.log(`${ok ? '✅' : '❌'} ${nombre}${extra ? ' — ' + extra : ''}`);
};

/* --------------------------------------------------------------------------
 * Extrae `export const NOMBRE = <literal>` como un valor de JavaScript.
 * juegos.js corre en el navegador y no se puede importar en Node (usa
 * document al cargar), así que basta con leer el literal de datos.
 * ----------------------------------------------------------------------- */
function extraerConstante(codigo, nombre) {
  const marca = `export const ${nombre}=`;
  const inicio = codigo.indexOf(marca);
  if (inicio < 0) return null;
  let i = codigo.indexOf('[', inicio);
  let profundidad = 0, comilla = null, escape = false;
  for (; i < codigo.length; i++) {
    const c = codigo[i];
    if (escape) { escape = false; continue; }
    if (escape = comilla && c === '\\') continue;
    if (comilla) { if (c === comilla) comilla = null; continue; }
    if (c === "'" || c === '"' || c === '`') { comilla = c; continue; }
    if (c === '[') profundidad++;
    if (c === ']' && --profundidad === 0) break;
  }
  if (profundidad !== 0) return null;
  return new Function(`return (${codigo.slice(codigo.indexOf('[', inicio), i + 1)});`)();
}

/* ----------------------------- Memoria --------------------------------- */
const selectParejas = html.match(/<select id="memoryPairs">([\s\S]*?)<\/select>/);
const opciones = [...(selectParejas?.[1] || '').matchAll(/<option>(\d+)<\/option>/g)].map(m => m[1]);
prueba('la memoria ofrece 6, 8 y 10 parejas',
  opciones.join(',') === '6,8,10', opciones.join(', ') || 'sin selector');

const figuras = extraerConstante(juegosJs, 'memoryFigures') || [];
prueba('hay al menos 10 figuras de memoria', figuras.length >= 10, `${figuras.length}`);

const cssTodo = juegosCss + boardCss + cuentaCss;
const tipos = new Set(['art', 'emoji']);
const llavesArtes = figuras.filter(f => f[0] === 'art').map(f => f[1]);
const artesFaltantes = llavesArtes.filter(k => !cssTodo.includes(`.avatar-art-${k}`));
prueba('cada figura art tiene su ilustración .avatar-art-*',
  llavesArtes.length > 0 && artesFaltantes.length === 0,
  artesFaltantes.length ? `faltan: ${artesFaltantes.join(', ')}` : `${llavesArtes.length} ilustraciones`);

prueba('cada figura usa un tipo conocido (art/emoji)',
  figuras.every(f => tipos.has(f[0]) && f[1] && f[2]));
prueba('las figuras emoji son un solo pictograma',
  figuras.filter(f => f[0] === 'emoji').every(f => [...f[1]].length <= 2));
prueba('los nombres de las figuras no se repiten',
  new Set(figuras.map(f => f[2])).size === figuras.length);
prueba('las claves de las figuras no se repiten',
  new Set(figuras.map(f => f[0] + ':' + f[1])).size === figuras.length);

/* --------------------------- ¿Quién soy? -------------------------------- */
prueba('la página tiene los controles de pistas progresivas',
  html.includes('id="whoHint"') && html.includes('id="whoClues"') && html.includes('id="whoProgress"'));

const tarjetas = extraerConstante(juegosJs, 'whoCards') || [];
prueba('«¿Quién soy?» tiene al menos 8 personajes', tarjetas.length >= 8, `${tarjetas.length}`);
const malas = tarjetas.filter(t => !Array.isArray(t[0]) || typeof t[1] !== 'string' ||
  !Array.isArray(t[2]) || t[2].length !== 3 || t[2].some(h => typeof h !== 'string' || h.trim().length < 12));
prueba('cada personaje tiene exactamente tres pistas escritas', tarjetas.length > 0 && malas.length === 0,
  malas.length ? `revisar: ${malas.map(t => t[1]).join(', ')}` : `${tarjetas.length}×3 pistas`);
prueba('las pistas de cada personaje no se repiten',
  tarjetas.every(t => new Set(t[2].map(h => h.trim())).size === 3));
prueba('los personajes tienen figura válida',
  tarjetas.every(t => tipos.has(t[0][0]) && t[0][1] &&
    (t[0][0] === 'emoji' || cssTodo.includes(`.avatar-art-${t[0][1]}`))));
prueba('los nombres de los personajes no se repiten',
  new Set(tarjetas.map(t => t[1])).size === tarjetas.length);

/* ------------------------------ Dado 3D --------------------------------- */
const caras = [...html.matchAll(/die-face die-face-(\d+)">([\s\S]*?)<\/div>/g)]
  .map(m => ({ cara: Number(m[1]), puntos: (m[2].match(/class="pip /g) || []).length }))
  .sort((a, b) => a.cara - b.cara);
prueba('el dado tiene seis caras y cada una muestra sus puntos',
  caras.length === 6 && caras.every((c, i) => c.cara === i + 1 && c.puntos === i + 1),
  caras.map(c => `${c.cara}→${c.puntos}`).join(', '));

const cssCaras = [1, 2, 3, 4, 5, 6].every(n => boardCss.includes(`.die-face-${n}{transform:`));
const cssMuestra = [1, 2, 3, 4, 5, 6].every(n => boardCss.includes(`.show-${n}{transform:`));
prueba('el CSS orienta las seis caras del cubo', boardCss.includes('.die-cube') && cssCaras && cssMuestra);
prueba('el dado tiene animación de giro y respeta prefers-reduced-motion',
  boardCss.includes('@keyframes dieTumble') && boardCss.includes('prefers-reduced-motion'));
prueba('el juego usa el dado 3D (no texto plano)',
  boardJs.includes('die-tumble') && boardJs.includes('show-') && !boardJs.includes("journeyDie').textContent"));

/* -------------------------- El buen pastor 3D --------------------------- */
console.log('\nJuego 3D («El buen pastor»):');
prueba('la página tiene la pestaña y el panel del juego 3D',
  html.includes('data-game="pastor"') && html.includes('id="game-pastor"') && html.includes('id="pastorStage"'));
prueba('el escenario trae lienzo, mapa, joystick y celebración',
  ['pastorPoster', 'pastorMapa', 'pastorJoystick', 'pastorMensaje', 'pastorFinal']
    .every((id) => html.includes(`id="${id}"`)));
prueba('el juego se pide solo al abrir su pestaña (import perezoso)',
  juegosJs.includes("import('/juegos-3d.js?v=") && !/<script[^>]+src="\/juegos-3d\.js/.test(html));
prueba('son cinco ovejas y el pasaje es Lucas 15:4-7',
  juego3dJs.includes('TOTAL_OVEJAS = 5') && juego3dJs.includes("REFERENCIA = 'Lucas 15:4-7'"));
prueba('la celebración cita Lucas 15:6 en Reina-Valera 1960',
  html.includes('Lucas 15:6') && html.includes('Reina-Valera 1960') && html.includes('/lecciones/oveja-perdida/'));
prueba('respeta prefers-reduced-motion en el CSS y en el motor',
  juego3dCss.includes('prefers-reduced-motion') && juego3dJs.includes('prefers-reduced-motion'));
prueba('el audio se sintetiza y se puede apagar',
  juego3dJs.includes('createOscillator') && html.includes('id="pastorSonido"') &&
  juego3dJs.includes('sonido = !sonido'));
prueba('Three.js viaja con el sitio, no desde un CDN',
  existsSync(join(RAIZ, 'vendor/three.module.min.js')) &&
  existsSync(join(RAIZ, 'vendor/three.core.min.js')) &&
  existsSync(join(RAIZ, 'vendor/LICENCIA-three.txt')) &&
  juego3dJs.includes("'/vendor/three.module.min.js?v=180'") &&
  !/https?:\/\/[^'"]+three/.test(juego3dJs));
prueba('el motor 3D se guarda para el modo sin conexión tras la primera visita',
  sw.includes('/^\\/vendor\\/three[.\\w-]*\\.js$/'));
prueba('hay una prueba del mundo 3D ejecutable sin navegador',
  existsSync(join(RAIZ, 'tools/probar-juego-3d.mjs')));

/* --------------------------- Versiones ?v= ------------------------------ */
console.log('\nVersiones de los recursos de juegos:');
for (const recurso of ['juegos.css', 'juegos.js', 'board-game.css', 'board-game.js', 'juegos-3d.css', 'juegos-3d.js']) {
  const patron = new RegExp(`/${recurso.replace('.', '\\.')}\\?v=(\\d+)`);
  // El motor 3D no se referencia con <script>: se pide con import() desde juegos.js.
  const pagina = (html.match(patron) || juegosJs.match(patron) || juego3dJs.match(patron))?.[1];
  const cache = sw.match(new RegExp(`/${recurso.replace('.', '\\.')}\\?v=(\\d+)`))?.[1];
  prueba(`${recurso}: misma versión en la página y en sw.js`, !!pagina && pagina === cache,
    `página v${pagina || '?'} · sw.js v${cache || '?'}`);
}

console.log(fallos ? `\n${fallos} revisión(es) fallida(s)` : '\n🎉 los juegos están completos y en orden');
process.exit(fallos ? 1 : 0);
