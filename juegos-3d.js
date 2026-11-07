/**
 * juegos-3d.js · «El buen pastor» — el juego 3D de /juegos/
 * -----------------------------------------------------------------------------
 * Un campo low-poly, un pastor, cinco ovejas perdidas y un redil. Se juega con
 * flechas/WASD, con el joystick del teléfono o tocando el pasto para caminar.
 *
 * Reglas de la casa que este archivo respeta:
 *   - Nada de CDN: Three.js se sirve desde /vendor/ y se descarga SOLO cuando
 *     alguien pulsa «Jugar en 3D» (import() perezoso), así quien entra a la
 *     ruleta no paga los 700 KB del motor.
 *   - Nada de perder: no hay tiempo límite, vidas ni eliminados. Al encontrar
 *     una oveja se celebra; al llegar al redil, se lee Lucas 15:6.
 *   - prefers-reduced-motion: sin vaivenes de cámara, sin latidos de luz y sin
 *     saltitos. El juego sigue siendo jugable y comprensible.
 *   - Todo el texto visible está en el HTML; este archivo solo dibuja y mueve.
 *   - El audio se sintetiza con WebAudio (ni un MP3): campanitas y balidos
 *     suaves que se pueden apagar.
 *
 * Para las pruebas sin navegador se exportan `alturaTerreno`, las posiciones
 * de las ovejas y `construirMundo`: `tools/probar-juego-3d.mjs` arma la escena
 * completa con Three.js en Node y comprueba que no haya NaN ni piezas sueltas.
 */

export const TOTAL_OVEJAS = 5;
export const REFERENCIA = 'Lucas 15:4-7';

const RUTA_THREE = '/vendor/three.module.min.js?v=180';
const RADIO_CAMPO = 41;
const REDIL = Object.freeze({ x: 0, z: -28, radio: 7.6, puerta: 0.42 });
const VEL_PASTOR = 8.5;
const VEL_OVEJA = 10.5;
const RADIO_RECOGIDA = 3.4;
const ALTURA_CAMARA = 22;
const DIST_CAMARA = 17.5;

/** Colinas suaves del campo. La misma función dibuja el suelo y calcula los pies. */
export function alturaTerreno(x, z) {
  return Math.sin(x * 0.08) * 0.9
    + Math.cos(z * 0.07) * 0.8
    + Math.sin((x + z) * 0.045) * 0.6
    + Math.cos((x - z) * 0.06) * 0.35;
}

/**
 * Mantiene a un personaje dentro del campo y del otro lado de la cerca.
 * Mutá `p` ({x, z}) y usa `anterior` para saber de qué lado venía: así nadie
 * atraviesa la cerca, pero la puerta del redil queda abierta.
 */
export function ajustarAlCampo(p, anterior) {
  const radio = Math.hypot(p.x, p.z);
  if (radio > RADIO_CAMPO) {
    p.x = (p.x / radio) * RADIO_CAMPO;
    p.z = (p.z / radio) * RADIO_CAMPO;
  }
  const dx = p.x - REDIL.x;
  const dz = p.z - REDIL.z;
  const distancia = Math.hypot(dx, dz);
  if (distancia < 0.001) return p;
  const enBanda = distancia > REDIL.radio - 0.8 && distancia < REDIL.radio + 0.8;
  if (!enBanda) return p;
  const angulo = Math.atan2(dx, dz);
  if (Math.abs(angulo) <= REDIL.puerta) return p; // por la puerta se pasa
  const estabaDentro = anterior
    ? Math.hypot(anterior.x - REDIL.x, anterior.z - REDIL.z) < REDIL.radio
    : distancia < REDIL.radio;
  const destino = estabaDentro ? REDIL.radio - 0.8 : REDIL.radio + 0.8;
  p.x = REDIL.x + (dx / distancia) * destino;
  p.z = REDIL.z + (dz / distancia) * destino;
  return p;
}

/** Generador pseudoaleatorio con semilla: el campo es distinto en cada partida, pero reproducible en las pruebas. */
function azar(semilla) {
  let estado = semilla >>> 0;
  return () => {
    estado = (estado * 1664525 + 1013904223) >>> 0;
    return estado / 4294967296;
  };
}

/**
 * Reparte las ovejas lejos del redil, del punto de salida y entre ellas.
 * Se usa al construir el mundo y al reiniciar la partida.
 */
export function posicionesDeOvejas(semilla = 20261107) {
  const rnd = azar(semilla);
  const puntos = [];
  const salida = { x: 0, z: -16 };
  let intentos = 0;
  while (puntos.length < TOTAL_OVEJAS && intentos < 800) {
    intentos++;
    const angulo = rnd() * Math.PI * 2;
    const radio = 14 + rnd() * 20; // entre 14 y 34 del centro
    const x = Math.cos(angulo) * radio;
    const z = Math.sin(angulo) * radio;
    if (Math.hypot(x - REDIL.x, z - REDIL.z) < 16) continue; // lejos del redil
    if (Math.hypot(x - salida.x, z - salida.z) < 13) continue; // lejos de la salida
    if (puntos.some((p) => Math.hypot(p.x - x, p.z - z) < 11)) continue; // separadas
    puntos.push({ x, z });
  }
  // Si la semilla fue muy tacaña, completa en círculo sin dejar huecos.
  while (puntos.length < TOTAL_OVEJAS) {
    const angulo = (puntos.length / TOTAL_OVEJAS) * Math.PI * 2;
    puntos.push({ x: Math.cos(angulo) * 28, z: Math.sin(angulo) * 28 });
  }
  return puntos;
}

/* --------------------------------------------------------------------------
 * Construcción del mundo. Recibe Three.js ya cargado para que este archivo
 * se pueda probar en Node sin navegador.
 * ----------------------------------------------------------------------- */
export function construirMundo(THREE, opciones = {}) {
  const semilla = Number.isFinite(opciones.semilla) ? opciones.semilla : 20261107;
  const rnd = azar(semilla + 17);

  const escena = new THREE.Scene();
  escena.background = new THREE.Color('#bfe3f1');
  escena.fog = new THREE.Fog('#c6e6f1', 58, 108);

  const mat = {
    tunica: new THREE.MeshStandardMaterial({ color: '#f6eed7', roughness: 0.95, flatShading: true }),
    manto: new THREE.MeshStandardMaterial({ color: '#5b8fd6', roughness: 0.92, flatShading: true }),
    piel: new THREE.MeshStandardMaterial({ color: '#e6b489', roughness: 0.85, flatShading: true }),
    pelo: new THREE.MeshStandardMaterial({ color: '#4b3527', roughness: 1, flatShading: true }),
    paja: new THREE.MeshStandardMaterial({ color: '#e3c680', roughness: 1, flatShading: true }),
    madera: new THREE.MeshStandardMaterial({ color: '#8a5f3c', roughness: 1, flatShading: true }),
    maderaOscura: new THREE.MeshStandardMaterial({ color: '#6b472d', roughness: 1, flatShading: true }),
    lana: new THREE.MeshStandardMaterial({ color: '#fcf8ec', roughness: 1, flatShading: true }),
    ovejaOscuro: new THREE.MeshStandardMaterial({ color: '#54463a', roughness: 1, flatShading: true }),
    hoja: [
      new THREE.MeshStandardMaterial({ color: '#5da45c', roughness: 1, flatShading: true }),
      new THREE.MeshStandardMaterial({ color: '#6cb268', roughness: 1, flatShading: true }),
      new THREE.MeshStandardMaterial({ color: '#4f9452', roughness: 1, flatShading: true }),
    ],
    roca: new THREE.MeshStandardMaterial({ color: '#9aa3a4', roughness: 1, flatShading: true }),
    agua: new THREE.MeshStandardMaterial({ color: '#7fc6e0', roughness: 0.35, flatShading: true }),
    heno: new THREE.MeshStandardMaterial({ color: '#e0bc61', roughness: 1, flatShading: true }),
    colina: new THREE.MeshStandardMaterial({ color: '#7fae7d', roughness: 1, flatShading: true }),
    nube: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, flatShading: true, transparent: true, opacity: 0.94 }),
    haz: new THREE.MeshBasicMaterial({ color: '#ffe9a3', transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false }),
    aro: new THREE.MeshBasicMaterial({ color: '#ffe9a3', transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }),
  };

  const geo = {
    tronco: new THREE.CylinderGeometry(0.26, 0.34, 2.2, 6),
    copaA: new THREE.ConeGeometry(1.6, 2.4, 7),
    copaB: new THREE.ConeGeometry(1.15, 1.8, 7),
    roca: new THREE.IcosahedronGeometry(0.9, 0),
    arbusto: new THREE.SphereGeometry(0.75, 7, 5),
    mata: new THREE.ConeGeometry(0.09, 0.55, 3),
    flor: new THREE.SphereGeometry(0.13, 6, 4),
    nube: new THREE.SphereGeometry(1, 7, 5),
    poste: new THREE.CylinderGeometry(0.13, 0.15, 1.5, 6),
    barda: new THREE.BoxGeometry(1, 0.1, 0.09),
    comedero: new THREE.BoxGeometry(2.2, 0.5, 0.9),
    agua: new THREE.BoxGeometry(1.95, 0.08, 0.66),
    heno: new THREE.CylinderGeometry(0.55, 0.55, 1.1, 9),
    cuerpoPastor: new THREE.CylinderGeometry(0.42, 0.8, 1.7, 8),
    cabezaPastor: new THREE.SphereGeometry(0.36, 10, 8),
    alaSombrero: new THREE.CylinderGeometry(0.62, 0.64, 0.08, 12),
    copaSombrero: new THREE.CylinderGeometry(0.3, 0.38, 0.4, 12),
    brazo: new THREE.CylinderGeometry(0.1, 0.1, 0.7, 6),
    cayado: new THREE.CylinderGeometry(0.05, 0.06, 2.5, 6),
    gancho: new THREE.TorusGeometry(0.2, 0.05, 5, 10, Math.PI * 1.15),
    lana: new THREE.IcosahedronGeometry(0.9, 1),
    cabezaOveja: new THREE.SphereGeometry(0.34, 9, 7),
    oreja: new THREE.SphereGeometry(0.15, 6, 4),
    pata: new THREE.CylinderGeometry(0.09, 0.09, 0.7, 5),
    cola: new THREE.SphereGeometry(0.22, 6, 4),
    haz: new THREE.CylinderGeometry(0.4, 1.5, 7, 8, 1, true),
    aro: new THREE.RingGeometry(1.05, 1.45, 18),
  };

  const enElSuelo = (objeto, x, z, desfase = 0) => {
    objeto.position.set(x, alturaTerreno(x, z) + desfase, z);
    return objeto;
  };
  const sombras = (objeto) => {
    objeto.castShadow = true;
    objeto.receiveShadow = true;
    return objeto;
  };

  /* ------------------------------- Cielo y luz ---------------------------- */
  escena.add(new THREE.HemisphereLight('#e8f7ff', '#7ea45c', 1.05));
  const sol = new THREE.DirectionalLight('#fff4d6', 1.5);
  sol.position.set(18, 32, 16);
  sol.castShadow = true;
  sol.shadow.mapSize.set(1024, 1024);
  sol.shadow.camera.near = 4;
  sol.shadow.camera.far = 90;
  sol.shadow.camera.left = -24;
  sol.shadow.camera.right = 24;
  sol.shadow.camera.top = 24;
  sol.shadow.camera.bottom = -24;
  sol.shadow.bias = -0.0009;
  escena.add(sol, sol.target);

  /* --------------------------------- Suelo -------------------------------- */
  const planoBase = new THREE.PlaneGeometry(150, 150, 70, 70);
  planoBase.rotateX(-Math.PI / 2);
  const posiciones = planoBase.attributes.position;
  for (let i = 0; i < posiciones.count; i++) {
    posiciones.setY(i, alturaTerreno(posiciones.getX(i), posiciones.getZ(i)));
  }
  const plano = planoBase.toNonIndexed();
  planoBase.dispose();
  const vertices = plano.attributes.position;
  const colores = new Float32Array(vertices.count * 3);
  const verdes = ['#86c26c', '#79bb63', '#6db35c', '#93cc7a', '#81bf69'].map((hex) => new THREE.Color(hex));
  const arena = new THREE.Color('#e7d6a9');
  const color = new THREE.Color();
  for (let i = 0; i < vertices.count; i += 3) {
    const cx = (vertices.getX(i) + vertices.getX(i + 1) + vertices.getX(i + 2)) / 3;
    const cz = (vertices.getZ(i) + vertices.getZ(i + 1) + vertices.getZ(i + 2)) / 3;
    color.copy(verdes[Math.floor(rnd() * verdes.length)]);
    const alRedil = Math.hypot(cx - REDIL.x, cz - REDIL.z);
    if (alRedil < 9.5) color.lerp(arena, alRedil < 7 ? 0.85 : 0.45);
    color.offsetHSL(0, 0, alturaTerreno(cx, cz) * 0.012);
    for (let k = 0; k < 3; k++) {
      colores[(i + k) * 3] = color.r;
      colores[(i + k) * 3 + 1] = color.g;
      colores[(i + k) * 3 + 2] = color.b;
    }
  }
  plano.setAttribute('color', new THREE.BufferAttribute(colores, 3));
  plano.computeVertexNormals();
  const terreno = new THREE.Mesh(plano, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 }));
  terreno.receiveShadow = true;
  escena.add(terreno);

  /* ------------------------------- Vegetación ----------------------------- */
  const arboles = new THREE.Group();
  for (let i = 0; i < 22; i++) {
    const angulo = (i / 22) * Math.PI * 2 + rnd() * 0.22;
    const radio = 33 + rnd() * 13;
    const x = Math.cos(angulo) * radio;
    const z = Math.sin(angulo) * radio;
    const arbol = new THREE.Group();
    const tronco = sombras(new THREE.Mesh(geo.tronco, mat.madera));
    tronco.position.y = 1.1;
    const copa1 = sombras(new THREE.Mesh(geo.copaA, mat.hoja[i % mat.hoja.length]));
    copa1.position.y = 2.9;
    const copa2 = sombras(new THREE.Mesh(geo.copaB, mat.hoja[(i + 1) % mat.hoja.length]));
    copa2.position.y = 4.05;
    arbol.add(tronco, copa1, copa2);
    arbol.scale.setScalar(0.85 + rnd() * 0.7);
    arbol.rotation.y = rnd() * Math.PI * 2;
    arboles.add(enElSuelo(arbol, x, z));
  }
  escena.add(arboles);

  // Colinas lejanas: dan profundidad y la niebla se las come poco a poco.
  for (let i = 0; i < 9; i++) {
    const angulo = (i / 9) * Math.PI * 2 + 0.35;
    const radio = 64 + rnd() * 16;
    const colina = new THREE.Mesh(new THREE.ConeGeometry(14 + rnd() * 10, 7 + rnd() * 7, 7), mat.colina);
    colina.position.set(Math.cos(angulo) * radio, -1.5, Math.sin(angulo) * radio);
    escena.add(colina);
  }

  for (let i = 0; i < 16; i++) {
    const angulo = rnd() * Math.PI * 2;
    const radio = 18 + rnd() * 24;
    const roca = new THREE.Mesh(geo.roca, mat.roca);
    roca.scale.set(0.6 + rnd() * 0.9, 0.5 + rnd() * 0.8, 0.6 + rnd() * 0.9);
    roca.rotation.set(rnd(), rnd() * Math.PI, rnd());
    escena.add(enElSuelo(sombras(roca), Math.cos(angulo) * radio, Math.sin(angulo) * radio, 0.2));
  }

  for (let i = 0; i < 14; i++) {
    const angulo = rnd() * Math.PI * 2;
    const radio = 16 + rnd() * 26;
    const arbusto = new THREE.Mesh(geo.arbusto, mat.hoja[i % mat.hoja.length]);
    arbusto.scale.setScalar(0.7 + rnd() * 0.8);
    escena.add(enElSuelo(sombras(arbusto), Math.cos(angulo) * radio, Math.sin(angulo) * radio, 0.3));
  }

  // Pasto y flores: dos mallas instanciadas para que sean cientos y costar dos.
  const matriz = new THREE.Matrix4();
  const punto = new THREE.Vector3();
  const escala = new THREE.Vector3();
  const giro = new THREE.Quaternion();
  const ejeY = new THREE.Vector3(0, 1, 0);
  const dentroDelRedil = (x, z) => Math.hypot(x - REDIL.x, z - REDIL.z) < 9.5;
  const puntoAlAzar = () => {
    let x = 0;
    let z = 0;
    let intentos = 0;
    do {
      const angulo = rnd() * Math.PI * 2;
      const radio = Math.sqrt(rnd()) * 33;
      x = Math.cos(angulo) * radio;
      z = Math.sin(angulo) * radio;
      intentos++;
    } while (dentroDelRedil(x, z) && intentos < 14);
    return { x, z };
  };

  const matas = new THREE.InstancedMesh(geo.mata, new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true }), 700);
  const verdesPasto = ['#7cbb63', '#6cae58', '#8ccb74', '#5f9f50'].map((hex) => new THREE.Color(hex));
  for (let i = 0; i < 700; i++) {
    const { x, z } = puntoAlAzar();
    punto.set(x, alturaTerreno(x, z) + 0.22, z);
    escala.setScalar(0.6 + rnd() * 0.9);
    giro.setFromAxisAngle(ejeY, rnd() * Math.PI * 2);
    matriz.compose(punto, giro, escala);
    matas.setMatrixAt(i, matriz);
    matas.setColorAt(i, verdesPasto[Math.floor(rnd() * verdesPasto.length)]);
  }
  matas.instanceMatrix.needsUpdate = true;
  if (matas.instanceColor) matas.instanceColor.needsUpdate = true;
  escena.add(matas);

  const flores = new THREE.InstancedMesh(geo.flor, new THREE.MeshStandardMaterial({ roughness: 0.9, flatShading: true }), 150);
  const coloresFlor = ['#fffdf5', '#ffd9e6', '#ffe9a3', '#d9c7f2'].map((hex) => new THREE.Color(hex));
  for (let i = 0; i < 150; i++) {
    const { x, z } = puntoAlAzar();
    punto.set(x, alturaTerreno(x, z) + 0.42, z);
    escala.setScalar(0.8 + rnd() * 0.8);
    matriz.compose(punto, giro, escala);
    flores.setMatrixAt(i, matriz);
    flores.setColorAt(i, coloresFlor[Math.floor(rnd() * coloresFlor.length)]);
  }
  flores.instanceMatrix.needsUpdate = true;
  if (flores.instanceColor) flores.instanceColor.needsUpdate = true;
  escena.add(flores);

  // Nubes de algodón: puro adorno, no reciben ni proyectan sombras.
  const nubes = new THREE.Group();
  for (let i = 0; i < 7; i++) {
    const nube = new THREE.Group();
    const piezas = 3 + Math.floor(rnd() * 3);
    for (let p = 0; p < piezas; p++) {
      const bola = new THREE.Mesh(geo.nube, mat.nube);
      bola.position.set(p * 1.5 - piezas * 0.7, rnd() * 0.5, rnd() * 1.2 - 0.6);
      bola.scale.setScalar(0.9 + rnd() * 0.8);
      nube.add(bola);
    }
    nube.position.set((rnd() - 0.5) * 150, 27 + rnd() * 9, (rnd() - 0.5) * 130);
    nube.scale.setScalar(1.6 + rnd());
    nubes.add(nube);
  }
  escena.add(nubes);

  /* --------------------------------- Redil -------------------------------- */
  const redil = new THREE.Group();
  const postes = [];
  const PASO = 0.28;
  for (let angulo = REDIL.puerta; angulo <= Math.PI * 2 - REDIL.puerta + 0.0001; angulo += PASO) {
    const x = REDIL.x + Math.sin(angulo) * REDIL.radio;
    const z = REDIL.z + Math.cos(angulo) * REDIL.radio;
    const altura = alturaTerreno(x, z);
    const poste = sombras(new THREE.Mesh(geo.poste, mat.maderaOscura));
    poste.position.set(x, altura + 0.72, z);
    redil.add(poste);
    postes.push({ x, z, y: altura });
  }
  for (let i = 0; i < postes.length - 1; i++) {
    const p = postes[i];
    const q = postes[i + 1];
    const dx = q.x - p.x;
    const dz = q.z - p.z;
    const largo = Math.hypot(dx, dz);
    for (const alto of [0.5, 1.02]) {
      const barda = sombras(new THREE.Mesh(geo.barda, mat.madera));
      barda.scale.x = largo;
      barda.position.set((p.x + q.x) / 2, (p.y + q.y) / 2 + alto, (p.z + q.z) / 2);
      barda.rotation.y = Math.atan2(dx, dz) - Math.PI / 2;
      redil.add(barda);
    }
  }
  // Postes de la puerta, un poco más gruesos para que se vea por dónde entrar.
  for (const signo of [-1, 1]) {
    const angulo = signo * REDIL.puerta;
    const x = REDIL.x + Math.sin(angulo) * REDIL.radio;
    const z = REDIL.z + Math.cos(angulo) * REDIL.radio;
    const altura = alturaTerreno(x, z);
    const poste = sombras(new THREE.Mesh(geo.poste, mat.maderaOscura));
    poste.scale.set(1.3, 1.2, 1.3);
    poste.position.set(x, altura + 0.86, z);
    redil.add(poste);
  }
  // Comedero con agua y pacas de heno dentro del redil.
  const comedero = sombras(new THREE.Mesh(geo.comedero, mat.madera));
  enElSuelo(comedero, REDIL.x + 3.1, REDIL.z - 2.4, 0.25);
  redil.add(comedero);
  const agua = new THREE.Mesh(geo.agua, mat.agua);
  enElSuelo(agua, REDIL.x + 3.1, REDIL.z - 2.4, 0.44);
  redil.add(agua);
  for (let i = 0; i < 3; i++) {
    const paca = sombras(new THREE.Mesh(geo.heno, mat.heno));
    paca.rotation.z = Math.PI / 2;
    paca.rotation.y = rnd() * Math.PI;
    enElSuelo(paca, REDIL.x - 3.2 + i * 0.7, REDIL.z + 1.4, 0.55);
    redil.add(paca);
  }
  escena.add(redil);

  /* -------------------------------- Pastor -------------------------------- */
  const pastor = new THREE.Group();
  const tunica = sombras(new THREE.Mesh(geo.cuerpoPastor, mat.tunica));
  tunica.position.y = 0.86;
  const manto = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.66, 0.62, 8, 1, true), mat.manto);
  manto.position.y = 1.36;
  const cabeza = sombras(new THREE.Mesh(geo.cabezaPastor, mat.piel));
  cabeza.position.y = 1.97;
  const pelo = new THREE.Mesh(new THREE.SphereGeometry(0.375, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat.pelo);
  pelo.position.y = 1.98;
  const ala = sombras(new THREE.Mesh(geo.alaSombrero, mat.paja));
  ala.position.y = 2.22;
  const copa = sombras(new THREE.Mesh(geo.copaSombrero, mat.paja));
  copa.position.y = 2.45;
  const brazoIzq = new THREE.Mesh(geo.brazo, mat.tunica);
  brazoIzq.position.set(-0.5, 1.32, 0.05);
  brazoIzq.rotation.z = 0.22;
  const brazoDer = new THREE.Mesh(geo.brazo, mat.tunica);
  brazoDer.position.set(0.5, 1.3, 0.18);
  brazoDer.rotation.z = -0.3;
  const cayado = new THREE.Group();
  const palo = sombras(new THREE.Mesh(geo.cayado, mat.madera));
  palo.position.y = 1.25;
  const gancho = sombras(new THREE.Mesh(geo.gancho, mat.madera));
  gancho.position.set(0, 2.47, 0);
  gancho.rotation.z = -0.25;
  cayado.add(palo, gancho);
  cayado.position.set(0.62, 0, 0.22);
  cayado.rotation.z = -0.05;
  pastor.add(tunica, manto, cabeza, pelo, ala, copa, brazoIzq, brazoDer, cayado);
  const alturaSalida = alturaTerreno(0, -16);
  pastor.position.set(0, alturaSalida, -16);
  pastor.rotation.y = Math.PI;
  escena.add(pastor);

  /* -------------------------------- Ovejas -------------------------------- */
  const ovejas = [];
  const puntosOvejas = posicionesDeOvejas(semilla);
  puntosOvejas.forEach((ubicacion, indice) => {
    const grupo = new THREE.Group();
    const cuerpo = sombras(new THREE.Mesh(geo.lana, mat.lana));
    cuerpo.scale.set(1, 0.9, 1.25);
    cuerpo.position.y = 1;
    const cabezaOveja = sombras(new THREE.Mesh(geo.cabezaOveja, mat.ovejaOscuro));
    cabezaOveja.position.set(0, 1.2, 0.95);
    cabezaOveja.scale.set(0.9, 1, 1.2);
    const orejas = [-1, 1].map((lado) => {
      const oreja = new THREE.Mesh(geo.oreja, mat.ovejaOscuro);
      oreja.position.set(lado * 0.3, 1.33, 0.86);
      oreja.scale.set(1.4, 0.7, 1);
      oreja.rotation.z = lado * 0.5;
      return oreja;
    });
    const cola = new THREE.Mesh(geo.cola, mat.lana);
    cola.position.set(0, 1.16, -1);
    const patas = [[-0.34, 0.5], [0.34, 0.5], [-0.34, -0.42], [0.34, -0.42]].map(([px, pz]) => {
      const pata = sombras(new THREE.Mesh(geo.pata, mat.ovejaOscuro));
      pata.position.set(px, 0.55, pz);
      return pata;
    });
    const haz = new THREE.Mesh(geo.haz, mat.haz.clone());
    haz.position.y = 4.1;
    const aro = new THREE.Mesh(geo.aro, mat.aro.clone());
    aro.rotation.x = -Math.PI / 2;
    aro.position.y = 0.14;
    grupo.add(cuerpo, cabezaOveja, cola, ...orejas, ...patas, haz, aro);
    enElSuelo(grupo, ubicacion.x, ubicacion.z);
    grupo.rotation.y = rnd() * Math.PI * 2;
    escena.add(grupo);
    ovejas.push({
      grupo,
      haz,
      aro,
      indice,
      fase: rnd() * Math.PI * 2,
      base: grupo.rotation.y,
      estado: 'perdida',
      destino: new THREE.Vector3(REDIL.x + (indice - 2) * 1.6, 0, REDIL.z + (indice % 2 ? 1.8 : 0.4)),
    });
  });

  return {
    escena,
    terreno,
    pastorGrupo: pastor,
    ovejas,
    redil,
    sol,
    nubes,
    puntosOvejas,
    materiales: mat,
    geometrias: geo,
  };
}

/* --------------------------------------------------------------------------
 * Juego en el navegador
 * ----------------------------------------------------------------------- */
export function iniciarPastor(escenario, opciones = {}) {
  if (!escenario) throw new Error('iniciarPastor necesita el contenedor del juego');

  const buscar = (selector) => escenario.querySelector(selector);
  const poster = buscar('#pastorPoster');
  const cargando = buscar('#pastorCargando');
  const ui = buscar('#pastorUI');
  const final = buscar('#pastorFinal');
  const botonEmpezar = buscar('#pastorStart');
  const mensaje = buscar('#pastorMensaje');
  const pista = buscar('#pastorPista');
  const contador = buscar('#pastorOvejas');
  const panelJuego = escenario.closest('.game-panel');
  const marcador = panelJuego ? panelJuego.querySelector('#pastorScore') : document.getElementById('pastorScore');
  const botonSonido = buscar('#pastorSonido');
  const botonPausa = buscar('#pastorPausa');
  const botonReiniciar = buscar('#pastorReiniciar');
  const botonOtra = buscar('#pastorOtra');
  const botonCerrarFinal = buscar('#pastorCerrarFinal');
  const mapa = buscar('#pastorMapa');
  const joystick = buscar('#pastorJoystick');

  const movimientoReducido = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  let reducido = Boolean(movimientoReducido && movimientoReducido.matches);
  if (movimientoReducido && movimientoReducido.addEventListener) {
    movimientoReducido.addEventListener('change', (evento) => { reducido = evento.matches; });
  }

  let THREE = null;
  let mundo = null;
  let renderer = null;
  let camara = null;
  let canvas = null;
  let raf = 0;
  let arrancado = false;
  let arrancando = false;
  let pausado = false;
  let terminado = false;
  let entrando = false;
  let encontradas = 0;
  let tiempo = 0;
  let anterior = 0;
  let frame = 0;
  let avisoTemporal = 0;
  let ultimaPista = -1;
  let textoPista = '';
  let muestrasRendimiento = 0;
  let sumaFotogramas = 0;
  let calidadBajada = false;

  const posicion = { x: 0, y: 0, z: -16 };
  const velocidadJugador = { x: 0, z: 0 };
  const camaraMirando = { x: 0, y: 1.4, z: -19 };
  const teclas = new Set();
  const joystickVec = { x: 0, y: 0 };
  let destinoClic = null;
  let giroPastor = Math.PI;
  let perilla = null;

  // Audio sintetizado: ni un archivo, ni una descarga.
  let contextoAudio = null;
  let sonido = true;

  /* ---------------------------------- Utilidades -------------------------- */
  function avisar(texto, fijo = false) {
    if (!mensaje) return;
    mensaje.textContent = texto;
    mensaje.classList.remove('pastor-mensaje-nuevo');
    // reinicia la animación de entrada
    void mensaje.offsetWidth;
    mensaje.classList.add('pastor-mensaje-nuevo');
    window.clearTimeout(avisoTemporal);
    if (!fijo) avisoTemporal = window.setTimeout(() => { if (mensaje) mensaje.textContent = ''; }, 3200);
  }

  function actualizarContadores() {
    if (contador) contador.textContent = `🐑 ${encontradas} / ${TOTAL_OVEJAS}`;
    if (marcador) marcador.textContent = `${encontradas} / ${TOTAL_OVEJAS} ovejas`;
    if (typeof opciones.alCambiarOvejas === 'function') opciones.alCambiarOvejas(encontradas);
  }

  function girarHacia(actual, objetivo, factor) {
    let diferencia = objetivo - actual;
    while (diferencia > Math.PI) diferencia -= Math.PI * 2;
    while (diferencia < -Math.PI) diferencia += Math.PI * 2;
    return actual + diferencia * Math.min(1, factor);
  }

  function garantizarAudio() {
    if (!sonido) return;
    try {
      if (!contextoAudio) {
        const Constructor = window.AudioContext || window.webkitAudioContext;
        if (Constructor) contextoAudio = new Constructor();
      }
      if (contextoAudio && contextoAudio.state === 'suspended') contextoAudio.resume();
    } catch { /* sin audio, el juego sigue */ }
  }

  function nota(frecuencia, inicio, duracion, volumen = 0.06, tipo = 'sine') {
    if (!contextoAudio) return;
    const osc = contextoAudio.createOscillator();
    const gan = contextoAudio.createGain();
    osc.type = tipo;
    osc.frequency.setValueAtTime(frecuencia, inicio);
    gan.gain.setValueAtTime(0.0001, inicio);
    gan.gain.exponentialRampToValueAtTime(volumen, inicio + 0.02);
    gan.gain.exponentialRampToValueAtTime(0.0001, inicio + duracion);
    osc.connect(gan).connect(contextoAudio.destination);
    osc.start(inicio);
    osc.stop(inicio + duracion + 0.02);
  }

  function balido() {
    if (!sonido || !contextoAudio) return;
    try {
      const inicio = contextoAudio.currentTime + 0.01;
      const osc = contextoAudio.createOscillator();
      const gan = contextoAudio.createGain();
      const filtro = contextoAudio.createBiquadFilter();
      const vib = contextoAudio.createOscillator();
      const vibGan = contextoAudio.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, inicio);
      osc.frequency.exponentialRampToValueAtTime(300, inicio + 0.38);
      filtro.type = 'lowpass';
      filtro.frequency.value = 1400;
      vib.frequency.value = 22;
      vibGan.gain.value = 22;
      gan.gain.setValueAtTime(0.0001, inicio);
      gan.gain.exponentialRampToValueAtTime(0.07, inicio + 0.05);
      gan.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.5);
      vib.connect(vibGan).connect(osc.frequency);
      osc.connect(filtro).connect(gan).connect(contextoAudio.destination);
      osc.start(inicio);
      vib.start(inicio);
      osc.stop(inicio + 0.55);
      vib.stop(inicio + 0.55);
    } catch { /* sin audio, el juego sigue */ }
  }

  function melodia() {
    if (!sonido) return;
    garantizarAudio();
    if (!contextoAudio) return;
    const inicio = contextoAudio.currentTime + 0.05;
    [523.25, 659.25, 783.99, 1046.5].forEach((frecuencia, i) => {
      nota(frecuencia, inicio + i * 0.14, 0.55, 0.055);
    });
  }

  function soportaWebGL() {
    try {
      const prueba = document.createElement('canvas');
      return Boolean(window.WebGLRenderingContext && (prueba.getContext('webgl2') || prueba.getContext('webgl')));
    } catch {
      return false;
    }
  }

  function mostrarFallo(mensajeTexto, definitivo = false) {
    if (cargando) cargando.hidden = true;
    if (ui) ui.hidden = true;
    if (poster) {
      poster.classList.remove('pastor-oculto');
      const texto = poster.querySelector('.pastor-poster-nota');
      if (texto) texto.textContent = mensajeTexto;
      if (botonEmpezar) {
        botonEmpezar.disabled = definitivo;
        botonEmpezar.textContent = definitivo ? 'El 3D no está disponible aquí' : 'Reintentar el 3D';
      }
    }
    console.warn('[pastor 3D] ' + mensajeTexto);
  }

  /** Deshace un montaje a medias (o uno roto) para poder reintentar limpiamente. */
  function limpiarMontaje() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    arrancado = false;
    arrancando = false;
    if (canvas && canvas.parentNode) canvas.remove();
    canvas = null;
    if (renderer) {
      try { renderer.dispose(); } catch { /* el renderizador de prueba no lo tiene */ }
    }
    renderer = null;
    camara = null;
    mundo = null;
  }

  /* ------------------------------ Puesta en marcha ------------------------ */
  async function empezar() {
    if (arrancado || arrancando) return;
    arrancando = true;
    garantizarAudio();
    if (cargando) cargando.hidden = false;
    if (poster) poster.classList.add('pastor-oculto');
    try {
      if (!soportaWebGL()) {
        mostrarFallo('Tu navegador no puede mostrar gráficos 3D. Prueba con Chrome, Edge, Firefox o Safari actualizados; mientras tanto, la ruleta y la memoria funcionan igual.', true);
        return;
      }
      THREE = await import(RUTA_THREE);
      montar(THREE);
      arrancado = true;
      if (cargando) cargando.hidden = true;
      if (ui) ui.hidden = false;
      if (canvas) canvas.focus({ preventScroll: true });
      avisar('Busca las columnas de luz. Camina con las flechas, el joystick o tocando el pasto.', true);
      window.setTimeout(() => { if (mensaje && mensaje.textContent.startsWith('Busca las columnas')) mensaje.textContent = ''; }, 5200);
    } catch (error) {
      limpiarMontaje();
      mostrarFallo('No pudimos cargar el juego 3D. Revisa tu conexión y vuelve a intentarlo; los otros juegos siguen disponibles.');
      console.error('[pastor 3D]', error);
    } finally {
      arrancando = false;
    }
  }

  function montar(T) {
    mundo = construirMundo(T, { semilla: opciones.semilla });
    canvas = document.createElement('canvas');
    canvas.id = 'pastorCanvas';
    canvas.className = 'pastor-canvas';
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Campo en 3D con el pastor y cinco ovejas perdidas. Usa las flechas o el joystick para caminar y acércate a cada oveja.');
    escenario.prepend(canvas);

    try {
      renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    } catch (error) {
      mostrarFallo('Este dispositivo no pudo abrir el 3D. Los otros juegos funcionan igual.');
      throw error;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;

    camara = new T.PerspectiveCamera(46, 1, 0.5, 240);
    posicion.x = 0;
    posicion.z = -16;
    posicion.y = alturaTerreno(0, -16);
    camara.position.set(posicion.x, posicion.y + ALTURA_CAMARA, posicion.z + DIST_CAMARA);
    camaraMirando.x = posicion.x;
    camaraMirando.y = posicion.y + 1.4;
    camaraMirando.z = posicion.z - 3;
    camara.lookAt(camaraMirando.x, camaraMirando.y, camaraMirando.z);
    canvas.addEventListener('pointerdown', alTocarCanvas);
    ajustarTamano();
    if (window.ResizeObserver) new ResizeObserver(ajustarTamano).observe(escenario);
    else window.addEventListener('resize', ajustarTamano);

    reiniciar(true);
    // Un primer fotograma ya pintado evita el parpadeo antes de la animación.
    renderer.render(mundo.escena, camara);
    dibujarMapa();
    anterior = 0;
    raf = requestAnimationFrame(paso);
  }

  function ajustarTamano() {
    if (!renderer || !escenario) return;
    const ancho = Math.max(240, escenario.clientWidth || 800);
    const alto = Math.max(240, escenario.clientHeight || 520);
    renderer.setSize(ancho, alto, false);
    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();
  }

  /* ---------------------------------- Reinicio ---------------------------- */
  function reiniciar(silencioso = false) {
    if (!mundo) return;
    terminado = false;
    pausado = false;
    entrando = false;
    encontradas = 0;
    tiempo = 0;
    teclas.clear();
    joystickVec.x = 0;
    joystickVec.y = 0;
    destinoClic = null;
    velocidadJugador.x = 0;
    velocidadJugador.z = 0;
    giroPastor = Math.PI;
    posicion.x = 0;
    posicion.z = -16;
    posicion.y = alturaTerreno(0, -16);
    mundo.pastorGrupo.position.set(posicion.x, posicion.y, posicion.z);
    mundo.pastorGrupo.rotation.y = giroPastor;
    if (final) final.hidden = true;
    if (ui) ui.hidden = false;
    if (botonPausa) {
      botonPausa.disabled = false;
      botonPausa.textContent = '⏸ Pausa';
      botonPausa.setAttribute('aria-pressed', 'false');
    }
    if (perilla) perilla.style.transform = 'translate(0px, 0px)';
    const nuevas = posicionesDeOvejas(Math.floor(Math.random() * 1000000) + 1);
    mundo.ovejas.forEach((oveja, i) => {
      const ubicacion = nuevas[i];
      oveja.estado = 'perdida';
      oveja.grupo.position.set(ubicacion.x, alturaTerreno(ubicacion.x, ubicacion.z), ubicacion.z);
      oveja.grupo.rotation.y = Math.random() * Math.PI * 2;
      oveja.base = oveja.grupo.rotation.y;
      oveja.haz.visible = true;
      oveja.aro.visible = true;
      oveja.destino.set(
        REDIL.x + (i - 2) * 1.7,
        0,
        REDIL.z + (i % 2 ? 1.9 : 0.5),
      );
    });
    actualizarContadores();
    ultimaPista = -1;
    textoPista = '';
    actualizarPista(true);
    if (!silencioso) {
      avisar('Nueva partida: cinco ovejas esperan en el campo.');
      dibujarMapa();
    }
    if (camara && renderer && mundo) renderer.render(mundo.escena, camara);
  }

  /* ---------------------------------- Bucle ------------------------------- */
  function paso(ahora) {
    if (!arrancado) return;
    raf = requestAnimationFrame(paso);
    try {
      if (!anterior) anterior = ahora;
      const dt = Math.min((ahora - anterior) / 1000, 0.05);
      anterior = ahora;
      if (pausado || document.hidden) {
        renderer.render(mundo.escena, camara);
        return;
      }
      tiempo += dt;
      actualizarPastor(dt);
      actualizarOvejas(dt);
      actualizarCamara(dt);
      if (++frame % 3 === 0) {
        dibujarMapa();
        actualizarPista();
      }
      renderer.render(mundo.escena, camara);
      vigilarRendimiento(dt);
    } catch (error) {
      // Si algo falla en pleno juego, se detiene con un aviso claro en vez de
      // dejar el campo congelado sin explicación.
      limpiarMontaje();
      mostrarFallo('El 3D se detuvo por un problema del dispositivo. Vuelve a pulsar «Jugar en 3D»; si sigue igual, usa los otros juegos.');
      console.error('[pastor 3D]', error);
    }
  }

  /**
   * En celulares modestos, si el campo va por debajo de ~30 fps durante dos
   * segundos, se baja la resolución y se apagan las sombras una sola vez.
   * Preferimos un 3D sencillo y fluido antes que uno precioso que se traba.
   */
  function vigilarRendimiento(dt) {
    if (calidadBajada) return;
    sumaFotogramas += dt;
    muestrasRendimiento++;
    if (muestrasRendimiento < 120) return;
    const media = sumaFotogramas / muestrasRendimiento;
    muestrasRendimiento = 0;
    sumaFotogramas = 0;
    if (media <= 0.032) return;
    calidadBajada = true;
    renderer.setPixelRatio(1);
    renderer.shadowMap.enabled = false;
    mundo.escena.traverse((objeto) => {
      if (!objeto.material) return;
      const materiales = Array.isArray(objeto.material) ? objeto.material : [objeto.material];
      materiales.forEach((material) => { material.needsUpdate = true; });
    });
    ajustarTamano();
    console.info('[pastor 3D] Calidad reducida para mantener el juego fluido.');
  }

  function actualizarPastor(dt) {
    let ix = 0;
    let iz = 0;
    if (!terminado) {
      for (const tecla of teclas) {
        if (tecla === 'arrowleft' || tecla === 'a') ix -= 1;
        else if (tecla === 'arrowright' || tecla === 'd') ix += 1;
        else if (tecla === 'arrowup' || tecla === 'w') iz -= 1;
        else if (tecla === 'arrowdown' || tecla === 's') iz += 1;
      }
      ix += joystickVec.x;
      iz += joystickVec.y;
      if (ix === 0 && iz === 0 && destinoClic) {
        const dx = destinoClic.x - posicion.x;
        const dz = destinoClic.z - posicion.z;
        const distancia = Math.hypot(dx, dz);
        if (distancia < 0.85) destinoClic = null;
        else { ix = dx / distancia; iz = dz / distancia; }
      }
    }
    const largo = Math.hypot(ix, iz);
    if (largo > 1) { ix /= largo; iz /= largo; }
    const suave = 1 - Math.exp(-dt * 9);
    velocidadJugador.x += (ix * VEL_PASTOR - velocidadJugador.x) * suave;
    velocidadJugador.z += (iz * VEL_PASTOR - velocidadJugador.z) * suave;
    if (Math.hypot(velocidadJugador.x, velocidadJugador.z) < 0.08) {
      velocidadJugador.x = 0;
      velocidadJugador.z = 0;
    }
    const previo = { x: posicion.x, z: posicion.z };
    posicion.x += velocidadJugador.x * dt;
    posicion.z += velocidadJugador.z * dt;
    limitar(posicion, previo);
    posicion.y = alturaTerreno(posicion.x, posicion.z);

    const andando = Math.hypot(velocidadJugador.x, velocidadJugador.z);
    const salto = reducido || andando < 0.5 ? 0 : Math.abs(Math.sin(tiempo * 9)) * 0.09;
    mundo.pastorGrupo.position.set(posicion.x, posicion.y + salto, posicion.z);
    if (andando > 0.7) giroPastor = Math.atan2(velocidadJugador.x, velocidadJugador.z);
    mundo.pastorGrupo.rotation.y = girarHacia(mundo.pastorGrupo.rotation.y, giroPastor, dt * 10);
    if (!reducido) mundo.pastorGrupo.rotation.z = Math.sin(tiempo * 9) * 0.02 * Math.min(1, andando / 4);
  }

  function limitar(p, previo) {
    ajustarAlCampo(p, previo);
  }

  function recoger(oveja) {
    oveja.estado = 'sigue';
    oveja.haz.visible = false;
    oveja.aro.visible = false;
    encontradas++;
    balido();
    actualizarContadores();
    avisar(encontradas === TOTAL_OVEJAS
      ? `¡Están las ${TOTAL_OVEJAS}! Ahora llévalas al redil que marca el mapa.`
      : `¡Encontraste una oveja! Van ${encontradas} de ${TOTAL_OVEJAS}.`);
    if (encontradas === TOTAL_OVEJAS) actualizarPista(true);
  }

  function actualizarOvejas(dt) {
    if (!terminado && encontradas === TOTAL_OVEJAS) {
      const distanciaRedil = Math.hypot(posicion.x - REDIL.x, posicion.z - REDIL.z);
      if (!entrando && distanciaRedil < REDIL.radio - 0.6) {
        entrando = true;
        actualizarPista(true);
        avisar('¡Entraste al redil! Las ovejas vienen detrás de ti.');
      }
    }

    for (const oveja of mundo.ovejas) {
      const grupo = oveja.grupo;
      const x = grupo.position.x;
      const z = grupo.position.z;

      if (oveja.estado === 'perdida') {
        grupo.rotation.y = oveja.base + (reducido ? 0 : Math.sin(tiempo * 0.6 + oveja.fase) * 0.35);
        grupo.position.y = alturaTerreno(x, z) + (reducido ? 0 : Math.abs(Math.sin(tiempo * 1.8 + oveja.fase)) * 0.05);
        oveja.haz.material.opacity = reducido ? 0.18 : 0.16 + (Math.sin(tiempo * 1.5 + oveja.fase) + 1) * 0.06;
        oveja.haz.rotation.y += dt * 0.4;
        if (!terminado && Math.hypot(posicion.x - x, posicion.z - z) < RADIO_RECOGIDA) recoger(oveja);
        continue;
      }

      if (oveja.estado === 'dentro') {
        grupo.position.y = alturaTerreno(x, z) + (reducido ? 0 : Math.abs(Math.sin(tiempo * 2 + oveja.fase)) * 0.04);
        continue;
      }

      // Sigue al pastor: primero detrás de él, y al entrar al redil busca su sitio.
      let objetivoX;
      let objetivoZ;
      if (entrando) {
        const alRedil = Math.hypot(x - REDIL.x, z - REDIL.z);
        const enLaPuerta = Math.hypot(x - REDIL.x, z - (REDIL.z + REDIL.radio)) < 1.8;
        if (alRedil > REDIL.radio - 1.2 && !enLaPuerta) {
          objetivoX = REDIL.x;
          objetivoZ = REDIL.z + REDIL.radio;
        } else {
          objetivoX = oveja.destino.x;
          objetivoZ = oveja.destino.z;
        }
      } else {
        const angulo = (oveja.indice - (TOTAL_OVEJAS - 1) / 2) * 0.38;
        objetivoX = posicion.x + Math.sin(angulo) * 3.1;
        objetivoZ = posicion.z + Math.cos(angulo) * 3.1;
      }

      const dx = objetivoX - x;
      const dz = objetivoZ - z;
      const distancia = Math.hypot(dx, dz);
      if (distancia > 0.3) {
        const velocidadOveja = distancia > 7 ? 13.5 : VEL_OVEJA;
        const pasoOveja = Math.min(distancia, velocidadOveja * dt);
        const previo = { x, z };
        grupo.position.x += (dx / distancia) * pasoOveja;
        grupo.position.z += (dz / distancia) * pasoOveja;
        limitar(grupo.position, previo);
        grupo.rotation.y = girarHacia(grupo.rotation.y, Math.atan2(dx, dz), dt * 8);
      }
      grupo.position.y = alturaTerreno(grupo.position.x, grupo.position.z)
        + (reducido ? 0 : Math.abs(Math.sin(tiempo * 10 + oveja.fase)) * 0.07);

      if (entrando && Math.hypot(grupo.position.x - REDIL.x, grupo.position.z - REDIL.z) < REDIL.radio - 0.7) {
        oveja.estado = 'dentro';
      }
    }

    if (!terminado && entrando && mundo.ovejas.every((oveja) => oveja.estado === 'dentro')) ganar();
  }

  function actualizarCamara(dt) {
    if (!camara) return;
    const suave = reducido ? 1 : 1 - Math.exp(-dt * 3.6);
    const destinoY = posicion.y + ALTURA_CAMARA + (reducido ? 0 : Math.sin(tiempo * 0.7) * 0.25);
    camara.position.x += (posicion.x - camara.position.x) * suave;
    camara.position.y += (destinoY - camara.position.y) * suave;
    camara.position.z += (posicion.z + DIST_CAMARA - camara.position.z) * suave;
    camaraMirando.x += (posicion.x - camaraMirando.x) * suave;
    camaraMirando.y += (posicion.y + 1.4 - camaraMirando.y) * suave;
    camaraMirando.z += (posicion.z - 3 - camaraMirando.z) * suave;
    camara.lookAt(camaraMirando.x, camaraMirando.y, camaraMirando.z);

    if (mundo) {
      // Las nubes se mecen despacio; con movimiento reducido se quedan quietas.
      if (!reducido) {
        mundo.nubes.children.forEach((nube, i) => {
          nube.position.x += Math.sin(tiempo * 0.05 + i) * 0.004;
        });
      }
      mundo.sol.position.set(posicion.x + 16, posicion.y + 32, posicion.z + 14);
      mundo.sol.target.position.set(posicion.x, posicion.y, posicion.z);
      mundo.sol.target.updateMatrixWorld();
    }
  }

  /* ---------------------------------- Victoria ---------------------------- */
  function ganar() {
    if (terminado) return;
    terminado = true;
    pausado = false;
    if (final) final.hidden = false;
    if (ui) ui.hidden = true;
    if (botonPausa) botonPausa.disabled = true;
    if (mensaje) mensaje.textContent = '';
    melodia();
    actualizarPista(true);
    avisar('¡Celebración! Las cinco ovejas están en el redil.', true);
    if (botonOtra) botonOtra.focus();
    if (typeof opciones.alGanar === 'function') opciones.alGanar();
  }

  /* ---------------------------------- Mapa -------------------------------- */
  function dibujarMapa() {
    if (!mapa || !mundo) return;
    const ctx = mapa.getContext('2d');
    if (!ctx) return;
    const ancho = mapa.width;
    const alto = mapa.height;
    const centro = ancho / 2;
    const escalaMapa = (centro - 18) / RADIO_CAMPO;
    const aMapaX = (x) => centro + x * escalaMapa;
    const aMapaY = (z) => centro + z * escalaMapa;

    ctx.clearRect(0, 0, ancho, alto);
    ctx.save();
    ctx.beginPath();
    ctx.arc(centro, centro, centro - 5, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = '#e9f6dc';
    ctx.fillRect(0, 0, ancho, alto);

    // Redil
    ctx.fillStyle = '#e7d6a9';
    ctx.beginPath();
    ctx.arc(aMapaX(REDIL.x), aMapaY(REDIL.z), REDIL.radio * escalaMapa, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8a5f3c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(aMapaX(REDIL.x), aMapaY(REDIL.z), REDIL.radio * escalaMapa, REDIL.puerta + 0.12, Math.PI * 2 - REDIL.puerta - 0.12);
    ctx.stroke();

    // Ovejas
    for (const oveja of mundo.ovejas) {
      const x = aMapaX(oveja.grupo.position.x);
      const y = aMapaY(oveja.grupo.position.z);
      const perdida = oveja.estado === 'perdida';
      ctx.beginPath();
      ctx.arc(x, y, perdida ? 7 : 5.5, 0, Math.PI * 2);
      ctx.fillStyle = perdida ? '#f2b431' : '#4f9452';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fffdf7';
      ctx.stroke();
    }

    // Pastor con su sombrero
    ctx.beginPath();
    ctx.arc(aMapaX(posicion.x), aMapaY(posicion.z), 8, 0, Math.PI * 2);
    ctx.fillStyle = '#086f8b';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fffdf7';
    ctx.stroke();
    ctx.restore();

    // Norte del campo = arriba: un pajarito indica hacia dónde mirar.
    ctx.fillStyle = '#17364a';
    ctx.font = 'bold 20px Nunito, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', centro, 20);
  }

  function actualizarPista(forzar = false) {
    if (!pista) return;
    if (!forzar && tiempo - ultimaPista < 0.4) return;
    ultimaPista = tiempo;
    const escribir = (texto) => {
      if (texto === textoPista) return;
      textoPista = texto;
      pista.textContent = texto;
    };
    if (terminado) {
      escribir('¡Las cinco ovejas están a salvo en el redil!');
      return;
    }
    const perdidas = mundo.ovejas.filter((oveja) => oveja.estado === 'perdida');
    if (!perdidas.length) {
      escribir(entrando
        ? '¡Ya están dentro! Espera a que entren todas.'
        : 'Las cinco te siguen. Cruza la puerta del redil que marca el mapa.');
      return;
    }
    let distancia = Infinity;
    for (const oveja of perdidas) {
      const d = Math.hypot(oveja.grupo.position.x - posicion.x, oveja.grupo.position.z - posicion.z);
      if (d < distancia) distancia = d;
    }
    const pasos = Math.max(1, Math.round(distancia));
    escribir(perdidas.length === 1
      ? `Queda 1 oveja · la más cercana está a unos ${pasos} pasos (columna de luz).`
      : `Quedan ${perdidas.length} ovejas · la más cercana está a unos ${pasos} pasos (columna de luz).`);
  }

  /* ---------------------------------- Entrada ----------------------------- */
  function alTeclear(evento) {
    if (!arrancado) return;
    const panel = escenario.closest('.game-panel');
    if (panel && panel.hidden) return;
    const etiqueta = evento.target && evento.target.tagName;
    if (etiqueta === 'INPUT' || etiqueta === 'SELECT' || etiqueta === 'TEXTAREA') return;
    const tecla = typeof evento.key === 'string' ? evento.key.toLowerCase() : '';
    if (!tecla) return;
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(tecla)) evento.preventDefault();
    if (tecla === 'p') { alternarPausa(); return; }
    if (tecla === 'r') { reiniciar(); return; }
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(tecla)) {
      teclas.add(tecla);
      garantizarAudio();
    }
  }

  function alSoltar(evento) {
    if (typeof evento.key !== 'string') return;
    teclas.delete(evento.key.toLowerCase());
  }

  function alternarPausa() {
    if (!arrancado || terminado) return;
    pausado = !pausado;
    if (botonPausa) {
      botonPausa.textContent = pausado ? '▶ Seguir' : '⏸ Pausa';
      botonPausa.setAttribute('aria-pressed', String(pausado));
    }
    if (pausado) avisar('En pausa. Pulsa «Seguir» para continuar.', true);
    else if (mensaje) mensaje.textContent = '';
    if (pausado) { teclas.clear(); joystickVec.x = 0; joystickVec.y = 0; if (perilla) perilla.style.transform = 'translate(0px, 0px)'; }
    anterior = 0;
  }

  // Teclado, joystick, sonido, pausa, reinicio y cierre de la celebración.
  window.addEventListener('keydown', alTeclear);
  window.addEventListener('keyup', alSoltar);
  window.addEventListener('blur', () => { teclas.clear(); joystickVec.x = 0; joystickVec.y = 0; });

  if (joystick) {
    perilla = joystick.querySelector('span');
    const radio = 42;
    let punteroActivo = null;
    const moverPerilla = (evento) => {
      const caja = joystick.getBoundingClientRect();
      let dx = evento.clientX - (caja.left + caja.width / 2);
      let dy = evento.clientY - (caja.top + caja.height / 2);
      const distancia = Math.hypot(dx, dy) || 1;
      const limite = Math.min(distancia, radio);
      dx = (dx / distancia) * limite;
      dy = (dy / distancia) * limite;
      if (perilla) perilla.style.transform = `translate(${dx}px, ${dy}px)`;
      joystickVec.x = dx / radio;
      joystickVec.y = dy / radio;
      if (Math.hypot(joystickVec.x, joystickVec.y) > 0.15) garantizarAudio();
    };
    const soltar = () => {
      punteroActivo = null;
      joystickVec.x = 0;
      joystickVec.y = 0;
      if (perilla) perilla.style.transform = 'translate(0px, 0px)';
    };
    joystick.addEventListener('pointerdown', (evento) => {
      if (!arrancado || terminado || pausado) return;
      punteroActivo = evento.pointerId;
      joystick.setPointerCapture(evento.pointerId);
      moverPerilla(evento);
    });
    joystick.addEventListener('pointermove', (evento) => {
      if (punteroActivo === null || evento.pointerId !== punteroActivo) return;
      moverPerilla(evento);
    });
    joystick.addEventListener('pointerup', soltar);
    joystick.addEventListener('pointercancel', soltar);
  }

  function empezarDesdePoster() {
    empezar();
  }

  if (botonEmpezar) botonEmpezar.addEventListener('click', empezarDesdePoster);

  if (botonSonido) {
    botonSonido.addEventListener('click', () => {
      sonido = !sonido;
      botonSonido.setAttribute('aria-pressed', String(sonido));
      botonSonido.textContent = sonido ? '🔊 Sonido' : '🔇 Sin sonido';
      if (sonido) { garantizarAudio(); nota(660, (contextoAudio?.currentTime || 0) + 0.02, 0.18, 0.05); }
    });
  }

  if (botonPausa) botonPausa.addEventListener('click', alternarPausa);
  if (botonReiniciar) botonReiniciar.addEventListener('click', () => reiniciar());
  if (botonOtra) botonOtra.addEventListener('click', () => { reiniciar(); descartarDestello(); });
  if (botonCerrarFinal) {
    botonCerrarFinal.addEventListener('click', () => {
      if (final) final.hidden = true;
      // Se vuelven a mostrar los controles para poder empezar otra partida.
      if (ui) ui.hidden = false;
      if (canvas) canvas.focus({ preventScroll: true });
    });
  }

  function descartarDestello() {
    if (mensaje) mensaje.textContent = '';
  }

  // Clic o toque en el pasto: el pastor camina hasta ese punto.
  function alTocarCanvas(evento) {
    if (!arrancado || terminado || pausado || !mundo) return;
    try {
      const caja = canvas.getBoundingClientRect();
      const x = ((evento.clientX - caja.left) / caja.width) * 2 - 1;
      const y = -((evento.clientY - caja.top) / caja.height) * 2 + 1;
      const rayo = new THREE.Raycaster();
      rayo.setFromCamera({ x, y }, camara);
      const choque = rayo.intersectObject(mundo.terreno, false)[0];
      if (!choque) return;
      destinoClic = { x: choque.point.x, z: choque.point.z };
      garantizarAudio();
    } catch { /* un toque raro no debe romper la partida */ }
  }

  return {
    empezar,
    pausar() { if (arrancado && !terminado && !pausado) alternarPausa(); },
    reanudar() { if (arrancado && !terminado && pausado) alternarPausa(); },
    reiniciar,
    get listo() { return arrancado; },
    get pausado() { return pausado; },
    /**
     * Solo lectura: posiciones, ovejas encontradas y si la partida terminó.
     * La usan las pruebas automáticas; no modifica nada del juego.
     */
    get estado() {
      return {
        jugador: { x: posicion.x, z: posicion.z },
        ovejas: mundo
          ? mundo.ovejas.map((oveja) => ({
            x: oveja.grupo.position.x,
            z: oveja.grupo.position.z,
            estado: oveja.estado,
          }))
          : [],
        encontradas,
        entrando,
        terminado,
      };
    },
  };
}
