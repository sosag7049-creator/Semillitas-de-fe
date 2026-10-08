#!/usr/bin/env node
/**
 * Comprobaciones estáticas de rutas, modo sin conexión y accesibilidad global.
 * No requiere instalar dependencias.
 *
 *   node tools/revisar-plataforma.mjs
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errores = [];

async function listar(dir) {
  const salida = [];
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    if (entrada.name === '.git' || entrada.name === 'node_modules') continue;
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) salida.push(...await listar(ruta));
    else if (entrada.isFile()) salida.push(ruta);
  }
  return salida;
}

function exigir(condicion, mensaje) {
  if (!condicion) errores.push(mensaje);
}

async function existe(urlPath) {
  const limpia = decodeURIComponent(urlPath.split(/[?#]/, 1)[0]);
  const relativa = limpia.replace(/^\/+/, '');
  const candidatos = limpia.endsWith('/')
    ? [join(ROOT, relativa, 'index.html')]
    : [join(ROOT, relativa), join(ROOT, relativa, 'index.html')];
  for (const candidato of candidatos) {
    const normalizada = resolve(candidato);
    if (normalizada !== ROOT && !normalizada.startsWith(ROOT + sep)) continue;
    try {
      if ((await stat(normalizada)).isFile()) return true;
    } catch {
      // La ruta podría ser una carpeta con su propio index.html.
    }
  }
  return false;
}

const archivos = await listar(ROOT);
const paginas = archivos.filter(ruta => ruta.endsWith('.html'));
for (const archivo of paginas) {
  const html = await readFile(archivo, 'utf8');
  const nombre = relative(ROOT, archivo);
  const skip = html.match(/<a\b[^>]*\bclass=["'][^"']*\bskip-link\b[^"']*["'][^>]*\bhref=["']#([^"']+)["'][^>]*>/i);
  const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(match => match[1]));
  exigir(Boolean(skip), `${nombre}: falta el enlace para saltar al contenido.`);
  if (skip) exigir(ids.has(skip[1]), `${nombre}: el destino del enlace de salto no existe.`);
  exigir(html.includes('/accessibility.css?v=1'), `${nombre}: falta la hoja de accesibilidad compartida.`);
  exigir(html.includes('/pwa-register.js?v=1'), `${nombre}: falta el registro universal de la PWA.`);
}

const serviceWorker = await readFile(join(ROOT, 'sw.js'), 'utf8');
const bloquesCache = [
  ...[...serviceWorker.matchAll(/(?:CORE|ACCOUNT_ASSETS)\s*=\s*\[([\s\S]*?)\]/g)].map(match => match[1]),
  ...[...serviceWorker.matchAll(/CORE\.push\(([^;]+)\)/g)].map(match => match[1]),
];
const rutasDelCache = [...new Set(bloquesCache
  .flatMap(bloque => [...bloque.matchAll(/["']([^"']+)["']/g)].map(match => match[1]))
  .filter(path => path.startsWith('/')))];
for (const ruta of rutasDelCache) {
  if (!await existe(ruta)) errores.push(`sw.js: la ruta de caché no existe: ${ruta}`);
}
exigir(rutasDelCache.some(path => path.startsWith('/pwa-register.js')),
  'sw.js: no incluye el script de registro PWA necesario para trabajar sin conexión.');
exigir(rutasDelCache.some(path => path.startsWith('/accessibility.css')),
  'sw.js: no incluye la hoja de accesibilidad necesaria para las páginas sin conexión.');
exigir(serviceWorker.includes('CACHE_CURRENT_PAGE'),
  'sw.js: falta guardar la página de entrada directa para usarla sin conexión.');

const moduloLeccion = serviceWorker.match(/["']\/lesson-page\.js\?v=(\d+)["']/);
exigir(Boolean(moduloLeccion), 'sw.js: no declara la versión del módulo de lección.');
const lecciones = archivos.filter(ruta => /\/lecciones\/[^/]+\/index\.html$/.test(ruta));
exigir(lecciones.length > 0, 'No se encontraron páginas de lección.');
for (const archivo of lecciones) {
  const html = await readFile(archivo, 'utf8');
  exigir(html.includes(`lesson-page.js?v=${moduloLeccion?.[1]}`),
    `${relative(ROOT, archivo)}: versión del módulo de lección desactualizada.`);
}

const paginaSeries = await readFile(join(ROOT, 'series/index.html'), 'utf8');
const moduloSeries = serviceWorker.match(/["']\/series-page\.js\?v=(\d+)["']/);
exigir(Boolean(moduloSeries) && paginaSeries.includes(`series-page.js?v=${moduloSeries?.[1]}`),
  'series/index.html: falta cargar la versión vigente del módulo de planes.');
exigir(paginaSeries.includes('id="seriesGrid"') && paginaSeries.includes('id="seriesIntro"') && paginaSeries.includes('id="next"'),
  'series/index.html: falta un contenedor que usa la página de planes.');
exigir(/<meta name="twitter:title"[^>]*>/.test(paginaSeries),
  'series/index.html: la etiqueta de título para compartir está mal formada.');
exigir(/<\/body>\s*<\/html>\s*$/.test(paginaSeries),
  'series/index.html: el documento no tiene cierres HTML completos.');

if (errores.length) {
  console.error(`\n❌ ${errores.length} problema(s) de plataforma:`);
  errores.forEach(error => console.error(`   • ${error}`));
  process.exitCode = 1;
} else {
  console.log(`✅ ${paginas.length} páginas HTML: accesibilidad y registro PWA presentes.`);
  console.log(`✅ ${rutasDelCache.length} rutas de caché del service worker existen.`);
  console.log(`✅ ${lecciones.length} páginas de lección usan la versión actual.`);
}
