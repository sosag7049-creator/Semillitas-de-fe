#!/usr/bin/env node
/**
 * Pruebas automáticas de la portada (index.html).
 *
 *   1) node tools/servidor-local.mjs        (en una terminal)
 *   2) npm install jsdom                    (solo la primera vez)
 *      node tools/probar-portada.mjs        (en otra terminal)
 *
 * Simula un navegador y comprueba que la portada corta siga funcionando:
 * accesos rápidos, «Continúa donde quedaste», lecciones destacadas, planes,
 * el botón flotante único, el asistente Sion y la ventana de lección.
 *
 * Conviene ejecutarlo después de agregar o editar lecciones.
 *
 * NOTA: jsdom no ejecuta <script type="module">, así que `home.js` se carga a
 * mano sobre el mismo documento (igual que haría el navegador), copiando los
 * módulos a una carpeta temporal con las rutas en relativo.
 */
import jsdom from 'jsdom';
import { readFileSync, writeFileSync, mkdtempSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL, fileURLToPath } from 'node:url';

const { JSDOM, VirtualConsole, ResourceLoader, requestInterceptor } = jsdom;
const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'http://127.0.0.1:8000';
const errores = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => { const m = String(e.message || e); if (!/Not implemented|Could not parse CSS/.test(m)) errores.push(m); });
vc.on('error', (...a) => errores.push(a.join(' ')));

// Solo se descarga lo del propio sitio: las tipografías de Google o un video
// de YouTube dejarían la prueba colgada en una máquina sin internet, y no es
// lo que se quiere comprobar aquí.
// (jsdom 27 y posteriores usan interceptores; las versiones anteriores, ResourceLoader.)
function soloDelSitio() {
  if (typeof requestInterceptor === 'function') {
    return { interceptors: [requestInterceptor(peticion =>
      peticion.url.startsWith(BASE) ? undefined : new Response('', { status: 200, headers: { 'content-type': 'text/css' } }))] };
  }
  if (typeof ResourceLoader === 'function') {
    return new (class extends ResourceLoader {
      fetch(url, opciones) { return url.startsWith(BASE) ? super.fetch(url, opciones) : null; }
    })();
  }
  return 'usable';
}

// Red de seguridad: si algo se queda esperando, la prueba falla en vez de
// quedarse colgada para siempre.
const reloj = setTimeout(() => {
  console.log('\n❌ la prueba tardó más de 90 segundos; algo se quedó esperando');
  process.exit(1);
}, 90000);
reloj.unref?.();

// jsdom no implementa matchMedia y los scripts del sitio lo usan para detectar
// "prefiere menos movimiento" o si la app ya está instalada. Se añade antes de
// que se ejecute cualquier script de la página.
function prepararVentana(w) {
  if (typeof w.matchMedia === 'function') return;
  w.matchMedia = (consulta) => ({
    matches: false, media: String(consulta), onchange: null,
    addListener() {}, removeListener() {},
    addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false,
  });
  // jsdom anuncia navigator.serviceWorker pero register() no devuelve promesa.
  try {
    Object.defineProperty(w.navigator, 'serviceWorker', {
      configurable: true,
      value: { register: () => Promise.resolve({ scope: '/' }), addEventListener() {} },
    });
  } catch { /* si no se puede redefinir, se ignora */ }
  // jsdom tampoco reproduce video: play() debe devolver una promesa como en
  // el navegador, porque el video del hero encadena .catch().
  try {
    w.HTMLMediaElement.prototype.play = () => Promise.resolve();
    w.HTMLMediaElement.prototype.pause = () => {};
    w.HTMLMediaElement.prototype.load = () => {};
  } catch { /* idem */ }
}

const dom = await JSDOM.fromURL(BASE + '/', {
  runScripts: 'dangerously',
  resources: soloDelSitio(),
  pretendToBeVisual: true,
  virtualConsole: vc,
  beforeParse: prepararVentana,
});
const { window } = dom;
// jsdom no implementa <dialog>; lo suplimos para poder probar la ventana de lección.
window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
window.HTMLDialogElement.prototype.close = function () { this.open = false; };
await new Promise(r => window.addEventListener('load', r, { once: true }));
await new Promise(r => setTimeout(r, 1200));
const d = window.document;
let fallos = 0;
const prueba = (n, c, extra = '') => { if (!c) fallos++; console.log(`${c ? '✅' : '❌'} ${n}${extra ? ' — ' + extra : ''}`); };

/* --------------------------------------------------------------------------
 * El catálogo que comparten Sion, la cuenta y el panel del maestro
 * ----------------------------------------------------------------------- */
const cat = window.Semillitas?.lessons;
prueba('catálogo global con 31 lecciones', cat?.length === 31, `${cat?.length}`);
prueba('los 31 títulos son únicos', new Set(cat.map(l => l.title)).size === 31);
prueba('todas tienen emoji y pasaje', cat.every(l => l.emoji && l.reference));
prueba('el catálogo interno se renderiza', d.querySelectorAll('#grid .card').length === 31, `${d.querySelectorAll('#grid .card').length} tarjetas`);

/* --------------------------------------------------------------------------
 * La portada ya no es un folleto largo
 * ----------------------------------------------------------------------- */
const fuera = ['#rouletteTheme', '#videosGrid', '#metodo', '#canales', '#recursos', '#agendaMaestro'];
prueba('ya no lleva ruleta, videoteca, método, canales ni recursos',
  fuera.every(sel => !d.querySelector(sel)),
  fuera.filter(sel => d.querySelector(sel)).join(' ') || 'portada limpia');
prueba('las seis secciones de la portada están en orden',
  ['#inicio', '#accesos', '#destacadas', '#planes', '#herramientas', '#proteccion'].every(sel => d.querySelector(sel)));

/* --------------------------------------------------------------------------
 * Accesos rápidos
 * ----------------------------------------------------------------------- */
const atajos = [...d.querySelectorAll('.quick-tile')];
prueba('hay seis accesos rápidos', atajos.length === 6, `${atajos.length}`);
prueba('los accesos rápidos llevan a lecciones, planes, juegos e imprimibles',
  ['/lecciones/', '/series/', '/juegos/', '/printables.html']
    .every(destino => atajos.some(a => a.getAttribute('href') === destino)));
prueba('la agenda y las favoritas abren el panel del maestro',
  Boolean(d.querySelector('.quick-tile[data-open-agenda]')) && Boolean(d.querySelector('.quick-tile[data-open-panel]')));

/* --------------------------------------------------------------------------
 * Un solo botón flotante
 * ----------------------------------------------------------------------- */
/* --------------------------------------------------------------------------
 * El menú móvil de la barra superior
 * ----------------------------------------------------------------------- */
const botonMenu = d.querySelector('#menuToggle');
const menu = d.querySelector('#mainMenu');
prueba('la barra superior tiene menú móvil accesible',
  Boolean(botonMenu && menu)
  && botonMenu.getAttribute('aria-controls') === 'mainMenu'
  && botonMenu.getAttribute('aria-expanded') === 'false');
botonMenu.click();
prueba('el menú móvil se abre y se anuncia',
  menu.classList.contains('is-open') && botonMenu.getAttribute('aria-expanded') === 'true');
menu.querySelector('a').click();
prueba('el menú móvil se cierra al elegir una opción',
  !menu.classList.contains('is-open') && botonMenu.getAttribute('aria-expanded') === 'false');

prueba('solo hay un botón flotante', d.querySelectorAll('.dock-toggle').length === 1);
prueba('Sion y la cuenta se recogen en la bandeja',
  d.body.classList.contains('has-dock') && Boolean(d.querySelector('.dock-item[data-dock="sion"]')));
d.querySelector('#dockToggle').click();
prueba('la bandeja se abre', d.querySelector('#dockTray').hidden === false);
d.querySelector('.dock-item[data-dock="sion"]').click();
prueba('desde la bandeja se abre Sion', d.querySelector('#jerubiPanel').classList.contains('is-open'));

/* --------------------------------------------------------------------------
 * La ventana de lección (la que abre Sion)
 * ----------------------------------------------------------------------- */
window.Semillitas.openLesson('16');
const titulo = d.getElementById('title')?.textContent || '';
const cuerpo = d.getElementById('body')?.textContent || '';
prueba('abrir una lección llena la ventana', /jon[áa]s/i.test(titulo), `título: "${titulo}"`);
prueba('la ventana trae objetivo, dinámica y oración', /Objetivo/.test(cuerpo) && /Dinámica/.test(cuerpo) && /Oración/.test(cuerpo));

/* --------------------------------------------------------------------------
 * Sion
 * ----------------------------------------------------------------------- */
const form = d.querySelector('#jerubiForm'), input = d.querySelector('#jerubiInput');
input.value = 'dame una dinámica';
form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
await new Promise(r => setTimeout(r, 600));
prueba('el asistente Sion responde', d.querySelectorAll('#jerubiMessages .jerubi-bubble').length >= 2,
  `${d.querySelectorAll('#jerubiMessages .jerubi-bubble').length} burbujas`);

const buscador = d.getElementById('search');
buscador.value = 'jonás'; buscador.dispatchEvent(new window.Event('input', { bubbles: true }));
await new Promise(r => setTimeout(r, 200));
prueba('el buscador filtra', d.querySelectorAll('#grid .card').length < 31, `${d.querySelectorAll('#grid .card').length} tras buscar`);

/* --------------------------------------------------------------------------
 * Destacadas, «Continúa donde quedaste» y planes
 *
 * jsdom ignora los <script type="module">, así que se ejecuta home.js aquí
 * sobre el mismo documento. Antes se deja un avance guardado para que la
 * tarjeta de «Continúa donde quedaste» tenga algo que mostrar.
 * ----------------------------------------------------------------------- */
window.localStorage.setItem('semillitas-class-16', JSON.stringify({ parts: { story: true, bible: true }, updatedAt: Date.now() }));
window.localStorage.setItem('semillitas-ultima-clase', JSON.stringify({ id: '16', slug: 'jonas', at: Date.now() }));

const temporal = mkdtempSync(join(tmpdir(), 'semillitas-portada-'));
for (const archivo of readdirSync(RAIZ).filter(n => n.endsWith('.js'))) {
  writeFileSync(join(temporal, archivo), readFileSync(join(RAIZ, archivo), 'utf8')
    .replace(/from\s+(['"])\/(?!\/)/g, 'from $1./')
    .replace(/import\(\s*(['"])\/(?!\/)/g, 'import($1./'));
}
globalThis.document = d;
globalThis.localStorage = window.localStorage;
await import(pathToFileURL(join(temporal, 'home.js')).href);

const destacadas = [...d.querySelectorAll('#homeFeatured .feat-card')];
prueba('la portada muestra entre 3 y 6 lecciones destacadas',
  destacadas.length >= 3 && destacadas.length <= 6, `${destacadas.length} tarjetas`);
prueba('cada destacada dice duración, edad, pasaje y materiales',
  destacadas.length > 0 && destacadas.every(card => {
    const texto = card.textContent;
    return card.querySelectorAll('.feat-facts li').length === 3
      && /minutos/.test(texto) && /años/.test(texto) && /Materiales/.test(texto);
  }));
prueba('cada destacada lleva su etiqueta y abre la clase',
  destacadas.every(card => card.querySelector('.feat-badge')?.textContent.trim()
    && /^\/lecciones\/[a-z0-9-]+\/$/.test(card.querySelector('.feat-open')?.getAttribute('href') || '')));

const continuar = d.querySelector('#homeResume .resume-card');
prueba('«Continúa donde quedaste» recupera la clase a medias',
  Boolean(continuar) && /Jon[áa]s/.test(continuar.textContent), continuar ? 'tarjeta presente' : 'sin tarjeta');

const planes = [...d.querySelectorAll('#homePlans .plan-card')];
prueba('la portada propone tres planes de enseñanza', planes.length === 3, `${planes.length}`);
prueba('cada plan dice cuántas clases tiene y por cuál seguir',
  planes.every(card => /clases/.test(card.textContent) && card.querySelector('.plan-next')));

console.log(errores.length ? '\n❌ errores JS:\n  ' + errores.join('\n  ') : '\n✅ sin errores de JavaScript');
console.log(fallos ? `\n${fallos} prueba(s) fallida(s)` : '\n🎉 todas las pruebas pasaron');
window.close();
process.exit(fallos || errores.length ? 1 : 0);
