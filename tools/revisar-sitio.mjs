#!/usr/bin/env node
/**
 * revisar-sitio.mjs
 * ---------------------------------------------------------------------------
 * Revisión estructural de todo el sitio, sin instalar nada.
 *
 *     node tools/revisar-sitio.mjs
 *
 * Nació después de encontrar que `/series/` se había subido cortada: le
 * faltaban el cierre del footer y las etiquetas <script>, así que la página
 * cargaba en blanco con un «Cargando los planes…» eterno. Nada avisaba.
 *
 * Comprueba:
 *   1. Que cada página HTML esté completa (head/body/main cerrados y </html>).
 *   2. Que ninguna página que depende de JavaScript se quede sin su <script>.
 *   3. Que todos los href/src internos apunten a un archivo que existe.
 *   4. Que los recursos con ?v= usen la misma versión en todas partes
 *      (si no coinciden, el service worker guarda una copia vieja).
 *   5. Que todo lo que precarga sw.js exista: si falla un solo archivo,
 *      `cache.addAll` se cae entero y el modo sin conexión deja de funcionar.
 *   6. Que las etiquetas <meta> no lleven HTML dentro del content.
 *   7. Que cada lección tenga canonical, descripción propia e imagen real.
 *
 * Devuelve código de salida 1 si encuentra algo, para poder usarlo en CI.
 */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITIO = 'https://semillitasbiblicas.space';
const fallos = [];
const avisos = [];
const anotar = (lista, archivo, texto) => lista.push(`${archivo} → ${texto}`);

/* ------------------------------------------------------------------ */
function recorrer(dir, salida = []) {
  for (const entrada of readdirSync(dir)) {
    if (entrada === '.git' || entrada === 'node_modules') continue;
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) recorrer(ruta, salida);
    else salida.push(ruta);
  }
  return salida;
}

const archivos = recorrer(RAIZ);
const relativo = (ruta) => ruta.replace(RAIZ + '/', '');
const paginas = archivos.filter((f) => f.endsWith('.html')).sort();

/* 1 y 2 · Páginas completas y con su JavaScript ---------------------- */
for (const archivo of paginas) {
  const html = readFileSync(archivo, 'utf8');
  const nombre = relativo(archivo);

  if (!html.trimEnd().endsWith('</html>'))
    anotar(fallos, nombre, 'el archivo está cortado: no termina en </html>');

  for (const etiqueta of ['head', 'body']) {
    const abre = (html.match(new RegExp(`<${etiqueta}[\\s>]`, 'g')) || []).length;
    const cierra = (html.match(new RegExp(`</${etiqueta}>`, 'g')) || []).length;
    if (abre !== cierra)
      anotar(fallos, nombre, `<${etiqueta}> abierto ${abre} vez/veces y cerrado ${cierra}`);
  }

  /* Una página con contenedores vacíos que solo rellena el JavaScript se ve
   * en blanco si olvidamos la etiqueta <script>. */
  const esperaJs = /id="(grid|seriesGrid|printRoot|lessonApp|memoryBoard)"/.test(html);
  const traeJs = /<script[^>]*\ssrc="/.test(html) || /<script\s+type="module"\s*>/.test(html);
  if (esperaJs && !traeJs)
    anotar(fallos, nombre, 'tiene contenedores que rellena el JavaScript pero no carga ningún <script>');
}

/* 3 · Enlaces y recursos internos ------------------------------------ */
const ATRIBUTOS = /\b(?:href|src|poster)\s*=\s*"([^"]+)"/g;
for (const archivo of paginas) {
  const html = readFileSync(archivo, 'utf8');
  const nombre = relativo(archivo);
  const vistos = new Set();
  for (const coincidencia of html.matchAll(ATRIBUTOS)) {
    const original = coincidencia[1].trim();
    if (vistos.has(original)) continue;
    vistos.add(original);
    if (!original || original.includes('${')) continue;
    if (/^(https?:|\/\/|#|data:|mailto:|tel:|javascript:)/i.test(original)) continue;
    const limpio = original.split('#')[0].split('?')[0];
    if (!limpio) continue;
    const destino = limpio.startsWith('/')
      ? join(RAIZ, limpio)
      : resolve(dirname(archivo), limpio);
    const existe = existsSync(destino)
      ? statSync(destino).isDirectory()
        ? existsSync(join(destino, 'index.html'))
        : true
      : false;
    if (!existe) anotar(fallos, nombre, `enlace roto: ${original}`);
  }
}

/* 4 y 5 · Versiones (?v=) y precarga del service worker --------------- */
const codigo = archivos.filter((f) => /\.(html|js)$/.test(f));
const versiones = new Map(); // '/archivo.js' → Map(versión → [páginas])
for (const archivo of codigo) {
  const texto = readFileSync(archivo, 'utf8');
  const nombre = relativo(archivo);
  for (const m of texto.matchAll(
    /['"(]\s*(\/[A-Za-z0-9._/-]+\.(?:mjs|js|css|json|webp|png|jpg|mp4))(\?v=\d+)?(?=['")])/g,
  )) {
    // `document.querySelector('link[href^="/sion-ui.css"]')` no es una
    // petición del recurso, es una búsqueda en el DOM: no cuenta como versión.
    if (texto.slice(Math.max(0, m.index - 12), m.index).includes('[href')) continue;
    const recurso = m[1];
    if (!existsSync(join(RAIZ, recurso))) {
      anotar(fallos, nombre, `apunta a un archivo que no existe: ${recurso}`);
      continue;
    }
    if (!versiones.has(recurso)) versiones.set(recurso, new Map());
    const mapa = versiones.get(recurso);
    const v = m[2] || '';
    if (!mapa.has(v)) mapa.set(v, new Set());
    mapa.get(v).add(nombre);
  }
}
for (const [recurso, mapa] of [...versiones].sort()) {
  if (mapa.size < 2) continue;
  const detalle = [...mapa]
    .map(([v, donde]) => `"${v || 'sin versión'}" en ${[...donde].join(', ')}`)
    .join(' · ');
  anotar(avisos, recurso, `se pide con versiones distintas: ${detalle}`);
}

const sw = readFileSync(join(RAIZ, 'sw.js'), 'utf8');
for (const m of sw.matchAll(/'(\/[^']*)'/g)) {
  const ruta = m[1];
  if (ruta.includes('${')) continue;
  const limpio = ruta.split('?')[0];
  const destino = limpio.endsWith('/') ? join(RAIZ, limpio, 'index.html') : join(RAIZ, limpio);
  if (!existsSync(destino))
    anotar(fallos, 'sw.js', `precarga un archivo inexistente (${ruta}); cache.addAll fallaría entero`);
}

/* 6 · Etiquetas meta --------------------------------------------------- */
for (const archivo of paginas) {
  const html = readFileSync(archivo, 'utf8');
  const nombre = relativo(archivo);
  for (const m of html.matchAll(/<meta\s[^>]*content="([^"]*)"/g))
    if (/[<>]/.test(m[1]))
      anotar(fallos, nombre, `etiqueta <meta> mal cerrada: content="${m[1].slice(0, 60)}…"`);
  for (const bloque of html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g) || []) {
    try {
      JSON.parse(bloque.replace(/<script[^>]*>/, '').replace('</script>', ''));
    } catch (error) {
      anotar(fallos, nombre, `datos estructurados inválidos: ${error.message}`);
    }
  }
}

/* 7 · Lecciones -------------------------------------------------------- */
const carpetas = readdirSync(join(RAIZ, 'lecciones')).filter((e) => !e.includes('.')).sort();
const descripciones = new Map();
for (const slug of carpetas) {
  const nombre = `lecciones/${slug}/index.html`;
  const html = readFileSync(join(RAIZ, nombre), 'utf8');
  const leer = (re) => (html.match(re) || [])[1] || null;

  const canonical = leer(/rel="canonical" href="([^"]+)"/);
  if (canonical !== `${SITIO}/lecciones/${slug}/`)
    anotar(fallos, nombre, `canonical incorrecto: ${canonical}`);

  const marca = leer(/data-lesson="([^"]+)"/);
  if (marca && marca !== slug) anotar(fallos, nombre, `data-lesson="${marca}" no coincide con la carpeta`);

  const imagen = leer(/property="og:image" content="([^"]+)"/);
  if (imagen && !existsSync(join(RAIZ, imagen.replace(SITIO, ''))))
    anotar(fallos, nombre, `og:image apunta a una imagen inexistente: ${imagen}`);

  const descripcion = leer(/name="description" content="([^"]*)"/);
  if (!descripcion) anotar(fallos, nombre, 'sin meta description');
  else {
    if (descripcion.length < 70) anotar(avisos, nombre, `descripción muy corta (${descripcion.length} caracteres)`);
    if (descripcion.length > 180) anotar(avisos, nombre, `descripción muy larga (${descripcion.length} caracteres)`);
    const repetida = descripciones.get(descripcion);
    if (repetida) anotar(avisos, nombre, `comparte descripción con ${repetida}`);
    else descripciones.set(descripcion, nombre);
  }
}

/* Resultado ------------------------------------------------------------ */
console.log('\n🔍 Revisión del sitio\n');
console.log(`   Páginas HTML: ${paginas.length}`);
console.log(`   Lecciones:    ${carpetas.length}\n`);

if (avisos.length) {
  console.log('⚠️  Avisos (no rompen el sitio):');
  for (const aviso of avisos) console.log(`   · ${aviso}`);
  console.log('');
}

if (fallos.length) {
  console.log('❌ Problemas encontrados:');
  for (const fallo of fallos) console.log(`   · ${fallo}`);
  console.log(`\n   Total: ${fallos.length}\n`);
  process.exit(1);
}

console.log('✅ Sin páginas cortadas, enlaces rotos ni versiones descuadradas.\n');
