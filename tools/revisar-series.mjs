#!/usr/bin/env node
/**
 * revisar-series.mjs
 * ---------------------------------------------------------------------------
 * Comprueba que los planes de enseñanza de `series-data.js` sean coherentes:
 *
 *   1. Cada slug referenciado existe de verdad como carpeta en /lecciones/.
 *   2. Ninguna serie repite la misma lección dos veces.
 *   3. Los identificadores de serie no se repiten.
 *   4. Informa qué lecciones del catálogo no aparecen en ninguna serie.
 *
 * Uso:
 *     node tools/revisar-series.mjs
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..');

/* --------------------------------------------------------------------------
 * series-data.js importa con rutas absolutas del navegador («/...»), que Node
 * no sabe resolver. Como este archivo no importa nada, basta con leerlo y
 * evaluar el literal.
 * ----------------------------------------------------------------------- */
function cargarSeries() {
  const texto = readFileSync(join(RAIZ, 'series-data.js'), 'utf8');
  const inicio = texto.indexOf('export const SERIES');
  const corchete = texto.indexOf('[', inicio);
  let profundidad = 0;
  let fin = corchete;
  for (; fin < texto.length; fin += 1) {
    if (texto[fin] === '[') profundidad += 1;
    else if (texto[fin] === ']') {
      profundidad -= 1;
      if (profundidad === 0) break;
    }
  }
  // eslint-disable-next-line no-eval
  return eval(texto.slice(corchete, fin + 1));
}

/** Lecciones publicadas: una carpeta por lección dentro de /lecciones/. */
function leccionesPublicadas() {
  const dir = join(RAIZ, 'lecciones');
  return new Set(
    readdirSync(dir).filter((nombre) => {
      const ruta = join(dir, nombre);
      return statSync(ruta).isDirectory() && existsSync(join(ruta, 'index.html'));
    }),
  );
}

const series = cargarSeries();
const publicadas = leccionesPublicadas();
const problemas = [];
const usadas = new Set();
const idsVistos = new Set();

for (const serie of series) {
  const donde = `«${serie.title}»`;

  if (idsVistos.has(serie.id)) {
    problemas.push(`${donde}: el identificador «${serie.id}» está repetido.`);
  }
  idsVistos.add(serie.id);

  if (!serie.lessons?.length) {
    problemas.push(`${donde}: no tiene ninguna lección.`);
    continue;
  }

  const enEstaSerie = new Set();
  for (const slug of serie.lessons) {
    if (!publicadas.has(slug)) {
      problemas.push(`${donde}: la lección «${slug}» no existe en /lecciones/.`);
    }
    if (enEstaSerie.has(slug)) {
      problemas.push(`${donde}: la lección «${slug}» aparece dos veces.`);
    }
    enEstaSerie.add(slug);
    usadas.add(slug);
  }
}

// ---------------------------------------------------------------------------
// Informe
// ---------------------------------------------------------------------------
console.log('\n📚 Revisión de los planes de enseñanza\n');
console.log(`   Series definidas:     ${series.length}`);
console.log(`   Lecciones publicadas: ${publicadas.size}`);
console.log(`   Lecciones usadas:     ${usadas.size}\n`);

for (const serie of series) {
  const semanas = serie.lessons.length;
  console.log(
    `   ${serie.emoji}  ${serie.title.padEnd(36)} ${String(semanas).padStart(2)} semanas · ${serie.audience}`,
  );
}

const sueltas = [...publicadas].filter((slug) => !usadas.has(slug)).sort();
if (sueltas.length) {
  console.log(`\n   ℹ️  ${sueltas.length} lección(es) sin serie todavía:`);
  console.log(`      ${sueltas.join(', ')}`);
}

if (problemas.length) {
  console.log(`\n❌ ${problemas.length} problema(s):\n`);
  problemas.forEach((p) => console.log(`   · ${p}`));
  console.log();
  process.exit(1);
}

console.log('\n✅ Todos los planes apuntan a lecciones que existen.\n');
