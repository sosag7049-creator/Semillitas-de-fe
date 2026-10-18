/**
 * escenas-1.mjs — Portadas 01 a 13
 * ---------------------------------------------------------------------------
 * Antiguo Testamento, primera mitad. Cada función devuelve un SVG completo.
 * Las composiciones siguen la regla de la colección: un asunto claro al
 * centro, cielo con degradado, suelo en dos o tres capas y movimiento suave.
 */
import {
  C, CIELO, documento, cielo, fondo, sol, luna, estrella, estrellas, nube, colina, suelo,
  agua, arbol, palmera, arbusto, pasto, trigo, flor, persona, bebe, oveja, leon,
  pez, paloma, casa, tienda, muro, barca, llama, corazon, jarra, tabla, canasta,
  racimo, pan, corona, arcoiris, mariposa, camino, rayosLuz, resplandor, destello,
  senderoPuntos, hoja, roca, cama, lluvia,
} from './base.mjs';

/* 01 · La creación ------------------------------------------------------ */
const creacion = () =>
  documento(
    'La creación: un mundo bueno, verde y lleno de vida',
    `${cielo(CIELO.dia)}<linearGradient id="rio" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8fd8e2"/><stop offset="1" stop-color="#5fb9d0"/></linearGradient>`,
    `${fondo()}
    ${sol({ x: 300, y: 96, r: 44, giro: 110 })}
    ${nube(112, 82, 0.9, '#ffffff', 0.9, 0)}
    ${nube(504, 64, 0.7, '#ffffff', 0.8, -2.5)}
    ${nube(430, 132, 0.5, '#ffffff', 0.55, -4)}
    ${colina(250, '#b9dd9c', { amp: 26, fase: 0.6 })}
    ${colina(282, '#9ccb83', { amp: 20, fase: 2.1 })}
    ${suelo(318, '#86bf6d', { amp: 10 })}
    <path d="M 250 400 C 236 360 300 330 336 300 C 352 286 348 272 340 262 L 372 264 C 384 282 372 300 354 316 C 318 344 286 372 296 400 Z" fill="url(#rio)" opacity=".85"/>
    <path d="M 262 398 C 252 364 306 336 340 306" stroke="#d9f6f2" stroke-width="3" fill="none" opacity=".55" class="wv"/>
    ${arbol(88, 322, 1.05, '#6fbd7f', '#4b9a63')}
    ${arbol(520, 312, 0.92, '#7cc98a', '#529f68')}
    ${arbol(148, 292, 0.62, '#8ed69a', '#5aa96e')}
    ${palmera(452, 330, 0.85)}
    ${arbusto(190, 340, 0.7)}
    ${arbusto(400, 342, 0.62, '#7cc98a', '#529f68')}
    ${pasto(11, 46, { y: 344, alto: 22 })}
    ${flor(120, 366, '#f58fa0')}
    ${flor(170, 376, '#f2b04e')}
    ${flor(360, 380, '#8d6fc4')}
    ${flor(470, 372, '#f58fa0')}
    ${oveja(206, 372, 0.72, { retraso: -1.2, mirando: -1 })}
    ${oveja(510, 376, 0.66, { retraso: -2.4 })}
    ${mariposa(340, 250, 1.1, C.gold, -1)}
    ${mariposa(420, 222, 0.8, C.coral, -2.2)}
    ${paloma(178, 128, 0.7, { retraso: -1 })}
    ${paloma(226, 158, 0.55, { retraso: -2.4, op: 0.9 })}
    ${pez(330, 330, 0.75, '#f2914e', { retraso: -1.4 })}
    ${destello(96, 158, '#ffffff', 0.7)}
    ${destello(500, 176, '#ffffff', 0.6)}`,
  );

/* 02 · Noé y el arca ---------------------------------------------------- */
const arca = () =>
  documento(
    'El arca de Noé sobre las aguas, bajo un arcoíris',
    `${cielo(['#b8cbd6', '#ffe8bd'])}<linearGradient id="aguaArca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#66b6cf"/><stop offset="1" stop-color="#2f7fa4"/></linearGradient>`,
    `${fondo()}
    ${sol({ x: 512, y: 84, r: 30, color: '#ffe08a', halo: '#fff2bf', giro: 150, op: 0.9 })}
    ${arcoiris(300, 300, 1.18)}
    ${nube(96, 108, 1.05, '#eef4f6', 0.95)}
    ${nube(226, 74, 0.72, '#e6eef1', 0.9, -2)}
    ${nube(420, 70, 0.9, '#f4f7f8', 0.85, -4)}
    ${nube(548, 138, 0.6, '#e9f0f2', 0.7, -1.5)}
    <g class="fa" style="animation-delay:-0.5s"><path d="M 70 140 q 3 12 0 20" stroke="#8fc4d6" stroke-width="3" stroke-linecap="round" fill="none"/></g>
    <g class="fa" style="animation-delay:-2s"><path d="M 116 128 q 3 12 0 20" stroke="#8fc4d6" stroke-width="3" stroke-linecap="round" fill="none"/></g>
    <g class="fa" style="animation-delay:-3.1s"><path d="M 186 146 q 3 12 0 20" stroke="#8fc4d6" stroke-width="3" stroke-linecap="round" fill="none"/></g>
    ${colina(282, '#7fae87', { amp: 18, fase: 1.4, op: 0.85 })}
    <rect x="0" y="292" width="600" height="110" fill="url(#aguaArca)"/>
    ${agua(296, 70, '#7cc8da', '#3f8fb2', { ola: 8 })}
    <g transform="translate(300 300)">
      <g class="fl" style="animation-duration:5.2s">
        <path d="M -128 0 Q -112 30 0 34 Q 112 30 128 0 L 112 -10 L -112 -10 Z" fill="#9a6239"/>
        <path d="M -128 0 Q -120 20 -96 28 L -40 30 L -96 2 Z" fill="#7c4c2b" opacity=".65"/>
        <path d="M -126 -2 Q -140 -30 -132 -58" stroke="#8a5733" stroke-width="9" fill="none" stroke-linecap="round"/>
        <path d="M -96 -10 L -96 -66 Q -96 -72 -90 -72 L 90 -72 Q 96 -72 96 -66 L 96 -10 Z" fill="#e9d3a4"/>
        <path d="M -96 -40 H 96 M -96 -56 H 96" stroke="#c8ab78" stroke-width="2.5" opacity=".7"/>
        <path d="M -108 -70 L 0 -98 L 108 -70 Z" fill="#cf6b4f"/>
        <path d="M -96 -72 L 0 -94 L 96 -72" stroke="#f0a07f" stroke-width="4" fill="none" opacity=".55"/>
        <rect x="-58" y="-64" width="24" height="20" rx="3" fill="#7fb7c9"/>
        <rect x="-16" y="-64" width="24" height="20" rx="3" fill="#7fb7c9"/>
        <rect x="26" y="-64" width="24" height="20" rx="3" fill="#7fb7c9"/>
        <rect x="-14" y="-36" width="28" height="26" rx="3" fill="#8a5733"/>
        ${oveja(-46, -10, 0.5, { retraso: -1, mirando: -1 })}
        ${oveja(52, -10, 0.46, { retraso: -2.2 })}
        <circle cx="-46" cy="-84" r="2.5" fill="#ffffff" opacity=".25"/>
      </g>
    </g>
    ${agua(330, 66, '#59a9c4', '#2f7fa4', { ola: 10 })}
    ${paloma(442, 196, 0.85, { retraso: -1.2 })}
    <path d="M 456 202 q 12 6 24 2" stroke="${C.leafDark}" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${hoja(470, 200, 0.5, C.leaf, 20)}
    ${destello(150, 206, '#ffffff', 0.55)}`,
  );

/* 03 · Abraham espera --------------------------------------------------- */
const abraham = () =>
  documento(
    'Abraham mira las estrellas junto a su tienda',
    `${cielo(CIELO.noche)}<radialGradient id="brilloEstrella" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff6cd" stop-opacity=".85"/><stop offset="1" stop-color="#fff6cd" stop-opacity="0"/></radialGradient>`,
    `${fondo()}
    ${estrellas(7, 70, { y: 16, alto: 210 })}
    ${luna({ x: 506, y: 66, r: 24 })}
    <circle cx="430" cy="96" r="56" fill="url(#brilloEstrella)" class="gl"/>
    ${estrella(430, 96, 7, '#fff6cd', 0, 4.2)}
    ${estrella(410, 76, 3.4, '#fff6cd', -1.2)}
    ${estrella(452, 118, 2.6, '#fff6cd', -2.4)}
    ${colina(298, '#8c7458', { amp: 24, fase: 0.4 })}
    ${colina(326, '#a08157', { amp: 18, fase: 2.4 })}
    ${suelo(352, '#b08a5c', { amp: 8 })}
    ${tienda(168, 348, 1.0, { lona: '#d9b985', sombra: '#bf9a63' })}
    <ellipse cx="170" cy="344" rx="26" ry="33" fill="#ffd98f" opacity=".35" class="gl"/>
    ${llama(246, 350, 0.7, { retraso: -1 })}
    ${persona({ x: 402, y: 356, s: 1.05, robe: '#6f86b8', robeDark: '#5570a3', skin: C.skin3, pelo: '#e4e0d6', barba: true, pose: 'up', retraso: -1.5 })}
    ${persona({ x: 452, y: 354, s: 0.82, robe: '#c98f8f', robeDark: '#b27676', skin: C.skin3, pelo: '#d9d2c4', cabeza: 'velo', pose: 'stand', retraso: -2.4 })}
    ${oveja(78, 372, 0.6, { retraso: -1.8 })}
    ${pasto(23, 26, { y: 360, alto: 16, color: '#8a744f' })}
    ${senderoPuntos(31, 40, { y: 356, alto: 40, color: '#c9a878' })}`,
  );

/* 04 · José perdona ----------------------------------------------------- */
const jose = () =>
  documento(
    'José abraza a sus hermanos con su manta de colores',
    `${cielo(CIELO.tarde)}<linearGradient id="manto" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8694f"/><stop offset=".3" stop-color="#f2a24e"/><stop offset=".58" stop-color="#ffd35d"/><stop offset=".8" stop-color="#79c47b"/><stop offset="1" stop-color="#8d6fc4"/></linearGradient>`,
    `${fondo()}
    ${sol({ x: 300, y: 226, r: 52, color: '#ffcf7a', halo: '#fff0c4', rayos: false, op: 0.9 })}
    ${colina(268, '#d9b98a', { amp: 24, fase: 1.2 })}
    ${colina(304, '#e6c99b', { amp: 18, fase: 3 })}
    ${suelo(338, '#e9cf9f', { amp: 9 })}
    ${arbol(84, 322, 0.72, '#9fbf72', '#7da05c')}
    ${tienda(514, 330, 0.62, { lona: '#e6d2ac', sombra: '#cbb487' })}
    <clipPath id="mantoJose"><path d="M -15 -56 L -25 -6 Q 0 2 25 -6 L 15 -56 L 6 -48 Q 0 -44 -6 -48 Z"/></clipPath>
    ${persona({ x: 300, y: 352, s: 1.2, robe: '#f0d9a8', robeDark: '#d3b781', skin: C.skin2, pelo: C.hair, pose: 'open', retraso: -1 })}
    <g transform="translate(300 352) scale(1.2)">
      <g clip-path="url(#mantoJose)">
        <rect x="-26" y="-58" width="11" height="62" fill="#e8694f"/>
        <rect x="-15" y="-58" width="10" height="62" fill="#ffd35d"/>
        <rect x="-5" y="-58" width="10" height="62" fill="#79c47b"/>
        <rect x="5" y="-58" width="10" height="62" fill="#5aa8d8"/>
        <rect x="15" y="-58" width="11" height="62" fill="#8d6fc4"/>
      </g>
      <path d="M -15 -56 L -25 -6 Q 0 2 25 -6 L 15 -56 L 6 -48 Q 0 -44 -6 -48 Z" fill="none" stroke="#b7722f" stroke-width="1.6" opacity=".45"/>
      <path d="M -25 -6 Q 0 2 25 -6" stroke="#b7722f" stroke-width="2.4" fill="none" opacity=".4"/>
    </g>
    ${persona({ x: 214, y: 358, s: 0.98, robe: '#a9b7cf', robeDark: '#8d9cb6', skin: C.skin3, pelo: C.hair, pose: 'hug', retraso: -2 })}
    ${persona({ x: 388, y: 358, s: 0.98, robe: '#c9a48f', robeDark: '#b28c77', skin: C.skin2, pelo: C.hairSoft, pose: 'hug', retraso: -2.8 })}
    ${corazon(300, 180, 0.8, C.coral, { retraso: -0.6 })}
    ${corazon(264, 158, 0.5, C.red, { retraso: -1.8, op: 0.85 })}
    ${corazon(338, 166, 0.6, C.orange, { retraso: -3 })}
    <g transform="translate(122 366)">
      <ellipse cx="0" cy="0" rx="30" ry="22" fill="#c9a878"/>
      <path d="M -28 -10 Q -22 -34 -8 -32 Q 0 -44 10 -32 Q 24 -36 28 -12" fill="#d8b884"/>
      <path d="M -12 -34 Q -6 -28 -8 -22 M 8 -34 Q 4 -26 8 -22" stroke="#a9855a" stroke-width="2.4" fill="none"/>
      <ellipse cx="0" cy="14" rx="26" ry="7" fill="#e6cfa0"/>
    </g>
    <g transform="translate(480 370)">
      <ellipse cx="0" cy="0" rx="26" ry="19" fill="#c9a878"/>
      <path d="M -24 -8 Q -18 -30 -6 -28 Q 2 -38 12 -28 Q 22 -30 24 -8" fill="#d8b884"/>
      <ellipse cx="0" cy="12" rx="22" ry="6" fill="#e6cfa0"/>
    </g>
    ${pasto(43, 34, { y: 366, alto: 18, color: '#c3a468' })}
    ${destello(154, 226, '#fff6d2', 0.7)}
    ${destello(444, 210, '#fff6d2', 0.55)}`,
  );

/* 05 · Moisés y la zarza ------------------------------------------------ */
const zarza = () =>
  documento(
    'Moisés ante la zarza que arde sin consumirse',
    `${cielo(CIELO.atardecer)}<radialGradient id="fuegoZarza" cx="50%" cy="60%" r="50%"><stop offset="0" stop-color="#fff2b0" stop-opacity=".95"/><stop offset=".55" stop-color="#ffb45e" stop-opacity=".45"/><stop offset="1" stop-color="#ffb45e" stop-opacity="0"/></radialGradient>`,
    `${fondo()}
    ${sol({ x: 96, y: 88, r: 34, giro: 130, op: 0.85 })}
    <path d="M -10 330 L 130 168 L 258 330 Z" fill="#b28b78" opacity=".55"/>
    <path d="M 210 332 L 362 140 L 512 332 Z" fill="#a67f6c" opacity=".5"/>
    <path d="M 130 168 L 156 212 L 118 216 Z" fill="#d8b79c" opacity=".5"/>
    <path d="M 362 140 L 388 194 L 346 198 Z" fill="#d8b79c" opacity=".45"/>
    ${colina(292, '#c9a273', { amp: 22, fase: 0.8 })}
    ${suelo(334, '#d5b183', { amp: 10 })}
    <circle cx="318" cy="322" r="120" fill="url(#fuegoZarza)" class="gl" style="animation-duration:3.8s"/>
    <g transform="translate(318 340)">
      <ellipse cx="0" cy="2" rx="72" ry="12" fill="${C.shadow}" opacity=".14"/>
      ${arbusto(0, 0, 1.55, '#5f9d5e', '#3f7b4c')}
      ${arbusto(-40, 4, 0.9, '#6fae68', '#4a8a53')}
      ${arbusto(42, 6, 0.85, '#6fae68', '#4a8a53')}
      ${llama(-30, -32, 1.5, { retraso: -0.4 })}
      ${llama(4, -44, 1.9, { retraso: -1 })}
      ${llama(36, -30, 1.35, { retraso: -1.7 })}
      ${llama(18, -22, 1.0, { retraso: -0.8 })}
    </g>
    <g class="rz" style="animation-delay:-1s"><circle cx="292" cy="276" r="3" fill="#ffe9a0"/></g>
    <g class="rz" style="animation-delay:-3.2s"><circle cx="344" cy="288" r="2.4" fill="#ffd17a"/></g>
    <g class="rz" style="animation-delay:-4.6s"><circle cx="326" cy="262" r="2" fill="#fff3c4"/></g>
    ${persona({ x: 168, y: 356, s: 1.1, robe: '#b98a5c', robeDark: '#9c6f45', skin: C.skin3, pelo: '#d8d2c6', barba: true, pose: 'up', retraso: -1.4 })}
    <path d="M 199 278 L 212 356" stroke="${C.brown}" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="146" cy="368" rx="12" ry="4.5" fill="${C.brownDark}" opacity=".8"/>
    <ellipse cx="160" cy="372" rx="12" ry="4.5" fill="${C.brownDark}" opacity=".8"/>
    ${oveja(88, 362, 0.62, { retraso: -2, mirando: -1 })}
    ${pasto(57, 34, { y: 364, alto: 20, color: '#b08a55' })}
    ${senderoPuntos(59, 34, { y: 366, alto: 32 })}`,
  );

/* 06 · Dios abre el mar ------------------------------------------------ */
const mar = () =>
  documento(
    'El pueblo cruza el mar por un camino de tierra seca',
    `${cielo(['#7b9db4', '#ffe3b0'])}<linearGradient id="muroAgua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fd0e2"/><stop offset=".55" stop-color="#3f95bb"/><stop offset="1" stop-color="#25688d"/></linearGradient><linearGradient id="caminoSeco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6cfa0"/><stop offset="1" stop-color="#cbaa78"/></linearGradient>`,
    `${fondo()}
    <rect x="0" y="290" width="600" height="110" fill="#4d9ab4"/>
    <path d="M -20 400 L -20 240 C 46 234 86 264 100 300 C 112 330 106 366 120 400 Z" fill="url(#muroAgua)"/>
    <path d="M 620 400 L 620 240 C 554 234 514 264 500 300 C 488 330 494 366 480 400 Z" fill="url(#muroAgua)"/>
    <g class="wv" style="transform-origin:0 0">
      <path d="M 96 300 C 84 268 46 246 -20 246 L -20 400 C 40 372 92 350 118 400 Z" fill="#9fe0ec" opacity=".35"/>
      <path d="M -20 252 C 30 244 70 266 96 300" stroke="#d6f7fb" stroke-width="9" fill="none" stroke-linecap="round" opacity=".85"/>
      <path d="M 8 288 C 44 276 70 288 88 320" stroke="#e8fbfe" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>
    </g>
    <g class="wv2" style="transform-origin:600px 0">
      <path d="M 504 300 C 516 268 554 246 620 246 L 620 400 C 560 372 508 350 482 400 Z" fill="#9fe0ec" opacity=".35"/>
      <path d="M 620 252 C 570 244 530 266 504 300" stroke="#d6f7fb" stroke-width="9" fill="none" stroke-linecap="round" opacity=".85"/>
      <path d="M 592 288 C 556 276 530 288 512 320" stroke="#e8fbfe" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>
    </g>
    <path d="M 120 400 C 160 330 230 300 300 300 C 370 300 440 330 480 400 Z" fill="url(#caminoSeco)"/>
    <path d="M 170 400 C 200 348 250 322 300 322 C 350 322 400 348 430 400 Z" fill="#d9bd8e" opacity=".8"/>
    <path d="M 186 400 C 216 360 256 340 300 340 C 344 340 384 360 414 400 Z" fill="#e6cfa0" opacity=".55"/>
    <g>
      <ellipse cx="300" cy="200" rx="26" ry="70" fill="#ffe9b8" opacity=".26" class="gl"/>
      <path d="M 284 300 L 284 204 Q 284 156 300 156 Q 316 156 316 204 L 316 300 Z" fill="#eef3f5" opacity=".4"/>
      <path d="M 290 300 L 290 206 Q 290 166 300 166 Q 310 166 310 206 L 310 300 Z" fill="#fbfdfd" opacity=".45"/>
      <path d="M 294 300 C 285 274 290 246 300 230 C 310 246 315 274 306 300 Z" fill="#fff8e6" opacity=".9"/>
      <circle cx="300" cy="240" r="9" fill="#fffdf3" opacity=".9"/>
      <circle cx="300" cy="240" r="20" fill="#fff3c4" opacity=".38" class="gl"/>
      <circle cx="300" cy="302" r="60" fill="#ffd88a" opacity=".24" class="gl" style="animation-duration:4.6s"/>
      ${llama(300, 302, 1.3, { retraso: -1.2 })}
      ${llama(272, 302, 0.68, { retraso: -2 })}
      ${llama(328, 302, 0.68, { retraso: -0.6 })}
      <g class="rz" style="animation-delay:-1.4s"><circle cx="292" cy="206" r="2.6" fill="#fff3c4" opacity=".65"/></g>
      <g class="rz" style="animation-delay:-3.6s"><circle cx="308" cy="218" r="2.2" fill="#fff3c4" opacity=".55"/></g>
    </g>
    ${pez(64, 300, 0.62, '#f2a24e', { retraso: -1, voltear: true })}
    ${pez(548, 318, 0.55, '#f2c14e', { retraso: -2.2 })}
    ${persona({ x: 244, y: 388, s: 0.7, robe: '#8d6fc4', robeDark: '#745aa6', skin: C.skin3, pelo: C.hair, pose: 'walk', retraso: -1 })}
    ${persona({ x: 288, y: 392, s: 0.78, robe: '#4a90cf', robeDark: '#3577b4', skin: C.skin2, pelo: C.hair, barba: true, pose: 'walk', retraso: -2 })}
    ${persona({ x: 330, y: 388, s: 0.62, robe: '#c98f61', skin: C.skin3, pelo: C.hairSoft, pose: 'walk', retraso: -2.8 })}
    ${persona({ x: 362, y: 394, s: 0.7, robe: '#79a86b', robeDark: '#5f8c55', skin: C.skin1, pelo: C.hair, pose: 'walk', retraso: -3.4 })}
    ${oveja(408, 388, 0.45, { retraso: -1.2 })}
    ${destello(180, 320, '#ffffff', 0.5)}
    ${destello(430, 336, '#ffffff', 0.45)}`,
  );

/* 07 · Los diez mandamientos ------------------------------------------- */
const mandamientos = () =>
  documento(
    'Las dos tablas de los mandamientos en el monte Sinaí',
    `${cielo(['#8aa0b2', '#d7dde0'])}<radialGradient id="luzMonte" cx="50%" cy="40%" r="55%"><stop offset="0" stop-color="#fff6cb" stop-opacity=".8"/><stop offset="1" stop-color="#fff6cb" stop-opacity="0"/></radialGradient><linearGradient id="piedraTabla" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe7d6"/><stop offset="1" stop-color="#cfc3ac"/></linearGradient>`,
    `${fondo()}
    ${rayosLuz(300, 18, { ancho: 380, alto: 260, color: '#fff3b0', op: 0.35 })}
    <circle cx="300" cy="190" r="150" fill="url(#luzMonte)" class="gl"/>
    <path d="M -20 400 L 300 108 L 620 400 Z" fill="#8d7f6e"/>
    <path d="M 300 108 L 620 400 L 380 400 Z" fill="#7a6d5e" opacity=".7"/>
    <path d="M 300 108 L 340 176 L 276 186 Z" fill="#b7a998" opacity=".65"/>
    ${nube(300, 132, 0.9, '#ece6dc', 0.9)}
    ${nube(226, 160, 0.6, '#e5dfd4', 0.8, -2)}
    ${nube(374, 156, 0.55, '#e5dfd4', 0.75, -3)}
    ${llama(300, 128, 0.9, { retraso: -0.8 })}
    <path d="M 248 108 L 258 138 L 244 142 L 256 172" stroke="#fff3b0" stroke-width="4" fill="none" stroke-linecap="round" class="gl"/>
    ${colina(330, '#a5967c', { amp: 20, fase: 1.6 })}
    ${suelo(352, '#b8a887', { amp: 7 })}
    <g transform="translate(272 356) rotate(-7)">${tabla(0, 0, 1.15, 'url(#piedraTabla)')}</g>
    <g transform="translate(336 358) rotate(6)">${tabla(0, 0, 1.15, 'url(#piedraTabla)')}</g>
    <ellipse cx="304" cy="362" rx="86" ry="10" fill="${C.shadow}" opacity=".14"/>
    ${destello(250, 250, '#fff6d2', 0.6)}
    ${destello(356, 236, '#fff6d2', 0.5)}`,
  );

/* 08 · Josué y Jericó --------------------------------------------------- */
const jerico = () =>
  documento(
    'Las murallas de Jericó caen al sonido de las trompetas',
    `${cielo(CIELO.amanecer)}<linearGradient id="muroJerico" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2c391"/><stop offset="1" stop-color="#c09a63"/></linearGradient>`,
    `${fondo()}
    ${sol({ x: 92, y: 92, r: 36, giro: 140 })}
    ${colina(276, '#c8b184', { amp: 22, fase: 2 })}
    <g class="tr" style="transform-origin:300px 300px">
      ${muro(116, 304, { ancho: 368, alto: 128, color: '#d3ab72', claro: '#eccf9f' })}
      <path d="M 244 304 L 244 246 Q 300 214 356 246 L 356 304 Z" fill="#7c5734"/>
      <path d="M 262 304 L 262 252 Q 300 228 338 252 L 338 304 Z" fill="#5f4226"/>
      <rect x="104" y="168" width="42" height="140" rx="6" fill="#c79c63"/>
      <rect x="454" y="168" width="42" height="140" rx="6" fill="#c79c63"/>
      <path d="M 100 168 L 125 144 L 150 168 Z" fill="#b48851"/>
      <path d="M 450 168 L 475 144 L 500 168 Z" fill="#b48851"/>
      <path d="M 216 250 L 230 276 L 214 286 L 226 304 M 372 234 L 360 262 L 376 274" stroke="#8a6338" stroke-width="3.4" fill="none" opacity=".8"/>
    </g>
    <g class="df">
      <ellipse cx="300" cy="312" rx="180" ry="22" fill="#e8d3a8" opacity=".55"/>
      <ellipse cx="240" cy="318" rx="60" ry="14" fill="#f2e2c4" opacity=".5"/>
      <ellipse cx="380" cy="316" rx="54" ry="12" fill="#f2e2c4" opacity=".45"/>
    </g>
    <g class="hp"><rect x="150" y="286" width="14" height="9" rx="2" fill="#c79c63" transform="rotate(24 157 290)"/></g>
    <g class="hp" style="animation-delay:-1.6s"><rect x="420" y="292" width="16" height="10" rx="2" fill="#d3ab72" transform="rotate(-18 428 297)"/></g>
    ${suelo(344, '#d9bd8a', { amp: 8 })}
    ${persona({ x: 128, y: 386, s: 0.82, robe: '#4a90cf', robeDark: '#3577b4', skin: C.skin3, pelo: C.hair, barba: true, pose: 'bless', retraso: -1 })}
    <g transform="translate(158 316)">
      <g class="sw" style="transform-origin:0 50%">
        <path d="M 0 0 L 44 -7 L 44 7 Z" fill="#d9a94e"/>
        <path d="M 44 -7 Q 54 0 44 7" fill="#b8873a"/>
        <rect x="22" y="-3" width="10" height="6" rx="2" fill="#b8873a"/>
      </g>
    </g>
    ${persona({ x: 208, y: 392, s: 0.72, robe: '#c9a45e', skin: C.skin2, pelo: C.hair, pose: 'bless', retraso: -2 })}
    <g transform="translate(236 340)">
      <g class="sw" style="transform-origin:0 50%">
        <path d="M 0 0 L 36 -6 L 36 6 Z" fill="#d9a94e"/>
        <rect x="18" y="-3" width="8" height="6" rx="2" fill="#b8873a"/>
      </g>
    </g>
    <circle cx="204" cy="332" r="10" fill="none" stroke="#fff3c4" stroke-width="3" opacity=".7" class="rp"/>
    <circle cx="204" cy="332" r="10" fill="none" stroke="#fff3c4" stroke-width="2.4" opacity=".5" class="rp" style="animation-delay:-1.7s"/>
    <circle cx="252" cy="352" r="8" fill="none" stroke="#fff3c4" stroke-width="2.4" opacity=".55" class="rp" style="animation-delay:-2.6s"/>
    ${pasto(71, 30, { y: 372, alto: 18, color: '#b99a63' })}
    ${senderoPuntos(73, 40, { y: 372, alto: 26, color: '#e6d3a8' })}`,
  );

/* 09 · Rut es fiel ------------------------------------------------------ */
const rut = () =>
  documento(
    'Rut y Noemí en el campo de trigo al atardecer',
    `${cielo(['#ffd6a4', '#ffeecb'])}`,
    `${fondo()}
    ${sol({ x: 474, y: 112, r: 42, giro: 120 })}
    ${nube(150, 78, 0.7, '#ffffff', 0.7, -1.5)}
    ${colina(252, '#dcbe83', { amp: 26, fase: 0.5 })}
    ${colina(284, '#cba86b', { amp: 18, fase: 2.2 })}
    ${suelo(318, '#b9955c', { amp: 9 })}
    <path d="M 0 344 C 90 316 190 306 300 300 C 410 294 520 300 620 318 L 620 400 L 0 400 Z" fill="#c9a262"/>
    <path d="M 0 366 C 100 340 200 330 300 324 C 400 318 520 324 620 342 L 620 400 L 0 400 Z" fill="#d9b273" opacity=".85"/>
    ${arbol(84, 302, 0.66, '#a8b96a', '#87995a')}
    ${arbol(538, 306, 0.54, '#b3c377', '#8fa062')}
    ${Array.from({ length: 26 }, (_, i) => {
      const x = 14 + i * 23 + (i % 3) * 5;
      const y = 352 + (i % 4) * 12;
      return trigo(x, y, 0.85 + (i % 3) * 0.12);
    }).join('')}
    ${persona({ x: 268, y: 392, s: 1.0, robe: '#5f9fc9', robeDark: '#4583ad', skin: C.skin2, pelo: C.hair, cabeza: 'panuelo', pose: 'carry', retraso: -1.4 })}
    <g transform="translate(246 356) rotate(-26)">
      <g class="sw" style="transform-origin:100% 100%">
        <path d="M -4 0 L 30 -6" stroke="#b98a3c" stroke-width="3" stroke-linecap="round"/>
        ${trigo(4, 0, 0.6)}${trigo(14, -2, 0.58)}${trigo(24, -4, 0.6)}${trigo(32, -6, 0.52)}
        <ellipse cx="16" cy="2" rx="20" ry="5" fill="#d9a94e" opacity=".9"/>
      </g>
    </g>
    ${persona({ x: 352, y: 388, s: 0.94, robe: '#a888b8', robeDark: '#8d6fa0', skin: C.skin2, pelo: '#cfc6b8', cabeza: 'velo', pose: 'walk', retraso: -2.2 })}
    ${pasto(83, 28, { y: 384, alto: 18, color: '#b98a3c' })}
    ${paloma(178, 148, 0.5, { retraso: -1 })}
    ${paloma(222, 168, 0.4, { retraso: -2.2, op: 0.85 })}
    ${destello(388, 236, '#fff6d2', 0.55)}`,
  );

/* 10 · Samuel escucha --------------------------------------------------- */
const samuel = () =>
  documento(
    'Samuel despierta al escuchar la voz de Dios en la noche',
    `${cielo(CIELO.noche)}<radialGradient id="luzVoz" cx="50%" cy="0%" r="80%"><stop offset="0" stop-color="#fff6c9" stop-opacity=".85"/><stop offset="1" stop-color="#fff6c9" stop-opacity="0"/></radialGradient>`,
    `${fondo()}
    ${estrellas(13, 46, { y: 18, alto: 180 })}
    ${luna({ x: 508, y: 62, r: 22 })}
    ${rayosLuz(300, 0, { ancho: 360, alto: 330, color: '#fff3b0', op: 0.3, giro: 80 })}
    <circle cx="300" cy="86" r="34" fill="#fff6c9" opacity=".22" class="gl"/>
    ${estrella(300, 86, 5.5, '#fff6c9', 0, 4)}
    ${colina(292, '#6a7f6a', { amp: 20, fase: 1.8 })}
    ${suelo(330, '#5c725e', { amp: 8 })}
    ${tienda(430, 350, 0.82, { lona: '#cbb98f', sombra: '#b09d74' })}
    ${cama(268, 344, 0.96, { manta: '#7c9ec9', sabanas: '#f4e6c8', almohada: '#e8dcc0' })}
    <g transform="translate(214 318)">
      ${persona({ x: 0, y: 0, s: 0.62, robe: '#c9d8d0', robeDark: '#b0c4bc', skin: C.skin1, pelo: C.hair, pose: 'pray', retraso: -1 })}
    </g>
    <path d="M 268 336 Q 292 300 292 278" stroke="#c9d8d0" stroke-width="4" fill="none" opacity=".55"/>
    <g transform="translate(352 330)">
      <path d="M 0 0 L 0 -64" stroke="${C.brown}" stroke-width="4"/>
      <path d="M -8 0 L 8 0" stroke="${C.brown}" stroke-width="4" stroke-linecap="round"/>
      <path d="M -6 -64 L 6 -64 L 9 -50 L -9 -50 Z" fill="#d9a94e"/>
      <g class="fm" style="transform-origin:50% 100%">
        <path d="M 0 -76 C -7 -70 -6 -58 0 -54 C 6 -58 7 -70 0 -76 Z" fill="${C.gold}"/>
        <path d="M 0 -71 C -3 -67 -3 -60 0 -58 C 3 -60 3 -67 0 -71 Z" fill="#fff3c4"/>
      </g>
      <circle cx="0" cy="-64" r="26" fill="#ffe9a0" opacity=".22" class="gl"/>
    </g>
    ${pasto(97, 26, { y: 360, alto: 18, color: '#4c6452' })}
    ${destello(388, 236, '#fff6d2', 0.45)}
    ${destello(210, 246, '#fff6d2', 0.35)}`,
  );

/* 11 · David y Goliat --------------------------------------------------- */
const goliat = () =>
  documento(
    'David, con su honda, frente al gigante Goliat',
    `${cielo(CIELO.tarde)}`,
    `${fondo()}
    ${sol({ x: 118, y: 96, r: 34, giro: 150, op: 0.9 })}
    ${nube(432, 82, 0.85, '#fff3df', 0.8, -2)}
    ${colina(258, '#d7b787', { amp: 24, fase: 0.9 })}
    ${colina(294, '#c8a472', { amp: 16, fase: 2.6 })}
    ${suelo(334, '#d9bc8b', { amp: 8 })}
    <path d="M 60 400 C 120 372 180 366 250 372 L 244 400 Z" fill="#a9c9b0" opacity=".45"/>
    <g transform="translate(468 362)">
      <ellipse cx="0" cy="2" rx="74" ry="12" fill="${C.shadow}" opacity=".18"/>
      <g class="fl" style="animation-duration:8s">
        <rect x="-36" y="-74" width="25" height="76" rx="9" fill="#5f5668"/>
        <rect x="12" y="-74" width="25" height="76" rx="9" fill="#5f5668"/>
        <path d="M -54 -68 Q -62 -182 -32 -238 L 32 -238 Q 62 -182 54 -68 Q 0 -54 -54 -68 Z" fill="#7f6f8e"/>
        <path d="M -46 -182 Q 0 -170 46 -182 L 48 -158 Q 0 -146 -48 -158 Z" fill="#c9a45e"/>
        <path d="M -46 -160 L -50 -120 M 46 -160 L 50 -120" stroke="#b08a3f" stroke-width="5" opacity=".7"/>
        <g opacity=".55" fill="#9686a6">
          <circle cx="-34" cy="-108" r="7"/><circle cx="-14" cy="-108" r="7"/><circle cx="6" cy="-108" r="7"/><circle cx="26" cy="-108" r="7"/>
          <circle cx="-24" cy="-88" r="7"/><circle cx="-4" cy="-88" r="7"/><circle cx="16" cy="-88" r="7"/><circle cx="36" cy="-88" r="7"/>
          <circle cx="-14" cy="-68" r="7"/><circle cx="6" cy="-68" r="7"/><circle cx="26" cy="-68" r="7"/>
        </g>
        <path d="M -32 -234 Q -42 -262 -22 -274 L 22 -274 Q 42 -262 32 -234 Z" fill="#c9a45e"/>
        <path d="M -34 -236 Q 0 -250 34 -236" stroke="#a9853f" stroke-width="6" fill="none"/>
        <path d="M -30 -250 Q -30 -282 0 -284 Q 30 -282 30 -250 Q 18 -262 0 -260 Q -18 -262 -30 -250 Z" fill="#c9a45e"/>
        <path d="M -30 -250 Q -34 -256 -26 -262 L -30 -240 Z" fill="#b08a3f"/>
        <path d="M 30 -250 Q 34 -256 26 -262 L 30 -240 Z" fill="#b08a3f"/>
        <path d="M 0 -282 L 0 -262" stroke="#8d6a2e" stroke-width="3" opacity=".6"/>
        <circle cx="0" cy="-248" r="16" fill="${C.skin3}"/>
        <path d="M -16 -250 Q -16 -232 -10 -226 Q 0 -220 10 -226 Q 16 -232 16 -250 Q 8 -240 0 -238 Q -8 -240 -16 -250 Z" fill="#5c4335"/>
        <path d="M -7 -250 h 5 M 5 -250 h 5" stroke="#3b2a24" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M -6 -242 Q 0 -238 6 -242" stroke="#3b2a24" stroke-width="2" fill="none"/>
        <path d="M -17 -246 Q -22 -244 -18 -238 M 17 -246 Q 22 -244 18 -238" stroke="#3b2a24" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 32 -230 Q 54 -208 58 -168" stroke="#7f6f8e" stroke-width="15" stroke-linecap="round" fill="none"/>
        <circle cx="59" cy="-166" r="9.5" fill="${C.skin3}"/>
        <path d="M 60 -262 L 76 26" stroke="${C.brownDark}" stroke-width="5" stroke-linecap="round"/>
        <path d="M 60 -262 L 72 -292 L 80 -260 Z" fill="#b9c1c6" stroke="#8d969c" stroke-width="2"/>
        <path d="M 66 -270 L 74 -268" stroke="#8d969c" stroke-width="2"/>
        <path d="M -30 -222 Q -72 -192 -76 -140" stroke="#7f6f8e" stroke-width="15" stroke-linecap="round" fill="none"/>
        <g transform="translate(-84 -150)">
          <ellipse rx="27" ry="41" fill="#a9853f"/>
          <ellipse rx="23" ry="36" fill="#c9a45e"/>
          <ellipse rx="10" ry="36" fill="#dbb96c" opacity=".7"/>
          <circle r="8" fill="#a9853f"/>
          <circle r="4" fill="#e2c07a"/>
          <path d="M -18 -30 Q -30 -14 -14 6" stroke="#8d6a2e" stroke-width="2.4" fill="none" opacity=".7"/>
        </g>
      </g>
    </g>
    ${persona({ x: 156, y: 374, s: 1.04, robe: '#c9a45e', robeDark: '#a9873f', skin: C.skin1, pelo: '#a5643a', pose: 'up', retraso: -1.6 })}
    <g transform="translate(178 336)">
      <path d="M -12 0 Q 0 -10 12 0 L 9 14 Q 0 18 -9 14 Z" fill="#a9855a"/>
      <path d="M -12 0 Q 0 -6 12 0" stroke="#8d6a3e" stroke-width="2.4" fill="none"/>
      <circle cx="-4" cy="6" r="3.4" fill="${C.stone}"/>
      <circle cx="5" cy="7" r="3" fill="${C.stoneDark}"/>
    </g>
    <g transform="translate(192 286)">
      <g class="sp" style="animation-duration:2.8s;transform-origin:0 0">
        <path d="M 0 0 L 24 -6 M 0 0 L 30 4" stroke="${C.brownDark}" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        <path d="M 24 -6 Q 34 0 30 4 Q 22 2 24 -6 Z" fill="${C.brown}" opacity=".9"/>
        <ellipse cx="28" cy="-1" rx="4.4" ry="3.6" fill="${C.stone}"/>
      </g>
      <circle cx="0" cy="0" r="4.5" fill="${C.skin1}"/>
      <path d="M -3 3 Q -8 12 -4 20" stroke="${C.brownDark}" stroke-width="2" fill="none" opacity=".6"/>
    </g>
    <g fill="${C.stoneDark}" opacity=".9">
      <ellipse cx="112" cy="388" rx="9" ry="5"/><ellipse cx="128" cy="394" rx="6" ry="3.6"/><ellipse cx="98" cy="394" rx="5" ry="3"/>
      <ellipse cx="80" cy="380" rx="7" ry="4"/>
    </g>
    ${pasto(101, 46, { y: 376, alto: 24, color: '#b8955f' })}
    ${destello(360, 196, '#fff6d2', 0.5)}`,
  );

/* 12 · David y Jonatán -------------------------------------------------- */
const jonatan = () =>
  documento(
    'David y Jonatán, amigos que se ayudan y cumplen su promesa',
    `${cielo(['#ffc9a1', '#ffe9c6'])}`,
    `${fondo()}
    ${sol({ x: 300, y: 208, r: 54, color: '#ffd08a', halo: '#fff0c2', rayos: false, op: 0.85 })}
    ${colina(258, '#cbae7d', { amp: 24, fase: 1.5 })}
    ${colina(292, '#d9bd8d', { amp: 16, fase: 3.2 })}
    ${suelo(330, '#e3ca9d', { amp: 8 })}
    ${arbol(88, 320, 0.7, '#a7bd72', '#879c5b')}
    ${arbusto(520, 336, 0.6, '#a7bd72', '#879c5b')}
    <path d="M 470 400 L 470 320" stroke="${C.brown}" stroke-width="4" stroke-linecap="round"/>
    <path d="M 470 330 L 458 314 M 470 340 L 482 322" stroke="${C.brown}" stroke-width="2.4" opacity=".7"/>
    ${persona({ x: 266, y: 358, s: 1.02, robe: '#c9a45e', robeDark: '#a9873f', skin: C.skin1, pelo: '#a5643a', pose: 'hug', retraso: -1 })}
    ${persona({ x: 334, y: 358, s: 1.02, robe: '#4a7fb4', robeDark: '#39699c', skin: C.skin2, pelo: C.hair, pose: 'hug', retraso: -2 })}
    ${corazon(300, 268, 0.5, C.coral, { retraso: -1.4, op: 0.9 })}
    ${corazon(272, 248, 0.34, C.orange, { retraso: -2.6, op: 0.8 })}
    ${corazon(330, 252, 0.38, C.red, { retraso: -3.4, op: 0.8 })}
    <g transform="translate(180 366)">
      <path d="M 0 0 L 0 -58" stroke="${C.brown}" stroke-width="3" stroke-linecap="round"/>
      <path d="M 0 -58 L -8 -50 L 0 -46 L 8 -50 Z" fill="${C.coral}"/>
      <path d="M -6 -58 L -2 -48 L 2 -58" stroke="${C.cream}" stroke-width="2" fill="none"/>
    </g>
    <g transform="translate(206 372) rotate(-12)">
      <path d="M 0 0 L 0 -46" stroke="${C.brown}" stroke-width="3" stroke-linecap="round"/>
      <path d="M 0 -46 L -7 -38 L 0 -34 L 7 -38 Z" fill="${C.gold}"/>
    </g>
    <path d="M 148 380 Q 168 352 196 366" stroke="${C.brown}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <path d="M 148 380 L 196 366" stroke="${C.cream}" stroke-width="1" opacity=".6"/>
    ${pasto(113, 40, { y: 372, alto: 20, color: '#c2a468' })}
    ${flor(430, 380, '#f2b04e')}
    ${flor(462, 390, '#f58fa0')}
    ${paloma(168, 150, 0.5, { retraso: -1 })}
    ${paloma(410, 132, 0.42, { retraso: -2.4 })}
    ${destello(300, 190, '#fff6d2', 0.6)}`,
  );

/* 13 · Salomón y la sabiduría ------------------------------------------ */
const salomon = () =>
  documento(
    'El rey Salomón pide un corazón sabio para gobernar',
    `${cielo(['#e8dcc2', '#f7ecd4'])}<linearGradient id="pisoPalacio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2cfae"/><stop offset="1" stop-color="#cbb187"/></linearGradient><linearGradient id="cortina" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8d6fc4"/><stop offset="1" stop-color="#63499a"/></linearGradient>`,
    `${fondo()}
    ${rayosLuz(300, 10, { ancho: 300, alto: 300, color: '#fff8dd', op: 0.45, giro: 70 })}
    <rect x="0" y="330" width="600" height="70" fill="url(#pisoPalacio)"/>
    <path d="M 0 330 H 600 M 0 348 H 600" stroke="#b89a6f" stroke-width="2" opacity=".5"/>
    <g fill="#e9dcc1">
      <rect x="46" y="78" width="46" height="252" rx="4"/><rect x="26" y="70" width="86" height="18" rx="6"/><rect x="26" y="322" width="86" height="14" rx="5"/>
      <rect x="508" y="78" width="46" height="252" rx="4"/><rect x="488" y="70" width="86" height="18" rx="6"/><rect x="488" y="322" width="86" height="14" rx="5"/>
    </g>
    <path d="M 69 78 V 330 M 531 78 V 330" stroke="#d3c1a1" stroke-width="3" opacity=".7"/>
    <path d="M 150 330 L 150 120 Q 300 54 450 120 L 450 330 Z" fill="#efe3ca" opacity=".7"/>
    <g class="sw" style="transform-origin:50% 0%">
      <path d="M 118 0 Q 168 8 158 92 Q 140 150 118 178 Q 130 80 118 0 Z" fill="url(#cortina)"/>
      <path d="M 482 0 Q 432 8 442 92 Q 460 150 482 178 Q 470 80 482 0 Z" fill="url(#cortina)"/>
    </g>
    <rect x="240" y="212" width="120" height="112" rx="10" fill="#b0873f"/>
    <path d="M 228 216 Q 300 178 372 216 L 372 236 L 228 236 Z" fill="#c9a45e"/>
    <circle cx="300" cy="204" r="18" fill="#d9b46a"/>
    ${corazon(300, 150, 1.05, C.gold, { retraso: -1 })}
    <circle cx="300" cy="150" r="56" fill="#fff3c4" opacity=".35" class="gl"/>
    ${persona({ x: 300, y: 344, s: 1.05, robe: '#8d6fc4', robeDark: '#7157a5', skin: C.skin2, pelo: C.hair, cabeza: 'corona', pose: 'open', retraso: -1.6 })}
    ${persona({ x: 186, y: 350, s: 0.82, robe: '#c98f8f', robeDark: '#b27676', skin: C.skin3, pelo: C.hair, pose: 'stand', retraso: -2.4 })}
    ${persona({ x: 414, y: 350, s: 0.82, robe: '#8fa8bd', robeDark: '#7690a6', skin: C.skin1, pelo: C.hairSoft, pose: 'stand', retraso: -3 })}
    ${destello(180, 186, '#fff6d2', 0.55)}
    ${destello(424, 200, '#fff6d2', 0.5)}`,
  );

export const escenas1 = {
  'la-creacion': creacion,
  'noe-y-el-arca': arca,
  'abraham-espera': abraham,
  'jose-perdona': jose,
  'moises-y-la-zarza': zarza,
  'dios-abre-el-mar': mar,
  'diez-mandamientos': mandamientos,
  'josue-y-jerico': jerico,
  'rut-es-fiel': rut,
  'samuel-escucha': samuel,
  'david-y-goliat': goliat,
  'david-y-jonatan': jonatan,
  'salomon-y-la-sabiduria': salomon,
};
