#!/usr/bin/env node
/**
 * revisar-cobertura.mjs
 * ---------------------------------------------------------------------------
 * Comprueba que NINGUNA lección del catálogo se quede a medias.
 *
 *     node tools/revisar-cobertura.mjs
 *
 * ¿Por qué existe? Al pasar de 31 a 39 clases, añadir una lección toca muchos
 * archivos: la carpeta de `/lecciones/`, dos portadas (1200 px y 800 px), una
 * entrada en `preschool-data.json`, los materiales de `home-destacadas.js` y
 * los datos del propio catálogo. Las otras revisiones miran cada pieza por
 * separado; ninguna miraba que TODAS las piezas de una misma clase existieran.
 * El resultado de olvidar una: la clase se publica sin ilustración, sin
 * materiales o sin hoja de párvulos, y nadie se entera.
 *
 * Revisa, lección por lección:
 *   1. Que exista su carpeta en /lecciones/ con index.html.
 *   2. Que existan sus dos portadas WebP (para redes sociales) y su portada
 *      SVG animada (la que se ve en el sitio), y que las tres estén completas.
 *   3. Que tenga su versión para 3 a 5 años en `preschool-data.json`.
 *   4. Que tenga su lista de materiales en `home-destacadas.js`.
 *   5. Que el contenido esté completo (historia, preguntas, quiz, actividad,
 *      versículo con enlace y oración) y que el quiz tenga una sola respuesta
 *      válida por pregunta.
 *   6. Que emojis, títulos y slugs no se repitan entre lecciones.
 *
 * No necesita instalar nada: usa únicamente Node.
 */
import { readFileSync, readdirSync, statSync, existsSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fallos = [];
const avisos = [];
const anotar = (archivo, texto) => fallos.push(`${archivo} → ${texto}`);

/* ------------------------------------------------------------------ *
 * El catálogo se carga tal como lo ve el navegador: `lesson-data.js`
 * importa con rutas absolutas ('/printables-data.js'), que Node no
 * entiende, así que se copia a una carpeta temporal con rutas relativas.
 * Lo que se revisa es el catálogo real, no una copia a mano.
 * ------------------------------------------------------------------ */
async function cargarCatalogo() {
  const temporal = mkdtempSync(join(tmpdir(), 'semillitas-cobertura-'));
  for (const archivo of readdirSync(RAIZ).filter((nombre) => nombre.endsWith('.js'))) {
    writeFileSync(
      join(temporal, archivo),
      readFileSync(join(RAIZ, archivo), 'utf8')
        .replace(/from\s+(['"])\/(?!\/)/g, 'from $1./')
        .replace(/import\(\s*(['"])\/(?!\/)/g, 'import($1./'),
    );
  }
  try {
    return await import(pathToFileURL(join(temporal, 'lesson-data.js')).href);
  } finally {
    rmSync(temporal, { recursive: true, force: true });
  }
}

const { LESSONS } = await cargarCatalogo();
const { MATERIALES } = await import(pathToFileURL(join(RAIZ, 'home-destacadas.js')).href);
const parvulos = JSON.parse(readFileSync(join(RAIZ, 'preschool-data.json'), 'utf8'));

/* Rutas de lección publicadas: una carpeta con index.html. */
const carpetas = readdirSync(join(RAIZ, 'lecciones')).filter((nombre) => {
  const ruta = join(RAIZ, 'lecciones', nombre);
  return statSync(ruta).isDirectory() && existsSync(join(ruta, 'index.html'));
});

const esTexto = (valor) => typeof valor === 'string' && valor.trim().length > 0;
const emojis = new Map();
const titulos = new Map();
const slugs = new Map();

for (const [indice, lesson] of LESSONS.entries()) {
  const donde = `lección ${String(indice + 1).padStart(2, '0')} (${lesson.slug ?? 'sin slug'})`;

  if (!esTexto(lesson.slug)) { anotar(donde, 'no tiene slug.'); continue; }
  if (!carpetas.includes(lesson.slug)) anotar(donde, `no existe /lecciones/${lesson.slug}/index.html.`);
  if (lesson.number !== indice + 1) anotar(donde, `su número es ${lesson.number} y le correspondería ${indice + 1}.`);

  /* Datos que cada página muestra en pantalla. */
  for (const campo of ['title', 'objective', 'reference', 'category', 'icon', 'age', 'duration', 'prayer']) {
    if (!esTexto(lesson[campo])) anotar(donde, `no tiene "${campo}".`);
  }
  if (lesson.bibleVersion !== 'Reina-Valera 1960 (RVR1960)')
    anotar(donde, `la versión bíblica es «${lesson.bibleVersion ?? 'ninguna'}» y debe ser la Reina-Valera 1960.`);
  if (!['Dios', 'Jesús', 'Carácter', 'Fe'].includes(lesson.category))
    anotar(donde, `la categoría «${lesson.category}» no está entre los filtros del catálogo.`);
  if (esTexto(lesson.prayer) && lesson.prayer.length < 80)
    avisos.push(`${donde}: la oración es muy corta (${lesson.prayer.length} caracteres).`);

  /* Portadas: la grande y la de 800 px (redes sociales) y la escena SVG. */
  for (const sufijo of ['.webp', '-800.webp']) {
    const ruta = join(RAIZ, 'images', 'lessons', `${lesson.slug}${sufijo}`);
    if (!existsSync(ruta)) anotar(donde, `falta la portada images/lessons/${lesson.slug}${sufijo}.`);
    else if (statSync(ruta).size < 20_480)
      anotar(donde, `la portada ${lesson.slug}${sufijo} pesa menos de 20 KB: puede estar dañada.`);
  }

  /* La portada que se ve en el catálogo y en la clase es un SVG animado. Debe
   * existir en las dos copias y conservar su lienzo y su respeto por quien
   * prefiere menos movimiento; si se rompe, la tarjeta queda en blanco. */
  for (const ruta of [
    join(RAIZ, 'images', 'lessons', `${lesson.slug}.svg`),
    join(RAIZ, 'v2', 'public', 'images', 'lessons', `${lesson.slug}.svg`),
  ]) {
    const nombre = ruta.replace(RAIZ + '/', '');
    if (!existsSync(ruta)) { anotar(donde, `falta la portada animada ${nombre}.`); continue; }
    const contenido = readFileSync(ruta, 'utf8');
    if (!contenido.includes('viewBox="0 0 600 400"'))
      anotar(donde, `${nombre} no tiene el lienzo de 600 × 400 de la colección.`);
    if (!contenido.includes('prefers-reduced-motion'))
      anotar(donde, `${nombre} no respeta prefers-reduced-motion.`);
    if (statSync(ruta).size < 6_000)
      anotar(donde, `${nombre} pesa muy poco: puede estar incompleta.`);
  }
  if (!String(lesson.coverImage).endsWith('.svg'))
    anotar(donde, `su portada (${lesson.coverImage}) no apunta al SVG animado.`);

  /* Contenido de la clase. */
  if (!Array.isArray(lesson.story) || lesson.story.length < 3)
    anotar(donde, 'la historia bíblica necesita al menos tres partes.');
  else if (lesson.story.some((parte) => !Array.isArray(parte) || !esTexto(parte[0]) || !esTexto(parte[1])))
    anotar(donde, 'alguna parte de la historia no tiene título o texto.');
  if (!Array.isArray(lesson.takeaways) || lesson.takeaways.length < 3)
    anotar(donde, 'faltan las verdades para repetir (al menos tres).');
  if (!Array.isArray(lesson.questions) || lesson.questions.length < 5)
    anotar(donde, 'faltan preguntas para conversar (al menos cinco).');

  if (!Array.isArray(lesson.quiz) || lesson.quiz.length !== 3) {
    anotar(donde, 'el mini quiz debe tener tres preguntas.');
  } else {
    lesson.quiz.forEach((pregunta, posicion) => {
      const cual = `la pregunta ${posicion + 1} del quiz`;
      if (!esTexto(pregunta.question)) anotar(donde, `${cual} no tiene enunciado.`);
      if (!Array.isArray(pregunta.options) || pregunta.options.length !== 3)
        anotar(donde, `${cual} necesita tres opciones.`);
      else if (pregunta.options.some((opcion) => !esTexto(opcion)))
        anotar(donde, `${cual} tiene una opción vacía.`);
      else if (!Number.isInteger(pregunta.answer) || pregunta.answer < 0 || pregunta.answer > 2)
        anotar(donde, `${cual} no marca cuál es la respuesta correcta.`);
    });
  }

  if (!lesson.activity || !esTexto(lesson.activity.title) || !Array.isArray(lesson.activity.steps) || lesson.activity.steps.length < 3)
    anotar(donde, 'la actividad necesita título y al menos tres pasos.');

  const memoria = lesson.memory ?? {};
  if (!esTexto(memoria.text) || !esTexto(memoria.reference))
    anotar(donde, 'falta el versículo para memorizar con su referencia.');
  else if (!esTexto(memoria.sourceUrl) || !memoria.sourceUrl.startsWith('https://'))
    anotar(donde, 'el versículo no enlaza a su fuente en línea.');
  if (!esTexto(lesson.printable)) anotar(donde, 'no enlaza a su material imprimible.');
  if (!esTexto(lesson.videoId) && !esTexto(lesson.videoQuery))
    anotar(donde, 'no ofrece ni video ni búsqueda de video.');
  if (esTexto(lesson.videoId) && !/^[\w-]{11}$/.test(lesson.videoId))
    anotar(donde, `el identificador de video «${lesson.videoId}» no parece válido.`);

  /* Ayudas de 3 a 5 años: una entrada por lección, en el mismo orden. */
  const dibujo = parvulos[indice];
  if (!Array.isArray(dibujo) || !esTexto(dibujo[0]) || !esTexto(dibujo[1]))
    anotar(donde, 'preschool-data.json no tiene su consigna de dibujo y su actividad corta en esa posición.');

  /* Materiales de la portada. */
  if (!MATERIALES[lesson.slug]) avisos.push(`${donde}: usa la lista de materiales general de la portada.`);

  /* Nada se repite: el emoji va en el catálogo, la ruleta y los planes. */
  for (const [mapa, valor, etiqueta] of [[emojis, lesson.icon, 'emoji'], [titulos, lesson.title, 'título'], [slugs, lesson.slug, 'slug']]) {
    if (!esTexto(valor)) continue;
    if (mapa.has(valor)) anotar(donde, `el ${etiqueta} «${valor}» ya lo usa ${mapa.get(valor)}.`);
    else mapa.set(valor, donde);
  }
}

if (carpetas.length !== LESSONS.length)
  anotar('catálogo', `hay ${carpetas.length} carpetas de lección y ${LESSONS.length} lecciones en lesson-data.js.`);
if (parvulos.length < LESSONS.length)
  anotar('preschool-data.json', `tiene ${parvulos.length} entradas y hay ${LESSONS.length} lecciones.`);

/* --------------------------------------------------------------------------- */
console.log('\n🧩 Revisión de cobertura del catálogo\n');
console.log(`   Lecciones:            ${LESSONS.length}`);
console.log(`   Carpetas publicadas:  ${carpetas.length}`);
console.log(`   Consignas de párvulos: ${parvulos.length}`);
console.log(`   Listas de materiales:  ${Object.keys(MATERIALES).length}\n`);

if (avisos.length) {
  console.log('⚠️  Avisos (no rompen el sitio):');
  for (const aviso of avisos) console.log(`   · ${aviso}`);
  console.log('');
}

if (fallos.length) {
  console.log(`❌ ${fallos.length} problema(s):\n`);
  for (const fallo of fallos) console.log(`   · ${fallo}`);
  console.log();
  process.exit(1);
}

console.log(`✅ Las ${LESSONS.length} lecciones tienen su página, sus portadas, sus ayudas y su contenido completo.\n`);
