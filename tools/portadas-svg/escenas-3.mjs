/**
 * escenas-3.mjs — Portadas 27 a 39
 * ---------------------------------------------------------------------------
 * Parábolas finales, personajes del Antiguo Testamento y las dos lecciones
 * sobre amar y confiar de todo corazón.
 */
import {
  C, CIELO, documento, cielo, fondo, sol, luna, estrella, estrellas, nube, colina,
  suelo, agua, arbol, palmera, arbusto, pasto, trigo, flor, persona, bebe, oveja,
  leon, pez, paloma, casa, tienda, muro, barca, llama, corazon, jarra, tabla,
  canasta, racimo, pan, corona, arcoiris, mariposa, camino, rayosLuz, resplandor,
  destello, senderoPuntos, hoja, roca as monticulo, cama, lluvia,
} from './base.mjs';

/* 27 · La casa sobre la roca ------------------------------------------- */
const roca = () =>
  documento(
    'La casa construida sobre la roca resiste la lluvia',
    `${cielo(['#8aa2b4', '#d3e0e4'])}<linearGradient id="risco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bdb3a3"/><stop offset="1" stop-color="#8e8577"/></linearGradient>`,
    `${fondo()}
    ${nube(120, 62, 1.2, '#7f909c', 0.85, -1.4)}
    ${nube(300, 44, 1.05, '#93a4ae', 0.8, -2.8)}
    ${nube(480, 70, 0.95, '#86979f', 0.75, -4.2)}
    ${lluvia(41, 18, { x: 96, y: 92, ancho: 150, alto: 158, color: '#9fc0d2' })}
    ${lluvia(43, 18, { x: 384, y: 100, ancho: 154, alto: 148, color: '#9fc0d2' })}
    ${colina(272, '#8fa87e', { amp: 20, fase: 1.4 })}
    ${suelo(312, '#82a06d', { amp: 9 })}
    <ellipse cx="300" cy="386" rx="250" ry="26" fill="#6f8c62" opacity=".35"/>
    <path d="M 118 400 Q 96 340 158 316 Q 232 292 300 300 Q 372 290 442 318 Q 504 342 482 400 Z" fill="url(#risco)"/>
    <path d="M 158 316 Q 232 292 300 300 Q 372 290 442 318 Q 386 330 300 330 Q 214 330 158 316 Z" fill="#d4cbba" opacity=".75"/>
    <path d="M 140 348 Q 210 332 300 336 Q 392 332 460 350" stroke="#7d7568" stroke-width="3" fill="none" opacity=".45"/>
    <path d="M 172 376 Q 250 360 330 366 Q 400 370 448 382" stroke="#7d7568" stroke-width="2.6" fill="none" opacity=".35"/>
    <path d="M 206 330 l 10 16 l -8 14 M 386 328 l -8 18 l 10 12 M 262 366 l 8 14" stroke="#6f675b" stroke-width="2.6" fill="none" opacity=".4" stroke-linecap="round"/>
    ${casa(300, 302, 1.05, { pared: '#f4e6c8', techo: '#b8563f', puerta: '#7c4c2b' })}
    <g transform="translate(150 372) scale(0.82)">
      ${persona({ x: 0, y: 0, s: 1, robe: '#8d6fc4', robeDark: '#745aa6', skin: C.skin2, pelo: C.hair, pose: 'up', retraso: -1.4 })}
    </g>
    <g transform="translate(452 376) scale(0.78)">
      ${persona({ x: 0, y: 0, s: 1, robe: '#c9a45e', robeDark: '#a9873f', skin: C.skin1, pelo: '#a5643a', pose: 'hug', retraso: -2.4 })}
    </g>
    ${arbusto(92, 322, 0.6, '#7fae6a', '#5f8c52')}
    ${arbusto(514, 330, 0.54, '#8fbf6e', '#6f9e55')}
    ${arbol(532, 300, 0.62, '#7fae6a', '#5f8c52')}
    ${arbol(64, 306, 0.55, '#8fbf6e', '#6f9e55')}
    ${pasto(233, 30, { y: 392, alto: 16, color: '#6f9a4f' })}`,
  );

/* 28 · Adán y Eva ------------------------------------------------------- */
const adanEva = () =>
  documento(
    'Adán y Eva cuidan el jardín que Dios les dio',
    `${cielo(['#c9ecff', '#fff6d8'])}<radialGradient id="luzEden" cx="50%" cy="40%" r="55%"><stop offset="0" stop-color="#fff6c9" stop-opacity=".55"/><stop offset="1" stop-color="#fff6c9" stop-opacity="0"/></radialGradient>`,
    `${fondo()}
    ${sol({ x: 300, y: 96, r: 42, giro: 120, op: 0.9 })}
    <circle cx="300" cy="180" r="150" fill="url(#luzEden)" class="gl"/>
    ${colina(248, '#a9d68a', { amp: 24, fase: 0.7 })}
    ${colina(282, '#8fc777', { amp: 18, fase: 2.4 })}
    ${suelo(320, '#7cba66', { amp: 9 })}
    <path d="M 250 400 C 240 366 296 340 330 314 C 346 302 342 288 334 276 L 366 278 C 378 296 366 314 350 328 C 316 352 288 376 296 400 Z" fill="#7fd0e2" opacity=".85"/>
    <path d="M 262 398 C 254 368 304 344 338 320" stroke="#d9f6f2" stroke-width="3" fill="none" opacity=".55" class="wv"/>
    ${arbol(96, 320, 1.1, '#5fae6e', '#3f8552')}
    ${arbol(516, 306, 1.0, '#6fbd7f', '#4b9a63')}
    ${arbol(160, 288, 0.7, '#7cc98a', '#529f68')}
    ${arbusto(196, 344, 0.7, '#7cc98a', '#529f68')}
    ${arbusto(404, 348, 0.62, '#7cc98a', '#529f68')}
    <g transform="translate(476 348)">
      <path d="M 0 0 L 0 -60" stroke="#8d5c3c" stroke-width="6" stroke-linecap="round"/>
      <circle cx="-16" cy="-54" r="16" fill="#6fbd7f"/><circle cx="14" cy="-58" r="15" fill="#5fae6e"/><circle cx="0" cy="-70" r="17" fill="#7cc98a"/>
      <circle cx="-10" cy="-56" r="3" fill="${C.coral}"/><circle cx="10" cy="-64" r="3" fill="${C.coral}"/><circle cx="4" cy="-48" r="3" fill="${C.coral}"/>
    </g>
    ${persona({ x: 246, y: 372, s: 1.02, robe: '#8fbf6e', robeDark: '#6f9e55', skin: C.skin2, pelo: C.hair, pose: 'stand', retraso: -1.4 })}
    ${persona({ x: 348, y: 372, s: 0.98, robe: '#e8c07c', robeDark: '#cba25e', skin: C.skin1, pelo: '#8d5c3c', pose: 'open', retraso: -2.4 })}
    ${corazon(300, 250, 0.5, C.coral, { retraso: -1.2, op: 0.85 })}
    ${mariposa(196, 226, 0.95, C.gold, -0.6)}
    ${mariposa(420, 240, 0.8, C.coral, -2)}
    ${oveja(196, 394, 0.6, { retraso: -1.8, mirando: -1 })}
    ${pasto(227, 46, { y: 380, alto: 20, color: '#5f9a4f' })}
    ${flor(148, 388, '#f58fa0')}
    ${flor(378, 394, '#f2b04e')}
    ${flor(430, 386, '#8d6fc4')}
    ${destello(300, 196, '#fff9dd', 0.5)}`,
  );

/* 29 · Débora sirve con valentía --------------------------------------- */
const debora = () =>
  documento(
    'Débora guía a su pueblo bajo una palmera',
    `${cielo(['#ffd9a2', '#fff0cc'])}<linearGradient id="tierraDebora" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9be86"/><stop offset="1" stop-color="#bfa166"/></linearGradient>`,
    `${fondo()}
    ${sol({ x: 470, y: 98, r: 44, giro: 120 })}
    ${nube(150, 76, 0.72, '#ffffff', 0.7, -1.6)}
    ${colina(252, '#cfb47f', { amp: 22, fase: 0.9 })}
    ${colina(288, '#bfa066', { amp: 16, fase: 2.6 })}
    ${suelo(322, '#c9ac72', { amp: 8 })}
    <path d="M -20 400 C 140 372 320 368 620 384 L 620 400 Z" fill="url(#tierraDebora)"/>
    ${palmera(150, 356, 2.15, '#6fae68', '#8d5c3c')}
    ${palmera(492, 350, 1.5, '#7cba6a', '#96613f')}
    <g transform="translate(150 300)">
      <path d="M -30 0 Q 0 -14 30 0 Q 0 10 -30 0 Z" fill="#e8c07c" opacity=".35"/>
    </g>
    ${persona({ x: 300, y: 366, s: 1.12, robe: '#8d6fc4', robeDark: '#745aa6', skin: C.skin2, pelo: C.hair, cabeza: 'panuelo', pose: 'up', retraso: -1 })}
    <path d="M 331 290 L 342 366" stroke="${C.brown}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="331" cy="286" r="4" fill="${C.gold}"/>
    ${persona({ x: 214, y: 382, s: 0.9, robe: '#6f9fb8', robeDark: '#5a86a0', skin: C.skin3, pelo: C.hair, barba: true, pose: 'stand', retraso: -2.2 })}
    ${persona({ x: 388, y: 384, s: 0.84, robe: '#c9a45e', robeDark: '#a9873f', skin: C.skin1, pelo: '#a5643a', pose: 'bless', retraso: -2.8 })}
    ${persona({ x: 446, y: 390, s: 0.66, robe: '#c98f8f', skin: C.skin2, pelo: C.hair, pose: 'wave', retraso: -3.4 })}
    ${oveja(96, 388, 0.52, { retraso: -1.4 })}
    ${pasto(239, 44, { y: 376, alto: 20, color: '#b09055' })}
    ${senderoPuntos(241, 34, { y: 380, alto: 22 })}
    ${destello(252, 208, '#fff6d2', 0.5)}
    ${destello(330, 190, '#fff6d2', 0.45)}`,
  );

/* 30 · El bautismo de Jesús -------------------------------------------- */
const bautismo = () =>
  documento(
    'Jesús es bautizado en el río y el cielo se abre',
    `${cielo(['#cfeaff', '#fff5d6'])}<linearGradient id="rioBautismo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd8e2"/><stop offset="1" stop-color="#3f95bb"/></linearGradient><radialGradient id="luzBautismo" cx="50%" cy="0%" r="80%"><stop offset="0" stop-color="#fff9dd" stop-opacity=".95"/><stop offset="1" stop-color="#fff9dd" stop-opacity="0"/></radialGradient>`,
    `${fondo()}
    <path d="M 232 0 L 368 0 L 400 260 L 200 260 Z" fill="url(#luzBautismo)" class="gl"/>
    ${rayosLuz(300, 4, { ancho: 260, alto: 250, color: '#fff8d0', op: 0.32, giro: 70 })}
    ${colina(238, '#a9c98a', { amp: 20, fase: 1.1 })}
    ${suelo(276, '#96b877', { amp: 9 })}
    ${palmera(86, 288, 0.95)}
    ${arbusto(514, 286, 0.6, '#8fbf6e', '#6f9e55')}
    <rect x="0" y="288" width="600" height="112" fill="url(#rioBautismo)"/>
    ${agua(294, 56, '#8fd6e2', '#5aa9c4', { ola: 7 })}
    <ellipse cx="300" cy="344" rx="72" ry="10" fill="#dff6ff" opacity=".35" class="wv"/>
    ${persona({ x: 300, y: 356, s: 1.1, robe: '#f0e2c4', robeDark: '#d3c1a1', skin: C.skin2, pelo: C.hair, barba: true, pose: 'pray', retraso: -1.2 })}
    <path d="M 300 356 Q 300 330 300 296" stroke="#dff6ff" stroke-width="3" fill="none" opacity=".55"/>
    ${persona({ x: 198, y: 350, s: 1.0, robe: '#8a7a5c', robeDark: '#6f6249', skin: C.skin3, pelo: '#d8d2c6', barba: true, pose: 'bless', retraso: -2.2 })}
    ${paloma(300, 168, 1.05, { retraso: -1.6 })}
    <circle cx="300" cy="160" r="46" fill="#fff6c9" opacity=".3" class="gl"/>
    ${agua(336, 64, '#66b6cf', '#3f88ad', { ola: 9 })}
    <g class="rp" style="animation-delay:-0.6s"><circle cx="300" cy="344" r="16" fill="none" stroke="#dff6ff" stroke-width="3" opacity=".6"/></g>
    <g class="rp" style="animation-delay:-2.4s"><circle cx="300" cy="344" r="16" fill="none" stroke="#dff6ff" stroke-width="2.4" opacity=".45"/></g>
    ${destello(240, 200, '#fff9dd', 0.6)}
    ${destello(362, 188, '#fff9dd', 0.55)}`,
  );

/* 31 · Gedeón y los 300 ------------------------------------------------- */
const gedeon = () =>
  documento(
    'Los trescientos de Gedeón con antorchas y trompetas',
    `${cielo(CIELO.noche)}<radialGradient id="fogataGedeon" cx="50%" cy="60%" r="50%"><stop offset="0" stop-color="#ffd88a" stop-opacity=".9"/><stop offset="1" stop-color="#ffd88a" stop-opacity="0"/></radialGradient><linearGradient id="monteGedeon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5f6a72"/><stop offset="1" stop-color="#3d4850"/></linearGradient>`,
    `${fondo()}
    ${estrellas(29, 52, { y: 14, alto: 190 })}
    ${luna({ x: 500, y: 62, r: 22 })}
    <path d="M -20 300 L 120 210 L 240 276 L 380 186 L 460 244 L 620 196 L 620 400 L -20 400 Z" fill="url(#monteGedeon)" opacity=".85"/>
    ${colina(300, '#4f5a54', { amp: 18, fase: 1.5 })}
    ${suelo(336, '#5c5a4c', { amp: 8 })}
    <circle cx="300" cy="330" r="124" fill="url(#fogataGedeon)" class="gl" style="animation-duration:3.4s"/>
    <g transform="translate(300 352)">
      <ellipse cx="0" cy="2" rx="42" ry="8" fill="${C.shadow}" opacity=".3"/>
      <path d="M -30 -4 L 30 -8 M -28 4 L 30 0" stroke="#6b4a37" stroke-width="6" stroke-linecap="round"/>
      ${llama(0, -6, 1.6, { retraso: -0.6 })}
      ${llama(-18, -2, 1.05, { retraso: -1.4 })}
      ${llama(16, -2, 1.15, { retraso: -2.2 })}
    </g>
    ${persona({ x: 152, y: 376, s: 1.02, robe: '#7c8fa0', robeDark: '#64768a', skin: C.skin3, pelo: C.hair, barba: true, pose: 'up', retraso: -1.2 })}
    <g transform="translate(180 292)">
      <g class="sw" style="transform-origin:0 50%">
        <path d="M 0 0 L 38 -6 L 38 6 Z" fill="#d9a94e"/>
        <rect x="20" y="-3" width="8" height="6" rx="2" fill="#b8873a"/>
      </g>
      <g class="fm" style="transform-origin:0 50%">
        <path d="M -2 -2 C -8 -6 -8 -12 -2 -16 C 4 -12 4 -6 -2 -2 Z" fill="${C.gold}"/>
      </g>
    </g>
    ${persona({ x: 446, y: 374, s: 0.98, robe: '#8a7a6a', robeDark: '#6f6153', skin: C.skin2, pelo: C.hairSoft, pose: 'up', retraso: -2.2 })}
    <g transform="translate(418 292)">
      <g class="sw" style="transform-origin:100% 50%">
        <path d="M 0 0 L 38 -6 L 38 6 Z" fill="#d9a94e"/>
        <rect x="20" y="-3" width="8" height="6" rx="2" fill="#b8873a"/>
      </g>
      <g class="fm" style="transform-origin:100% 50%">
        <path d="M 40 -2 C 34 -6 34 -12 40 -16 C 46 -12 46 -6 40 -2 Z" fill="${C.gold}"/>
      </g>
    </g>
    <g opacity=".8">
      ${persona({ x: 236, y: 388, s: 0.6, robe: '#6f7f8c', skin: C.skin2, pelo: C.hair, pose: 'stand', retraso: -3 })}
      ${persona({ x: 268, y: 392, s: 0.56, robe: '#8a7a6a', skin: C.skin1, pelo: C.hair, pose: 'stand', retraso: -3.4 })}
      ${persona({ x: 340, y: 392, s: 0.56, robe: '#6f7f8c', skin: C.skin3, pelo: C.hair, pose: 'stand', retraso: -3.8 })}
      ${persona({ x: 372, y: 388, s: 0.6, robe: '#8a7a6a', skin: C.skin2, pelo: C.hair, pose: 'stand', retraso: -4.2 })}
    </g>
    <g class="rz" style="animation-delay:-0.8s"><circle cx="284" cy="300" r="3" fill="#ffd88a"/></g>
    <g class="rz" style="animation-delay:-3s"><circle cx="322" cy="294" r="2.4" fill="#ffe9a0"/></g>
    ${pasto(251, 26, { y: 388, alto: 16, color: '#4c4a3e' })}`,
  );

/* 32 · Los doce espías -------------------------------------------------- */
const espias = () =>
  documento(
    'Dos espías vuelven con un racimo enorme de uvas',
    `${cielo(['#ffd7a2', '#ffefcd'])}<linearGradient id="valleEspias" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9c477"/><stop offset="1" stop-color="#84a35f"/></linearGradient>`,
    `${fondo()}
    ${sol({ x: 470, y: 104, r: 44, giro: 120 })}
    ${colina(248, '#b3cf85', { amp: 22, fase: 0.9 })}
    ${colina(284, '#9dbb72', { amp: 17, fase: 2.4 })}
    ${suelo(318, '#8fae66', { amp: 8 })}
    <path d="M 250 400 C 260 360 306 330 350 300 L 392 306 C 356 338 320 366 330 400 Z" fill="#7fd0e2" opacity=".7"/>
    ${arbol(82, 318, 0.78, '#5fae6e', '#3f8552')}
    ${arbol(526, 314, 0.66, '#6fbd7f', '#4b9a63')}
    <g transform="translate(300 356)">
      <path d="M -6 -116 L -6 -6 M 6 -116 L 6 -6" stroke="${C.brown}" stroke-width="5" stroke-linecap="round"/>
      <g class="fl" style="animation-duration:6.6s">
        ${racimo(0, -46, 2.6)}
        <path d="M -6 -112 Q 0 -126 6 -112" stroke="${C.leafDark}" stroke-width="4" fill="none"/>
        <path d="M 8 -104 Q 26 -112 34 -98 Q 20 -90 8 -96 Z" fill="${C.leaf}"/>
      </g>
    </g>
    ${persona({ x: 262, y: 384, s: 0.92, robe: '#4a90cf', robeDark: '#3577b4', skin: C.skin3, pelo: C.hair, pose: 'carry', retraso: -1.4 })}
    ${persona({ x: 340, y: 384, s: 0.92, robe: '#79a86b', robeDark: '#5f8c55', skin: C.skin2, pelo: C.hairSoft, pose: 'carry', retraso: -2.4 })}
    ${persona({ x: 414, y: 390, s: 0.6, robe: '#c9a45e', skin: C.skin1, pelo: C.hair, pose: 'stand', retraso: -3 })}
    ${persona({ x: 192, y: 392, s: 0.56, robe: '#c98f8f', skin: C.skin2, pelo: C.hair, pose: 'stand', retraso: -3.4 })}
    ${pasto(257, 46, { y: 378, alto: 20, color: '#6f9a4f' })}
    ${flor(148, 388, '#f2b04e')}
    ${flor(444, 390, '#f58fa0')}
    ${destello(300, 222, '#fff6d2', 0.5)}`,
  );

/* 33 · Naamán sana ------------------------------------------------------ */
const naaman = () =>
  documento(
    'Naamán sale limpio de las aguas del río Jordán',
    `${cielo(['#cfeaff', '#fff6da'])}<linearGradient id="rioNaaman" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd8e2"/><stop offset="1" stop-color="#3f95bb"/></linearGradient>`,
    `${fondo()}
    ${sol({ x: 110, y: 92, r: 36, giro: 140 })}
    ${nube(340, 70, 0.85, '#ffffff', 0.8, -2)}
    ${nube(486, 104, 0.6, '#ffffff', 0.65, -3.4)}
    ${colina(240, '#b3cf85', { amp: 20, fase: 1.2 })}
    ${suelo(280, '#9dbb72', { amp: 8 })}
    ${palmera(80, 290, 1.05, '#6fae68', '#8d5c3c')}
    ${arbusto(520, 288, 0.62, '#8fbf6e', '#6f9e55')}
    <rect x="0" y="292" width="600" height="108" fill="url(#rioNaaman)"/>
    ${agua(298, 54, '#8fd6e2', '#5aa9c4', { ola: 7 })}
    ${persona({ x: 300, y: 368, s: 1.06, robe: '#c9a45e', robeDark: '#a9873f', skin: C.skin3, pelo: C.hair, barba: true, pose: 'open', retraso: -1.2 })}
    <g class="rp" style="animation-delay:-0.4s"><ellipse cx="300" cy="368" rx="42" ry="12" fill="none" stroke="#dff6ff" stroke-width="3" opacity=".6"/></g>
    <g class="rp" style="animation-delay:-2.2s"><ellipse cx="300" cy="368" rx="42" ry="12" fill="none" stroke="#dff6ff" stroke-width="2.4" opacity=".45"/></g>
    ${persona({ x: 190, y: 382, s: 0.86, robe: '#8a7a5c', robeDark: '#6f6249', skin: C.skin2, pelo: '#d8d2c6', barba: true, pose: 'bless', retraso: -2.4 })}
    ${persona({ x: 430, y: 386, s: 0.7, robe: '#7c8fa0', skin: C.skin1, pelo: C.hair, pose: 'wave', retraso: -3 })}
    ${pez(470, 340, 0.7, '#f2b04e', { retraso: -1.8 })}
    ${pez(120, 352, 0.6, '#f2914e', { retraso: -2.8, voltear: true })}
    <g class="fa" style="animation-delay:-1s"><circle cx="342" cy="250" r="2.6" fill="#dff6ff" opacity=".6"/></g>
    <g class="fa" style="animation-delay:-2.6s"><circle cx="262" cy="236" r="2" fill="#dff6ff" opacity=".5"/></g>
    ${destello(300, 262, '#ffffff', 0.55)}
    ${pasto(263, 30, { y: 292, alto: 18, color: '#6f9a4f' })}`,
  );

/* 34 · Nehemías y el muro ---------------------------------------------- */
const nehemias = () =>
  documento(
    'Nehemías y el pueblo reconstruyen el muro de Jerusalén',
    `${cielo(['#ffd6a2', '#ffeed0'])}<linearGradient id="muroNehemias" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2c391"/><stop offset="1" stop-color="#bfa070"/></linearGradient>`,
    `${fondo()}
    ${sol({ x: 96, y: 90, r: 34, giro: 140 })}
    ${nube(320, 66, 0.8, '#ffffff', 0.75, -2)}
    ${colina(250, '#cfb47f', { amp: 22, fase: 1 })}
    ${colina(286, '#bfa066', { amp: 16, fase: 2.6 })}
    ${suelo(320, '#c9ac72', { amp: 8 })}
    <g transform="translate(330 310)">
      ${muro(0, 0, { ancho: 448, alto: 150, color: '#d3ab72', claro: '#eccf9f', huecos: [[56, 40], [210, 74], [330, 30]] })}
      <path d="M 120 0 L 120 -70 Q 160 -92 200 -70 L 200 0 Z" fill="#8a6238"/>
      <path d="M 134 0 L 134 -64 Q 160 -80 186 -64 L 186 0 Z" fill="#5f4226"/>
      <path d="M 244 0 L 244 -46 L 288 -46 L 288 0 Z" fill="#8a6238"/>
      <path d="M 250 0 L 250 -40 L 282 -40 L 282 0 Z" fill="#5f4226"/>
      <path d="M 214 0 L 252 0 L 252 12 L 214 12 Z" fill="#8a6238" opacity=".6"/>
      <g fill="#b48851">
        <rect x="40" y="-166" width="26" height="18" rx="3"/><rect x="86" y="-166" width="26" height="18" rx="3"/>
        <rect x="300" y="-166" width="26" height="18" rx="3"/><rect x="346" y="-166" width="26" height="18" rx="3"/>
      </g>
      <path d="M 40 -146 L 300 -146" stroke="#a8825a" stroke-width="4" opacity=".6"/>
      <path d="M 60 -110 L 96 -110 M 380 -96 L 420 -96" stroke="#a8825a" stroke-width="3" opacity=".5"/>
    </g>
    <g class="hp">
      <path d="M 152 342 L 152 300" stroke="${C.brown}" stroke-width="4" stroke-linecap="round"/>
      <path d="M 152 302 L 140 300 L 152 296 L 164 300 Z" fill="#b9c1c6"/>
    </g>
    <g class="hp" style="animation-delay:-1.8s">
      <path d="M 470 346 L 470 306" stroke="${C.brown}" stroke-width="4" stroke-linecap="round"/>
      <path d="M 470 308 L 458 306 L 470 302 L 482 306 Z" fill="#b9c1c6"/>
    </g>
    <g transform="translate(300 386) scale(0.55)">
      ${muro(0, 0, { ancho: 120, alto: 52, color: '#d3ab72', claro: '#eccf9f' })}
    </g>
    ${persona({ x: 232, y: 388, s: 0.96, robe: '#4a7fb4', robeDark: '#39699c', skin: C.skin3, pelo: C.hair, barba: true, pose: 'up', retraso: -1.4 })}
    ${persona({ x: 372, y: 390, s: 0.9, robe: '#a888b8', robeDark: '#8d6fa0', skin: C.skin2, pelo: C.hair, pose: 'carry', retraso: -2.4 })}
    <rect x="386" y="336" width="26" height="14" rx="3" fill="#b48851"/>
    ${persona({ x: 434, y: 392, s: 0.72, robe: '#79a86b', skin: C.skin1, pelo: C.hair, pose: 'stand', retraso: -3 })}
    ${persona({ x: 156, y: 394, s: 0.68, robe: '#c9a45e', skin: C.skin2, pelo: C.hairSoft, pose: 'stand', retraso: -3.4 })}
    ${pasto(271, 36, { y: 382, alto: 18, color: '#b09055' })}
    ${destello(410, 196, '#fff6d2', 0.45)}`,
  );

/* 35 · Job confía en Dios ---------------------------------------------- */
const job = () =>
  documento(
    'Job mira el amanecer con confianza después de la tormenta',
    `${cielo(['#f2a97c', '#ffe6b8'])}<radialGradient id="luzJob" cx="50%" cy="60%" r="55%"><stop offset="0" stop-color="#fff6c9" stop-opacity=".9"/><stop offset="1" stop-color="#fff6c9" stop-opacity="0"/></radialGradient>`,
    `${fondo()}
    ${nube(96, 62, 1.1, '#9c8f8a', 0.55, -1.4)}
    ${nube(506, 52, 0.9, '#a89a92', 0.5, -3)}
    <circle cx="300" cy="272" r="122" fill="url(#luzJob)" class="gl"/>
    ${sol({ x: 300, y: 268, r: 50, color: '#ffd98a', halo: '#fff0c4', rayos: true, giro: 100 })}
    ${colina(276, '#b89a70', { amp: 22, fase: 1.3 })}
    ${colina(306, '#a8895f', { amp: 16, fase: 2.8 })}
    ${suelo(338, '#b19168', { amp: 8 })}
    ${arbol(88, 330, 0.62, '#a8b96a', '#87995a')}
    <path d="M 508 342 Q 512 320 506 306 M 526 344 Q 528 322 522 310 M 542 340 Q 544 322 540 312" stroke="#8d9a5c" stroke-width="5" fill="none" stroke-linecap="round" class="sw" style="transform-origin:50% 100%"/>
    ${persona({ x: 300, y: 372, s: 1.12, robe: '#8d7a5c', robeDark: '#73624a', skin: C.skin3, pelo: '#d8d2c6', barba: true, pose: 'up', retraso: -1.2 })}
    ${corazon(300, 274, 0.55, C.coral, { retraso: -1.8, op: 0.9 })}
    ${persona({ x: 186, y: 384, s: 0.9, robe: '#a888b8', robeDark: '#8d6fa0', skin: C.skin2, pelo: C.hair, cabeza: 'velo', pose: 'pray', retraso: -2.6 })}
    ${oveja(430, 384, 0.62, { retraso: -1.6 })}
    ${oveja(476, 390, 0.54, { retraso: -2.8 })}
    ${paloma(220, 196, 0.6, { retraso: -1.4 })}
    ${paloma(392, 178, 0.5, { retraso: -2.6, op: 0.9 })}
    ${pasto(283, 40, { y: 382, alto: 20, color: '#98804f' })}
    ${flor(148, 392, '#f2b04e')}
    ${destello(300, 214, '#fff9dd', 0.7)}`,
  );

/* 36 · El Señor es mi pastor ------------------------------------------- */
const pastor = () =>
  documento(
    'El buen pastor guía a sus ovejas junto a aguas tranquilas',
    `${cielo(['#bfe6ff', '#fff7dd'])}<linearGradient id="prado" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9d68a"/><stop offset="1" stop-color="#82b566"/></linearGradient>`,
    `${fondo()}
    ${sol({ x: 470, y: 92, r: 40, giro: 130 })}
    ${nube(150, 74, 0.9, '#ffffff', 0.85, -1.4)}
    ${nube(340, 108, 0.6, '#ffffff', 0.7, -3)}
    <path d="M -20 254 Q 120 206 250 234 Q 380 262 500 218 Q 560 198 620 216 L 620 400 L -20 400 Z" fill="url(#prado)"/>
    ${colina(286, '#9ccb7f', { amp: 14, fase: 2.2 })}
    <path d="M 236 400 C 236 364 320 348 366 322 C 388 310 388 296 380 286 L 414 288 C 424 304 414 322 392 336 C 348 362 306 380 312 400 Z" fill="#7fd0e2" opacity=".9"/>
    <path d="M 252 398 C 254 366 330 350 374 326" stroke="#d9f6f2" stroke-width="3" fill="none" opacity=".6" class="wv"/>
    ${destello(330, 330, '#ffffff', 0.55)}
    ${destello(370, 312, '#ffffff', 0.4)}
    ${arbol(96, 314, 0.9, '#6fbd7f', '#4b9a63')}
    ${arbol(548, 300, 0.72, '#7cc98a', '#529f68')}
    ${arbusto(196, 348, 0.62, '#7cc98a', '#529f68')}
    ${persona({ x: 196, y: 368, s: 1.08, robe: '#8a6fae', robeDark: '#71589a', skin: C.skin3, pelo: C.hairSoft, barba: true, pose: 'up', retraso: -1 })}
    <path d="M 227 292 L 238 368" stroke="${C.brown}" stroke-width="5" stroke-linecap="round"/>
    <path d="M 238 288 Q 248 280 246 270" stroke="${C.brown}" stroke-width="4" fill="none" stroke-linecap="round"/>
    ${oveja(300, 376, 0.8, { retraso: -1.4, mirando: 1 })}
    ${oveja(372, 386, 0.66, { retraso: -2.4 })}
    ${oveja(462, 374, 0.72, { retraso: -3, mirando: -1 })}
    ${oveja(514, 390, 0.56, { retraso: -2 })}
    ${oveja(136, 392, 0.52, { retraso: -3.4 })}
    ${pasto(311, 54, { y: 376, alto: 22, color: '#6f9a4f' })}
    ${flor(258, 392, '#f58fa0')}
    ${flor(422, 392, '#f2b04e')}
    ${flor(482, 396, '#8d6fc4')}
    ${mariposa(250, 250, 0.75, C.gold, -1.2)}
    ${paloma(392, 160, 0.55, { retraso: -2 })}
    ${destello(300, 200, '#fff9dd', 0.5)}`,
  );

/* 37 · Isaías es llamado ------------------------------------------------ */
const isaias = () =>
  documento(
    'Isaías responde al llamado de Dios junto al altar',
    `${cielo(['#e8ddc4', '#f8ecd6'])}<radialGradient id="luzIsaias" cx="50%" cy="30%" r="70%"><stop offset="0" stop-color="#fff8d8" stop-opacity=".95"/><stop offset="1" stop-color="#fff8d8" stop-opacity="0"/></radialGradient><linearGradient id="pisoTemplo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2cfae"/><stop offset="1" stop-color="#c9ae84"/></linearGradient>`,
    `${fondo()}
    ${rayosLuz(300, 0, { ancho: 300, alto: 300, color: '#fff6c9', op: 0.26, giro: 60 })}
    <circle cx="300" cy="196" r="132" fill="url(#luzIsaias)" class="gl"/>
    <rect x="0" y="330" width="600" height="70" fill="url(#pisoTemplo)"/>
    <path d="M 0 330 H 600 M 0 348 H 600" stroke="#b89a6f" stroke-width="2" opacity=".5"/>
    <g fill="#e9dcc1">
      <rect x="44" y="66" width="48" height="264" rx="4"/><rect x="22" y="58" width="92" height="18" rx="6"/><rect x="22" y="324" width="92" height="14" rx="5"/>
      <rect x="508" y="66" width="48" height="264" rx="4"/><rect x="486" y="58" width="92" height="18" rx="6"/><rect x="486" y="324" width="92" height="14" rx="5"/>
    </g>
    <path d="M 68 -20 L 68 330 M 532 -20 L 532 330" stroke="#d9c8a8" stroke-width="4" opacity=".55"/>
    <path d="M 118 330 L 118 128 Q 190 84 262 128 L 262 330 Z" fill="#cbb896" opacity=".5"/>
    <path d="M 338 330 L 338 128 Q 410 84 482 128 L 482 330 Z" fill="#cbb896" opacity=".5"/>
    <path d="M 132 330 L 132 136 Q 190 100 248 136 L 248 330 Z" fill="#e4d4b4" opacity=".55"/>
    <path d="M 352 330 L 352 136 Q 410 100 468 136 L 468 330 Z" fill="#e4d4b4" opacity=".55"/>
    <path d="M 200 330 L 200 190 Q 300 132 400 190 L 400 330 Z" fill="#efe0c2" opacity=".75"/>
    <path d="M 214 330 L 214 196 Q 300 144 386 196 L 386 330 Z" fill="#fff3d8" opacity=".8"/>
    <g transform="translate(300 316)">
      <path d="M -46 14 L 46 14 L 38 0 L -38 0 Z" fill="#b0873f"/>
      <rect x="-30" y="-28" width="60" height="28" rx="4" fill="#c9a45e"/>
      <path d="M -30 -28 L -22 -34 L 22 -34 L 30 -28 Z" fill="#d9b46a"/>
      ${llama(0, -24, 1.05, { retraso: -1 })}
      <circle cx="0" cy="-26" r="46" fill="#ffe9a0" opacity=".25" class="gl"/>
    </g>
    ${persona({ x: 300, y: 366, s: 1.02, robe: '#8d6fc4', robeDark: '#745aa6', skin: C.skin3, pelo: C.hair, barba: true, pose: 'up', retraso: -1.4 })}
    ${persona({ x: 208, y: 378, s: 0.8, robe: '#c9a45e', skin: C.skin2, pelo: C.hair, pose: 'pray', retraso: -2.4 })}
    ${persona({ x: 392, y: 378, s: 0.8, robe: '#c98f8f', skin: C.skin1, pelo: C.hairSoft, pose: 'pray', retraso: -3 })}
    ${paloma(300, 154, 0.9, { retraso: -1.8 })}
    <g class="rz" style="animation-delay:-1s"><circle cx="268" cy="228" r="4" fill="#ffd88a"/></g>
    <g class="rz" style="animation-delay:-3s"><circle cx="330" cy="222" r="3.2" fill="#ffe9a0"/></g>
    <g class="rz" style="animation-delay:-4.6s"><circle cx="300" cy="238" r="2.6" fill="#fff3c4"/></g>
    ${destello(232, 196, '#fff9dd', 0.6)}
    ${destello(372, 204, '#fff9dd', 0.5)}`,
  );

/* 38 · Ama a Dios de corazón ------------------------------------------- */
const amar = () =>
  documento(
    'Una familia ama a Dios de corazón en su casa',
    `${cielo(['#ffd9b8', '#fff2d8'])}<linearGradient id="cespedAmar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9d68a"/><stop offset="1" stop-color="#82b566"/></linearGradient>`,
    `${fondo()}
    ${sol({ x: 300, y: 98, r: 42, giro: 120, op: 0.9 })}
    <circle cx="300" cy="190" r="140" fill="#ffe9a0" opacity=".3" class="gl"/>
    ${nube(110, 80, 0.76, '#ffffff', 0.8, -1.6)}
    ${nube(492, 92, 0.62, '#ffffff', 0.72, -3.2)}
    <path d="M -20 262 Q 120 220 250 244 Q 380 268 500 228 Q 560 210 620 226 L 620 400 L -20 400 Z" fill="url(#cespedAmar)"/>
    ${colina(300, '#93c477', { amp: 14, fase: 2.2 })}
    ${casa(300, 352, 1.12, { pared: '#f4e6c8', techo: '#c9704f', puerta: '#8d5c3c' })}
    <g transform="translate(300 236)">
      <circle r="42" fill="#ffe9a0" opacity=".3" class="gl"/>
      ${corazon(0, 0, 1.25, C.coral, { retraso: -1 })}
    </g>
    ${corazon(238, 182, 0.44, C.orange, { retraso: -2.2, op: 0.9 })}
    ${corazon(360, 170, 0.5, C.red, { retraso: -3.2, op: 0.9 })}
    ${corazon(300, 156, 0.34, C.purple, { retraso: -4, op: 0.85 })}
    ${arbol(72, 320, 0.78, '#6fbd7f', '#4b9a63')}
    ${arbol(534, 322, 0.66, '#7cc98a', '#529f68')}
    ${persona({ x: 236, y: 384, s: 1.0, robe: '#c96f6f', robeDark: '#ac5858', skin: C.skin2, pelo: C.hair, barba: true, pose: 'open', retraso: -1.6 })}
    ${persona({ x: 300, y: 388, s: 0.92, robe: '#8fa8bd', robeDark: '#7690a6', skin: C.skin1, pelo: C.hairSoft, cabeza: 'velo', pose: 'pray', retraso: -2.4 })}
    ${persona({ x: 362, y: 388, s: 0.62, robe: '#f2b04e', skin: C.skin1, pelo: '#a5643a', pose: 'wave', retraso: -3 })}
    ${persona({ x: 408, y: 392, s: 0.54, robe: '#8d6fc4', skin: C.skin3, pelo: C.hair, pose: 'stand', retraso: -3.6 })}
    ${pasto(349, 46, { y: 386, alto: 20, color: '#6f9a4f' })}
    ${flor(176, 392, '#f58fa0')}
    ${flor(464, 394, '#f2b04e')}
    ${oveja(120, 390, 0.5, { retraso: -2 })}
    ${destello(258, 176, '#fff9dd', 0.55)}`,
  );

/* 39 · Confía de todo corazón ------------------------------------------ */
const confiar = () =>
  documento(
    'Un niño camina confiado con su brújula y su mochila',
    `${cielo(['#c9ecff', '#fff6da'])}<linearGradient id="sendaConfia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9c49a"/><stop offset="1" stop-color="#bfa377"/></linearGradient>`,
    `${fondo()}
    ${sol({ x: 480, y: 92, r: 40, giro: 120 })}
    ${nube(130, 76, 0.8, '#ffffff', 0.82, -1.6)}
    ${nube(320, 106, 0.55, '#ffffff', 0.66, -3.2)}
    <path d="M -20 250 Q 120 204 250 232 Q 380 260 500 214 Q 560 194 620 212 L 620 400 L -20 400 Z" fill="#a9d68a"/>
    ${colina(288, '#93c477', { amp: 14, fase: 2.4 })}
    <path d="M -20 400 C 120 366 220 356 300 342 C 380 356 480 366 620 400 Z" fill="url(#sendaConfia)" opacity=".95"/>
    <path d="M 300 400 C 306 380 300 362 300 342" stroke="#e6d3a8" stroke-width="4" fill="none" opacity=".7"/>
    ${arbol(84, 312, 0.8, '#6fbd7f', '#4b9a63')}
    ${arbol(528, 306, 0.72, '#7cc98a', '#529f68')}
    ${arbusto(196, 340, 0.56, '#7cc98a', '#529f68')}
    ${persona({ x: 300, y: 366, s: 1.14, robe: '#4a90cf', robeDark: '#3577b4', skin: C.skin1, pelo: '#a5643a', pose: 'walk', retraso: -1 })}
    <path d="M 272 322 Q 250 316 246 296" stroke="${C.blueDeep}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <g transform="translate(246 292)">
      <circle r="13" fill="#d9b46a"/>
      <circle r="10" fill="#fff6da"/>
      <g class="nd" style="transform-origin:50% 50%">
        <path d="M 0 -7 L 3 3 L 0 1 L -3 3 Z" fill="${C.coral}"/>
      </g>
      <circle r="1.6" fill="${C.brownDark}"/>
    </g>
    ${corazon(300, 240, 0.55, C.coral, { retraso: -1.6, op: 0.9 })}
    ${corazon(266, 220, 0.36, C.orange, { retraso: -2.8, op: 0.8 })}
    ${arbol(410, 330, 0.5, '#7cc98a', '#529f68')}
    <path d="M 410 340 L 410 300" stroke="${C.brown}" stroke-width="3"/>
    <path d="M 410 312 L 434 306" stroke="${C.brown}" stroke-width="3"/>
    <g transform="translate(436 306)">
      <path d="M 0 0 L 14 -6 L 14 6 Z" fill="#f2b04e"/>
      <circle cx="0" cy="0" r="2" fill="${C.brownDark}"/>
    </g>
    ${pasto(359, 44, { y: 382, alto: 20, color: '#6f9a4f' })}
    ${flor(214, 386, '#f58fa0')}
    ${flor(372, 392, '#8d6fc4')}
    ${mariposa(212, 236, 0.7, C.gold, -1.4)}
    ${paloma(404, 168, 0.5, { retraso: -2.2 })}
    ${destello(300, 202, '#fff9dd', 0.55)}`,
  );

export const escenas3 = {
  'la-casa-sobre-la-roca': roca,
  'adan-y-eva': adanEva,
  'debora-sirve-con-valentia': debora,
  'bautismo-de-jesus': bautismo,
  'gedeon-y-los-300': gedeon,
  'los-doce-espias': espias,
  'naaman-sana': naaman,
  'nehemias-y-el-muro': nehemias,
  'job-confia-en-dios': job,
  'el-senor-es-mi-pastor': pastor,
  'isaias-es-llamado': isaias,
  'ama-a-dios-de-corazon': amar,
  'confia-de-todo-corazon': confiar,
};
