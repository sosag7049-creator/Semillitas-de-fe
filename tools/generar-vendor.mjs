#!/usr/bin/env node
/**
 * generar-vendor.mjs
 * ---------------------------------------------------------------------------
 * Prepara las dos librerías de terceros que se sirven desde el propio sitio,
 * en `vendor/`, para que funcionen sin conexión y sin depender de una CDN:
 *
 *   1. @supabase/supabase-js → empaquetado con esbuild en `vendor/supabase-js.min.js`
 *   2. three.js              → copiado tal cual en `vendor/three.module.min.js`
 *                              y `vendor/three.core.min.js` (juego 3D)
 *
 * ¿Por qué no se piden a esm.sh o a un CDN? Porque eran un punto único de
 * fallo de un tercero, varias peticiones encadenadas y URLs que el service
 * worker no podía precargar.
 *
 * Uso normal (las dos):
 *     node tools/generar-vendor.mjs
 *
 * Solo una, para no tocar la otra versión:
 *     node tools/generar-vendor.mjs --solo supabase --version 2.57.4
 *     node tools/generar-vendor.mjs --solo three --three 0.180.0
 *
 * Requiere internet la primera vez: instala el paquete en una carpeta temporal
 * (no queda como dependencia del sitio) y copia el resultado.
 */
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DESTINO = join(RAIZ, 'vendor');
const args = process.argv.slice(2);

/** Lee el valor que sigue a una bandera, si está. */
function bandera(nombre) {
  const indice = args.indexOf(nombre);
  return indice > -1 ? args[indice + 1] : null;
}

const solo = bandera('--solo'); // 'supabase' | 'three' | null
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function carpetaTemporal() {
  const temporal = join(RAIZ, '.vendor-tmp');
  rmSync(temporal, { recursive: true, force: true });
  mkdirSync(temporal, { recursive: true });
  writeFileSync(join(temporal, 'package.json'), '{"private":true}');
  return temporal;
}

function instalar(temporal, paquete) {
  execFileSync(npm, ['install', paquete, '--no-audit', '--no-fund', '--silent'], {
    cwd: temporal,
    stdio: 'inherit',
  });
}

/* ------------------------------ Supabase --------------------------------- */
/** Lee la versión empaquetada del comentario que encabeza el archivo. */
function versionSupabase() {
  try {
    const cabecera = readFileSync(join(DESTINO, 'supabase-js.min.js'), 'utf8').slice(0, 300);
    return cabecera.match(/@supabase\/supabase-js v?([\d.]+)/)?.[1] || null;
  } catch {
    return null;
  }
}

function empaquetarSupabase(version) {
  if (!version) {
    console.error('No pude leer la versión de Supabase. Usa --version <n>, por ejemplo --version 2.57.4');
    process.exit(1);
  }
  console.log(`📦 @supabase/supabase-js ${version}`);
  const temporal = carpetaTemporal();
  instalar(temporal, `@supabase/supabase-js@${version}`);
  instalar(temporal, 'esbuild@0.24.2');

  const esbuild = join(temporal, 'node_modules', '.bin', process.platform === 'win32' ? 'esbuild.cmd' : 'esbuild');
  mkdirSync(DESTINO, { recursive: true });
  const salida = join(DESTINO, 'supabase-js.min.js');

  execFileSync(esbuild, [
    '--bundle',
    '--format=esm',
    '--minify',
    '--target=es2020',
    '--legal-comments=none',
    '--define:process.env.NODE_ENV="production"',
    `--outfile=${salida}`,
    join(temporal, 'node_modules', '@supabase', 'supabase-js', 'dist', 'module', 'index.js'),
  ], { stdio: 'inherit' });

  const codigo = readFileSync(salida, 'utf8');
  writeFileSync(
    salida,
    `/*! @supabase/supabase-js v${version} | MIT | empaquetado por tools/generar-vendor.mjs */\n${codigo}`,
  );
  writeFileSync(
    join(DESTINO, 'LICENCIA-supabase-js.txt'),
    `@supabase/supabase-js v${version}\nMIT License\nhttps://github.com/supabase/supabase-js\n`,
  );
  rmSync(temporal, { recursive: true, force: true });
  const kb = (readFileSync(salida).length / 1024).toFixed(1);
  console.log(`✅ vendor/supabase-js.min.js (${kb} KB)`);
}

/* -------------------------------- Three ---------------------------------- */
/** La versión vive en vendor/LICENCIA-three.txt: «three.js r180». */
function versionThree() {
  try {
    const texto = readFileSync(join(DESTINO, 'LICENCIA-three.txt'), 'utf8');
    return texto.match(/three\.js r(\d+)/)?.[1] || null;
  } catch {
    return null;
  }
}

/** three publica 0.<revisión>.<parche>: 0.180.0 → r180. */
function revisionThree(version) {
  const partes = String(version).split('.').map(Number);
  return partes[1] > 0 ? partes[1] : partes[0];
}

function vendorizarThree(version) {
  if (!version) {
    console.error('No pude leer la versión de Three.js. Usa --three <n>, por ejemplo --three 0.180.0');
    process.exit(1);
  }
  const revision = revisionThree(version);
  console.log(`📦 three.js r${revision} (${version})`);
  const temporal = carpetaTemporal();
  instalar(temporal, `three@${version}`);

  const construccion = join(temporal, 'node_modules', 'three', 'build');
  const archivos = ['three.module.min.js', 'three.core.min.js'];
  for (const archivo of archivos) {
    if (!existsSync(join(construccion, archivo))) {
      console.error(`❌ three@${version} no trae build/${archivo}`);
      rmSync(temporal, { recursive: true, force: true });
      process.exit(1);
    }
  }
  mkdirSync(DESTINO, { recursive: true });
  for (const archivo of archivos) copyFileSync(join(construccion, archivo), join(DESTINO, archivo));

  // `three.module.min.js` importa `./three.core.min.js`: los dos van juntos.
  const licencia = [
    `three.js r${revision}`,
    'MIT License',
    'https://github.com/mrdoob/three.js',
    '',
    `Copiado sin modificaciones desde el paquete npm \`three@${version}\``,
    '(build/three.module.min.js y build/three.core.min.js).',
    'Lo usa solo el juego 3D de /juegos/ y se descarga bajo demanda.',
    '',
  ].join('\n');
  writeFileSync(join(DESTINO, 'LICENCIA-three.txt'), licencia);
  rmSync(temporal, { recursive: true, force: true });

  const kb = archivos
    .map((archivo) => readFileSync(join(DESTINO, archivo)).length)
    .reduce((total, bytes) => total + bytes, 0) / 1024;
  console.log(`✅ vendor/three.module.min.js + three.core.min.js (${kb.toFixed(1)} KB)`);
}

/* ---------------------------------- Main --------------------------------- */
if (solo && !['supabase', 'three'].includes(solo)) {
  console.error('--solo acepta «supabase» o «three».');
  process.exit(1);
}
if (!solo || solo === 'supabase') {
  empaquetarSupabase(bandera('--version') || versionSupabase());
}
if (!solo || solo === 'three') {
  vendorizarThree(bandera('--three') || versionThree());
}
