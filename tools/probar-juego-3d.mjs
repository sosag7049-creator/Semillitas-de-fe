#!/usr/bin/env node
/**
 * probar-juego-3d.mjs
 * ---------------------------------------------------------------------------
 * Arma el mundo del juego 3D («El buen pastor») en Node, con el mismo Three.js
 * que sirve el sitio, y comprueba que todo esté en su sitio ANTES de abrir un
 * navegador:
 *
 *   1. Las cinco ovejas existen y caen dentro del campo, separadas entre sí.
 *   2. Ninguna posición, normal o color de la escena contiene NaN/Infinity.
 *   3. El pastor, la cerca del redil y los controles están construidos.
 *   4. La cerca no se atraviesa, pero la puerta sí deja pasar.
 *   5. El pasaje bíblico y el total de ovejas coinciden con la página.
 *
 * No usa navegador ni WebGL: se apoya en las funciones puras del módulo y en
 * `construirMundo(THREE)`. Lo visual se confirma en el navegador; esto atrapa
 * los errores de lógica y de API que no se ven a simple vista.
 *
 * Uso:
 *     node tools/probar-juego-3d.mjs
 */

import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const leer = (rel) => readFileSync(join(RAIZ, rel), 'utf8');

let fallos = 0;
const prueba = (nombre, ok, extra = '') => {
  if (!ok) fallos++;
  console.log(`${ok ? '✅' : '❌'} ${nombre}${extra ? ' — ' + extra : ''}`);
};

const esNumero = (valor) => typeof valor === 'number' && Number.isFinite(valor);

// Node solo trata como módulo los .js de un paquete "type": "module". Three.js
// y el juego se copian a una carpeta temporal con esa marca para poder
// importarlos tal cual se sirven en el sitio.
const temporal = mkdtempSync(join(tmpdir(), 'semillitas-3d-'));
try {
  writeFileSync(join(temporal, 'package.json'), '{"type":"module"}');
  copyFileSync(join(RAIZ, 'vendor/three.module.min.js'), join(temporal, 'three.module.min.js'));
  copyFileSync(join(RAIZ, 'vendor/three.core.min.js'), join(temporal, 'three.core.min.js'));
  writeFileSync(join(temporal, 'juego.mjs'), leer('juegos-3d.js'));

  const THREE = await import(pathToFileURL(join(temporal, 'three.module.min.js')).href);
  const juego = await import(pathToFileURL(join(temporal, 'juego.mjs')).href);
  const html = leer('juegos/index.html');

  /* ------------------------------ Constantes ---------------------------- */
  prueba('el total de ovejas es 5 y coincide con la página',
    juego.TOTAL_OVEJAS === 5 && html.includes('0 / 5 ovejas'),
    `módulo ${juego.TOTAL_OVEJAS}`);
  prueba('el pasaje es Lucas 15:4-7 (Reina-Valera 1960)',
    juego.REFERENCIA === 'Lucas 15:4-7' && html.includes('Lucas 15:6'));

  /* ------------------------------ Alturas ------------------------------- */
  let alturasOk = true;
  for (let x = -50; x <= 50; x += 2.5) {
    for (let z = -50; z <= 50; z += 2.5) {
      if (!esNumero(juego.alturaTerreno(x, z))) alturasOk = false;
    }
  }
  prueba('la altura del terreno es finita en todo el mapa', alturasOk);

  /* --------------------------- Sitios de ovejas ------------------------- */
  for (const semilla of [1, 7, 42, 20261107, 987654]) {
    const puntos = juego.posicionesDeOvejas(semilla);
    const dentro = puntos.every((p) => esNumero(p.x) && esNumero(p.z) && Math.hypot(p.x, p.z) <= 34.1);
    const separadas = puntos.every((p, i) => puntos.every((q, j) => i === j || Math.hypot(p.x - q.x, p.z - q.z) >= 10.9));
    const lejosDelRedil = puntos.every((p) => Math.hypot(p.x, p.z + 28) >= 15.9);
    const lejosDeSalida = puntos.every((p) => Math.hypot(p.x, p.z + 16) >= 12.9);
    prueba(`semilla ${semilla}: 5 ovejas dentro, separadas y lejos del redil`,
      puntos.length === 5 && dentro && separadas && lejosDelRedil && lejosDeSalida,
      `${puntos.length} sitios`);
  }

  /* ------------------------------- El mundo ----------------------------- */
  const mundo = juego.construirMundo(THREE, { semilla: 7 });
  prueba('la escena tiene terreno, pastor, redil y cielo',
    Boolean(mundo.escena) && Boolean(mundo.terreno) && Boolean(mundo.pastorGrupo) &&
    Boolean(mundo.redil) && Boolean(mundo.sol) && mundo.escena.children.length > 5,
    `${mundo.escena.children.length} grupos en la escena`);

  prueba('hay exactamente 5 ovejas con su columna de luz',
    mundo.ovejas.length === 5 && mundo.ovejas.every((o) => o.grupo && o.haz && o.aro && o.estado === 'perdida'));

  const ovejasDentro = mundo.ovejas.every((o) =>
    esNumero(o.grupo.position.x) && esNumero(o.grupo.position.z) &&
    Math.hypot(o.grupo.position.x, o.grupo.position.z) <= 34.5);
  prueba('las ovejas del mundo están dentro del campo', ovejasDentro);

  prueba('el pastor empieza junto a la puerta del redil',
    Math.abs(mundo.pastorGrupo.position.x) < 0.01 &&
    Math.abs(mundo.pastorGrupo.position.z + 16) < 0.01 &&
    esNumero(mundo.pastorGrupo.position.y),
    `(${mundo.pastorGrupo.position.x}, ${mundo.pastorGrupo.position.z})`);

  /* ------------------------- Nada de NaN ni huecos ---------------------- */
  let verticesFin = true;
  let coloresFin = true;
  let mallasSinMaterial = 0;
  let totalMallas = 0;
  mundo.escena.traverse((objeto) => {
    if (!objeto.isMesh && !objeto.isInstancedMesh) return;
    totalMallas++;
    if (!objeto.material) mallasSinMaterial++;
    const posiciones = objeto.geometry?.attributes?.position;
    if (posiciones) {
      for (let i = 0; i < posiciones.count; i++) {
        if (!esNumero(posiciones.getX(i)) || !esNumero(posiciones.getY(i)) || !esNumero(posiciones.getZ(i))) {
          verticesFin = false;
          break;
        }
      }
    }
    const colores = objeto.geometry?.attributes?.color;
    if (colores) {
      for (let i = 0; i < colores.count * 3; i++) {
        if (!esNumero(colores.array[i])) {
          coloresFin = false;
          break;
        }
      }
    }
  });
  prueba('ningún vértice de la escena es NaN ni infinito', verticesFin, `${totalMallas} mallas`);
  prueba('los colores del pasto son válidos', coloresFin);
  prueba('todas las mallas tienen material', mallasSinMaterial === 0);
  prueba('la escena tiene pasto y flores instanciados',
    mundo.escena.children.some((hijo) => hijo.isInstancedMesh));
  prueba('la cerca del redil tiene postes y barandales',
    mundo.redil.children.length >= 40, `${mundo.redil.children.length} piezas`);

  const terreno = mundo.terreno.geometry;
  prueba('el terreno tiene colores por triángulo y normales',
    Boolean(terreno.attributes.color) && Boolean(terreno.attributes.normal) &&
    terreno.attributes.position.count % 3 === 0);

  /* ----------------------------- La cerca ------------------------------- */
  const campo = juego.ajustarAlCampo({ x: 0, z: 90 }, { x: 0, z: 89 });
  prueba('nadie se sale del campo',
    Math.abs(Math.hypot(campo.x, campo.z) - 41) < 0.001,
    `radio ${Math.hypot(campo.x, campo.z).toFixed(2)}`);

  const puerta = juego.ajustarAlCampo({ x: 0, z: -20 }, { x: 0, z: -19 });
  prueba('la puerta del redil deja pasar',
    Math.abs(puerta.x) < 0.001 && Math.abs(puerta.z + 20) < 0.001);

  const costado = juego.ajustarAlCampo({ x: 7.7, z: -28 }, { x: 7, z: -28 });
  const distanciaCostado = Math.hypot(costado.x, costado.z + 28);
  prueba('la cerca no se atraviesa por el costado', distanciaCostado <= 6.81,
    `quedó a ${distanciaCostado.toFixed(2)} del centro`);

  const saliendo = juego.ajustarAlCampo({ x: 7.7, z: -28 }, { x: 0, z: -30 });
  prueba('desde dentro tampoco se sale por la cerca',
    Math.hypot(saliendo.x, saliendo.z + 28) <= 6.81);

  const afuera = juego.ajustarAlCampo({ x: 8.1, z: -28 }, { x: 9, z: -28 });
  prueba('desde fuera la cerca empuja hacia afuera',
    Math.hypot(afuera.x, afuera.z + 28) >= 8.39);

  /* --------------------------- La página y el caché --------------------- */
  prueba('la página tiene la pestaña y el panel del juego',
    html.includes('data-game="pastor"') && html.includes('id="game-pastor"'));
  prueba('el juego se carga bajo demanda (nada de <script> suelto)',
    !/<script[^>]+src="\/juegos-3d\.js/.test(html) && leer('juegos.js').includes("import('/juegos-3d.js?v=1')"));
  prueba('la página explica los controles y la clase relacionada',
    html.includes('pastorJoystick') && html.includes('/lecciones/oveja-perdida/'));
  prueba('respeta prefers-reduced-motion', leer('juegos-3d.css').includes('prefers-reduced-motion'));
  prueba('Three.js viaja con el sitio (sin CDN)',
    leer('juegos-3d.js').includes("'/vendor/three.module.min.js?v=180'") &&
    leer('vendor/three.module.min.js').includes('Three.js Authors'));

  /* ---------------------- Partida completa en un DOM -------------------- */
  // `--domo` arma la página real con jsdom, un Three.js sin WebGL y un reloj
  // acelerado: juega las cinco ovejas, vuelve al redil y comprueba la victoria.
  // Es opcional para que el CI siga sin dependencias.
  if (args.includes('--domo')) await probarEnDomo();
  else console.log('\nℹ️  Añade --domo para jugar la partida completa (necesita jsdom).');
} finally {
  rmSync(temporal, { recursive: true, force: true });
}

console.log(fallos
  ? `\n${fallos} revisión(es) fallida(s)`
  : '\n🎉 el juego 3D está completo y en orden');
process.exit(fallos ? 1 : 0);

/**
 * Juega una partida entera sin navegador de verdad:
 * jsdom pone la página, un WebGLRenderer de mentira evita la tarjeta gráfica y
 * requestAnimationFrame avanza a 20 ms por fotograma. El "alumno" virtual
 * camina con las flechas hacia cada oveja y luego al redil.
 */
async function probarEnDomo() {
  console.log('\nPartida completa en un DOM simulado:');
  let JSDOM;
  let VirtualConsole;
  try {
    ({ JSDOM, VirtualConsole } = await import('jsdom'));
  } catch {
    console.log('⏭️  jsdom no está instalado; se omite. Instálalo con: npm install jsdom');
    return;
  }

  const errores = [];
  const consola = new VirtualConsole();
  consola.on('jsdomError', (error) => errores.push(error.message));
  consola.on('error', (...mensajes) => errores.push(mensajes.join(' ')));

  const dom = new JSDOM(leer('juegos/index.html'), {
    url: 'https://semillitasbiblicas.space/juegos/',
    pretendToBeVisual: true,
    virtualConsole: consola,
  });
  const { window } = dom;
  global.window = window;
  global.document = window.document;
  global.HTMLElement = window.HTMLElement;

  // Lienzo sin GPU: el mapa usa un contexto 2D de mentira y el 3D, un render falso.
  const contexto2d = new Proxy({}, {
    get: (objeto, clave) => (clave in objeto ? objeto[clave] : () => {}),
    set: (objeto, clave, valor) => { objeto[clave] = valor; return true; },
  });
  window.WebGLRenderingContext = function WebGLRenderingContext() {};
  window.HTMLCanvasElement.prototype.getContext = (tipo) => (tipo === '2d' ? contexto2d : {});

  // Reloj acelerado: 20 ms por fotograma, por debajo del umbral de calidad.
  let reloj = 0;
  let siguienteId = 1;
  const cola = new Map();
  global.requestAnimationFrame = (callback) => {
    const id = siguienteId++;
    cola.set(id, callback);
    return id;
  };
  global.cancelAnimationFrame = (id) => cola.delete(id);
  const tick = (ms = 20) => {
    const callbacks = [...cola.values()];
    cola.clear();
    reloj += ms;
    callbacks.forEach((callback) => callback(reloj));
  };

  const carpeta = mkdtempSync(join(tmpdir(), 'semillitas-domo-'));
  try {
    writeFileSync(join(carpeta, 'package.json'), '{"type":"module"}');
    copyFileSync(join(RAIZ, 'vendor/three.module.min.js'), join(carpeta, 'three.module.min.js'));
    copyFileSync(join(RAIZ, 'vendor/three.core.min.js'), join(carpeta, 'three.core.min.js'));
    writeFileSync(join(carpeta, 'three.prueba.mjs'), `export * from './three.module.min.js';
export class WebGLRenderer {
  constructor() { this.shadowMap = { enabled: false, type: 0 }; globalThis.__renders = 0; }
  setPixelRatio() {}
  setSize() {}
  render() { globalThis.__renders++; }
}`);
    let fuente = leer('juegos-3d.js');
    fuente = fuente.replace(/const RUTA_THREE = '[^']+';/,
      `const RUTA_THREE = '${pathToFileURL(join(carpeta, 'three.prueba.mjs')).href}';`);
    writeFileSync(join(carpeta, 'juego.mjs'), fuente);

    const { iniciarPastor } = await import(pathToFileURL(join(carpeta, 'juego.mjs')).href);
    const escenario = document.getElementById('pastorStage');
    // Abrir la pestaña, como hace juegos.js al pulsarla.
    document.getElementById('game-pastor').hidden = false;

    const api = iniciarPastor(escenario);
    await api.empezar();
    prueba('el juego arranca y pinta el campo',
      api.listo === true && Boolean(document.getElementById('pastorCanvas')) &&
      document.getElementById('pastorUI').hidden === false && globalThis.__renders > 0);

    // Un "niño" que camina con las flechas hacia donde le dicen.
    const activas = new Set();
    const tecla = (key, tipo) => window.dispatchEvent(new window.KeyboardEvent(tipo, {
      key,
      bubbles: true,
      cancelable: true,
    }));
    const dirigirA = (x, z) => {
      const { jugador } = api.estado;
      const dx = x - jugador.x;
      const dz = z - jugador.z;
      const deseadas = new Set();
      if (dx > 0.35) deseadas.add('ArrowRight');
      if (dx < -0.35) deseadas.add('ArrowLeft');
      if (dz > 0.35) deseadas.add('ArrowDown');
      if (dz < -0.35) deseadas.add('ArrowUp');
      for (const k of [...activas]) if (!deseadas.has(k)) { tecla(k, 'keyup'); activas.delete(k); }
      for (const k of deseadas) if (!activas.has(k)) { tecla(k, 'keydown'); activas.add(k); }
    };
    const soltar = () => {
      for (const k of [...activas]) { tecla(k, 'keyup'); activas.delete(k); }
    };
    const irA = (x, z, tolerancia = 1.2, maximo = 4000) => {
      let pasos = 0;
      const llegue = () => Math.hypot(api.estado.jugador.x - x, api.estado.jugador.z - z) < tolerancia;
      while (!llegue() && pasos++ < maximo) { dirigirA(x, z); tick(); }
      soltar();
      return llegue();
    };

    let vueltas = 0;
    while (api.estado.ovejas.some((oveja) => oveja.estado === 'perdida') && vueltas++ < 6000) {
      const perdidas = api.estado.ovejas.filter((oveja) => oveja.estado === 'perdida');
      const { jugador } = api.estado;
      let cercana = perdidas[0];
      let distancia = Infinity;
      for (const oveja of perdidas) {
        const d = Math.hypot(oveja.x - jugador.x, oveja.z - jugador.z);
        if (d < distancia) { distancia = d; cercana = oveja; }
      }
      if (distancia < 2.6) { tick(); continue; }
      dirigirA(cercana.x, cercana.z);
      tick();
    }
    prueba('se encuentran las cinco ovejas caminando con el teclado',
      api.estado.encontradas === 5, `${api.estado.encontradas} de 5 en ${vueltas} fotogramas`);

    irA(0, -10, 2);
    irA(0, -20.5, 1);
    irA(0, -26.5, 1.2);
    let espera = 0;
    while (!api.estado.terminado && espera++ < 4000) tick();
    prueba('las ovejas entran al redil y la partida termina',
      api.estado.terminado && api.estado.ovejas.every((oveja) => oveja.estado === 'dentro'),
      api.estado.ovejas.map((oveja) => oveja.estado).join(', '));
    prueba('aparece la celebración con el marcador completo',
      document.getElementById('pastorFinal').hidden === false &&
      document.getElementById('pastorScore').textContent.trim() === '5 / 5 ovejas');

    api.reiniciar();
    prueba('«Jugar otra vez» reparte de nuevo las cinco ovejas',
      api.estado.encontradas === 0 &&
      api.estado.ovejas.every((oveja) => oveja.estado === 'perdida') &&
      document.getElementById('pastorFinal').hidden === true);

    api.pausar();
    const enPausa = api.pausado && document.getElementById('pastorPausa').textContent.includes('Seguir');
    api.reanudar();
    prueba('la pausa y el botón «Seguir» responden',
      enPausa && api.pausado === false);

    const botonSonido = document.getElementById('pastorSonido');
    botonSonido.click();
    const apagado = botonSonido.getAttribute('aria-pressed') === 'false';
    botonSonido.click();
    prueba('el sonido se puede apagar y encender',
      apagado && botonSonido.getAttribute('aria-pressed') === 'true');

    for (let i = 0; i < 40; i++) tick();
    prueba('el bucle no lanza errores durante la partida', errores.length === 0, errores.join(' | '));
  } finally {
    rmSync(carpeta, { recursive: true, force: true });
  }
}
