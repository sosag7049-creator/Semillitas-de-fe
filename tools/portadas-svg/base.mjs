/**
 * base.mjs — Piezas de dibujo para las portadas ilustradas
 * ---------------------------------------------------------------------------
 * Las 39 portadas de /images/lessons/<slug>.svg se dibujan a mano con estas
 * piezas: colinas, agua, árboles, personajes sencillos y pequeños detalles con
 * movimiento. No se usa ninguna imagen generada: todo es vectorial, por eso
 * pesa poco, se ve nítido en cualquier pantalla y jamás aparece un rostro
 * deforme.
 *
 * Reglas del estilo (para que las 39 parezcan de la misma colección):
 *   · Lienzo 600 × 400, horizonte entre 250 y 320.
 *   · Formas redondeadas, contornos gruesos y colores cálidos de cuento.
 *   · Los personajes son figuras planas, sin ojos realistas: dos puntos y una
 *     sonrisa. Nunca se dibujan manos con dedos ni caras en detalle.
 *   · Cada escena tiene UN movimiento protagonista y dos o tres secundarios,
 *     lentos y suaves. Nada rebota ni gira rápido.
 *   · `@media (prefers-reduced-motion: reduce)` apaga todo el movimiento.
 */

/* Paleta compartida ---------------------------------------------------- */
export const C = {
  ink: '#33414f',
  inkSoft: '#5c6f7d',
  cream: '#fff8e8',
  white: '#fffdf7',
  sand: '#f2d6a2',
  sandDark: '#dfb87a',
  sandDeep: '#c99a5e',
  grass: '#93d072',
  grassDark: '#5da95c',
  grassDeep: '#3f8552',
  leaf: '#61b47c',
  leafDark: '#3d8b62',
  leafDeep: '#2c6c50',
  blue: '#4a90cf',
  blueDeep: '#2b6a9c',
  sea: '#65bcd8',
  seaDeep: '#2f83ab',
  seaNight: '#295d83',
  orange: '#f2914e',
  coral: '#e8694f',
  red: '#d15050',
  purple: '#8d6fc4',
  purpleDeep: '#63499a',
  gold: '#ffd35d',
  goldDeep: '#e8ab35',
  brown: '#8d5c3c',
  brownDark: '#6b432c',
  stone: '#cdc5b7',
  stoneDark: '#a89e8e',
  skin1: '#f5cba6',
  skin2: '#e3ad80',
  skin3: '#c98f61',
  skin4: '#96613f',
  hair: '#3b2a24',
  hairSoft: '#6b4a37',
  shadow: '#1c2c3a',
};

/* Cielos de la colección ----------------------------------------------- */
export const CIELO = {
  dia: ['#c9ecff', '#eaf9e6'],
  claro: ['#dff4ff', '#fff6dd'],
  tarde: ['#ffcf9e', '#ffe9c0'],
  atardecer: ['#f7a97c', '#ffe0ae'],
  noche: ['#1f3255', '#3f628c'],
  nocheClara: ['#2a4770', '#7fa2c4'],
  amanecer: ['#ffbfa0', '#ffe7bd'],
  tormenta: ['#849aac', '#c3d2da'],
  agua: ['#a9e3ef', '#d8f5f0'],
};

/* Utilidades ------------------------------------------------------------ */
const n = (valor) => Math.round(valor * 100) / 100;
export const esc = (texto) =>
  String(texto).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Oscurece o aclara un color hex; sirve para separar brazos, pliegues y sombras. */
export function tono(hex, factor) {
  const limpio = hex.replace('#', '');
  const n = parseInt(limpio.length === 3 ? limpio.replace(/(.)/g, '$1$1') : limpio, 16);
  const canal = (desplazamiento) => {
    const valor = (n >> desplazamiento) & 255;
    const mezcla = factor < 0 ? valor * (1 + factor) : valor + (255 - valor) * factor;
    return Math.max(0, Math.min(255, Math.round(mezcla)));
  };
  return `#${[16, 8, 0].map((d) => canal(d).toString(16).padStart(2, '0')).join('')}`;
}

/** Generador pseudoaleatorio determinista: la misma portada siempre sale igual. */
export function rng(semilla) {
  let estado = (semilla * 2654435761) >>> 0;
  return () => {
    estado = (estado * 1664525 + 1013904223) >>> 0;
    return estado / 4294967296;
  };
}

/** Envuelve el contenido en un SVG completo, con su CSS y su título. */
export function documento(titulo, defs, cuerpo) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="1200" height="800" role="img" aria-labelledby="titulo-portada">
<title id="titulo-portada">${esc(titulo)}</title>
<style>
.pf{isolation:isolate}
.tw{animation:sm-twinkle 3.6s ease-in-out infinite}
.fl{animation:sm-float 7s ease-in-out infinite}
.sw{animation:sm-sway 5.2s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
.swc{animation:sm-sway 4.4s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}
.pu{animation:sm-pulse 4.2s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}
.wv{animation:sm-wave 8s ease-in-out infinite alternate}
.wv2{animation:sm-wave 11s ease-in-out infinite alternate-reverse}
.fm{animation:sm-flame 1.7s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
.rp{animation:sm-ripple 3.4s ease-out infinite;transform-box:fill-box;transform-origin:50% 50%}
.hp{animation:sm-hop 3.2s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
.sp{animation:sm-spin 90s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
.sp2{animation:sm-spin 55s linear infinite reverse;transform-box:fill-box;transform-origin:50% 50%}
.rz{animation:sm-rise 5.5s ease-out infinite}
.fa{animation:sm-fall 4.2s linear infinite}
.df{animation:sm-drift 10s ease-in-out infinite alternate}
.bt{animation:sm-flap 2.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 45%}
.gl{animation:sm-glow 4.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}
.tr{animation:sm-tremble 1.15s ease-in-out infinite}
.nd{animation:sm-needle 4.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}
@keyframes sm-twinkle{0%,100%{opacity:.28;transform:scale(.8)}50%{opacity:1;transform:scale(1.18)}}
@keyframes sm-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes sm-sway{0%,100%{transform:rotate(-2.4deg)}50%{transform:rotate(2.4deg)}}
@keyframes sm-pulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:.92;transform:scale(1.07)}}
@keyframes sm-wave{0%{transform:translateX(-16px)}100%{transform:translateX(16px)}}
@keyframes sm-flame{0%,100%{transform:scale(1,1)}30%{transform:scale(.93,1.12) translateY(-1px)}65%{transform:scale(1.06,.9) translateY(1px)}}
@keyframes sm-ripple{0%{transform:scale(.55);opacity:.6}80%{opacity:.08}100%{transform:scale(1.7);opacity:0}}
@keyframes sm-hop{0%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}62%{transform:translateY(-1px)}}
@keyframes sm-spin{to{transform:rotate(360deg)}}
@keyframes sm-rise{0%{transform:translateY(8px);opacity:0}25%{opacity:.85}100%{transform:translateY(-52px);opacity:0}}
@keyframes sm-fall{0%{transform:translateY(-10px);opacity:0}25%{opacity:.8}100%{transform:translateY(60px);opacity:0}}
@keyframes sm-drift{0%{transform:translateX(-9px)}100%{transform:translateX(9px)}}
@keyframes sm-flap{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(6deg)}}
@keyframes sm-glow{0%,100%{opacity:.35;transform:scale(.97)}50%{opacity:.8;transform:scale(1.04)}}
@keyframes sm-tremble{0%,100%{transform:translateX(0)}25%{transform:translateX(-1.6px)}75%{transform:translateX(1.6px)}}
@keyframes sm-needle{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(12deg)}}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>
<defs>
<radialGradient id="vineta" cx="50%" cy="46%" r="72%">
  <stop offset=".55" stop-color="#20303c" stop-opacity="0"/>
  <stop offset="1" stop-color="#20303c" stop-opacity=".16"/>
</radialGradient>
<filter id="granoPapel" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="ruido"/>
  <feColorMatrix in="ruido" type="saturate" values="0"/>
</filter>
${defs}
</defs>
${cuerpo}
<g style="pointer-events:none">
  <rect width="600" height="400" fill="url(#vineta)"/>
  <rect width="600" height="400" filter="url(#granoPapel)" opacity=".055" style="mix-blend-mode:multiply"/>
</g>
</svg>
`;
}

/* Cielo, sol, luna y estrellas ----------------------------------------- */
export const cielo = (colores, id = 'cielo') =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${colores[0]}"/><stop offset="1" stop-color="${colores[1]}"/>
  </linearGradient>`;

export const fondo = (id = 'cielo') => `<rect width="600" height="400" fill="url(#${id})"/>`;

export function sol({ x = 300, y = 90, r = 46, color = C.gold, halo = '#ffe9a0', rayos = true, giro = 90, op = 1 }) {
  const rayosMarca = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    const x1 = n(Math.cos(a) * (r + 12));
    const y1 = n(Math.sin(a) * (r + 12));
    const x2 = n(Math.cos(a) * (r + (i % 2 ? 26 : 36)));
    const y2 = n(Math.sin(a) * (r + (i % 2 ? 26 : 36)));
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${i % 2 ? 4 : 6}" stroke-linecap="round" opacity=".72"/>`;
  }).join('');
  return `<g transform="translate(${x} ${y})" opacity="${op}">
    ${rayos ? `<g class="sp" style="animation-duration:${giro}s">${rayosMarca}</g>` : ''}
    <circle r="${r + 16}" fill="${halo}" opacity=".28"/>
    <circle r="${r}" fill="${color}"/>
    <circle r="${n(r * 0.72)}" fill="#fff0b4" opacity=".55"/>
  </g>`;
}

export function luna({ x = 470, y = 74, r = 30, color = '#fff1c4' }) {
  return `<g transform="translate(${x} ${y})">
    <circle r="${r + 12}" fill="${color}" opacity=".16" class="gl"/>
    <path d="M ${n(r * 0.45)} ${n(-r)} a ${r} ${r} 0 1 0 0 ${2 * r} a ${n(r * 0.78)} ${r} 0 1 1 0 ${-2 * r} Z" fill="${color}"/>
    <circle cx="-9" cy="4" r="3" fill="#e8d18f" opacity=".55"/>
    <circle cx="2" cy="13" r="2" fill="#e8d18f" opacity=".45"/>
  </g>`;
}

export function estrella(x, y, r = 3, color = '#fff4c9', retraso = 0, dur = 3.6) {
  const forma =
    r >= 3
      ? `<path d="M0 ${-r} L ${n(r * 0.34)} ${n(-r * 0.34)} L ${r} 0 L ${n(r * 0.34)} ${n(r * 0.34)} L 0 ${r} L ${n(-r * 0.34)} ${n(r * 0.34)} L ${-r} 0 L ${n(-r * 0.34)} ${n(-r * 0.34)} Z" fill="${color}"/>`
      : `<circle r="${r}" fill="${color}"/>`;
  return `<g transform="translate(${x} ${y})"><g class="tw" style="animation-delay:${retraso}s;animation-duration:${dur}s">${forma}</g></g>`;
}

/** Cielo estrellado determinista; `zona` limita el área. */
export function estrellas(semilla, cantidad, { x = 20, y = 18, ancho = 560, alto = 190, rMin = 1.2, rMax = 3.4, color = '#fff6d2' } = {}) {
  const azar = rng(semilla);
  return Array.from({ length: cantidad }, () => {
    const px = n(x + azar() * ancho);
    const py = n(y + azar() * alto);
    const r = n(rMin + azar() * (rMax - rMin));
    const retraso = n(-azar() * 3.6);
    return estrella(px, py, r, color, retraso, n(3 + azar() * 2.6));
  }).join('');
}

export function nube(x, y, s = 1, color = '#ffffff', op = 0.85, retraso = 0, clase = 'fl') {
  return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${op}">
    <g class="${clase}" style="animation-delay:${retraso}s">
      <ellipse cx="0" cy="0" rx="34" ry="19" fill="${color}"/>
      <ellipse cx="-26" cy="7" rx="22" ry="13" fill="${color}"/>
      <ellipse cx="26" cy="7" rx="24" ry="14" fill="${color}"/>
      <ellipse cx="6" cy="-12" rx="20" ry="16" fill="${color}"/>
    </g>
  </g>`;
}

/* Terreno y agua -------------------------------------------------------- */
/** Banda de terreno con borde ondulado; se apoya en el borde inferior. */
export function colina(y, color, { amp = 22, fase = 0, op = 1 } = {}) {
  const d = [
    `M -20 400`,
    `L -20 ${n(y + Math.sin(fase) * amp)}`,
    `C 90 ${n(y - amp)} 150 ${n(y + amp * 0.5)} 235 ${n(y - amp * 0.2)}`,
    `S 380 ${n(y + amp * 0.7)} 450 ${n(y - amp * 0.1)}`,
    `S 570 ${n(y + amp * 0.6)} 620 ${n(y - amp * 0.4)}`,
    `L 620 400 Z`,
  ].join(' ');
  return `<path d="${d}" fill="${color}" opacity="${op}"/>`;
}

/** Suelo plano con una leve curva, para patios y caminos. */
export function suelo(y, color, { amp = 8 } = {}) {
  return `<path d="M -20 400 L -20 ${y} C 140 ${n(y - amp)} 300 ${n(y + amp)} 620 ${n(y + amp * 0.4)} L 620 400 Z" fill="${color}"/>`;
}

/** Franja de agua con dos olas que se mecen a distinto ritmo. */
export function agua(y, alto, arriba, abajo, { ola = 9 } = {}) {
  const onda = (yy, amp, clase, desfase) => {
    let d = `M -40 ${n(yy + desfase)}`;
    for (let x = -40; x < 640; x += 85) {
      const sube = ((x / 85) % 2 === 0 ? -1 : 1) * amp;
      d += ` Q ${n(x + 21)} ${n(yy + sube + desfase)} ${n(x + 42)} ${n(yy + desfase)}`;
      d += ` Q ${n(x + 63)} ${n(yy - sube + desfase)} ${n(x + 85)} ${n(yy + desfase)}`;
    }
    d += ` L 700 420 L -40 420 Z`;
    return `<path d="${d}" fill="${clase === 'wv' ? arriba : abajo}" opacity=".92" class="${clase}" style="animation-delay:${desfase ? '-2.4s' : '0s'}"/>`;
  };
  return `<g>${onda(y, ola, 'wv', 0)}${onda(y + alto * 0.42, ola * 0.8, 'wv2', 7)}</g>`;
}

export function destello(x, y, color = '#ffffff', op = 0.8) {
  return `<g transform="translate(${x} ${y})" opacity="${op}">
    <path d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z" fill="${color}"/>
  </g>`;
}

/* Vegetación ------------------------------------------------------------ */
export function arbol(x, y, s = 1, copa = C.leaf, copaOscura = C.leafDark, tronco = C.brown) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="2" rx="26" ry="7" fill="${C.shadow}" opacity=".12"/>
    <path d="M -5 0 L -4 -34 L 5 -34 L 6 0 Z" fill="${tronco}"/>
    <path d="M0 -26 L -16 -40 M0 -30 L 15 -43" stroke="${tronco}" stroke-width="4" stroke-linecap="round" fill="none"/>
    <g class="sw" style="animation-delay:-1.4s;transform-origin:50% 90%">
      <circle cx="-16" cy="-48" r="19" fill="${copaOscura}"/>
      <circle cx="16" cy="-50" r="18" fill="${copaOscura}"/>
      <circle cx="0" cy="-62" r="22" fill="${copa}"/>
      <circle cx="-8" cy="-48" r="16" fill="${copa}"/>
      <circle cx="12" cy="-38" r="13" fill="${copaOscura}"/>
      <circle cx="4" cy="-58" r="7" fill="#ffffff" opacity=".14"/>
    </g>
  </g>`;
}

export function palmera(x, y, s = 1, hoja = '#79c47b', tronco = C.brown) {
  const frondas = [-150, -115, -80, -45, -10, 25]
    .map(
      (a, i) => `<path d="M0 0 C ${n(Math.cos((a * Math.PI) / 180) * 24)} ${n(Math.sin((a * Math.PI) / 180) * 26)} ${n(Math.cos((a * Math.PI) / 180) * 44)} ${n(Math.sin((a * Math.PI) / 180) * 34)} ${n(Math.cos((a * Math.PI) / 180) * 58)} ${n(Math.sin((a * Math.PI) / 180) * 40)} C ${n(Math.cos((a * Math.PI) / 180) * 40)} ${n(Math.sin((a * Math.PI) / 180) * 26)} ${n(Math.cos((a * Math.PI) / 180) * 24)} ${n(Math.sin((a * Math.PI) / 180) * 14)} 0 0 Z" fill="${i % 2 ? hoja : '#5fae6e'}" opacity=".95" class="sw" style="transform-origin:0 0;animation-delay:${n(-i * 0.6)}s"></path>`,
    )
    .join('');
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M -6 0 C -3 -26 4 -48 12 -66 L 20 -64 C 12 -46 6 -24 5 0 Z" fill="${tronco}"/>
    <path d="M -3 -8 L 3 -10 M -1 -22 L 5 -24 M 2 -36 L 8 -38 M 6 -50 L 12 -52" stroke="${C.brownDark}" stroke-width="1.6" opacity=".5"/>
    <g transform="translate(14 -66)"><g class="swc" style="transform-origin:50% 50%">${frondas}</g></g>
    <circle cx="12" cy="-60" r="4" fill="${C.goldDeep}"/>
    <circle cx="19" cy="-58" r="3.5" fill="${C.brown}"/>
  </g>`;
}

export function arbusto(x, y, s = 1, color = C.leaf, oscuro = C.leafDark) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="0" rx="30" ry="7" fill="${C.shadow}" opacity=".12"/>
    <circle cx="-17" cy="-12" r="15" fill="${oscuro}"/>
    <circle cx="16" cy="-12" r="14" fill="${oscuro}"/>
    <circle cx="0" cy="-20" r="18" fill="${color}"/>
    <circle cx="-9" cy="-20" r="12" fill="${color}"/>
    <circle cx="9" cy="-13" r="9" fill="${color}"/>
  </g>`;
}

export function pasto(semilla, cantidad, { x = 10, ancho = 580, y = 352, alto = 26, color = C.grassDark } = {}) {
  const azar = rng(semilla);
  return `<g stroke="${color}" stroke-width="3" stroke-linecap="round" fill="none" opacity=".8">${Array.from(
    { length: cantidad },
    () => {
      const px = n(x + azar() * ancho);
      const py = n(y + azar() * 18);
      const h = n(alto * (0.5 + azar() * 0.7));
      const inclina = n((azar() - 0.5) * 12);
      return `<path d="M ${px} ${py} Q ${n(px + inclina)} ${n(py - h * 0.6)} ${n(px + inclina * 1.7)} ${n(py - h)}" class="sw" style="transform-origin:${px}px ${py}px;animation-delay:${n(-azar() * 4)}s"/>`;
    },
  ).join('')}</g>`;
}

export function trigo(x, y, s = 1, color = '#e9c25c', oscuro = '#c99a3c') {
  const granos = [-6, -2, 2, 6]
    .map(
      (dx, i) =>
        `<ellipse cx="${dx}" cy="${-12 - i * 1.5}" rx="3.1" ry="5.2" fill="${i % 2 ? color : oscuro}" transform="rotate(${dx * 2.4} ${dx} ${-12 - i * 1.5})"/>`,
    )
    .join('');
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 0 Q 2 -18 4 -34" stroke="${oscuro}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M0 -18 Q -8 -24 -12 -32 M1 -24 Q 9 -30 13 -38" stroke="${oscuro}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <g class="sw" style="transform-origin:0 0;animation-delay:-1s">${granos}</g>
  </g>`;
}

export function flor(x, y, color = '#f58fa0', centro = C.gold) {
  return `<g transform="translate(${x} ${y})">
    <path d="M0 0 Q 1 -8 0 -14" stroke="${C.grassDeep}" stroke-width="2" fill="none"/>
    <g class="swc" style="animation-delay:-2s;transform-origin:0 -14px">
      ${[0, 72, 144, 216, 288].map((a) => `<circle cx="${n(Math.cos((a * Math.PI) / 180) * 4)}" cy="${n(-14 + Math.sin((a * Math.PI) / 180) * 4)}" r="3.4" fill="${color}"/>`).join('')}
      <circle cx="0" cy="-14" r="2.6" fill="${centro}"/>
    </g>
  </g>`;
}

export function hoja(x, y, s = 1, color = C.leaf, rot = 0) {
  return `<path d="M0 0 C 8 -10 22 -12 30 -2 C 22 8 8 8 0 0 Z" fill="${color}" transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" opacity=".9"/>`;
}

/* Personajes ------------------------------------------------------------ */
/**
 * Figura plana de cuento. Los pies quedan en (x, y); `s` es la altura relativa.
 * poses: stand · open · up · pray · walk · carry · wave · hold
 */
export function persona({
  x, y, s = 1, robe = C.leaf, robeDark = null, skin = C.skin1, pelo = C.hair,
  pose = 'stand', cabeza = 'descubierta', barba = false, nino = false,
  retraso = 0, op = 1,
}) {
  const oscuro = robeDark || robe;
  const alto = nino ? 0.74 : 1;
  const brazos = {
    stand: ['M-13 -54 Q -22 -42 -20 -26', 'M13 -54 Q 22 -42 20 -26'],
    walk: ['M-13 -54 Q -23 -44 -25 -34', 'M13 -54 Q 24 -44 26 -32'],
    open: ['M-13 -55 Q -30 -60 -36 -50', 'M13 -55 Q 30 -60 36 -50'],
    up: ['M-13 -54 Q -22 -44 -21 -30', 'M13 -55 Q 26 -64 30 -82'],
    wave: ['M-13 -54 Q -22 -44 -21 -30', 'M13 -55 Q 27 -66 33 -76'],
    pray: ['M-12 -53 Q -7 -48 -3 -44', 'M12 -53 Q 7 -48 3 -44'],
    carry: ['M-13 -54 Q -17 -46 -10 -42', 'M13 -54 Q 17 -46 10 -42'],
    bless: ['M-13 -54 Q -22 -44 -21 -30', 'M13 -55 Q 26 -64 31 -74'],
    hug: ['M-13 -54 Q -28 -50 -24 -38', 'M13 -54 Q 28 -50 24 -38'],
  }[pose] || ['M-13 -54 Q -22 -42 -20 -26', 'M13 -54 Q 22 -42 20 -26'];
  const manos = {
    stand: [-20, -26, 20, -26],
    walk: [-25, -34, 26, -32],
    open: [-37, -50, 37, -50],
    up: [-21, -30, 31, -82],
    wave: [-21, -30, 31, -77],
    pray: [0, -44, 0, -44],
    carry: [-10, -42, 10, -42],
    bless: [-21, -30, 31, -75],
    hug: [-25, -38, 25, -38],
  }[pose] || [-20, -26, 20, -26];

  /* El velo y el pañuelo van DETRÁS de la cabeza: así enmarcan el rostro y no
   * lo tapan. La corona y el turbante, en cambio, se apoyan encima. */
  const detras =
    cabeza === 'velo'
      ? `<path d="M -15 -78 Q 0 -97 15 -78 Q 18 -56 11 -46 L 8 -52 Q 14 -64 12 -76 Q 0 -88 -12 -76 Q -14 -64 -8 -52 L -11 -46 Q -18 -56 -15 -78 Z" fill="${C.blue}" opacity=".92"/>
         <path d="M 11 -48 Q 18 -56 16 -70" stroke="${C.blueDeep}" stroke-width="3" fill="none" opacity=".45"/>`
      : cabeza === 'panuelo'
        ? `<path d="M -14 -78 Q 0 -95 14 -78 Q 16 -62 10 -50 L 6 -56 Q 11 -68 9 -76 Q 0 -85 -9 -76 Q -11 -68 -6 -56 L -10 -50 Q -16 -62 -14 -78 Z" fill="${C.coral}" opacity=".95"/>
           <path d="M 9 -60 Q 17 -56 19 -48" stroke="${C.coral}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`
        : '';

  const toca =
    cabeza === 'turbante'
      ? `<path d="M -12 -80 Q 0 -92 12 -80 Q 12 -72 8 -70 L -8 -70 Q -12 -72 -12 -80 Z" fill="${C.cream}"/>
         <path d="M -11 -78 Q 0 -84 11 -78" stroke="${C.sandDark}" stroke-width="2.4" fill="none"/>`
      : cabeza === 'corona'
        ? `<path d="M -12 -78 L -12 -68 L -7 -73 L -3 -65 L 0 -74 L 3 -65 L 7 -73 L 12 -68 L 12 -78 Z" fill="${C.gold}" stroke="${C.goldDeep}" stroke-width="1.3"/>`
        : '';

  const barbilla = barba
    ? `<path d="M -9 -70 Q 0 -58 9 -70 Q 6 -64 0 -62 Q -6 -64 -9 -70 Z" fill="${pelo}"/>`
    : '';

  return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${op}">
    <ellipse cx="0" cy="3" rx="${n(25 * alto)}" ry="6" fill="${C.shadow}" opacity=".13"/>
    <g class="fl" style="animation-delay:${retraso}s;animation-duration:6.5s">
      <path d="M -15 ${n(-55 * alto)} Q 0 ${n(-64 * alto)} 15 ${n(-55 * alto)} L ${n(24 * alto)} -3 Q 0 5 ${n(-24 * alto)} -3 Z" fill="${robe}"/>
      <path d="M ${n(-8 * alto)} ${n(-56 * alto)} L ${n(-10 * alto)} -4 Q 0 1 ${n(-2 * alto)} -5 Z" fill="${oscuro}" opacity=".28"/>
      <path d="M -15 ${n(-37 * alto)} Q 0 ${n(-32 * alto)} 15 ${n(-37 * alto)} L 16 ${n(-32 * alto)} Q 0 ${n(-27 * alto)} -16 ${n(-32 * alto)} Z" fill="${C.sandDark}" opacity=".85"/>
      <path d="M ${brazos[0]}" stroke="${tono(robe, -0.16)}" stroke-width="${n(6.5 * alto)}" stroke-linecap="round" fill="none"/>
      <path d="M ${brazos[1]}" stroke="${tono(robe, -0.16)}" stroke-width="${n(6.5 * alto)}" stroke-linecap="round" fill="none"/>
      <circle cx="${manos[0]}" cy="${manos[1]}" r="${n(3.6 * alto)}" fill="${skin}"/>
      <circle cx="${manos[2]}" cy="${manos[3]}" r="${n(3.6 * alto)}" fill="${skin}"/>
      <rect x="${n(-5 * alto)}" y="${n(-64 * alto)}" width="${n(10 * alto)}" height="${n(9 * alto)}" rx="3" fill="${skin}"/>
      <circle cx="0" cy="${n(-73 * alto)}" r="${n(11.5 * alto)}" fill="${skin}"/>
      ${detras}
      <path d="M ${n(-11.5 * alto)} ${n(-76 * alto)} Q ${n(-9 * alto)} ${n(-87 * alto)} 0 ${n(-86 * alto)} Q ${n(9 * alto)} ${n(-87 * alto)} ${n(11.5 * alto)} ${n(-76 * alto)} Q ${n(7 * alto)} ${n(-80 * alto)} 0 ${n(-79 * alto)} Q ${n(-7 * alto)} ${n(-80 * alto)} ${n(-11.5 * alto)} ${n(-76 * alto)} Z" fill="${pelo}"/>
      <circle cx="${n(-4 * alto)}" cy="${n(-73 * alto)}" r="${n(1.3 * alto)}" fill="${C.ink}"/>
      <circle cx="${n(4 * alto)}" cy="${n(-73 * alto)}" r="${n(1.3 * alto)}" fill="${C.ink}"/>
      <path d="M ${n(-2.5 * alto)} ${n(-68.6 * alto)} Q 0 ${n(-66.2 * alto)} ${n(2.5 * alto)} ${n(-68.6 * alto)}" stroke="${C.ink}" stroke-width="${n(1.1 * alto)}" stroke-linecap="round" fill="none" opacity=".72"/>
      <circle cx="${n(-7 * alto)}" cy="${n(-70 * alto)}" r="${n(2 * alto)}" fill="#f08e83" opacity=".28"/>
      <circle cx="${n(7 * alto)}" cy="${n(-70 * alto)}" r="${n(2 * alto)}" fill="#f08e83" opacity=".28"/>
      ${barbilla}
      ${toca}
    </g>
  </g>`;
}

export function bebe(x, y, s = 1, manta = C.cream) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="0" rx="17" ry="9" fill="${manta}"/>
    <circle cx="-12" cy="-4" r="7" fill="${C.skin1}"/>
    <path d="M -18 -7 Q -16 -12 -11 -11" stroke="${C.hair}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <circle cx="-14" cy="-4" r=".9" fill="${C.ink}"/><circle cx="-9" cy="-4" r=".9" fill="${C.ink}"/>
    <path d="M -6 0 Q 2 4 10 0" stroke="${C.sandDark}" stroke-width="1.4" fill="none" opacity=".6"/>
  </g>`;
}

/* Animales -------------------------------------------------------------- */
export function oveja(x, y, s = 1, { color = '#f6f1e3', cara = '#4a4a52', retraso = 0, mirando = 1 } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="2" rx="22" ry="5" fill="${C.shadow}" opacity=".12"/>
    <g class="hp" style="animation-delay:${retraso}s;animation-duration:3.6s">
      <rect x="-11" y="-12" width="4" height="13" rx="2" fill="${cara}"/>
      <rect x="6" y="-12" width="4" height="13" rx="2" fill="${cara}"/>
      <ellipse cx="0" cy="-20" rx="21" ry="14" fill="${color}"/>
      <circle cx="-14" cy="-24" r="7" fill="${color}"/>
      <circle cx="-4" cy="-29" r="8" fill="${color}"/>
      <circle cx="8" cy="-28" r="7" fill="${color}"/>
      <circle cx="17" cy="-23" r="6.5" fill="${color}"/>
      <circle cx="${n(19 * mirando)}" cy="-29" r="8" fill="${cara}"/>
      <ellipse cx="${n(25 * mirando)}" cy="-25" rx="5" ry="4" fill="${cara}"/>
      <circle cx="${n(22 * mirando)}" cy="-31" r="1.2" fill="${C.white}"/>
      <ellipse cx="${n(28 * mirando)}" cy="-23" rx="3.4" ry="2.6" fill="#d9d2c2"/>
      <path d="M ${n(17 * mirando)} -34 Q ${n(13 * mirando)} -37 ${n(11 * mirando)} -33" stroke="${cara}" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g>
  </g>`;
}

export function leon(x, y, s = 1, { color = C.gold, melena = '#b8732f', retraso = 0 } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="2" rx="34" ry="7" fill="${C.shadow}" opacity=".12"/>
    <g class="fl" style="animation-delay:${retraso}s;animation-duration:7s">
      <path d="M 24 -6 Q 48 -8 46 -26" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="47" cy="-28" r="4.5" fill="${melena}"/>
      <ellipse cx="0" cy="-20" rx="34" ry="19" fill="${color}"/>
      <ellipse cx="-6" cy="-14" rx="24" ry="12" fill="#ffe6a6" opacity=".55"/>
      <rect x="-22" y="-12" width="5" height="13" rx="2.4" fill="${color}"/>
      <rect x="-9" y="-12" width="5" height="13" rx="2.4" fill="${color}"/>
      <rect x="10" y="-12" width="5" height="13" rx="2.4" fill="${color}"/>
      <rect x="21" y="-12" width="5" height="13" rx="2.4" fill="${color}"/>
      <g transform="translate(-34 -34)">
        ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<circle cx="${n(Math.cos((a * Math.PI) / 180) * 14)}" cy="${n(Math.sin((a * Math.PI) / 180) * 14)}" r="8" fill="${melena}"/>`).join('')}
        <circle r="15" fill="${melena}"/>
        <circle r="11" fill="${color}"/>
        <circle cx="-4" cy="-2" r="1.4" fill="${C.ink}"/><circle cx="4" cy="-2" r="1.4" fill="${C.ink}"/>
        <path d="M -2 4 Q 0 6 2 4" stroke="${C.ink}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
        <path d="M -5 -6 Q -3 -8 -1 -6 M 1 -6 Q 3 -8 5 -6" stroke="${C.ink}" stroke-width="1.1" fill="none" opacity=".55"/>
      </g>
    </g>
  </g>`;
}

export function pez(x, y, s = 1, color = C.orange, { retraso = 0, voltear = false } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${voltear ? -s : s} ${s})">
    <g class="swc" style="animation-delay:${retraso}s;transform-origin:50% 50%">
      <path d="M -22 0 Q -32 -12 -38 -4 Q -33 4 -38 12 Q -28 10 -22 4 Z" fill="${color}" opacity=".85"/>
      <ellipse cx="0" cy="0" rx="24" ry="13" fill="${color}"/>
      <path d="M -4 -12 Q 4 -22 14 -10 Z" fill="${color}" opacity=".7"/>
      <path d="M -6 4 Q 6 10 16 2" stroke="#ffffff" stroke-width="2" fill="none" opacity=".45"/>
      <circle cx="14" cy="-3" r="2.2" fill="${C.ink}"/>
    </g>
  </g>`;
}

export function paloma(x, y, s = 1, { color = '#ffffff', retraso = 0, op = 1 } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${op}">
    <g class="fl" style="animation-delay:${retraso}s;animation-duration:4.8s">
      <path d="M -18 2 L -34 9 L -16 10 Z" fill="${color}" opacity=".9"/>
      <ellipse cx="0" cy="0" rx="20" ry="12" fill="${color}" transform="rotate(-8)"/>
      <circle cx="17" cy="-8" r="8" fill="${color}"/>
      <path d="M 24 -7 L 31 -3 L 24 -2 Z" fill="${C.goldDeep}"/>
      <circle cx="20" cy="-10" r="1.5" fill="${C.ink}"/>
      <g class="bt" style="animation-delay:${retraso}s">
        <path d="M -6 -6 Q 4 -30 18 -16 Q 8 -4 -6 -6 Z" fill="${color}" stroke="${C.stone}" stroke-width="1" opacity=".95"/>
      </g>
    </g>
  </g>`;
}

/* Construcciones -------------------------------------------------------- */
export function casa(x, y, s = 1, { pared = C.cream, techo = C.coral, puerta = C.brown } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="1" rx="52" ry="8" fill="${C.shadow}" opacity=".12"/>
    <rect x="-40" y="-52" width="80" height="52" rx="4" fill="${pared}"/>
    <path d="M -50 -50 L 0 -88 L 50 -50 Z" fill="${techo}"/>
    <path d="M -42 -54 L 0 -82 L 42 -54" stroke="#ffffff" stroke-width="4" fill="none" opacity=".22"/>
    <rect x="-10" y="-30" width="20" height="30" rx="2" fill="${puerta}"/>
    <circle cx="5" cy="-15" r="1.7" fill="${C.gold}"/>
    <rect x="-32" y="-38" width="15" height="14" rx="2" fill="${C.sky || '#cdeafa'}"/>
    <path d="M -32 -31 H -17 M -24.5 -38 V -24" stroke="${pared}" stroke-width="2"/>
    <rect x="18" y="-38" width="15" height="14" rx="2" fill="#cdeafa"/>
    <path d="M 18 -31 H 33 M 25.5 -38 V -24" stroke="${pared}" stroke-width="2"/>
  </g>`;
}

export function tienda(x, y, s = 1, { lona = '#f0dcb4', sombra = '#d9bd8c' } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="1" rx="58" ry="8" fill="${C.shadow}" opacity=".12"/>
    <path d="M -50 0 L 0 -78 L 50 0 Z" fill="${lona}"/>
    <path d="M 0 -78 L 50 0 L 18 0 Z" fill="${sombra}" opacity=".75"/>
    <path d="M 0 -78 L 0 0" stroke="${C.brown}" stroke-width="2" opacity=".25"/>
    <path d="M -50 0 L -70 4 M 50 0 L 70 4" stroke="${C.brown}" stroke-width="2" opacity=".5"/>
    <path d="M -10 0 Q 0 -20 10 0 Z" fill="${C.brownDark}" opacity=".65"/>
  </g>`;
}

export function muro(x, y, { ancho = 300, alto = 96, s = 1, color = C.sandDark, claro = '#edd0a1', huecos = [] } = {}) {
  const filas = Math.ceil(alto / 22);
  let ladrillos = '';
  for (let fila = 0; fila < filas; fila += 1) {
    const yy = -fila * 22 - 2;
    const desfase = fila % 2 ? -18 : 0;
    for (let col = -1; col < Math.ceil(ancho / 36) + 1; col += 1) {
      const xx = desfase + col * 36;
      if (xx < -6 || xx + 32 > ancho + 6) continue;
      if (huecos.some(([hx, hy]) => Math.abs(hx - (xx + 16)) < 22 && Math.abs(hy - (yy + 9)) < 16)) continue;
      ladrillos += `<rect x="${xx}" y="${yy}" width="32" height="18" rx="4" fill="${fila % 2 ? color : claro}"/>`;
    }
  }
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-4" y="-${alto}" width="${ancho + 8}" height="${alto}" rx="6" fill="${C.stoneDark}" opacity=".4"/>
    ${ladrillos}
    <rect x="-8" y="-${alto - 2}" width="${ancho + 16}" height="8" rx="4" fill="${claro}"/>
  </g>`;
}

export function barca(x, y, s = 1, { casco = C.brown, vela = '#fff4d8', mastil = C.brownDark } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <g class="fl" style="animation-duration:5.4s">
      <path d="M -52 -6 Q 0 22 52 -6 Q 44 10 30 13 L -30 13 Q -44 10 -52 -6 Z" fill="${casco}"/>
      <path d="M -48 -5 Q 0 16 48 -5 Q 40 4 28 6 L -28 6 Q -40 4 -48 -5 Z" fill="#a06b45" opacity=".5"/>
      <path d="M 0 -6 L 0 -82" stroke="${mastil}" stroke-width="5" stroke-linecap="round"/>
      <path d="M 4 -78 Q 40 -58 34 -18 L 4 -14 Z" fill="${vela}"/>
      <path d="M -4 -76 Q -32 -58 -27 -22 L -4 -18 Z" fill="${vela}" opacity=".92"/>
      <path d="M 0 -84 L 12 -78 L 0 -72 Z" fill="${C.coral}"/>
    </g>
  </g>`;
}

/* Objetos bíblicos ------------------------------------------------------ */
export function llama(x, y, s = 1, { afuera = C.orange, adentro = C.gold, core = '#fff6c8', retraso = 0 } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <g class="fm" style="animation-delay:${retraso}s">
      <path d="M0 0 C -18 -8 -20 -30 -8 -44 C -6 -32 2 -30 4 -42 C 18 -28 16 -8 0 0 Z" fill="${afuera}"/>
      <path d="M0 -3 C -11 -10 -12 -24 -4 -34 C -2 -24 4 -22 6 -30 C 13 -20 10 -8 0 -3 Z" fill="${adentro}"/>
      <path d="M0 -6 C -5 -12 -4 -19 0 -24 C 4 -19 5 -12 0 -6 Z" fill="${core}"/>
    </g>
  </g>`;
}

export function corazon(x, y, s = 1, color = C.coral, { clase = 'pu', retraso = 0, op = 1 } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${op}">
    <path class="${clase}" style="animation-delay:${retraso}s" d="M0 14 C -20 -2 -22 -18 -10 -24 C -4 -27 0 -22 0 -17 C 0 -22 4 -27 10 -24 C 22 -18 20 -2 0 14 Z" fill="${color}"/>
  </g>`;
}

export function jarra(x, y, s = 1, { color = '#d68a5c', oscuro = '#b56c44', brillo = C.cream } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="1" rx="20" ry="5" fill="${C.shadow}" opacity=".12"/>
    <path d="M -9 -34 L -9 -26 Q -20 -18 -18 0 Q 0 7 18 0 Q 20 -18 9 -26 L 9 -34 Z" fill="${color}"/>
    <ellipse cx="0" cy="-34" rx="9" ry="3.6" fill="${oscuro}"/>
    <path d="M -9 -32 Q -22 -30 -22 -20" stroke="${oscuro}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <path d="M -12 -8 Q -6 -4 0 -10" stroke="${brillo}" stroke-width="2.4" fill="none" opacity=".55"/>
  </g>`;
}

export function tabla(x, y, s = 1, color = C.stone) {
  const lineas = Array.from({ length: 5 }, (_, i) => `<path d="M ${-22 + (i % 2) * 5} ${-58 + i * 10} H ${4 + (i % 2) * 5}" stroke="${C.inkSoft}" stroke-width="3" stroke-linecap="round" opacity=".45"/>`).join('');
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M -24 0 L -24 -66 Q -24 -80 -10 -80 L 10 -80 Q 24 -80 24 -66 L 24 0 Q 0 5 -24 0 Z" fill="${color}"/>
    <path d="M -20 -2 L -20 -64 Q -20 -74 -9 -74 L 8 -74 Q 20 -74 20 -62 L 20 -2 Q 0 2 -20 -2 Z" fill="${C.cream}" opacity=".35"/>
    ${lineas}
  </g>`;
}

export function canasta(x, y, s = 1, color = C.sandDark, oscuro = C.brown) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="2" rx="42" ry="7" fill="${C.shadow}" opacity=".12"/>
    <path d="M -42 -26 L 42 -26 L 32 0 L -32 0 Z" fill="${color}"/>
    <path d="M -34 -18 H 34 M -28 -9 H 28" stroke="${oscuro}" stroke-width="2" opacity=".45"/>
    <path d="M -42 -26 Q 0 -38 42 -26" stroke="${oscuro}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <ellipse cx="-16" cy="-32" rx="17" ry="9" fill="#eccf91"/>
    <ellipse cx="14" cy="-33" rx="16" ry="8.5" fill="#e3bf7c"/>
    <path d="M -26 -34 L -8 -31 M 4 -36 L 22 -33" stroke="${C.sandDeep}" stroke-width="2" opacity=".6"/>
    <path d="M 30 -4 Q 45 -8 52 -16 Q 46 -4 34 2 Z" fill="${C.sea}" opacity=".9"/>
  </g>`;
}

export function racimo(x, y, s = 1) {
  const uvas = [
    [-8, -22], [8, -22], [0, -14], [-12, -8], [12, -8], [-6, 0], [6, 0], [0, 8],
  ]
    .map(([dx, dy]) => `<circle cx="${dx}" cy="${dy}" r="8" fill="${dy % 2 ? '#7d5aa8' : '#8e68bd'}"/><circle cx="${dx - 2}" cy="${dy - 2}" r="2.4" fill="#ffffff" opacity=".35"/>`)
    .join('');
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M -2 -30 Q -8 -42 -18 -46 M -2 -30 Q 6 -40 14 -42" stroke="${C.leafDark}" stroke-width="3" fill="none"/>
    <path d="M -14 -36 Q -2 -46 12 -38 Q 2 -28 -14 -36 Z" fill="${C.leaf}" opacity=".9"/>
    ${uvas}
  </g>`;
}

export function pan(x, y, s = 1, color = '#e5b978', oscuro = '#c99655') {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="0" rx="20" ry="11" fill="${color}"/>
    <path d="M -12 -4 Q 0 -12 12 -4" stroke="${oscuro}" stroke-width="2.4" fill="none"/>
    <path d="M -9 2 Q -3 -3 3 2" stroke="${oscuro}" stroke-width="2" fill="none" opacity=".7"/>
  </g>`;
}

export function corona(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><g class="fl">
    <path d="M -30 0 L -34 -30 L -16 -16 L 0 -36 L 16 -16 L 34 -30 L 30 0 Z" fill="${C.gold}" stroke="${C.goldDeep}" stroke-width="2.5"/>
    <ellipse cx="0" cy="0" rx="30" ry="6" fill="${C.goldDeep}" opacity=".55"/>
    <circle cx="-30" cy="-32" r="4" fill="${C.coral}"/><circle cx="0" cy="-38" r="4.5" fill="${C.coral}"/><circle cx="30" cy="-32" r="4" fill="${C.coral}"/>
    <circle cx="-14" cy="-8" r="2.6" fill="${C.white}" opacity=".8"/><circle cx="14" cy="-8" r="2.6" fill="${C.white}" opacity=".8"/>
  </g></g>`;
}

export function arcoiris(x, y, s = 1, colores = ['#e8694f', '#f2a24e', '#ffd35d', '#79c47b', '#5aa8d8', '#8d6fc4']) {
  return `<g transform="translate(${x} ${y}) scale(${s})" opacity=".92">
    <g class="gl" style="animation-duration:6.5s">
      ${colores
        .map(
          (color, i) =>
            `<path d="M ${-150 - i * 15} 0 A ${150 + i * 15} ${130 + i * 15} 0 0 1 ${150 + i * 15} 0" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round" opacity="${0.55 + i * 0.05}"/>`,
        )
        .join('')}
    </g>
  </g>`;
}

export function mariposa(x, y, s = 1, color = C.gold, retraso = 0) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <g class="bt" style="animation-delay:${retraso}s">
      <path d="M 0 0 C -12 -16 -22 -6 -14 2 C -22 10 -10 18 0 4 Z" fill="${color}"/>
      <path d="M 0 0 C 12 -16 22 -6 14 2 C 22 10 10 18 0 4 Z" fill="${color}" opacity=".85"/>
      <path d="M 0 -4 L 0 8" stroke="${C.ink}" stroke-width="1.6" stroke-linecap="round"/>
    </g>
  </g>`;
}

/* Rutas y adornos ------------------------------------------------------- */
export function camino(x1, y1, x2, y2, ancho = 40, color = '#f0d9ab') {
  const mx = (x1 + x2) / 2;
  return `<path d="M ${x1 - ancho / 2} ${y1} Q ${mx} ${(y1 + y2) / 2 + 30} ${x2 - ancho * 0.65} ${y2} L ${x2 + ancho * 0.65} ${y2} Q ${mx} ${(y1 + y2) / 2 + 46} ${x1 + ancho / 2} ${y1} Z" fill="${color}" opacity=".8"/>`;
}

export function rayosLuz(x, y, { ancho = 260, alto = 240, color = '#fff3b0', op = 0.28, giro = 80 } = {}) {
  const id = `rayo-${Math.round(x)}-${Math.round(y)}-${Math.round(ancho)}`;
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${color}" stop-opacity="${op}"/>
      <stop offset=".7" stop-color="${color}" stop-opacity="${n(op * 0.35)}"/>
      <stop offset="1" stop-color="${color}" stop-opacity="0"/>
    </linearGradient></defs>
  <g transform="translate(${x} ${y})"><g class="gl" style="animation-duration:${n(giro / 20)}s">
    <path d="M -14 0 L 14 0 L ${n(ancho / 2)} ${alto} Q 0 ${n(alto * 1.14)} ${n(-ancho / 2)} ${alto} Z" fill="url(#${id})"/>
    <path d="M -7 0 L 7 0 L ${n(ancho * 0.2)} ${n(alto * 0.94)} Q 0 ${n(alto * 1.02)} ${n(-ancho * 0.2)} ${n(alto * 0.94)} Z" fill="url(#${id})" opacity=".7"/>
  </g></g>`;
}

/** Montículo de roca con facetas y grietas, para cimientos y cuevas. */
export function roca(x, y, { ancho = 360, alto = 86, color = '#a89e8e', luz = '#c2b8a8', sombra = '#8a8174' } = {}) {
  const mitad = ancho / 2;
  return `<g transform="translate(${x} ${y})">
    <path d="M ${-mitad} 6 Q ${n(-mitad * 0.94)} ${n(-alto * 0.55)} ${n(-mitad * 0.55)} ${n(-alto * 0.82)}
      Q ${n(-mitad * 0.16)} ${-alto - 8} ${n(mitad * 0.12)} ${n(-alto * 0.9)}
      Q ${n(mitad * 0.6)} ${n(-alto * 0.72)} ${n(mitad * 0.9)} ${n(-alto * 0.3)}
      Q ${mitad + 6} ${n(-alto * 0.1)} ${mitad} 6 Z" fill="${color}"/>
    <path d="M ${n(-mitad * 0.86)} 4 Q ${n(-mitad * 0.8)} ${n(-alto * 0.5)} ${n(-mitad * 0.48)} ${n(-alto * 0.72)}
      Q ${n(-mitad * 0.2)} ${n(-alto * 0.36)} ${n(-mitad * 0.3)} 4 Z" fill="${luz}" opacity=".55"/>
    <path d="M ${n(mitad * 0.06)} 4 Q ${n(mitad * 0.1)} ${n(-alto * 0.62)} ${n(mitad * 0.36)} ${n(-alto * 0.6)}
      Q ${n(mitad * 0.6)} ${n(-alto * 0.4)} ${n(mitad * 0.68)} 4 Z" fill="${sombra}" opacity=".4"/>
    <path d="M ${n(-mitad * 0.12)} ${n(-alto * 0.62)} l 14 12 l -6 14 M ${n(mitad * 0.3)} ${n(-alto * 0.4)} l -12 10"
      stroke="${sombra}" stroke-width="2.4" fill="none" opacity=".45" stroke-linecap="round"/>
  </g>`;
}

/** Cama sencilla de cuento, vista de lado. Los pies quedan en (x, y). */
export function cama(x, y, s = 1, { madera = C.brown, manta = '#8fa8bd', sabanas = C.cream, almohada = '#f4e6c8' } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="4" rx="86" ry="9" fill="${C.shadow}" opacity=".14"/>
    <rect x="-84" y="-46" width="8" height="46" rx="4" fill="${madera}"/>
    <rect x="76" y="-36" width="8" height="36" rx="4" fill="${madera}"/>
    <rect x="-80" y="-30" width="160" height="12" rx="4" fill="${madera}"/>
    <rect x="-80" y="-42" width="160" height="14" rx="6" fill="${sabanas}"/>
    <rect x="-76" y="-30" width="152" height="8" rx="3" fill="${manta}" opacity=".55"/>
    <path d="M -60 -42 Q -34 -56 0 -44 L 0 -24 L -60 -26 Z" fill="${sabanas}"/>
    <path d="M -74 -40 Q -96 -52 -88 -66 Q -70 -70 -58 -54 Q -66 -46 -74 -40 Z" fill="${almohada}"/>
    <path d="M -74 -40 Q -70 -48 -60 -50" stroke="${C.sandDark}" stroke-width="2" fill="none" opacity=".55"/>
    <path d="M 4 -44 Q 44 -50 78 -38 L 78 -22 L 4 -26 Z" fill="${manta}"/>
    <path d="M 8 -42 Q 40 -46 72 -36" stroke="#ffffff" stroke-width="2" fill="none" opacity=".22"/>
    <path d="M -80 -46 L -76 -46 L -76 -2 L -80 -2 Z" fill="${C.brownDark}" opacity=".5"/>
  </g>`;
}

/** Gotas de lluvia bajo una nube. */
export function lluvia(semilla, cantidad, { x = 60, y = 90, ancho = 200, alto = 120, color = '#a8c8d8' } = {}) {
  const azar = rng(semilla);
  return Array.from({ length: cantidad }, (_, i) => {
    const px = n(x + azar() * ancho);
    const py = n(y + azar() * alto);
    const largo = n(9 + azar() * 8);
    return `<g class="fa" style="animation-delay:${n(-azar() * 2.4)}s;animation-duration:${n(1.6 + azar() * 1.2)}s">
      <path d="M ${px} ${py} q 1.6 ${largo * 0.6} 0 ${largo}" stroke="${color}" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".75"/>
    </g>`;
  }).join('');
}

export function resplandor(x, y, r, color = '#fff3b0', op = 0.4, dur = 5) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${op}" class="gl" style="animation-duration:${dur}s"/>`;
}

export function senderoPuntos(semilla, cantidad, { x = 40, y = 330, ancho = 520, alto = 50, color = '#f4e2ba' } = {}) {
  const azar = rng(semilla);
  return Array.from({ length: cantidad }, () => {
    const px = n(x + azar() * ancho);
    const py = n(y + azar() * alto);
    return `<ellipse cx="${px}" cy="${py}" rx="${n(2 + azar() * 3)}" ry="${n(1.4 + azar() * 2)}" fill="${color}" opacity=".7"/>`;
  }).join('');
}
