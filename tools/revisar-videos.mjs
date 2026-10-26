#!/usr/bin/env node
/**
 * revisar-videos.mjs
 * ---------------------------------------------------------------------------
 * Revisa el video de cada lección del catálogo.
 *
 *     node tools/revisar-videos.mjs              # revisión local, sin internet
 *     node tools/revisar-videos.mjs --en-linea   # además comprueba cada video
 *
 * ¿Por qué existe? `lesson-page.js` incrusta el video solo cuando la clase
 * tiene un `videoId` revisado; si no, muestra una búsqueda guiada en YouTube.
 * Esa decisión es buena (ningún maestro proyecta un video que no corresponde),
 * pero nadie miraba el catálogo completo para saber *cuántas* clases están
 * todavía a medias. Al añadir el cuarto bloque llegaron ocho clases sin video:
 * siete se quedaban con la búsqueda para siempre sin que nada lo recordara.
 *
 * Revisa, lección por lección:
 *   1. Que el `videoId` tenga la forma de un identificador de YouTube
 *      (11 caracteres) y que el `videoUrl` apunte a ese mismo video.
 *   2. Que ninguna clase repita el video de otra (síntoma de copiar y pegar).
 *   3. Que toda clase tenga al menos una salida: video revisado o búsqueda.
 *   4. Avisa de las clases que todavía no tienen video revisado.
 *   5. Con `--en-linea`, consulta el oEmbed de YouTube para confirmar que el
 *      video existe, es público y se puede insertar, y muestra su título y su
 *      canal, que es lo que un maestro debería leer antes de proyectarlo.
 *      Un video que no responde al oEmbed no se puede incrustar en la clase.
 *
 * El catálogo se carga igual que en el navegador (copiando los módulos del v1 a
 * una carpeta temporal con rutas relativas), así que se revisa el contenido
 * real y no una copia mantenida a mano.
 *
 * Devuelve código de salida 1 si hay algo roto, para poder usarlo antes de
 * publicar. Las clases sin video son solo avisos.
 */
import { readdirSync, readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const EN_LINEA = process.argv.includes('--en-linea');

const fallos = [];
const avisos = [];
const anotar = (slug, texto) => fallos.push(`${slug} → ${texto}`);

async function cargarCatalogo() {
  const temporal = mkdtempSync(join(tmpdir(), 'semillitas-videos-'));
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

const esTexto = (valor) => typeof valor === 'string' && valor.trim() !== '';
const PATRON_ID = /^[\w-]{11}$/;
const buscar = (consulta) => `https://www.youtube.com/results?search_query=${encodeURIComponent(consulta)}`;

/* ------------------------------------------------------------------ *
 * 1. Revisión local: identificadores, enlaces y repeticiones
 * ------------------------------------------------------------------ */
const { LESSONS } = await cargarCatalogo();
const usados = new Map();

for (const lesson of LESSONS) {
  const slug = lesson.slug ?? '(sin slug)';
  const id = lesson.videoId;
  const consulta = lesson.videoQuery;

  if (!esTexto(id) && !esTexto(consulta))
    anotar(slug, 'no ofrece ni video revisado ni búsqueda guiada.');

  if (esTexto(id)) {
    if (!PATRON_ID.test(id)) {
      anotar(slug, `el identificador de video «${id}» no parece válido.`);
    } else if (usados.has(id)) {
      anotar(slug, `repite el video de ${usados.get(id)} (${id}).`);
    } else {
      usados.set(id, slug);
    }

    const esperado = `https://www.youtube.com/watch?v=${id}`;
    if (lesson.videoUrl !== esperado)
      anotar(slug, `el enlace «${lesson.videoUrl}» no apunta al video ${id}.`);

    if (!esTexto(consulta))
      avisos.push(`${slug}: tiene video pero no palabras de búsqueda de respaldo.`);
  } else {
    const esperado = buscar(consulta ?? '');
    if (lesson.videoUrl !== esperado)
      anotar(slug, 'no tiene video y su búsqueda guiada no coincide con las palabras clave.');
    avisos.push(`${slug}: sin video revisado; la clase muestra la búsqueda guiada.`);
  }
}

/* ------------------------------------------------------------------ *
 * 2. Revisión en línea: ¿el video existe, es público y se puede insertar?
 * ------------------------------------------------------------------ */
const enLinea = new Map();

if (EN_LINEA) {
  const ids = [...usados.keys()];
  process.stdout.write(`\n🌐 Comprobando ${ids.length} videos en YouTube…\n`);

  for (const id of ids) {
    const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`;
    try {
      const respuesta = await fetch(oembed, { signal: AbortSignal.timeout(15000) });
      if (!respuesta.ok) {
        anotar(usados.get(id), `el video ${id} no se puede insertar (YouTube respondió ${respuesta.status}).`);
        continue;
      }
      const datos = await respuesta.json();
      if (!esTexto(datos.title)) {
        anotar(usados.get(id), `el video ${id} no devolvió título; puede estar retirado o privado.`);
        continue;
      }
      enLinea.set(id, { title: datos.title, author: datos.author_name ?? '(sin canal)' });
    } catch (error) {
      anotar(usados.get(id), `no se pudo confirmar el video ${id}: ${error.message}.`);
    }
  }
}

/* ------------------------------------------------------------------ *
 * 3. Resumen
 * ------------------------------------------------------------------ */
const conVideo = LESSONS.filter((lesson) => esTexto(lesson.videoId)).length;
const sinVideo = LESSONS.length - conVideo;

console.log('\n📺 Revisión de videos del catálogo\n');
console.log(`   Lecciones:            ${LESSONS.length}`);
console.log(`   Con video revisado:   ${conVideo}`);
console.log(`   Con búsqueda guiada:  ${sinVideo}\n`);

if (EN_LINEA && enLinea.size) {
  console.log('🎬 Videos confirmados en YouTube:\n');
  for (const lesson of LESSONS) {
    const datos = enLinea.get(lesson.videoId);
    if (!datos) continue;
    console.log(`   · ${lesson.slug}`);
    console.log(`     «${datos.title}» — ${datos.author}`);
  }
  console.log('');
}

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

console.log(
  sinVideo === 0
    ? `✅ Las ${LESSONS.length} lecciones tienen un video revisado.\n`
    : `✅ ${conVideo} lecciones con video revisado y ${sinVideo} con búsqueda guiada, sin enlaces rotos.\n`,
);
