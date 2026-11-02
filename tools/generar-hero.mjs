#!/usr/bin/env node
/**
 * generar-hero.mjs
 * ---------------------------------------------------------------------------
 * Dibuja el fondo del hero de la portada como una ESCENA VECTORIAL animada y
 * la escribe en `media/hero-amanecer.svg`.
 *
 *     node tools/generar-hero.mjs
 *
 * ¿Por qué vectorial? El hero usaba tres fotos de 1584 × 672 px. Con
 * `cover` + `inset:-7%` + Ken Burns hasta 1.15, cada pantalla ampliaba la foto
 * 1.3× antes de contar la densidad de píxeles: en una laptop retina se veía a
 * 2.4× y en un monitor 1920 retina a 3.2×. De ahí el aspecto borroso, y ninguna
 * foto del repositorio era mayor. Un SVG no tiene resolución máxima.
 *
 * El estilo sale del mismo kit que las 39 portadas de lección
 * (`tools/portadas-svg/base.mjs`): formas redondeadas, colores cálidos de
 * cuento y movimiento lento. Aquí solo se reutilizan las piezas que no
 * dependen del lienzo de 600 × 400; el terreno se dibuja a medida porque
 * `colina()` termina en x = 620 y dejaría un rectángulo verde a la izquierda.
 *
 * Composición pensada para `background-size: cover`:
 *   · el sol y el horizonte viven en la banda central (y 230–670), que es la
 *     que sobrevive a cualquier recorte, incluido un monitor ultrapanorámico;
 *   · la mitad izquierda queda despejada para el titular y la bajada.
 */
import { mkdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, CIELO, sol, nube, arbol, trigo } from './portadas-svg/base.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DESTINO = join(RAIZ, 'media', 'hero-amanecer.svg');

const ANCHO = 1600;
const ALTO = 900;
const HORIZONTE = 618;
const SOL_X = 1150;
const SOL_Y = 246;

/** Redondea a dos decimales: los SVG generados no llevan decimales eternos. */
const n = (valor) => Math.round(valor * 100) / 100;

/** Generador determinista: la escena sale igual cada vez que se regenera. */
function rng(semilla) {
  let estado = (semilla * 2654435761) >>> 0;
  return () => {
    estado = (estado * 1664525 + 1013904223) >>> 0;
    return estado / 4294967296;
  };
}
const azar = rng(7);

/**
 * Banda de terreno a todo el ancho, con la cresta ondulada y suave.
 * `y` es la altura media de la cresta; siempre cierra hasta el pie del lienzo.
 */
function banda(y, color, { amp = 26, fase = 0, op = 1, pasos = 6 } = {}) {
  const puntos = [];
  for (let i = 0; i <= pasos; i++) {
    const x = -60 + ((ANCHO + 120) / pasos) * i;
    puntos.push([n(x), n(y + Math.sin(fase + i * 1.05) * amp)]);
  }
  let d = `M -60 ${ALTO + 40} L ${puntos[0][0]} ${puntos[0][1]}`;
  for (let i = 1; i < puntos.length; i++) {
    const [x0, y0] = puntos[i - 1];
    const [x1, y1] = puntos[i];
    const cx = n((x0 + x1) / 2);
    d += ` C ${cx} ${y0} ${cx} ${y1} ${x1} ${y1}`;
  }
  d += ` L ${ANCHO + 60} ${ALTO + 40} Z`;
  return `<path d="${d}" fill="${color}" opacity="${op}"/>`;
}

/** Cordillera lejana: picos suavizados con curvas, no triángulos rectos. */
function cordillera(y, altura, color, op, semilla) {
  const azarCord = rng(semilla);
  const picos = 7;
  const puntos = [];
  for (let i = 0; i <= picos; i++) {
    const x = -120 + ((ANCHO + 240) / picos) * i;
    const alto = i === 0 || i === picos ? 0 : altura * (0.55 + azarCord() * 0.45);
    puntos.push([n(x), n(y - alto)]);
  }
  let d = `M -120 ${y + 80} L ${puntos[0][0]} ${puntos[0][1]}`;
  for (let i = 1; i < puntos.length; i++) {
    const [x0, y0] = puntos[i - 1];
    const [x1, y1] = puntos[i];
    // Valles redondeados entre picos: el punto de control baja, no sube.
    const cx = n((x0 + x1) / 2);
    d += ` Q ${cx} ${n(Math.max(y0, y1) + 26)} ${x1} ${y1}`;
  }
  d += ` L ${ANCHO + 120} ${y + 80} Z`;
  return `<path d="${d}" fill="${color}" opacity="${op}"/>`;
}

/** Capa de nubes: se desplaza muy despacio en horizontal (profundidad). */
function capaNubes(y, escala, opacidad, duracion, desplazamiento, cuantas, semilla) {
  const azarCapa = rng(semilla);
  const nubes = Array.from({ length: cuantas }, (_, i) => {
    const x = -140 + (ANCHO + 280) * ((i + 0.5) / cuantas) + (azarCapa() - 0.5) * 160;
    const yy = y + (azarCapa() - 0.5) * 64;
    const s = escala * (0.72 + azarCapa() * 0.6);
    return nube(n(x), n(yy), n(s), '#ffffff', opacidad, 0, 'hero-nube');
  }).join('');
  return `<g class="hero-deriva" style="animation-duration:${duracion}s;--deriva:${desplazamiento}px">${nubes}</g>`;
}

/** Hilera de trigo. `y` es la base de los tallos. */
function hileraTrigo(y, escala, desde, hasta, paso, semilla) {
  const azarFila = rng(semilla);
  const tallos = [];
  for (let x = desde; x < hasta; x += paso) {
    const jx = x + (azarFila() - 0.5) * paso * 0.55;
    const jy = y + (azarFila() - 0.5) * 16;
    const s = escala * (0.82 + azarFila() * 0.38);
    tallos.push(trigo(n(jx), n(jy), n(s)));
  }
  return tallos.join('');
}

/** Semillas de luz que ascienden y se desvanecen. */
function semillas(cantidad, semilla) {
  const azarSemilla = rng(semilla);
  return Array.from({ length: cantidad }, () => {
    const x = 60 + azarSemilla() * (ANCHO - 120);
    const y = HORIZONTE - 30 + azarSemilla() * 250;
    const r = 1.6 + azarSemilla() * 2.4;
    return `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="#fff3c4" opacity=".7"
      class="hero-semilla" style="animation-duration:${n(7 + azarSemilla() * 6)}s;animation-delay:${n(-azarSemilla() * 12)}s"/>`;
  }).join('');
}

/** Rayos de sol: triángulos largos que respiran. */
function rayosSol(x, y) {
  const largo = Math.hypot(ANCHO, ALTO) * 1.15;
  return [0.30, 0.58, 0.86, 1.14, 1.42].map((angulo, i) => {
    const apertura = 0.05 + (i % 2) * 0.022;
    const bx = x + Math.cos(angulo - apertura) * largo;
    const by = y + Math.sin(angulo - apertura) * largo;
    const cx = x + Math.cos(angulo + apertura) * largo;
    const cy = y + Math.sin(angulo + apertura) * largo;
    return `<path d="M ${n(x)} ${n(y)} L ${n(bx)} ${n(by)} L ${n(cx)} ${n(cy)} Z"
      fill="url(#rayo)" class="hero-rayo" style="animation-delay:${n(-i * 1.7)}s"/>`;
  }).join('');
}

/* Surcos del campo: líneas curvas que convergen hacia el horizonte. */
function surcos() {
  return Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    const xFondo = 300 + t * 1150;
    const xFrente = -260 + t * 2200;
    const yFondo = HORIZONTE + 96;
    const yFrente = HORIZONTE + 300;
    return `<path d="M ${n(xFondo)} ${n(yFondo)} Q ${n((xFondo + xFrente) / 2)} ${n(yFondo + 120)} ${n(xFrente)} ${n(yFrente)}"
      stroke="#3f7f4c" stroke-width="${n(3 + t * 5)}" fill="none" opacity="${n(0.13 + t * 0.1)}" stroke-linecap="round"/>`;
  }).join('');
}

/* Estrellas que se apagan con el amanecer: solo arriba y a la derecha. */
const estrellas = Array.from({ length: 24 }, () => {
  const x = 620 + azar() * 980;
  const y = 24 + azar() * 190;
  const r = n(0.9 + azar() * 1.5);
  return `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" fill="#fff8dc" class="hero-flotar"
    style="animation-duration:${n(8 + azar() * 6)}s;animation-delay:${n(-azar() * 8)}s"/>`;
}).join('\n  ');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ANCHO} ${ALTO}" width="${ANCHO}" height="${ALTO}"
  preserveAspectRatio="xMidYMid slice" role="img"
  aria-label="Amanecer sobre campos de cultivo, con el sol saliendo entre las montañas">
<title>Amanecer sobre los campos de Semillitas de Fe</title>
<style>
  /* Movimiento suave y lento, en la línea de las portadas de lección. */
  .hero-giro{animation:hero-giro 240s linear infinite;transform-box:fill-box;transform-origin:center}
  .hero-halo{animation:hero-halo 11s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
  .hero-deriva{animation:hero-deriva 46s ease-in-out infinite alternate}
  .hero-niebla{animation:hero-niebla 62s ease-in-out infinite alternate}
  .hero-rayo{animation:hero-rayo 13s ease-in-out infinite}
  .hero-semilla{animation:hero-semilla 9s ease-out infinite}
  .hero-flotar{animation:hero-flotar 9s ease-in-out infinite;transform-box:fill-box;transform-origin:center}

  @keyframes hero-giro{to{transform:rotate(360deg)}}
  @keyframes hero-halo{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:.9;transform:scale(1.05)}}
  @keyframes hero-deriva{from{transform:translateX(calc(var(--deriva, 26px) * -1))}to{transform:translateX(var(--deriva, 26px))}}
  @keyframes hero-niebla{from{transform:translateX(-70px)}to{transform:translateX(70px)}}
  @keyframes hero-rayo{0%,100%{opacity:.14}50%{opacity:.38}}
  @keyframes hero-semilla{0%{transform:translateY(16px);opacity:0}18%{opacity:.7}82%{opacity:.45}100%{transform:translateY(-150px);opacity:0}}
  @keyframes hero-flotar{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}

  /* Con movimiento reducido queda como ilustración fija: sigue siendo bonita,
     no solo "apagada". */
  @media (prefers-reduced-motion: reduce){
    .hero-giro,.hero-halo,.hero-deriva,.hero-niebla,.hero-rayo,.hero-semilla,.hero-flotar{animation:none!important}
  }
</style>
<defs>
  <linearGradient id="cieloAmanecer" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#33527a"/>
    <stop offset=".22" stop-color="#6f93b6"/>
    <stop offset=".44" stop-color="#a8bed2"/>
    <stop offset=".60" stop-color="${CIELO.amanecer[0]}"/>
    <stop offset=".74" stop-color="${CIELO.amanecer[1]}"/>
    <stop offset="1" stop-color="#fff6de"/>
  </linearGradient>
  <radialGradient id="halo" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#fffbe0" stop-opacity=".95"/>
    <stop offset=".38" stop-color="#ffe2a4" stop-opacity=".45"/>
    <stop offset="1" stop-color="#ffe2a4" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="rayo" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffeeb4" stop-opacity=".55"/>
    <stop offset="1" stop-color="#ffeeb4" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="niebla" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fffdf2" stop-opacity="0"/>
    <stop offset=".45" stop-color="#fffdf2" stop-opacity=".5"/>
    <stop offset="1" stop-color="#fffdf2" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="campo" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#8ec97a"/>
    <stop offset="1" stop-color="#5aa35c"/>
  </linearGradient>
  <linearGradient id="primerPlano" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#4b9153"/>
    <stop offset="1" stop-color="#2f6b40"/>
  </linearGradient>
  <linearGradient id="veloPie" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#08222f" stop-opacity=".42"/>
    <stop offset=".30" stop-color="#08222f" stop-opacity="0"/>
  </linearGradient>
</defs>

<!-- Cielo y estrellas -->
<rect width="${ANCHO}" height="${ALTO}" fill="url(#cieloAmanecer)"/>
<g opacity=".55">
  ${estrellas}
</g>

<!-- Rayos y sol -->
${rayosSol(SOL_X, SOL_Y)}
<circle cx="${SOL_X}" cy="${SOL_Y}" r="340" fill="url(#halo)" class="hero-halo"/>
${sol({ x: SOL_X, y: SOL_Y, r: 60, color: C.gold, halo: '#ffe9a0', rayos: true, giro: 240 }).replace('class="sp"', 'class="hero-giro"')}

<!-- Nubes: capas lejanas, medias y cercanas -->
${capaNubes(140, 1.55, 0.46, 74, 30, 5, 11)}
${capaNubes(296, 1.1, 0.5, 56, 24, 4, 23)}
${capaNubes(366, 0.82, 0.44, 44, 18, 4, 31)}

<!-- Montañas: dos cordilleras, la lejana más azulada -->
${cordillera(HORIZONTE + 8, 250, '#8099b0', 0.55, 3)}
${cordillera(HORIZONTE + 26, 170, '#5d7c93', 0.5, 9)}

<!-- Niebla del valle, justo sobre el horizonte -->
<g class="hero-niebla" style="animation-duration:62s">
  <ellipse cx="700" cy="${HORIZONTE - 6}" rx="900" ry="34" fill="url(#niebla)" opacity=".8"/>
</g>
<g class="hero-niebla" style="animation-duration:80s;animation-direction:alternate-reverse">
  <ellipse cx="1040" cy="${HORIZONTE + 26}" rx="700" ry="28" fill="url(#niebla)" opacity=".65"/>
</g>

<!-- Colinas del valle: de la más lejana a la más cercana -->
${banda(HORIZONTE + 34, '#a8d48d', { amp: 20, fase: 0.7, op: 0.95 })}
${banda(HORIZONTE + 92, '#8bc577', { amp: 24, fase: 2.1 })}
${banda(HORIZONTE + 150, '#6cae66', { amp: 20, fase: 4.3 })}

<!-- Árboles del valle medio -->
<g opacity=".95">
  ${arbol(196, HORIZONTE + 96, 0.9)}
  ${arbol(320, HORIZONTE + 78, 0.62)}
  ${arbol(1436, HORIZONTE + 108, 0.95)}
  ${arbol(1300, HORIZONTE + 80, 0.6)}
</g>

<!-- Campo de cultivo con sus surcos -->
${banda(HORIZONTE + 208, 'url(#campo)', { amp: 16, fase: 1.4 })}
<g>${surcos()}</g>

<!-- Primer plano: cresta oscura y dos hileras de trigo -->
${banda(HORIZONTE + 236, 'url(#primerPlano)', { amp: 12, fase: 3.2 })}
<g>${hileraTrigo(ALTO - 46, 1.45, -30, ANCHO + 40, 52, 5)}</g>
${banda(HORIZONTE + 272, '#2f6b40', { amp: 10, fase: 5.1 })}
<g>${hileraTrigo(ALTO - 6, 1.2, -40, ANCHO + 40, 44, 17)}</g>

<!-- Semillas de luz -->
${semillas(20, 41)}

<!-- Velo del pie, para que la escena se hunda en la página -->
<rect y="${ALTO * 0.62}" width="${ANCHO}" height="${ALTO * 0.38}" fill="url(#veloPie)"/>
</svg>
`;

mkdirSync(dirname(DESTINO), { recursive: true });
writeFileSync(DESTINO, svg, 'utf8');
const kb = (statSync(DESTINO).size / 1024).toFixed(1);
console.log(`✅ media/hero-amanecer.svg (${kb} KB · ${ANCHO}×${ALTO} · sin pérdida a cualquier resolución)`);
