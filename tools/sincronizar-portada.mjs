#!/usr/bin/env node
/**
 * Sincroniza el catálogo de la portada (index.html) con la fuente de verdad.
 *
 *   node tools/sincronizar-portada.mjs            → muestra las diferencias
 *   node tools/sincronizar-portada.mjs --escribir → además corrige index.html
 *
 * POR QUÉ EXISTE ESTE ARCHIVO
 * ---------------------------
 * La portada necesita el catálogo de lecciones ya disponible cuando corren sus
 * scripts, así que lo lleva escrito dentro del propio index.html (el array `L`).
 * Las demás páginas lo leen de `printables-data.js` y `additional-lessons*.js`.
 *
 * Eso significaba mantener las 31 lecciones en DOS lugares a mano. Con este
 * script ya no: se edita solo `printables-data.js` (y los bloques adicionales)
 * y luego se ejecuta esto para que la portada quede igual.
 *
 * No necesita instalar nada: usa únicamente Node.
 */
import { readFileSync, writeFileSync, mkdtempSync, copyFileSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ESCRIBIR = process.argv.includes('--escribir');

/* ------------------------------------------------------------------ *
 * 1. Cargar los módulos del sitio.
 *    Usan rutas absolutas ('/printables-data.js') porque están pensados
 *    para el navegador, y Node no las entiende. Se copian a una carpeta
 *    temporal con las rutas en relativo para poder importarlos.
 * ------------------------------------------------------------------ */
async function cargarModulos() {
  const temporal = mkdtempSync(join(tmpdir(), 'semillitas-'));
  for (const archivo of readdirSync(RAIZ).filter(n => n.endsWith('.js'))) {
    const contenido = readFileSync(join(RAIZ, archivo), 'utf8')
      .replace(/from\s+(['"])\/(?!\/)/g, 'from $1./')
      .replace(/import\(\s*(['"])\/(?!\/)/g, 'import($1./');
    writeFileSync(join(temporal, archivo), contenido);
  }
  const url = nombre => pathToFileURL(join(temporal, nombre)).href;
  const [printables, extra1, extra2, extra3] = await Promise.all([
    import(url('printables-data.js')),
    import(url('additional-lessons.js')),
    import(url('additional-lessons-2.js')),
    import(url('additional-lessons-3.js')),
  ]);
  // Los emojis de las 24 primeras lecciones viven en lesson-data.js.
  const iconosBase = JSON.parse(
    (readFileSync(join(RAIZ, 'lesson-data.js'), 'utf8').match(/const icons=(\[[^\]]+\])/) || [])[1]
      .replace(/'/g, '"')
  );
  return {
    PRINTABLES: printables.PRINTABLES,
    EXTRAS: [...extra1.ADDITIONAL_LESSONS, ...extra2.SECOND_BLOCK, ...extra3.THIRD_BLOCK],
    iconosBase,
  };
}

/* ------------------------------------------------------------------ *
 * 2. Construir las tuplas tal como las espera la portada.
 *    Orden de los 12 campos de cada lección en el array `L`:
 *    0 título · 1 pasaje · 2 categoría · 3 emoji · 4 objetivo
 *    5 narración · 6 dinámica · 7 manualidad · 8 preguntas (separadas por |)
 *    9 aplicación · 10 versión sencilla (3-5 años) · 11 versión profunda (6-10)
 * ------------------------------------------------------------------ */
function construirTuplas({ PRINTABLES, EXTRAS, iconosBase }) {
  return PRINTABLES.map((base, i) => {
    const emoji = i < iconosBase.length ? iconosBase[i] : (EXTRAS[i - iconosBase.length]?.icon ?? '📖');
    return [
      base.title, base.reference, base.category, emoji, base.objective,
      base.narration, base.dynamic, base.craft, base.questions.join('|'),
      base.application, base.simple, base.deep,
    ].map(valor => String(valor ?? ''));
  });
}

/* ------------------------------------------------------------------ *
 * 3. Leer el array `L` que hay hoy dentro de index.html.
 * ------------------------------------------------------------------ */
function localizarArrayL(html) {
  const marca = html.indexOf('const L=[');
  if (marca < 0) throw new Error('No se encontró "const L=[" en index.html');
  const inicio = html.indexOf('[', marca);
  let profundidad = 0;
  for (let k = inicio; k < html.length; k++) {
    if (html[k] === '[') profundidad++;
    else if (html[k] === ']' && --profundidad === 0) return { inicio, fin: k + 1, texto: html.slice(inicio, k + 1) };
  }
  throw new Error('El array "L" de index.html está mal cerrado');
}

/* ------------------------------------------------------------------ *
 * 4. Serializar con el mismo estilo del archivo: una lección por línea
 *    y comillas simples.
 * ------------------------------------------------------------------ */
const comillaSimple = texto => "'" + texto.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
const serializar = tuplas => '[\n' + tuplas.map(t => '[' + t.map(comillaSimple).join(',') + ']').join(',\n') + ']';

/* ------------------------------------------------------------------ *
 * 5. Comparar y, si se pide, escribir.
 * ------------------------------------------------------------------ */
const NOMBRES = ['título', 'pasaje', 'categoría', 'emoji', 'objetivo', 'narración', 'dinámica',
  'manualidad', 'preguntas', 'aplicación', 'versión sencilla', 'versión profunda'];

const datos = await cargarModulos();
const esperadas = construirTuplas(datos);
const html = readFileSync(join(RAIZ, 'index.html'), 'utf8');
const bloque = localizarArrayL(html);
const actuales = eval(bloque.texto);

let diferencias = 0;
if (actuales.length !== esperadas.length) {
  console.log(`⚠️  La portada tiene ${actuales.length} lecciones y la fuente de verdad ${esperadas.length}.`);
  diferencias++;
}
for (let i = 0; i < Math.min(actuales.length, esperadas.length); i++) {
  for (let c = 0; c < esperadas[i].length; c++) {
    if (String(actuales[i][c] ?? '') !== esperadas[i][c]) {
      diferencias++;
      console.log(`⚠️  Lección ${String(i + 1).padStart(2, '0')} (${esperadas[i][0]}) · ${NOMBRES[c]}`);
      console.log(`    portada: ${JSON.stringify(String(actuales[i][c] ?? '')).slice(0, 110)}`);
      console.log(`    fuente : ${JSON.stringify(esperadas[i][c]).slice(0, 110)}`);
    }
  }
}

if (!diferencias) {
  console.log(`✅ La portada está sincronizada: ${esperadas.length} lecciones, sin diferencias.`);
} else if (ESCRIBIR) {
  writeFileSync(join(RAIZ, 'index.html'), html.slice(0, bloque.inicio) + serializar(esperadas) + html.slice(bloque.fin));
  console.log(`\n✍️  index.html actualizado: ${diferencias} diferencia(s) corregida(s).`);
} else {
  console.log(`\n${diferencias} diferencia(s). Ejecuta con --escribir para corregir index.html.`);
  process.exitCode = 1;
}
