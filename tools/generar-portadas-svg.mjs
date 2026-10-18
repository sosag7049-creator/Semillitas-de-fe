#!/usr/bin/env node
/**
 * generar-portadas-svg.mjs
 * ---------------------------------------------------------------------------
 * Dibuja las 39 portadas de lección como SVG animados, sin depender de ninguna
 * imagen generada. Cada escena se compone con las piezas de `portadas-svg/`:
 * colinas, agua, árboles, personajes planos y detalles con movimiento suave.
 *
 *     node tools/generar-portadas-svg.mjs            Escribe las 39 portadas.
 *     node tools/generar-portadas-svg.mjs --revisar  Solo comprueba que existan.
 *
 * Se escriben dos copias, siempre idénticas:
 *   images/lessons/<slug>.svg          (sitio estático de la raíz)
 *   v2/public/images/lessons/<slug>.svg (app Next.js)
 *
 * Las portadas WebP anteriores se conservan: son las que usan `og:image` y las
 * vistas previas de las redes sociales, que no leen SVG animados.
 *
 * El resultado es autocontenido (estilos y animaciones dentro del propio SVG),
 * así que funciona igual dentro de una etiqueta <img> que abierto aparte. El
 * movimiento se apaga solo con `prefers-reduced-motion: reduce`.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { escenas1 } from './portadas-svg/escenas-1.mjs';
import { escenas2 } from './portadas-svg/escenas-2.mjs';
import { escenas3 } from './portadas-svg/escenas-3.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DESTINOS = [join(RAIZ, 'images', 'lessons'), join(RAIZ, 'v2', 'public', 'images', 'lessons')];
const soloRevisar = process.argv.includes('--revisar');

const ESCENAS = { ...escenas1, ...escenas2, ...escenas3 };

/** Los slugs salen del catálogo real, no de una lista copiada a mano. */
async function slugsDelCatalogo() {
  const temporal = join(RAIZ, '.portadas-tmp');
  const { readdirSync, rmSync } = await import('node:fs');
  mkdirSync(temporal, { recursive: true });
  writeFileSync(join(temporal, 'package.json'), '{"type":"module"}');
  for (const archivo of readdirSync(RAIZ).filter((nombre) => nombre.endsWith('.js'))) {
    const codigo = readFileSync(join(RAIZ, archivo), 'utf8')
      .replace(/from\s+(['"])\/(?!\/)/g, 'from $1./');
    writeFileSync(join(temporal, archivo), codigo);
  }
  try {
    const { LESSONS } = await import(pathToFileURL(join(temporal, 'lesson-data.js')).href);
    return LESSONS.map((leccion) => leccion.slug);
  } finally {
    rmSync(temporal, { recursive: true, force: true });
  }
}

const slugs = await slugsDelCatalogo();
const sinEscena = slugs.filter((slug) => !ESCENAS[slug]);
const sobrantes = Object.keys(ESCENAS).filter((slug) => !slugs.includes(slug));

if (sinEscena.length) {
  console.error(`❌ Faltan escenas para: ${sinEscena.join(', ')}`);
  process.exit(1);
}
if (sobrantes.length) {
  console.error(`❌ Hay escenas sin lección: ${sobrantes.join(', ')}`);
  process.exit(1);
}

const problemas = [];
let total = 0;

for (const slug of slugs) {
  const svg = ESCENAS[slug]();
  const bytes = Buffer.byteLength(svg);

  /* Controles de calidad mínimos: sin esto una escena podría romperse sin que
   * nadie lo note, porque un SVG inválido se ve como un hueco en blanco. */
  if (!svg.startsWith('<svg')) problemas.push(`${slug}: no empieza con <svg.`);
  if (!svg.includes('viewBox="0 0 600 400"')) problemas.push(`${slug}: le falta el lienzo de 600 × 400.`);
  if (!svg.includes('prefers-reduced-motion')) problemas.push(`${slug}: no respeta prefers-reduced-motion.`);
  if (!svg.includes('<title')) problemas.push(`${slug}: no tiene título accesible.`);
  if (bytes < 6_000) problemas.push(`${slug}: pesa solo ${bytes} bytes; parece incompleta.`);
  if (bytes > 90_000) problemas.push(`${slug}: pesa ${bytes} bytes; conviene aligerarla.`);

  if (soloRevisar) {
    for (const destino of DESTINOS) {
      const ruta = join(destino, `${slug}.svg`);
      if (!existsSync(ruta)) problemas.push(`${slug}: falta ${ruta.replace(RAIZ + '/', '')}.`);
    }
    total += bytes;
    continue;
  }

  for (const destino of DESTINOS) {
    mkdirSync(destino, { recursive: true });
    writeFileSync(join(destino, `${slug}.svg`), svg);
  }
  total += bytes;
}

const kb = (total / 1024).toFixed(0);
if (problemas.length) {
  console.error(`\n❌ ${problemas.length} problema(s):`);
  for (const problema of problemas) console.error(`   · ${problema}`);
  process.exit(1);
}

console.log(
  soloRevisar
    ? `\n✅ Las ${slugs.length} portadas SVG existen y son válidas (${kb} KB en total).\n`
    : `\n🎨 ${slugs.length} portadas SVG dibujadas (${kb} KB en total) en images/lessons/ y v2/public/images/lessons/.\n`,
);
