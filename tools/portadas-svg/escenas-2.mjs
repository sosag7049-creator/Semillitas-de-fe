/**
 * escenas-2.mjs — Portadas 14 a 26
 * ---------------------------------------------------------------------------
 * Del profeta Elías a la parábola del hijo pródigo. Se mantiene la misma
 * paleta y el mismo trazo que escenas-1.mjs.
 */
import {
  C, CIELO, documento, cielo, fondo, sol, luna, estrella, estrellas, nube, colina,
  suelo, agua, arbol, palmera, arbusto, pasto, trigo, flor, persona, bebe, oveja,
  leon, pez, paloma, casa, tienda, muro, barca, llama, corazon, jarra, tabla,
  canasta, racimo, pan, corona, arcoiris, mariposa, camino, rayosLuz, resplandor,
  destello, senderoPuntos, hoja, lluvia,
} from './base.mjs';

/* 14 · Elías y la viuda ------------------------------------------------ */
const elias = () =>
  documento(
    'Elías y la viuda comparten la harina y el aceite',
    `${cielo(['#ffd2a2', '#ffedc9'])}<linearGradient id="aceite" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8b54e"/><stop offset="1" stop-color="#c98a2e"/></linearGradient>`,
    `${fondo()}
    ${sol({ x: 470, y: 96, r: 40, giro: 130 })}
    ${nube(150, 86, 0.72, '#ffffff', 0.7, -1.8)}
    ${colina(262, '#d2b07c', { amp: 22, fase: 0.7 })}
    ${colina(298, '#c39c65', { amp: 16, fase: 2.5 })}
    ${suelo(332, '#d3b27c', { amp: 8 })}
    ${casa(128, 342, 0.86, { pared: '#f0e2c4', techo: '#c9704f', puerta: '#8d5c3c' })}
    <g class="rz" style="animation-delay:-1s"><circle cx="150" cy="292" r="5" fill="#ffffff" opacity=".45"/></g>
    <g class="rz" style="animation-delay:-3.2s"><circle cx="162" cy="292" r="3.6" fill="#ffffff" opacity=".35"/></g>
    ${arbusto(60, 350, 0.6, '#a8b96a', '#87995a')}
    ${persona({ x: 300, y: 372, s: 1.0, robe: '#a888b8', robeDark: '#8d6fa0', skin: C.skin2, pelo: '#4a3a32', cabeza: 'panuelo', pose: 'carry', retraso: -1.2 })}
    <g transform="translate(316 332) rotate(28)">
      ${jarra(0, 0, 0.9, { color: '#d68a5c', oscuro: '#b56c44' })}
      <path d="M 10 -34 Q 22 -30 24 -14" stroke="#e8b54e" stroke-width="4" fill="none" stroke-linecap="round"/>
      <g class="fa" style="animation-delay:-1s"><ellipse cx="25" cy="-8" rx="2.4" ry="4" fill="#e8b54e"/></g>
      <g class="fa" style="animation-delay:-2.6s"><ellipse cx="27" cy="-2" rx="2" ry="3.4" fill="#e8b54e"/></g>
    </g>
    <g transform="translate(238 366)">
      ${jarra(0, 0, 0.78, { color: '#d9b46a', oscuro: '#b8903f' })}
      <path d="M -4 -30 Q -2 -40 0 -44" stroke="#f2dfae" stroke-width="3" fill="none" opacity=".8"/>
    </g>
    ${persona({ x: 396, y: 370, s: 1.02, robe: '#8a7a5c', robeDark: '#6f6249', skin: C.skin3, pelo: '#d8d2c6', barba: true, pose: 'bless', retraso: -2 })}
    <circle cx="300" cy="330" r="66" fill="#ffe9a0" opacity=".22" class="gl"/>
    ${oveja(470, 378, 0.55, { retraso: -1.8 })}
    ${pasto(131, 34, { y: 372, alto: 18, color: '#bf9b60' })}
    ${senderoPuntos(137, 30, { y: 376, alto: 26 })}`,
  );

/* 15 · Ester actúa ------------------------------------------------------ */
const ester = () =>
  documento(
    'La reina Ester se presenta valiente ante el rey',
    `${cielo(['#4a3a66', '#8a6a91'])}<linearGradient id="pisoEster" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9a06b"/><stop offset="1" stop-color="#a97f4f"/></linearGradient><linearGradient id="cortinaEster" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9a54e"/><stop offset="1" stop-color="#b0802f"/></linearGradient>`,
    `${fondo()}
    <path d="M 190 330 L 190 150 Q 300 58 410 150 L 410 330 Z" fill="#f7e6bd" opacity=".92"/>
    <path d="M 210 330 L 210 158 Q 300 82 390 158 L 390 330 Z" fill="#fff4d6"/>
    ${rayosLuz(300, 96, { ancho: 240, alto: 260, color: '#fff6cd', op: 0.4, giro: 70 })}
    <rect x="0" y="330" width="600" height="70" fill="url(#pisoEster)"/>
    <g fill="#7a6a8a">
      <rect x="34" y="86" width="44" height="244" rx="4"/><rect x="16" y="78" width="80" height="16" rx="6"/><rect x="16" y="322" width="80" height="14" rx="5"/>
      <rect x="522" y="86" width="44" height="244" rx="4"/><rect x="504" y="78" width="80" height="16" rx="6"/><rect x="504" y="322" width="80" height="14" rx="5"/>
    </g>
    <g class="sw" style="transform-origin:50% 0%">
      <path d="M 104 0 Q 152 10 146 96 Q 132 160 110 190 Q 120 90 104 0 Z" fill="url(#cortinaEster)"/>
      <path d="M 496 0 Q 448 10 454 96 Q 468 160 490 190 Q 480 90 496 0 Z" fill="url(#cortinaEster)"/>
    </g>
    <rect x="352" y="196" width="98" height="134" rx="8" fill="#b0873f"/>
    <path d="M 340 200 Q 401 166 462 200 L 462 220 L 340 220 Z" fill="#d4ae61"/>
    <circle cx="401" cy="190" r="15" fill="#e2c07a"/>
    ${persona({ x: 300, y: 352, s: 1.06, robe: '#7c5aa6', robeDark: '#63478a', skin: C.skin2, pelo: C.hair, cabeza: 'corona', pose: 'up', retraso: -1 })}
    <path d="M 331 268 Q 352 260 362 238" stroke="${C.goldDeep}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="363" cy="235" r="6" fill="${C.gold}"/>
    ${corona(362, 228, 0.4)}
    ${persona({ x: 196, y: 366, s: 0.82, robe: '#c98f8f', robeDark: '#b27676', skin: C.skin3, pelo: '#4a3a32', pose: 'pray', retraso: -2.2 })}
    ${persona({ x: 428, y: 364, s: 0.9, robe: '#4a7fb4', robeDark: '#39699c', skin: C.skin2, pelo: C.hair, barba: true, cabeza: 'corona', pose: 'bless', retraso: -2.8 })}
    ${destello(300, 210, '#fff6d2', 0.7)}
    ${destello(250, 168, '#fff6d2', 0.5)}
    ${destello(352, 184, '#fff6d2', 0.45)}`,
  );

/* 16 · Daniel y la oración --------------------------------------------- */
const daniel = () =>
  documento(
    'Daniel ora con valentía y los leones descansan a su lado',
    `${cielo(CIELO.noche)}<radialGradient id="luzDaniel" cx="50%" cy="0%" r="75%"><stop offset="0" stop-color="#fff4c4" stop-opacity=".9"/><stop offset="1" stop-color="#fff4c4" stop-opacity="0"/></radialGradient><linearGradient id="cueva" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b5a52"/><stop offset="1" stop-color="#43362f"/></linearGradient>`,
    `${fondo()}
    ${estrellas(17, 34, { y: 14, alto: 120 })}
    <path d="M 232 0 L 368 0 L 436 400 L 164 400 Z" fill="url(#cueva)" opacity=".9"/>
    <path d="M 208 0 L 392 0 L 412 74 L 188 74 Z" fill="#2b3d55"/>
    ${estrellas(19, 12, { x: 214, y: 10, ancho: 168, alto: 48, rMin: 1, rMax: 2.4 })}
    <path d="M 118 400 L 118 258 Q 300 170 482 258 L 482 400 Z" fill="#5a4941"/>
    <path d="M 158 400 L 158 272 Q 300 196 442 272 L 442 400 Z" fill="#6b574c"/>
    ${rayosLuz(300, 0, { ancho: 250, alto: 300, color: '#ffe9a0', op: 0.3, giro: 80 })}
    <ellipse cx="300" cy="382" rx="70" ry="10" fill="#3b2f29" opacity=".8"/>
    ${leon(148, 372, 1.05, { retraso: -1.4 })}
    ${leon(452, 366, 0.95, { retraso: -2.8 })}
    ${persona({ x: 300, y: 378, s: 1.0, robe: '#d9b46a', robeDark: '#c39a4e', skin: C.skin2, pelo: C.hairSoft, pose: 'pray', retraso: -1 })}
    ${estrella(300, 92, 4.4, '#fff6c9', -1, 4)}
    ${pasto(151, 18, { y: 390, alto: 12, color: '#7a6a52' })}`,
  );

/* 17 · Jonás ------------------------------------------------------------ */
const jonas = () =>
  documento(
    'Jonás en el mar, junto al gran pez que lo rescatará',
    `<linearGradient id="fondoMar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fd3e0"/><stop offset=".45" stop-color="#3d95b8"/><stop offset="1" stop-color="#1d5179"/></linearGradient>
     <linearGradient id="ballena" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f7fa8"/><stop offset="1" stop-color="#2f5d86"/></linearGradient>`,
    `<rect width="600" height="400" fill="url(#fondoMar)"/>
    ${rayosLuz(310, 0, { ancho: 300, alto: 300, color: '#c7f4f2', op: 0.22, giro: 60 })}
    <path d="M -20 22 Q 80 6 160 22 T 340 22 T 520 22 T 640 22 L 640 -20 L -20 -20 Z" fill="#8fdde4" opacity=".55" class="wv"/>
    <path d="M -20 46 Q 80 30 160 46 T 340 46 T 520 46 T 640 46 L 640 8 L -20 8 Z" fill="#6cc7d6" opacity=".45" class="wv2"/>
    <g class="fl" style="animation-delay:-2s;animation-duration:9s">
      ${pez(96, 148, 0.85, '#f2b04e', { retraso: -1 })}
      ${pez(504, 128, 0.7, '#f2914e', { retraso: -2.2, voltear: true })}
      ${pez(140, 300, 0.6, '#ffd35d', { retraso: -3 })}
    </g>
    <path d="M 514 340 Q 528 300 520 268 M 544 346 Q 556 312 550 284 M 570 342 Q 580 314 574 292" stroke="#2f7d63" stroke-width="7" fill="none" stroke-linecap="round" class="sw" style="transform-origin:50% 100%"/>
    <g transform="translate(412 258)">
      <g class="fl" style="animation-duration:8s">
        <path d="M 104 -18 Q 152 -52 176 -6 Q 152 24 108 18 Z" fill="url(#ballena)"/>
        <path d="M 104 -18 Q 152 -52 176 -6" stroke="#7fa8c9" stroke-width="4" fill="none" opacity=".5"/>
        <path d="M 96 -64 Q 42 -92 -22 -64 Q -74 -40 -76 6 Q -78 46 -20 60 Q 50 76 96 40 Q 122 18 120 -12 Q 118 -44 96 -64 Z" fill="url(#ballena)"/>
        <path d="M -76 6 Q -104 -8 -116 -34 Q -98 -6 -70 -4 Z" fill="#3f6f96"/>
        <path d="M -74 14 Q -108 24 -128 12 Q -102 44 -68 40 Z" fill="#3f6f96"/>
        <path d="M -70 -6 Q -94 8 -88 46 Q -60 66 -16 62 Q 44 60 88 36 Q 110 22 116 -4 Q 74 16 -2 20 Q -44 22 -70 -6 Z" fill="#9fc9d9" opacity=".55"/>
        <path d="M 28 -14 Q 56 8 34 44" stroke="#2b557a" stroke-width="3" fill="none" opacity=".45"/>
        <path d="M 44 -2 Q 74 14 58 40" stroke="#2b557a" stroke-width="2.6" fill="none" opacity=".35"/>
        <circle cx="-32" cy="-22" r="7" fill="#16384f"/>
        <circle cx="-34" cy="-24" r="2.4" fill="#dff6ff"/>
        <path d="M -58 4 Q -30 14 -6 6" stroke="#173c55" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M 52 26 Q 74 34 96 24" stroke="#8fb6cc" stroke-width="2.4" fill="none" opacity=".6"/>
      </g>
    </g>
    <g transform="translate(272 236)">
      <g class="fl" style="animation-duration:5.4s">
        ${persona({ x: 0, y: 0, s: 0.78, robe: '#c9a45e', robeDark: '#a9873f', skin: C.skin2, pelo: C.hair, barba: true, pose: 'up', retraso: -1 })}
        <g class="rz" style="animation-delay:-0.8s"><circle cx="-16" cy="-96" r="4" fill="#d8f7ff" opacity=".7"/></g>
        <g class="rz" style="animation-delay:-2.6s"><circle cx="6" cy="-98" r="3" fill="#d8f7ff" opacity=".6"/></g>
        <g class="rz" style="animation-delay:-4.2s"><circle cx="22" cy="-94" r="2.4" fill="#d8f7ff" opacity=".55"/></g>
      </g>
    </g>
    <g class="fa" style="animation-delay:-1s"><circle cx="356" cy="120" r="3" fill="#d8f7ff" opacity=".5"/></g>
    <g class="fa" style="animation-delay:-2.8s"><circle cx="330" cy="90" r="2.4" fill="#d8f7ff" opacity=".45"/></g>
    ${pasto(163, 20, { y: 396, alto: 26, color: '#2f7d63' })}
    ${destello(468, 206, '#d8f7ff', 0.5)}
    ${destello(186, 232, '#d8f7ff', 0.4)}`,
  );

/* 18 · Jesús nace ------------------------------------------------------- */
const nacimiento = () =>
  documento(
    'El niño Jesús nace en Belén bajo una gran estrella',
    `${cielo(CIELO.noche)}<radialGradient id="luzBelén" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff6cd" stop-opacity=".95"/><stop offset=".5" stop-color="#ffe9a0" stop-opacity=".35"/><stop offset="1" stop-color="#ffe9a0" stop-opacity="0"/></radialGradient>`,
    `${fondo()}
    ${estrellas(23, 48, { y: 14, alto: 190 })}
    <circle cx="300" cy="82" r="66" fill="url(#luzBelén)" class="gl"/>
    ${estrella(300, 82, 9, '#fff6cd', 0, 4.6)}
    ${rayosLuz(300, 82, { ancho: 170, alto: 220, color: '#fff3b0', op: 0.22, giro: 60 })}
    ${colina(276, '#5f7358', { amp: 22, fase: 1.9 })}
    ${suelo(318, '#55684f', { amp: 8 })}
    <g transform="translate(360 322)">
      <path d="M -96 0 L 0 -92 L 96 0 Z" fill="#b58756"/>
      <path d="M -96 0 L -60 0 L 0 -96 L -10 -92 Z" fill="#9c7145" opacity=".7"/>
      <path d="M 0 -92 L 96 0 L 60 0 L 0 -96 Z" fill="#8a6238" opacity=".45"/>
      <path d="M -70 0 L -70 -54 L -18 -54 L -18 0 Z" fill="#3d3328"/>
      <path d="M -64 0 L -64 -48 L -24 -48 L -24 0 Z" fill="#6d5236"/>
      <path d="M -18 -46 L 44 -46 L 44 0 L -18 0 Z" fill="#c9a06b" opacity=".35"/>
      <path d="M -92 0 L 96 0" stroke="#7c5734" stroke-width="4" opacity=".6"/>
      <path d="M 0 -96 L 0 -112" stroke="#7c5734" stroke-width="3"/>
      <path d="M 0 -112 L 12 -118" stroke="#7c5734" stroke-width="3"/>
    </g>
    ${persona({ x: 256, y: 356, s: 0.9, robe: '#7c9ec9', robeDark: '#6384ad', skin: C.skin2, pelo: C.hair, cabeza: 'velo', pose: 'pray', retraso: -1.4 })}
    ${persona({ x: 392, y: 356, s: 0.92, robe: '#a9744f', robeDark: '#8d5c3c', skin: C.skin3, pelo: C.hair, barba: true, pose: 'stand', retraso: -2.4 })}
    <g transform="translate(318 362)">
      <path d="M -44 -18 L 44 -18 L 34 0 L -34 0 Z" fill="#a9784a"/>
      <path d="M -44 -18 L 44 -18 L 40 -24 L -40 -24 Z" fill="#c79358"/>
      <path d="M -40 -24 L -34 -44 M 40 -24 L 34 -44" stroke="#8d5c3c" stroke-width="4" stroke-linecap="round"/>
      <path d="M -34 -46 L 0 -48 L 34 -46" stroke="#8d5c3c" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M -30 -22 L 30 -22 M -28 -14 L 28 -14" stroke="#8d5c3c" stroke-width="2" opacity=".55"/>
      <path d="M -22 -24 Q -8 -34 8 -25 Q 20 -24 22 -20 L -22 -20 Z" fill="#f2d99e"/>
      ${bebe(0, -25, 0.9)}
      <circle cx="0" cy="-28" r="36" fill="#ffe9a0" opacity=".25" class="gl"/>
    </g>
    ${oveja(200, 372, 0.68, { retraso: -1.6, mirando: 1 })}
    ${oveja(438, 376, 0.6, { retraso: -2.8, mirando: -1 })}
    ${pasto(173, 30, { y: 380, alto: 18, color: '#485c46' })}
    ${destello(230, 170, '#fff6c9', 0.55)}
    ${destello(388, 150, '#fff6c9', 0.5)}`,
  );

/* 19 · Jesús calma el mar --------------------------------------------- */
const calma = () =>
  documento(
    'Jesús calma la tormenta desde la barca',
    `${cielo(['#5d7d99', '#d6e6e8'])}<linearGradient id="marCalma" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#79c4d8"/><stop offset="1" stop-color="#2f7fa4"/></linearGradient><radialGradient id="calmaLuz" cx="50%" cy="20%" r="60%"><stop offset="0" stop-color="#fff6c9" stop-opacity=".55"/><stop offset="1" stop-color="#fff6c9" stop-opacity="0"/></radialGradient>`,
    `${fondo()}
    ${nube(90, 62, 1.25, '#70828f', 0.9, -1.5)}
    ${nube(184, 96, 0.9, '#8a9aa6', 0.8, -3)}
    ${nube(56, 132, 0.72, '#a3b2bb', 0.7, -2.2)}
    ${nube(516, 74, 0.8, '#9fb0ba', 0.6, -4)}
    ${lluvia(23, 14, { x: 36, y: 104, ancho: 180, alto: 110, color: '#cfe0e8' })}
    <circle cx="330" cy="150" r="170" fill="url(#calmaLuz)" class="gl" style="animation-duration:6s" opacity=".7"/>
    ${colina(268, '#7f9a8c', { amp: 18, fase: 2, op: 0.6 })}
    <rect x="0" y="292" width="600" height="110" fill="url(#marCalma)"/>
    ${agua(298, 62, '#8fd6e2', '#3f95bb', { ola: 7 })}
    ${agua(342, 66, '#66b6cf', '#2f7fa4', { ola: 9 })}
    <g transform="translate(300 380)">
      <g class="fl" style="animation-duration:5.4s">
        <path d="M -96 -36 Q -84 4 0 6 Q 84 4 96 -36 Q 82 -30 62 -30 L -62 -30 Q -82 -30 -96 -36 Z" fill="#8d5c3c"/>
        <path d="M -92 -34 Q -80 -8 0 -6 Q 80 -8 92 -34 Q 72 -26 0 -26 Q -72 -26 -92 -34 Z" fill="#a06b45"/>
        <path d="M -96 -36 Q -104 -54 -100 -70 L -86 -76 L -84 -40 Z" fill="#7c4c2b"/>
        <path d="M 96 -36 Q 104 -54 100 -70 L 86 -76 L 84 -40 Z" fill="#7c4c2b"/>
        <path d="M -66 -30 L -60 -6 M -34 -28 L -30 -4 M 34 -28 L 30 -4 M 66 -30 L 60 -6" stroke="#7c4c2b" stroke-width="3" opacity=".5"/>
      </g>
    </g>
    ${persona({ x: 300, y: 352, s: 1.0, robe: '#8d6fc4', robeDark: '#745aa6', skin: C.skin2, pelo: C.hair, barba: true, pose: 'bless', retraso: -1.2 })}
    ${persona({ x: 222, y: 366, s: 0.66, robe: '#c9a45e', skin: C.skin3, pelo: C.hair, pose: 'pray', retraso: -2.4 })}
    ${persona({ x: 380, y: 366, s: 0.64, robe: '#79a86b', skin: C.skin1, pelo: C.hair, pose: 'hug', retraso: -3.2 })}
    ${paloma(468, 176, 0.75, { retraso: -1.8 })}
    <circle cx="468" cy="172" r="30" fill="#fff6c9" opacity=".22" class="gl"/>
    ${destello(430, 226, '#ffffff', 0.5)}
    ${destello(156, 206, '#ffffff', 0.4)}`,
  );

/* 20 · Panes y peces ---------------------------------------------------- */
const panes = () =>
  documento(
    'El muchacho entrega cinco panes y dos peces a Jesús',
    `${cielo(['#ffdca8', '#fff0cf'])}<radialGradient id="luzPanes" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff6c9" stop-opacity=".8"/><stop offset="1" stop-color="#fff6c9" stop-opacity="0"/></radialGradient>`,
    `${fondo()}
    ${sol({ x: 300, y: 104, r: 44, giro: 110, op: 0.9 })}
    ${colina(242, '#b9d18c', { amp: 24, fase: 0.6 })}
    ${colina(278, '#a3c076', { amp: 18, fase: 2.2 })}
    ${suelo(316, '#8fae66', { amp: 9 })}
    ${arbol(70, 314, 0.62, '#8fbf6e', '#6f9e55')}
    ${arbol(532, 322, 0.5, '#8fbf6e', '#6f9e55')}
    <g opacity=".35" fill="#5d7f4c">
      <ellipse cx="140" cy="314" rx="12" ry="14"/><ellipse cx="170" cy="306" rx="10" ry="12"/><ellipse cx="198" cy="316" rx="11" ry="13"/>
      <ellipse cx="420" cy="310" rx="12" ry="14"/><ellipse cx="450" cy="302" rx="10" ry="12"/><ellipse cx="478" cy="314" rx="11" ry="13"/>
      <ellipse cx="240" cy="304" rx="10" ry="12"/><ellipse cx="370" cy="302" rx="10" ry="12"/>
    </g>
    <circle cx="300" cy="284" r="96" fill="url(#luzPanes)" class="gl"/>
    <g transform="translate(300 348)">
      <ellipse cx="0" cy="14" rx="116" ry="16" fill="${C.shadow}" opacity=".12"/>
      <path d="M -120 6 Q -60 -14 0 4 Q 60 -14 120 6 Q 60 30 0 20 Q -60 30 -120 6 Z" fill="#c9a45e" opacity=".8"/>
      ${canasta(0, 0, 1.35)}
      ${pan(-34, -40, 1.1)}
      ${pan(0, -46, 1.2)}
      ${pan(32, -38, 1)}
      ${pez(-58, -16, 0.8, '#7fb7c9', { retraso: -1 })}
      ${pez(58, -14, 0.75, '#e8694f', { retraso: -2.2, voltear: true })}
    </g>
    ${persona({ x: 168, y: 362, s: 0.82, robe: '#c9a45e', robeDark: '#a9873f', skin: C.skin1, pelo: '#a5643a', pose: 'carry', retraso: -1.4 })}
    ${persona({ x: 442, y: 354, s: 1.05, robe: '#c96f6f', robeDark: '#ac5858', skin: C.skin2, pelo: C.hair, barba: true, pose: 'bless', retraso: -2 })}
    ${persona({ x: 514, y: 366, s: 0.62, robe: '#8fa8bd', skin: C.skin3, pelo: C.hair, pose: 'stand', retraso: -3 })}
    ${paloma(200, 168, 0.55, { retraso: -1.4 })}
    ${paloma(396, 146, 0.45, { retraso: -2.6, op: 0.9 })}
    ${destello(246, 236, '#fff6d2', 0.55)}
    ${destello(360, 214, '#fff6d2', 0.5)}`,
  );

/* 21 · El buen samaritano ---------------------------------------------- */
const samaritano = () =>
  documento(
    'El buen samaritano cuida al viajero herido en el camino',
    `${cielo(CIELO.atardecer)}<linearGradient id="caminoSam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6cfa0"/><stop offset="1" stop-color="#c9a878"/></linearGradient>`,
    `${fondo()}
    ${sol({ x: 108, y: 96, r: 34, giro: 140 })}
    ${colina(250, '#c9ab7c', { amp: 24, fase: 1.4 })}
    ${colina(288, '#bb9866', { amp: 18, fase: 3 })}
    ${suelo(324, '#c9a878', { amp: 8 })}
    <path d="M -20 400 C 120 356 300 352 620 380 L 620 400 Z" fill="url(#caminoSam)" opacity=".9"/>
    ${arbusto(64, 340, 0.6, '#a8b96a', '#87995a')}
    ${arbol(546, 312, 0.6, '#a8b96a', '#87995a')}
    <g transform="translate(300 358)">
      <ellipse cx="0" cy="10" rx="86" ry="12" fill="${C.shadow}" opacity=".14"/>
      <g transform="rotate(-8)">
        <path d="M -54 -14 Q -30 -26 -2 -20 L 26 -14 Q 40 -6 40 4 L -50 6 Q -62 0 -54 -14 Z" fill="#a9b7cf"/>
        <path d="M -12 -18 Q 6 -16 18 -8 L 10 2 L -18 0 Z" fill="#8fa3bf" opacity=".6"/>
        <circle cx="-58" cy="-24" r="12" fill="${C.skin3}"/>
        <path d="M -70 -28 Q -66 -40 -54 -38 Q -46 -34 -48 -26 Q -58 -32 -70 -28 Z" fill="${C.hair}"/>
        <path d="M -58 -22 q 4 2 8 0" stroke="${C.ink}" stroke-width="1.2" fill="none" opacity=".7"/>
        <path d="M 40 2 L 58 8 M 32 0 L 48 12" stroke="#a9b7cf" stroke-width="6" stroke-linecap="round"/>
        <path d="M -30 -14 Q -22 -22 -16 -18" stroke="#d15050" stroke-width="3" fill="none" opacity=".7"/>
      </g>
      <g transform="translate(-106 -8)">
        <path d="M -28 0 Q -30 -32 -14 -44 L 14 -44 Q 30 -32 28 0 Z" fill="#8d6fc4"/>
        <path d="M -14 -44 Q -16 -56 0 -58 Q 16 -56 14 -44 Z" fill="#c9a45e" opacity=".9"/>
        <circle cx="0" cy="-66" r="12" fill="${C.skin2}"/>
        <path d="M -12 -70 Q -12 -84 0 -84 Q 12 -84 12 -70 Q 4 -76 0 -74 Q -4 -76 -12 -70 Z" fill="${C.hairSoft}"/>
        <path d="M -12 -68 Q 0 -58 12 -68" stroke="${C.hairSoft}" stroke-width="3" fill="none" opacity=".85"/>
        <circle cx="-4" cy="-67" r="1.3" fill="${C.ink}"/><circle cx="4" cy="-67" r="1.3" fill="${C.ink}"/>
        <path d="M -2.2 -62.2 Q 0 -59.8 2.2 -62.2" stroke="${C.ink}" stroke-width="1" fill="none" stroke-linecap="round" opacity=".7"/>
        <path d="M 12 -36 Q 26 -30 30 -16" stroke="${C.skin2}" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M -30 -36 Q -42 -28 -44 -14" stroke="${C.skin2}" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M 30 -20 Q 40 -24 42 -34" stroke="#d9b46a" stroke-width="4" fill="none" stroke-linecap="round"/>
        <g class="fa" style="animation-delay:-1s"><ellipse cx="34" cy="-8" rx="2" ry="3.4" fill="#e8b54e"/></g>
        <g class="fa" style="animation-delay:-2.4s"><ellipse cx="36" cy="-2" rx="1.8" ry="3" fill="#e8b54e"/></g>
      </g>
      ${corazon(0, -78, 0.5, C.coral, { retraso: -1.6 })}
      ${corazon(-34, -96, 0.34, C.orange, { retraso: -2.8, op: 0.85 })}
    </g>
    <g transform="translate(506 340) scale(0.8)">
      <ellipse cx="0" cy="6" rx="54" ry="9" fill="${C.shadow}" opacity=".14"/>
      <g class="fl" style="animation-duration:7.4s">
        <path d="M 18 0 L 22 -48 M 4 0 L 2 -48" stroke="#a9855a" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="8" cy="-44" rx="22" ry="14" fill="#c9a06b"/>
        <path d="M 26 -46 Q 40 -56 42 -72 Q 54 -72 54 -58 Q 48 -44 34 -44 Z" fill="#b98d59"/>
        <path d="M 40 -70 Q 42 -84 52 -86 Q 58 -80 50 -70 Z" fill="#b98d59"/>
        <circle cx="48" cy="-76" r="1.6" fill="${C.ink}"/>
        <path d="M -12 -46 Q -22 -56 -30 -52" stroke="#a9855a" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M -14 -36 Q -4 -30 8 -34 Q 20 -30 26 -38" stroke="#8d5c3c" stroke-width="3" fill="none"/>
      </g>
    </g>
    ${pasto(181, 34, { y: 374, alto: 18, color: '#b8955f' })}
    ${flor(160, 386, '#f2b04e')}
    ${flor(444, 390, '#f58fa0')}
    ${destello(236, 200, '#fff6d2', 0.55)}`,
  );

/* 22 · La oveja perdida ------------------------------------------------ */
const ovejaPerdida = () =>
  documento(
    'El pastor carga a la oveja perdida y vuelve con alegría',
    `${cielo(['#ffd3a2', '#ffedc9'])}<linearGradient id="lomaOveja" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9c977"/><stop offset="1" stop-color="#7da55e"/></linearGradient>`,
    `${fondo()}
    ${sol({ x: 466, y: 108, r: 46, giro: 120 })}
    ${nube(166, 76, 0.8, '#ffffff', 0.75, -1.4)}
    ${nube(340, 118, 0.5, '#ffffff', 0.6, -3)}
    <path d="M -20 288 Q 100 214 220 250 Q 340 286 440 236 Q 530 192 620 232 L 620 400 L -20 400 Z" fill="url(#lomaOveja)"/>
    <path d="M -20 336 Q 120 292 250 316 Q 380 340 500 304 Q 570 284 620 302 L 620 400 L -20 400 Z" fill="#8fbc6b"/>
    <path d="M 250 400 Q 300 360 330 330 Q 350 310 340 292" stroke="#d9c49a" stroke-width="26" fill="none" stroke-linecap="round" opacity=".55"/>
    ${arbol(82, 300, 0.72, '#6fae63', '#4f8c52')}
    ${arbol(536, 288, 0.56, '#7cba6a', '#57955a')}
    ${oveja(96, 354, 0.55, { retraso: -1.4 })}
    ${oveja(140, 360, 0.5, { retraso: -2.2 })}
    ${oveja(500, 350, 0.55, { retraso: -1.8 })}
    ${oveja(536, 358, 0.48, { retraso: -3 })}
    ${oveja(468, 362, 0.44, { retraso: -2.6 })}
    ${persona({ x: 300, y: 372, s: 1.08, robe: '#8a6fae', robeDark: '#71589a', skin: C.skin3, pelo: C.hairSoft, barba: true, pose: 'up', retraso: -1 })}
    <path d="M 331 294 L 342 372" stroke="${C.brown}" stroke-width="5" stroke-linecap="round"/>
    <path d="M 342 290 Q 352 282 350 272" stroke="${C.brown}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <g transform="translate(300 288) rotate(-6)">
      <ellipse cx="0" cy="-8" rx="40" ry="17" fill="#f6f1e3"/>
      <circle cx="-30" cy="-14" r="11" fill="#f6f1e3"/>
      <circle cx="10" cy="-20" r="12" fill="#f6f1e3"/>
      <circle cx="28" cy="-12" r="10" fill="#f6f1e3"/>
      <circle cx="-48" cy="-10" r="9" fill="#4a4a52"/>
      <circle cx="-54" cy="-12" r="1.5" fill="#ffffff"/>
      <path d="M -60 -6 q 6 4 12 0" stroke="#d9d2c2" stroke-width="2" fill="none"/>
      <path d="M -22 6 Q -26 22 -30 28 M 10 6 Q 8 22 6 28 M 30 4 Q 34 18 36 24" stroke="#4a4a52" stroke-width="5" stroke-linecap="round"/>
      <path d="M -30 -24 Q -36 -34 -42 -30" stroke="#4a4a52" stroke-width="3" fill="none" stroke-linecap="round" class="sw" style="transform-origin:0 0"/>
    </g>
    ${corazon(300, 222, 0.6, C.coral, { retraso: -1.4 })}
    ${corazon(268, 204, 0.4, C.orange, { retraso: -2.8, op: 0.85 })}
    ${pasto(191, 52, { y: 374, alto: 22, color: '#6f9a4f' })}
    ${flor(196, 384, '#f2b04e')}
    ${flor(392, 390, '#f58fa0')}
    ${destello(300, 250, '#fff6d2', 0.5)}`,
  );

/* 23 · Zaqueo cambia ---------------------------------------------------- */
const zaqueo = () =>
  documento(
    'Zaqueo mira a Jesús desde la rama del sicómoro',
    `${cielo(['#ffd9a6', '#fff0d2'])}<linearGradient id="troncoZaqueo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8d5c3c"/><stop offset="1" stop-color="#6b432c"/></linearGradient>`,
    `${fondo()}
    ${sol({ x: 96, y: 92, r: 32, giro: 150, op: 0.9 })}
    ${colina(268, '#c2b077', { amp: 20, fase: 1.6 })}
    ${suelo(310, '#cbb27a', { amp: 8 })}
    ${casa(88, 320, 0.62, { pared: '#f0e2c4', techo: '#c9704f' })}
    ${casa(520, 326, 0.5, { pared: '#e9d6b0', techo: '#b8873f' })}
    <g transform="translate(300 340)">
      <path d="M -16 0 Q -22 -96 -8 -150 Q -2 -168 12 -172 L 24 -166 Q 12 -150 10 -120 Q 26 -150 44 -158 L 50 -148 Q 30 -136 20 -110 L 18 0 Z" fill="url(#troncoZaqueo)"/>
      <path d="M 8 -118 L -46 -158 M 12 -134 L 52 -170 M 2 -92 L -38 -104" stroke="#7c4c2b" stroke-width="9" stroke-linecap="round"/>
      <g class="sw" style="transform-origin:50% 100%">
        <circle cx="-58" cy="-176" r="38" fill="#5f9d5e"/>
        <circle cx="8" cy="-202" r="44" fill="#6fae68"/>
        <circle cx="66" cy="-164" r="36" fill="#5f9d5e"/>
        <circle cx="-20" cy="-154" r="30" fill="#6fae68"/>
        <circle cx="44" cy="-136" r="26" fill="#78b46c"/>
        <circle cx="-4" cy="-178" r="10" fill="#ffffff" opacity=".12"/>
      </g>
      <g transform="translate(-4 -156) scale(0.62)">
        ${persona({ x: 0, y: 0, s: 1, robe: '#c9a45e', robeDark: '#a9873f', skin: C.skin1, pelo: C.hair, pose: 'wave', retraso: -1.6 })}
      </g>
      <path d="M -14 -170 Q 0 -182 14 -170" stroke="#5f9d5e" stroke-width="6" fill="none" opacity=".7"/>
      <circle cx="38" cy="-186" r="5" fill="${C.gold}"/>
      <circle cx="-52" cy="-152" r="4" fill="${C.gold}"/>
      <circle cx="20" cy="-128" r="3.4" fill="${C.gold}"/>
    </g>
    ${persona({ x: 300, y: 384, s: 0.92, robe: '#c96f6f', robeDark: '#ac5858', skin: C.skin2, pelo: C.hair, barba: true, pose: 'open', retraso: -2.2 })}
    ${persona({ x: 206, y: 390, s: 0.62, robe: '#8fa8bd', skin: C.skin3, pelo: C.hair, pose: 'stand', retraso: -3 })}
    ${persona({ x: 392, y: 392, s: 0.6, robe: '#a888b8', skin: C.skin1, pelo: C.hairSoft, pose: 'stand', retraso: -3.4 })}
    ${oveja(468, 386, 0.5, { retraso: -1.6 })}
    ${pasto(199, 36, { y: 378, alto: 20, color: '#b8955f' })}
    ${corazon(300, 300, 0.5, C.coral, { retraso: -1, op: 0.9 })}
    ${destello(238, 214, '#fff6d2', 0.55)}${destello(368, 236, '#fff6d2', 0.45)}`,
  );

/* 24 · Jesús vive ------------------------------------------------------- */
const resurreccion = () =>
  documento(
    'La tumba vacía al amanecer: Jesús vive',
    `${cielo(['#ffc7a2', '#ffe9c4'])}<radialGradient id="luzTumba" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff9dd" stop-opacity=".95"/><stop offset="1" stop-color="#fff9dd" stop-opacity="0"/></radialGradient>`,
    `${fondo()}
    ${sol({ x: 300, y: 168, r: 54, color: '#ffe08a', halo: '#fff3c4', rayos: true, giro: 80, op: 0.85 })}
    ${rayosLuz(300, 120, { ancho: 360, alto: 260, color: '#fff3b0', op: 0.3, giro: 60 })}
    ${colina(262, '#a9c17f', { amp: 22, fase: 0.8 })}
    ${suelo(306, '#96b06d', { amp: 9 })}
    <g transform="translate(318 330)">
      <ellipse cx="0" cy="6" rx="112" ry="16" fill="${C.shadow}" opacity=".14"/>
      <path d="M -104 0 Q -112 -88 -46 -118 Q 28 -146 84 -100 Q 118 -70 108 0 Z" fill="#9c948a"/>
      <path d="M -92 -6 Q -98 -80 -40 -106 Q 24 -130 74 -92 Q 102 -66 96 -6 Z" fill="#b3aa9d"/>
      <path d="M -44 -6 L -44 -56 Q -44 -84 -14 -84 Q 16 -84 16 -56 L 16 -6 Z" fill="#5c534a"/>
      <path d="M -32 -6 L -32 -54 Q -32 -72 -12 -72 Q 10 -72 10 -54 L 10 -6 Z" fill="#f7ecc9"/>
      <circle cx="-8" cy="-40" r="30" fill="url(#luzTumba)" class="gl"/>
      <circle cx="66" cy="4" r="30" fill="#a89f92"/>
      <circle cx="66" cy="4" r="23" fill="#b8afa1"/>
      <ellipse cx="66" cy="4" rx="12" ry="22" fill="#c9c0b1" opacity=".6"/>
      <path d="M -104 2 Q -60 12 -10 4 Q 40 14 108 2" stroke="#7f776c" stroke-width="6" fill="none" stroke-linecap="round" opacity=".5"/>
    </g>
    ${persona({ x: 194, y: 366, s: 0.86, robe: '#c98f8f', robeDark: '#b27676', skin: C.skin2, pelo: C.hair, cabeza: 'velo', pose: 'up', retraso: -1.4 })}
    ${persona({ x: 138, y: 372, s: 0.8, robe: '#8fa8bd', robeDark: '#7690a6', skin: C.skin3, pelo: C.hair, cabeza: 'velo', pose: 'pray', retraso: -2.4 })}
    ${paloma(420, 148, 0.8, { retraso: -1.8 })}
    ${mariposa(226, 228, 0.95, C.gold, -0.6)}
    ${mariposa(470, 246, 0.8, C.coral, -2)}
    ${mariposa(388, 210, 0.62, C.purple, -3.2)}
    ${arbusto(96, 330, 0.6, '#8fbf6e', '#6f9e55')}
    ${arbusto(540, 340, 0.55, '#8fbf6e', '#6f9e55')}
    ${flor(254, 388, '#f2b04e')}
    ${flor(438, 380, '#f58fa0')}
    ${pasto(181, 34, { y: 378, alto: 20, color: '#6f9a4f' })}
    ${destello(300, 236, '#fff9dd', 0.75)}`,
  );

/* 25 · Jesús bendice a los niños --------------------------------------- */
const bendice = () =>
  documento(
    'Jesús bendice a los niños con cariño',
    `${cielo(['#cfeaff', '#fff3d0'])}<radialGradient id="luzNinos" cx="50%" cy="46%" r="52%"><stop offset="0" stop-color="#fff6c9" stop-opacity=".8"/><stop offset="1" stop-color="#fff6c9" stop-opacity="0"/></radialGradient>`,
    `${fondo()}
    ${sol({ x: 300, y: 96, r: 40, giro: 130, op: 0.9 })}
    ${nube(120, 84, 0.8, '#ffffff', 0.8, -1.4)}
    ${nube(488, 104, 0.62, '#ffffff', 0.7, -3)}
    ${colina(258, '#b9d99a', { amp: 22, fase: 1 })}
    ${suelo(304, '#a7cc84', { amp: 9 })}
    ${arbol(80, 302, 0.66, '#7cba6a', '#57955a')}
    ${arbol(530, 308, 0.56, '#7cba6a', '#57955a')}
    <circle cx="300" cy="300" r="130" fill="url(#luzNinos)" class="gl"/>
    ${persona({ x: 300, y: 366, s: 1.16, robe: '#c96f6f', robeDark: '#ac5858', skin: C.skin2, pelo: C.hair, barba: true, pose: 'open', retraso: -1 })}
    ${persona({ x: 196, y: 392, s: 0.56, robe: '#4a90cf', robeDark: '#3577b4', skin: C.skin1, pelo: '#a5643a', pose: 'stand', retraso: -2 })}
    ${persona({ x: 244, y: 398, s: 0.5, robe: '#f2b04e', skin: C.skin3, pelo: C.hair, pose: 'wave', retraso: -2.6 })}
    ${persona({ x: 348, y: 398, s: 0.52, robe: '#8d6fc4', skin: C.skin2, pelo: C.hair, pose: 'stand', retraso: -3 })}
    ${persona({ x: 396, y: 394, s: 0.58, robe: '#79a86b', robeDark: '#5f8c55', skin: C.skin1, pelo: C.hairSoft, pose: 'wave', retraso: -3.6 })}
    ${persona({ x: 468, y: 386, s: 0.78, robe: '#c98f8f', robeDark: '#b27676', skin: C.skin2, pelo: C.hair, cabeza: 'velo', pose: 'stand', retraso: -4 })}
    ${corazon(300, 218, 0.8, C.coral, { retraso: -0.8 })}
    ${corazon(246, 196, 0.5, C.orange, { retraso: -2 })}
    ${corazon(356, 202, 0.6, C.red, { retraso: -3.2 })}
    ${corazon(204, 174, 0.36, C.purple, { retraso: -4, op: 0.85 })}
    ${corazon(398, 176, 0.4, C.gold, { retraso: -2.6, op: 0.9 })}
    ${pasto(211, 46, { y: 382, alto: 20, color: '#7fae5e' })}
    ${flor(150, 390, '#f58fa0')}
    ${flor(374, 392, '#f2b04e')}
    ${destello(228, 248, '#fff6d2', 0.5)}${destello(374, 244, '#fff6d2', 0.45)}`,
  );

/* 26 · El hijo pródigo -------------------------------------------------- */
const prodigo = () =>
  documento(
    'El padre corre a abrazar a su hijo que vuelve a casa',
    `${cielo(CIELO.atardecer)}<linearGradient id="caminoHijo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfc191"/><stop offset="1" stop-color="#c2a06c"/></linearGradient>`,
    `${fondo()}
    ${sol({ x: 470, y: 104, r: 48, giro: 120, op: 0.9 })}
    ${nube(120, 74, 0.9, '#a9a3a0', 0.5, -1.6)}
    ${nube(196, 116, 0.6, '#c2b7ac', 0.45, -3)}
    ${colina(256, '#c3ab7c', { amp: 22, fase: 1.2 })}
    ${colina(292, '#b79560', { amp: 16, fase: 2.8 })}
    ${suelo(326, '#c2a06c', { amp: 8 })}
    <path d="M -20 400 C 160 356 380 360 620 386 L 620 400 Z" fill="url(#caminoHijo)"/>
    ${casa(112, 330, 0.72, { pared: '#f0e2c4', techo: '#b8873f' })}
    <g transform="translate(486 356)">
      <ellipse cx="0" cy="4" rx="52" ry="8" fill="${C.shadow}" opacity=".12"/>
      <g fill="#a9855a">
        <rect x="-48" y="-30" width="7" height="32" rx="3"/><rect x="-16" y="-30" width="7" height="32" rx="3"/>
        <rect x="16" y="-30" width="7" height="32" rx="3"/><rect x="44" y="-30" width="7" height="32" rx="3"/>
        <rect x="-50" y="-28" width="102" height="6" rx="3"/><rect x="-50" y="-14" width="102" height="6" rx="3"/>
      </g>
      <g transform="translate(-24 0)">
        <ellipse cx="0" cy="-4" rx="22" ry="14" fill="#e8b6ab"/>
        <ellipse cx="6" cy="4" rx="15" ry="9" fill="#eec4ba"/>
        <rect x="-14" y="6" width="5" height="10" rx="2.4" fill="#d99a90"/>
        <rect x="6" y="6" width="5" height="10" rx="2.4" fill="#d99a90"/>
        <circle cx="16" cy="-8" r="12" fill="#e8b6ab"/>
        <ellipse cx="26" cy="-4" rx="6" ry="4.6" fill="#d99a90"/>
        <circle cx="26" cy="-4" r="1" fill="#a9716a"/><circle cx="29" cy="-4" r="1" fill="#a9716a"/>
        <circle cx="19" cy="-12" r="1.5" fill="${C.ink}"/>
        <path d="M 10 -18 l 1 -7 l 6 4 Z" fill="#d99a90"/>
        <path d="M 22 -18 l 2 -7 l 5 5 Z" fill="#d99a90"/>
        <path d="M -18 -8 q -6 -3 -4 -8" stroke="#d99a90" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      </g>
      <g transform="translate(30 4) scale(.78)">
        <ellipse cx="0" cy="-4" rx="22" ry="14" fill="#dda69b"/>
        <ellipse cx="6" cy="4" rx="15" ry="9" fill="#e6b5aa"/>
        <rect x="-14" y="6" width="5" height="10" rx="2.4" fill="#c98d84"/>
        <rect x="6" y="6" width="5" height="10" rx="2.4" fill="#c98d84"/>
        <circle cx="16" cy="-8" r="12" fill="#dda69b"/>
        <ellipse cx="26" cy="-4" rx="6" ry="4.6" fill="#c98d84"/>
        <circle cx="26" cy="-4" r="1" fill="#9a655e"/><circle cx="29" cy="-4" r="1" fill="#9a655e"/>
        <circle cx="19" cy="-12" r="1.5" fill="${C.ink}"/>
        <path d="M 10 -18 l 1 -7 l 6 4 Z" fill="#c98d84"/>
        <path d="M 22 -18 l 2 -7 l 5 5 Z" fill="#c98d84"/>
      </g>
    </g>
    ${persona({ x: 226, y: 388, s: 0.92, robe: '#a8896a', robeDark: '#8d6f52', skin: C.skin3, pelo: C.hair, barba: true, pose: 'walk', retraso: -1.6 })}
    <path d="M 214 370 Q 210 384 204 392" stroke="#c9b18a" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${persona({ x: 366, y: 384, s: 1.05, robe: '#7c9ec9', robeDark: '#6384ad', skin: C.skin2, pelo: '#d8d2c6', barba: true, pose: 'open', retraso: -2.2 })}
    <circle cx="300" cy="330" r="62" fill="#ffe9a0" opacity=".22" class="gl"/>
    ${corazon(300, 292, 0.62, C.coral, { retraso: -1 })}
    ${corazon(266, 274, 0.4, C.orange, { retraso: -2.4, op: 0.85 })}
    ${paloma(430, 176, 0.5, { retraso: -1.8 })}
    ${pasto(221, 40, { y: 380, alto: 20, color: '#b0905e' })}
    ${flor(182, 392, '#f2b04e')}
    ${destello(300, 262, '#fff6d2', 0.5)}`,
  );

export const escenas2 = {
  'elias-y-la-viuda': elias,
  'ester-actua': ester,
  'daniel-y-la-oracion': daniel,
  jonas,
  'jesus-nace': nacimiento,
  'jesus-calma-el-mar': calma,
  'panes-y-peces': panes,
  'buen-samaritano': samaritano,
  'oveja-perdida': ovejaPerdida,
  'zaqueo-cambia': zaqueo,
  'jesus-vive': resurreccion,
  'jesus-bendice-a-los-ninos': bendice,
  'el-hijo-prodigo': prodigo,
};
