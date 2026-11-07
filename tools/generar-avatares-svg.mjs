#!/usr/bin/env node
/**
 * generar-avatares-svg.mjs
 * ---------------------------------------------------------------------------
 * Dibuja los doce avatares del sitio como SVG planos, con el mismo lenguaje de
 * las 39 portadas de lección: contornos gruesos, formas redondeadas, colores
 * planos y caras de cuento impreso. Nada de fotos ni de imágenes generadas.
 *
 *     node tools/generar-avatares-svg.mjs            Escribe los 12 avatares.
 *     node tools/generar-avatares-svg.mjs --revisar  Solo comprueba que existan.
 *
 * Se usan en:
 *   - «Memoria bíblica» y «¿Quién soy?» de /juegos/
 *   - el selector de avatar de la cuenta, el panel del maestro y las fichas
 *     del juego de mesa (clases .avatar-art-<clave>)
 *
 * Salida: images/avatars/<clave>.svg  (240 × 240, sin animación: se ven a 40 px
 * en una ficha y a 100 px en «¿Quién soy?», así que el detalle debe leerse).
 *
 * Cada archivo lleva su <title>: si mañana alguien lo abre suelto, se entiende.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DESTINO = join(RAIZ, 'images', 'avatars');
const soloRevisar = process.argv.includes('--revisar');

/* ---------------------------------- Kit ---------------------------------- */
const TINTA = '#43332c';
const GROSOR = 6;

const circulo = (cx, cy, r, relleno, extra = '') =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${relleno}" stroke="${TINTA}" stroke-width="${GROSOR}" ${extra}/>`;

const elipse = (cx, cy, rx, ry, relleno, extra = '') =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${relleno}" stroke="${TINTA}" stroke-width="${GROSOR}" ${extra}/>`;

const rect = (x, y, ancho, alto, radio, relleno, extra = '') =>
  `<rect x="${x}" y="${y}" width="${ancho}" height="${alto}" rx="${radio}" ry="${radio}" fill="${relleno}" stroke="${TINTA}" stroke-width="${GROSOR}" ${extra}/>`;

const camino = (d, relleno, extra = '') =>
  `<path d="${d}" fill="${relleno}" stroke="${TINTA}" stroke-width="${GROSOR}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;

const trazo = (d, color = TINTA, grosor = 5, extra = '') =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${grosor}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;

const puntos = (cx, cy, sep = 16, r = 4.8) =>
  `<circle cx="${cx - sep}" cy="${cy}" r="${r}" fill="${TINTA}"/><circle cx="${cx + sep}" cy="${cy}" r="${r}" fill="${TINTA}"/>`;

const ojosCerrados = (cx, cy, sep = 16) =>
  trazo(`M${cx - sep - 7},${cy} q7,8 14,0`, TINTA, 4.6)
  + trazo(`M${cx + sep - 7},${cy} q7,8 14,0`, TINTA, 4.6);

const sonrisa = (cx, cy, ancho = 22) =>
  trazo(`M${cx - ancho / 2},${cy} q${ancho / 2},${ancho * 0.5} ${ancho},0`, TINTA, 4.6);

const bocaAbierta = (cx, cy, ancho = 16, alto = 13) =>
  camino(`M${cx - ancho / 2},${cy} q${ancho / 2},${alto} ${ancho},0 q${-ancho / 2},${-alto * 0.45} ${-ancho},0 Z`, '#a1503f');

const rubor = (cx, cy, sep = 16) =>
  `<circle cx="${cx - sep - 12}" cy="${cy}" r="7" fill="#f2a08d" opacity=".55"/>`
  + `<circle cx="${cx + sep + 12}" cy="${cy}" r="7" fill="#f2a08d" opacity=".55"/>`;

const cejas = (cx, cy, sep = 16) =>
  trazo(`M${cx - sep - 8},${cy} q8,-5 14,0`, TINTA, 4)
  + trazo(`M${cx + sep - 6},${cy} q6,-5 14,0`, TINTA, 4);

/** Hombros y torso: una cúpula ancha que sale por debajo del círculo. */
const hombros = (relleno, ancho = 186, alto = 92, cx = 120) => {
  const x1 = cx - ancho / 2;
  const x2 = cx + ancho / 2;
  const tope = 246 - alto;
  return camino(
    `M${x1},246 L${x1},${tope + 22} C${x1 + 6},${tope - 10} ${x1 + 44},${tope - 14} ${cx},${tope - 14}`
    + ` C${x2 - 44},${tope - 14} ${x2 - 6},${tope - 10} ${x2},${tope + 22} L${x2},246 Z`,
    relleno,
  );
};

const cuello = (piel, cx = 120, y = 150) => rect(cx - 13, y - 12, 26, 30, 9, piel);

/** Cabeza redonda con orejas opcionales. */
const cabeza = (piel, { cx = 120, cy = 104, rx = 43, ry = 45 } = {}) =>
  elipse(cx, cy, rx, ry, piel)
  + elipse(cx - rx + 1, cy + 4, 7, 9, piel)
  + elipse(cx + rx - 1, cy + 4, 7, 9, piel);

/** Nariz mínima: dos puntitos o una curva. */
const nariz = (cx, cy) => trazo(`M${cx - 1},${cy - 3} q4,6 0,9`, TINTA, 3.6);

/** Cejas de asombro: arcos altos. */
const cejasAltas = (cx, cy, sep = 16) =>
  trazo(`M${cx - sep - 9},${cy - 4} q9,-8 17,-1`, TINTA, 4)
  + trazo(`M${cx + sep - 8},${cy - 5} q8,-7 17,1`, TINTA, 4);

/* ------------------------------ Pelo y barba ----------------------------- */
/** Pelo corto con entradas y flequillo. */
const peloCorto = (color, { cx = 120, cy = 104, rx = 43 } = {}) =>
  camino(
    `M${cx - rx - 3},${cy + 2} C${cx - rx - 6},${cy - 40} ${cx - 26},${cy - 60} ${cx},${cy - 60}`
    + ` C${cx + 26},${cy - 60} ${cx + rx + 6},${cy - 40} ${cx + rx + 3},${cy + 2}`
    + ` C${cx + rx - 9},${cy - 16} ${cx + 24},${cy - 26} ${cx},${cy - 26}`
    + ` C${cx - 24},${cy - 26} ${cx - rx + 9},${cy - 16} ${cx - rx - 3},${cy + 2} Z`,
    color,
  );

/** Melena que cae por los dos lados: se dibuja ANTES de la cabeza. */
const peloLargo = (color, { cx = 120, cy = 104, rx = 43, caida = 74 } = {}) =>
  camino(
    `M${cx - rx - 4},${cy + 8} C${cx - rx - 14},${cy - 46} ${cx - 28},${cy - 66} ${cx},${cy - 66}`
    + ` C${cx + 28},${cy - 66} ${cx + rx + 14},${cy - 46} ${cx + rx + 4},${cy + 8}`
    + ` L${cx + rx + 8},${cy + caida} C${cx + 30},${cy + 54} ${cx + 20},${cy + 48} ${cx + 12},${cy + 42}`
    + ` L${cx - 12},${cy + 42} C${cx - 20},${cy + 48} ${cx - 30},${cy + 54} ${cx - rx - 8},${cy + caida} Z`,
    color,
  );

/** Flequillo con raya al medio; va ENCIMA de la cabeza. */
const flequillo = (color, { cx = 120, cy = 104, rx = 43 } = {}) =>
  camino(
    `M${cx - rx - 2},${cy + 6} C${cx - rx - 4},${cy - 34} ${cx - 22},${cy - 58} ${cx},${cy - 58}`
    + ` C${cx + 22},${cy - 58} ${cx + rx + 4},${cy - 34} ${cx + rx + 2},${cy + 6}`
    + ` C${cx + rx - 10},${cy - 12} ${cx + 22},${cy - 20} ${cx + 9},${cy - 22}`
    + ` C${cx + 3},${cy - 11} ${cx - 3},${cy - 11} ${cx - 9},${cy - 22}`
    + ` C${cx - 22},${cy - 20} ${cx - rx + 10},${cy - 12} ${cx - rx - 2},${cy + 6} Z`,
    color,
  );

/**
 * Barba: rodea el mentón pero deja la boca a la vista. El borde superior baja
 * hasta la altura de los labios, así no parece una mascarilla.
 */
const barba = (color, { cx = 120, cy = 104, rx = 43, ry = 45, caida = 18 } = {}) =>
  camino(
    `M${cx - rx + 3},${cy - 2}`
    + ` C${cx - rx + 1},${cy + 42} ${cx - 26},${cy + ry + caida} ${cx},${cy + ry + caida + 4}`
    + ` C${cx + 26},${cy + ry + caida} ${cx + rx - 1},${cy + 42} ${cx + rx - 3},${cy - 2}`
    + ` C${cx + rx - 9},${cy + 28} ${cx + 32},${cy + 40} ${cx + 17},${cy + 37}`
    + ` C${cx + 7},${cy + 35} ${cx - 7},${cy + 35} ${cx - 17},${cy + 37}`
    + ` C${cx - 32},${cy + 40} ${cx - rx + 9},${cy + 28} ${cx - rx + 3},${cy - 2} Z`,
    color,
  );

/** Bigote de dos lóbulos, por debajo de la nariz. */
const bigote = (color, cx = 120, y = 116) =>
  camino(`M${cx - 15},${y} q7,-6 15,-1 q8,-5 15,1 q-7,5 -15,4 q-8,1 -15,-4 Z`, color);

/** Pañuelo o toca en la cabeza, con banda. */
const toca = (color, banda, { cx = 120, cy = 104, rx = 43 } = {}) => `
  ${camino(
    `M${cx - rx - 4},${cy + 2} C${cx - rx - 6},${cy - 52} ${cx - 26},${cy - 68} ${cx},${cy - 68}`
    + ` C${cx + 26},${cy - 68} ${cx + rx + 6},${cy - 52} ${cx + rx + 4},${cy + 2}`
    + ` C${cx + 30},${cy - 30} ${cx - 30},${cy - 30} ${cx - rx - 4},${cy + 2} Z`,
    color,
  )}
  ${trazo(`M${cx - 30},${cy - 44} q30,-16 60,0`, banda, 4)}
  ${camino(`M${cx - rx - 6},${cy - 30} C${cx - rx - 22},${cy - 6} ${cx - rx - 20},${cy + 24} ${cx - rx - 6},${cy + 44} C${cx - rx + 6},${cy + 20} ${cx - rx + 4},${cy - 8} ${cx - rx - 6},${cy - 30} Z`, color)}
`;

/** Corona de puntas con pedrería. */
const corona = (cx, y) => `
  ${camino(`M${cx - 38},${y} L${cx - 27},${y - 28} L${cx - 12},${y - 10} L${cx},${y - 34} L${cx + 12},${y - 10} L${cx + 27},${y - 28} L${cx + 38},${y} Z`, '#ffd45d')}
  ${rect(cx - 38, y - 5, 76, 12, 6, '#f0b93f')}
  ${circulo(cx - 27, y - 26, 4.5, '#ff9b76')}
  ${circulo(cx, y - 32, 4.5, '#ff9b76')}
  ${circulo(cx + 27, y - 26, 4.5, '#ff9b76')}
`;

/* ------------------------------- Decoración ------------------------------ */
const sol = (cx, cy, r = 20) => {
  let rayos = '';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    rayos += `<line x1="${cx + Math.cos(a) * (r + 8)}" y1="${cy + Math.sin(a) * (r + 8)}" x2="${cx + Math.cos(a) * (r + 17)}" y2="${cy + Math.sin(a) * (r + 17)}" stroke="${TINTA}" stroke-width="4.5" stroke-linecap="round"/>`;
  }
  return rayos + circulo(cx, cy, r, '#ffd45d');
};

const nube = (cx, cy, escala = 1) =>
  `<g transform="translate(${cx} ${cy}) scale(${escala})">`
  + camino('M-38,12 C-48,12 -50,0 -40,-4 C-44,-18 -28,-24 -18,-16 C-14,-28 6,-30 12,-16 C26,-22 38,-12 32,0 C42,2 40,12 30,12 Z', '#ffffff')
  + '</g>';

const colina = (color) => camino('M-10,206 C40,178 84,196 130,192 C178,188 210,206 250,194 L250,250 L-10,250 Z', color);

const arcoiris = (cx, cy) => {
  const colores = ['#ff9b76', '#ffd45d', '#8bd8a8', '#7fc6e0', '#c9a9e8'];
  return colores.map((color, i) => {
    const r = 88 - i * 11;
    return `<path d="M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round"/>`;
  }).join('');
};

/** Espiga de trigo con granos. */
const espiga = (x, y, giro = 0, escala = 1) =>
  `<g transform="translate(${x} ${y}) rotate(${giro}) scale(${escala})">`
  + trazo('M0,0 L0,-44', '#b98c43', 5)
  + `<ellipse cx="0" cy="-54" rx="8" ry="15" fill="#f0c96a" stroke="${TINTA}" stroke-width="4"/>`
  + `<ellipse cx="-10" cy="-40" rx="6" ry="11" fill="#f0c96a" stroke="${TINTA}" stroke-width="4" transform="rotate(-30 -10 -40)"/>`
  + `<ellipse cx="10" cy="-40" rx="6" ry="11" fill="#f0c96a" stroke="${TINTA}" stroke-width="4" transform="rotate(30 10 -40)"/>`
  + `<ellipse cx="-9" cy="-26" rx="5" ry="9" fill="#f0c96a" stroke="${TINTA}" stroke-width="3.5" transform="rotate(-30 -9 -26)"/>`
  + `<ellipse cx="9" cy="-26" rx="5" ry="9" fill="#f0c96a" stroke="${TINTA}" stroke-width="3.5" transform="rotate(30 9 -26)"/>`
  + '</g>';

const gota = (x, y, escala = 1) =>
  `<g transform="translate(${x} ${y}) scale(${escala})">`
  + `<path d="M0,0 C-7,10 -9,15 -9,20 A9,9 0 0 0 9,20 C9,15 7,10 0,0 Z" fill="#9fd8ea" stroke="${TINTA}" stroke-width="4"/>`
  + '</g>';

const ola = (y, color) => camino(`M-10,${y} q30,-12 60,0 t60,0 t60,0 t60,0 L250,250 L-10,250 Z`, color);

/** Rama de olivo con dos hojas. */
const ramaOlivo = (x, y, giro = 0, escala = 1) =>
  `<g transform="translate(${x} ${y}) rotate(${giro}) scale(${escala})">`
  + trazo('M0,0 q22,6 44,2', '#4f9452', 4.5)
  + `<ellipse cx="16" cy="-2" rx="10" ry="6" fill="#7cc46a" stroke="${TINTA}" stroke-width="4" transform="rotate(-30 16 -2)"/>`
  + `<ellipse cx="34" cy="0" rx="10" ry="6" fill="#7cc46a" stroke="${TINTA}" stroke-width="4" transform="rotate(20 34 0)"/>`
  + '</g>';

/**
 * Paloma de paz: cola en abanico, cuerpo ovalado, cabeza con pico y un ala
 * levantada que sobresale del lomo para que la silueta se lea de un vistazo.
 */
const paloma = (x, y, escala = 1) => `
  <g transform="translate(${x} ${y}) scale(${escala})">
    ${camino('M-34,6 L-74,-14 L-72,12 L-34,20 Z', '#f1f6f8')}
    ${trazo('M-66,-6 L-38,6', TINTA, 3.4)}
    ${trazo('M-66,4 L-38,12', TINTA, 3.4)}
    ${camino('M-34,4 C-34,-28 -6,-40 18,-32 C40,-30 54,-16 54,0 C54,20 34,30 8,30 C-18,30 -34,22 -34,4 Z', '#ffffff')}
    ${camino('M-14,-16 C4,-56 46,-50 48,-18 C34,2 4,6 -14,-16 Z', '#eaf2f6')}
    ${trazo('M12,-8 C22,-32 36,-30 40,-16', TINTA, 4)}
    ${trazo('M-2,2 C10,-16 24,-14 30,0', TINTA, 3.6)}
    ${circulo(40, -20, 17, '#ffffff')}
    <path d="M55,-24 L78,-18 L55,-9 Z" fill="#f0b93f" stroke="${TINTA}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="45" cy="-25" r="4.6" fill="${TINTA}"/>
    ${ramaOlivo(74, -10, 0, 0.95)}
  </g>`;

/** León manso de melena rizada. */
const leon = (x, y, escala = 1) => `
  <g transform="translate(${x} ${y}) scale(${escala})">
    ${[0, 45, 90, 135, 180, 225, 270, 315].map((grados) => {
      const a = (grados / 180) * Math.PI;
      return `<circle cx="${Math.cos(a) * 44}" cy="${Math.sin(a) * 44}" r="18" fill="#d9a65c" stroke="${TINTA}" stroke-width="5"/>`;
    }).join('')}
    ${circulo(0, 0, 42, '#d9a65c')}
    ${circulo(0, 2, 30, '#f0c98d')}
    <ellipse cx="-26" cy="-30" rx="11" ry="9" fill="#e9bd77" stroke="${TINTA}" stroke-width="4.5" transform="rotate(-24 -26 -30)"/>
    <ellipse cx="26" cy="-30" rx="11" ry="9" fill="#e9bd77" stroke="${TINTA}" stroke-width="4.5" transform="rotate(24 26 -30)"/>
    ${trazo('M-18,-4 q6,8 13,0', TINTA, 4.5)}
    ${trazo('M5,-4 q6,8 13,0', TINTA, 4.5)}
    ${camino('M0,4 L-8,16 L8,16 Z', '#8a4a34')}
    ${trazo('M0,16 q0,9 -9,11', TINTA, 4)}
    ${trazo('M0,16 q0,9 9,11', TINTA, 4)}
    ${trazo('M-10,20 q-14,1 -18,10', TINTA, 3.2)}
    ${trazo('M10,20 q14,1 18,10', TINTA, 3.2)}
  </g>`;

/** Pez grande y amistoso. */
const pez = (x, y, giro = 0, escala = 1) => `
  <g transform="translate(${x} ${y}) rotate(${giro}) scale(${escala})">
    ${camino('M42,0 C42,-26 14,-42 -12,-36 C-34,-31 -48,-16 -48,0 C-48,16 -34,31 -12,36 C14,42 42,26 42,0 Z', '#5b8fb5')}
    ${camino('M-44,0 C-62,-18 -74,-8 -70,0 C-74,8 -62,18 -44,0 Z', '#5b8fb5')}
    ${camino('M6,-30 C16,-46 34,-44 38,-30 Z', '#82b4d2')}
    ${circulo(16, -12, 9, '#ffffff')}
    ${circulo(18, -12, 4.5, TINTA)}
    ${trazo('M30,4 q10,5 16,1', TINTA, 4)}
    ${trazo('M-18,-10 q10,8 22,2', '#3f6f92', 4)}
    ${trazo('M-22,10 q10,8 22,2', '#3f6f92', 4)}
  </g>`;

/** Lira de David: marco de madera y cuerdas. */
const lira = (x, y, escala = 1) => `
  <g transform="translate(${x} ${y}) scale(${escala})">
    ${camino('M-26,18 C-30,-8 -16,-26 0,-34 C16,-26 30,-8 26,18 Z', '#c9a06a')}
    ${rect(-30, 14, 60, 10, 5, '#8a5f3c')}
    ${trazo('M-14,-12 L-10,16', TINTA, 3)}
    ${trazo('M-5,-20 L-3,16', TINTA, 3)}
    ${trazo('M5,-20 L3,16', TINTA, 3)}
    ${trazo('M14,-12 L10,16', TINTA, 3)}
  </g>`;

/** Ovejita asomada. */
const ovejita = (x, y, escala = 1) => `
  <g transform="translate(${x} ${y}) scale(${escala})">
    ${circulo(0, 0, 24, '#fcf8ec')}
    ${circulo(-18, -14, 12, '#fcf8ec')}
    ${circulo(4, -22, 13, '#fcf8ec')}
    ${circulo(20, -12, 11, '#fcf8ec')}
    ${elipse(16, 4, 13, 12, '#54463a')}
    <circle cx="13" cy="0" r="3.4" fill="${TINTA}"/>
    <circle cx="21" cy="0" r="3.4" fill="${TINTA}"/>
    <ellipse cx="9" cy="6" rx="6" ry="4" fill="#6b5a4a" stroke="${TINTA}" stroke-width="3"/>
  </g>`;

/* ------------------------------- Personajes ------------------------------ */
const AVATARES = {
  /* Creación: un brote en el jardín. También es el avatar «Semilla». */
  semilla: {
    titulo: 'Un brote que nace en el jardín de la creación',
    fondo: '#dff2ff',
    escena: () => `
      ${sol(188, 52, 16)}
      ${nube(62, 50, 0.85)}
      ${colina('#bfe6a8')}
      ${camino('M120,232 C120,210 120,196 120,176', 'none')}
      ${trazo('M120,176 C120,202 120,216 120,232', '#4f9452', 8)}
      ${camino('M120,196 C100,196 86,180 86,162 C108,162 120,178 120,196 Z', '#7cc46a')}
      ${camino('M120,182 C140,182 154,166 154,148 C132,148 120,164 120,182 Z', '#6cb268')}
      ${camino('M120,214 C105,214 95,204 95,191 C110,191 120,201 120,214 Z', '#7cc46a')}
      ${camino('M104,232 C104,220 111,213 120,213 C129,213 136,220 136,232 C136,238 129,241 120,241 C111,241 104,238 104,232 Z', '#c98f66')}
      ${trazo('M120,218 q6,7 0,15', '#8a5f3c', 3.5)}
      ${trazo('M64,214 q9,-13 18,0', '#6cb268', 5)}
      ${trazo('M172,218 q9,-13 18,0', '#6cb268', 5)}
      <circle cx="72" cy="204" r="6" fill="#ff9b76" stroke="${TINTA}" stroke-width="3.5"/>
      <circle cx="170" cy="208" r="5" fill="#ffd45d" stroke="${TINTA}" stroke-width="3.5"/>
      <g transform="translate(184 108) rotate(12)">
        <circle cx="-7" cy="0" r="7" fill="#ffb27a" stroke="${TINTA}" stroke-width="3.5"/>
        <circle cx="7" cy="0" r="7" fill="#ffb27a" stroke="${TINTA}" stroke-width="3.5"/>
        <path d="M0,-9 L0,9" stroke="${TINTA}" stroke-width="3.5" stroke-linecap="round"/>
      </g>
    `,
  },

  /* Adán y Eva: la primera familia, entre hojas. */
  adan: {
    titulo: 'Adán y Eva en el jardín',
    fondo: '#e4f3cf',
    escena: () => `
      ${camino('M-10,70 C26,44 60,60 84,40 C108,22 142,26 160,46 C184,32 216,48 250,40 L250,-10 L-10,-10 Z', '#8fc97a')}
      ${camino('M-10,224 C40,206 90,220 130,214 C176,208 212,222 250,210 L250,250 L-10,250 Z', '#a9d98f')}
      <g>
        ${cuello('#c98f66', 62, 174)}
        ${hombros('#8fc9a8', 152, 74, 62)}
        ${cabeza('#c98f66', { cx: 62, cy: 126, rx: 30, ry: 33 })}
        ${peloCorto('#3f2c22', { cx: 62, cy: 126, rx: 30 })}
        ${cejas(62, 118, 12)}
        ${puntos(62, 126, 12, 4)}
        ${nariz(62, 134)}
        ${sonrisa(62, 142, 15)}
        ${rubor(62, 136, 12)}
      </g>
      <g>
        ${cuello('#e3b08a', 176, 174)}
        ${hombros('#f1a8a0', 152, 74, 176)}
        ${peloLargo('#4b3527', { cx: 176, cy: 126, rx: 30, caida: 62 })}
        ${cabeza('#e3b08a', { cx: 176, cy: 126, rx: 30, ry: 33 })}
        ${flequillo('#4b3527', { cx: 176, cy: 126, rx: 30 })}
        ${cejas(176, 118, 12)}
        ${puntos(176, 126, 12, 4)}
        ${nariz(176, 134)}
        ${sonrisa(176, 142, 15)}
        ${rubor(176, 136, 12)}
        <circle cx="200" cy="102" r="6.5" fill="#ff9b76" stroke="${TINTA}" stroke-width="3.4"/>
        <circle cx="200" cy="102" r="2.4" fill="#ffd45d"/>
      </g>
      ${trazo('M34,226 q10,-14 20,0', '#6cb268', 4.5)}
      ${trazo('M188,232 q10,-14 20,0', '#6cb268', 4.5)}
    `,
  },

  /* Noé: barba blanca, toca y arcoíris. */
  noe: {
    titulo: 'Noé con su barba blanca bajo el arcoíris',
    fondo: '#dff2ff',
    escena: () => `
      ${arcoiris(120, 152)}
      ${nube(44, 58, 0.8)}
      ${nube(202, 62, 0.66)}
      ${cuello('#d8a678')}
      ${hombros('#8a5f3c')}
      ${trazo('M96,212 q24,10 48,0', '#6b472d', 4)}
      ${cabeza('#d8a678')}
      ${barba('#f2eee4')}
      ${bigote('#f2eee4')}
      ${trazo('M98,146 q22,8 44,0', '#ddd6c6', 4)}
      ${cejas(120, 96)}
      ${puntos(120, 105, 17)}
      ${nariz(120, 113)}
      ${sonrisa(120, 127, 18)}
      ${rubor(120, 114, 17)}
      ${toca('#e8ddc2', '#b9a279')}
    `,
  },

  /* Moisés: barba larga, cayado y las dos tablas. */
  maestro: {
    titulo: 'Moisés con su cayado y las tablas de la ley',
    fondo: '#f7e6bd',
    escena: () => `
      ${sol(46, 46, 15)}
      ${camino('M-10,196 C40,172 86,186 130,180 C176,174 210,190 250,178 L250,250 L-10,250 Z', '#e8cf94')}
      ${cuello('#c98f66')}
      ${hombros('#7f6a52', 176, 88)}
      ${cabeza('#c98f66')}
      ${barba('#f4f0e6', { caida: 30 })}
      ${bigote('#f4f0e6')}
      ${trazo('M96,146 q24,10 48,0', '#ddd6c6', 4)}
      ${trazo('M94,160 q26,10 52,0', '#ddd6c6', 4)}
      ${cejas(120, 94)}
      ${puntos(120, 103, 17)}
      ${nariz(120, 112)}
      ${sonrisa(120, 127, 18)}
      ${rubor(120, 113, 17)}
      <g transform="rotate(6 196 150)">
        ${trazo('M196,232 L196,108', '#8a5f3c', 8)}
        <path d="M196,108 q0,-22 -19,-22" fill="none" stroke="${TINTA}" stroke-width="8" stroke-linecap="round"/>
      </g>
      <g transform="rotate(-7 58 186)">
        ${rect(22, 150, 34, 66, 11, '#eee4cd')}
        ${rect(48, 150, 34, 66, 11, '#eee4cd')}
        ${trazo('M30,168 L48,168', TINTA, 4)}
        ${trazo('M30,182 L48,182', TINTA, 4)}
        ${trazo('M30,196 L44,196', TINTA, 4)}
        ${trazo('M56,168 L74,168', TINTA, 4)}
        ${trazo('M56,182 L74,182', TINTA, 4)}
        ${trazo('M56,196 L62,196', TINTA, 4)}
      </g>
    `,
  },

  /* David: pastor joven, honda, arpa y una oveja. */
  david: {
    titulo: 'David, el pastor joven, con su honda y su arpa',
    fondo: '#e2f3d6',
    escena: () => `
      ${sol(52, 48, 16)}
      ${colina('#bfe6a8')}
      ${cuello('#e3b08a')}
      ${hombros('#7fb3c8')}
      ${trazo('M104,200 q18,26 26,44', '#b98c43', 4)}
      ${camino('M142,206 q16,2 18,14 q-16,3 -18,-14 Z', '#a9744a')}
      ${cabeza('#e3b08a')}
      ${camino('M76,114 C72,72 96,50 120,50 C144,50 168,72 164,114 C162,96 156,90 148,98 C142,84 134,80 120,80 C106,80 98,84 92,98 C84,90 78,96 76,114 Z', '#8a5a34')}
      ${cejas(120, 96)}
      ${puntos(120, 105, 17)}
      ${nariz(120, 115)}
      ${sonrisa(120, 126, 20)}
      ${rubor(120, 116, 17)}
      ${lira(56, 196, 1.15)}
      ${ovejita(196, 206, 0.9)}
    `,
  },

  /* Daniel: en el foso, con un león manso. */
  leon: {
    titulo: 'Daniel junto a un león manso',
    fondo: '#f4d7ad',
    escena: () => `
      ${camino('M-10,214 C40,196 84,208 130,202 C176,196 212,210 250,198 L250,250 L-10,250 Z', '#d8b184')}
      ${camino('M36,120 C36,58 72,26 120,26 C168,26 204,58 204,120 L204,150 L36,150 Z', '#c99a6a')}
      ${cuello('#c98f66')}
      ${hombros('#6b8fb5', 168, 88)}
      ${cabeza('#c98f66')}
      ${barba('#4b3527', { caida: 16 })}
      ${bigote('#4b3527')}
      ${cejas(120, 96)}
      ${puntos(120, 105, 17)}
      ${nariz(120, 114)}
      ${sonrisa(120, 127, 18)}
      ${rubor(120, 114, 17)}
      ${leon(178, 202, 0.86)}
    `,
  },

  /* Ester: corona, pelo largo y manto coral. */
  maestra: {
    titulo: 'Ester, la reina valiente, con su corona',
    fondo: '#eadcf5',
    escena: () => `
      <path d="M-10,190 C30,150 60,176 92,150 C124,124 154,152 186,132 C212,116 232,132 250,120 L250,250 L-10,250 Z" fill="#d8c3ea"/>
      ${cuello('#e3b08a')}
      ${hombros('#e8856f')}
      ${camino('M120,200 C108,200 100,210 100,220 L140,220 C140,210 132,200 120,200 Z', '#f6eed7')}
      ${peloLargo('#4b3527', { caida: 78 })}
      ${cabeza('#e3b08a')}
      ${flequillo('#4b3527')}
      ${cejas(120, 96)}
      ${ojosCerrados(120, 105, 17)}
      ${trazo('M108,107 L102,110', TINTA, 3)}
      ${trazo('M132,107 L138,110', TINTA, 3)}
      ${nariz(120, 114)}
      ${sonrisa(120, 126, 20)}
      ${rubor(120, 116, 17)}
      <circle cx="120" cy="154" r="4.5" fill="#ffd45d" stroke="${TINTA}" stroke-width="2.6"/>
      <circle cx="103" cy="160" r="4" fill="#ffd45d" stroke="${TINTA}" stroke-width="2.6"/>
      <circle cx="137" cy="160" r="4" fill="#ffd45d" stroke="${TINTA}" stroke-width="2.6"/>
      ${corona(120, 58)}
    `,
  },

  /* Jesús: pelo largo, barba, túnica clara y manto azul. */
  biblia: {
    titulo: 'Jesús con su túnica y su manto azul',
    fondo: '#fff0d2',
    escena: () => `
      <circle cx="120" cy="108" r="74" fill="#ffe3a8" opacity=".7"/>
      ${nube(44, 54, 0.66)}
      ${nube(202, 64, 0.58)}
      ${cuello('#d8a678')}
      ${hombros('#f6eed7')}
      ${peloLargo('#6b472d', { caida: 72 })}
      ${cabeza('#d8a678')}
      ${flequillo('#6b472d')}
      ${barba('#6b472d', { caida: 18 })}
      ${bigote('#6b472d')}
      ${cejas(120, 96)}
      ${puntos(120, 105, 17)}
      ${nariz(120, 113)}
      ${sonrisa(120, 127, 20)}
      ${rubor(120, 114, 17)}
      ${camino('M60,244 C62,208 80,188 100,184 L120,210 L140,184 C160,188 178,208 180,244 Z', '#5b8fd6')}
      ${trazo('M120,210 L120,244', '#3f6f92', 4)}
    `,
  },

  /* Paloma: la paz del bautismo, con rama de olivo. */
  paloma: {
    titulo: 'Una paloma blanca con una rama de olivo',
    fondo: '#dff2ff',
    escena: () => `
      ${nube(58, 62, 0.9)}
      ${nube(188, 192, 0.7)}
      ${paloma(108, 122, 1.15)}
      ${gota(60, 196)}
      ${gota(186, 70, 0.8)}
    `,
  },

  /* Juan el Bautista: túnica de piel y paloma sobre el río. */
  juan: {
    titulo: 'Juan el Bautista junto al río Jordán',
    fondo: '#d7eee8',
    escena: () => `
      ${ola(198, '#a9d8d0')}
      ${trazo('M176,214 q8,-22 16,-30', '#5f9e6a', 5)}
      ${trazo('M22,208 q7,-18 14,-26', '#5f9e6a', 5)}
      ${cuello('#c98f66')}
      ${hombros('#b98c58')}
      ${trazo('M104,198 L101,226', '#8a5f3c', 3.4)}
      ${trazo('M136,198 L139,226', '#8a5f3c', 3.4)}
      ${trazo('M92,222 q28,10 56,0', '#8a5f3c', 3.4)}
      ${cabeza('#c98f66')}
      ${camino('M78,110 C74,72 94,52 120,52 C146,52 166,72 162,110 C158,92 148,86 142,96 C134,82 128,78 120,78 C112,78 104,82 96,96 C90,86 82,92 78,110 Z', '#5b4633')}
      ${barba('#6b5540', { caida: 16 })}
      ${bigote('#6b5540')}
      ${cejas(120, 96)}
      ${puntos(120, 105, 17)}
      ${nariz(120, 114)}
      ${sonrisa(120, 127, 18)}
      ${rubor(120, 114, 17)}
      ${paloma(120, 34, 0.52)}
    `,
  },

  /* Rut: pañuelo, sonrisa y un haz de espigas. */
  rut: {
    titulo: 'Rut con un haz de espigas en el campo',
    fondo: '#f8e7b6',
    escena: () => `
      ${sol(50, 46, 15)}
      ${camino('M-10,206 C40,190 84,202 130,196 C176,190 212,204 250,192 L250,250 L-10,250 Z', '#e6cf8f')}
      ${espiga(30, 224, -12, 0.85)}
      ${cuello('#c98f66')}
      ${hombros('#e0a25e')}
      ${camino('M120,200 C108,200 100,210 100,220 L140,220 C140,210 132,200 120,200 Z', '#f3d9a8')}
      <g transform="translate(176 214) rotate(10)">
        ${espiga(0, 10, 0, 1.05)}
        ${espiga(-14, 14, -18, 0.95)}
        ${espiga(14, 14, 18, 0.95)}
        ${trazo('M-16,26 q16,10 32,0', '#b98c43', 4)}
      </g>
      ${peloLargo('#a9744a', { caida: 60 })}
      ${cabeza('#c98f66')}
      ${flequillo('#a9744a')}
      ${camino('M78,116 C78,74 96,54 120,54 C144,54 162,74 162,116 C156,96 146,88 120,88 C94,88 84,96 78,116 Z', '#d9a06a')}
      ${cejas(120, 98)}
      ${puntos(120, 107, 17)}
      ${nariz(120, 116)}
      ${sonrisa(120, 127, 20)}
      ${rubor(120, 117, 17)}
      ${camino('M92,196 q28,14 56,0 l-4,20 q-24,10 -48,0 Z', '#d9a06a')}
      <circle cx="120" cy="60" r="7" fill="#f0b93f" stroke="${TINTA}" stroke-width="3.5"/>
    `,
  },

  /* Jonás: sorpresa y el gran pez. */
  jonas: {
    titulo: 'Jonás y el gran pez',
    fondo: '#d5ecf6',
    escena: () => `
      ${ola(202, '#a9d8ea')}
      ${gota(40, 70, 0.9)}
      ${gota(208, 92, 0.75)}
      ${cuello('#c98f66')}
      ${hombros('#7fb3c8')}
      ${cabeza('#c98f66')}
      ${peloCorto('#3f2c22')}
      ${barba('#4b3527', { caida: 14 })}
      ${bigote('#4b3527')}
      ${cejasAltas(120, 98)}
      ${puntos(120, 107, 18, 5.2)}
      ${nariz(120, 116)}
      <ellipse cx="120" cy="131" rx="7" ry="9" fill="#8a3f33" stroke="${TINTA}" stroke-width="4"/>
      ${rubor(120, 118, 18)}
      ${pez(170, 196, -14, 1.05)}
    `,
  },
};

/* -------------------------------- Escritura ------------------------------ */
function componer(clave, { titulo, fondo, escena }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240" role="img" aria-labelledby="titulo-${clave}">
<title id="titulo-${clave}">${titulo}</title>
<defs><clipPath id="recorte-${clave}"><circle cx="120" cy="120" r="114"/></clipPath></defs>
<circle cx="120" cy="120" r="114" fill="${fondo}"/>
<g clip-path="url(#recorte-${clave})">
${escena()}
</g>
<circle cx="120" cy="120" r="114" fill="none" stroke="${TINTA}" stroke-width="6"/>
</svg>
`;
}

const claves = Object.keys(AVATARES);

if (soloRevisar) {
  const faltan = claves.filter((clave) => !existsSync(join(DESTINO, `${clave}.svg`)));
  if (faltan.length) {
    console.error(`❌ Faltan avatares: ${faltan.join(', ')}`);
    process.exit(1);
  }
  const rotos = claves.filter((clave) => !readFileSync(join(DESTINO, `${clave}.svg`), 'utf8').includes('<title'));
  if (rotos.length) {
    console.error(`❌ Avatares sin <title>: ${rotos.join(', ')}`);
    process.exit(1);
  }
  console.log(`✅ Los ${claves.length} avatares existen y llevan título: ${claves.join(', ')}`);
  process.exit(0);
}

mkdirSync(DESTINO, { recursive: true });
for (const clave of claves) {
  const archivo = join(DESTINO, `${clave}.svg`);
  writeFileSync(archivo, componer(clave, AVATARES[clave]));
  const kb = (readFileSync(archivo).length / 1024).toFixed(1);
  console.log(`🖌️  images/avatars/${clave}.svg (${kb} KB)`);
}
console.log(`✅ ${claves.length} avatares dibujados`);
