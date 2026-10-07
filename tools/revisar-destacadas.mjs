#!/usr/bin/env node
/**
 * revisar-destacadas.mjs
 * ---------------------------------------------------------------------------
 * Comprueba las lecciones destacadas de la portada (`home-destacadas.js`):
 *
 *   1. Cada slug destacado y cada slug de la rotación semanal existe de verdad
 *      como carpeta en /lecciones/.
 *   2. Ninguna lección sale dos veces en la portada (ni fija ni por rotación).
 *   3. Todas las lecciones publicadas tienen su lista de materiales.
 *   4. `MATERIALES` no guarda slugs que ya no existen.
 *
 * Un error aquí se vería en la portada como una tarjeta que no aparece o que
 * dice «Biblia, hojas y crayones» en vez de los materiales de la clase.
 *
 * Uso:
 *     node tools/revisar-destacadas.mjs
 */

import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..');

// home-destacadas.js no importa nada, así que Node puede cargarlo tal cual.
const { DESTACADAS, MATERIALES, ROTACION_SEMANAL, semanaActual } =
  await import(pathToFileURL(join(RAIZ, 'home-destacadas.js')).href);

/** Lecciones publicadas: una carpeta por lección dentro de /lecciones/. */
const publicadas = new Set(
  readdirSync(join(RAIZ, 'lecciones')).filter((nombre) => {
    const ruta = join(RAIZ, 'lecciones', nombre);
    return statSync(ruta).isDirectory() && existsSync(join(ruta, 'index.html'));
  }),
);

const problemas = [];
const fijas = new Set();

for (const ficha of DESTACADAS) {
  const donde = `«${ficha.etiqueta}»`;
  if (ficha.rotatoria) continue;
  if (!ficha.slug) {
    problemas.push(`${donde}: no indica ninguna lección (slug) ni es rotatoria.`);
    continue;
  }
  if (!publicadas.has(ficha.slug)) {
    problemas.push(`${donde}: la lección «${ficha.slug}» no existe en /lecciones/.`);
  }
  if (fijas.has(ficha.slug)) {
    problemas.push(`${donde}: la lección «${ficha.slug}» ya está destacada en otra tarjeta.`);
  }
  fijas.add(ficha.slug);
}

for (const slug of ROTACION_SEMANAL) {
  if (!publicadas.has(slug)) {
    problemas.push(`Rotación semanal: la lección «${slug}» no existe en /lecciones/.`);
  }
  if (fijas.has(slug)) {
    problemas.push(`Rotación semanal: «${slug}» también está fija; algún lunes saldría dos veces.`);
  }
}

const sinMateriales = [...publicadas].filter((slug) => !MATERIALES[slug]).sort();
const sobrantes = Object.keys(MATERIALES).filter((slug) => !publicadas.has(slug)).sort();
for (const slug of sobrantes) {
  problemas.push(`MATERIALES guarda «${slug}», que ya no existe en /lecciones/.`);
}

// ---------------------------------------------------------------------------
// Informe
// ---------------------------------------------------------------------------
console.log('\n⭐ Revisión de las lecciones destacadas de la portada\n');
console.log(`   Tarjetas destacadas:  ${DESTACADAS.length}`);
console.log(`   Rotación semanal:     ${ROTACION_SEMANAL.length} lecciones`);
console.log(`   Lecciones publicadas: ${publicadas.size}\n`);

for (const ficha of DESTACADAS) {
  const slug = ficha.rotatoria
    ? `${ROTACION_SEMANAL[semanaActual() % ROTACION_SEMANAL.length]} (esta semana)`
    : ficha.slug;
  console.log(`   ${ficha.etiqueta.padEnd(32)} → ${slug}`);
}

if (sinMateriales.length) {
  console.log(`\n   ℹ️  ${sinMateriales.length} lección(es) sin materiales propios (usarán la lista general):`);
  console.log(`      ${sinMateriales.join(', ')}`);
}

if (problemas.length) {
  console.log(`\n❌ ${problemas.length} problema(s):\n`);
  problemas.forEach((p) => console.log(`   · ${p}`));
  console.log();
  process.exit(1);
}

console.log('\n✅ Todas las tarjetas destacadas apuntan a lecciones que existen.\n');
