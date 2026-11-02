#!/usr/bin/env node
/**
 * generar-vendor.mjs
 * ---------------------------------------------------------------------------
 * Empaqueta @supabase/supabase-js en un solo archivo ESM servido desde el
 * propio sitio: `vendor/supabase-js.min.js`.
 *
 *     node tools/generar-vendor.mjs
 *
 * ¿Por qué? Antes el sitio pedía el cliente a https://esm.sh en cada visita:
 *
 *   - Era un punto único de fallo de un tercero (si esm.sh tarda o cae, el
 *     inicio de sesión y la sincronización del avance dejan de funcionar).
 *   - Eran ~6 peticiones encadenadas a esm.sh para cargar el cliente y sus
 *     dependencias, cada una con su ida y vuelta.
 *   - El modo sin conexión no podía precargarlo desde el service worker: la
 *     URL quedaba fuera del alcance del sitio.
 *
 * Los dos archivos resultantes ya están en el repositorio; este script solo se
 * necesita para actualizar la versión. Requiere esbuild (se instala al vuelo
 * con npx, no es dependencia del sitio):
 *
 *     node tools/generar-vendor.mjs --version 2.57.4
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DESTINO = join(RAIZ, 'vendor');
const VERSION_ACTUAL = leerVersionActual();

const indice = process.argv.indexOf('--version');
const version = indice > -1 ? process.argv[indice + 1] : VERSION_ACTUAL;
if (!version) {
  console.error('No pude leer la versión actual. Usa --version <n>, por ejemplo --version 2.57.4');
  process.exit(1);
}

/** Lee la versión empaquetada del comentario que encabeza vendor/supabase-js.min.js. */
function leerVersionActual() {
  try {
    const cabecera = readFileSync(join(DESTINO, 'supabase-js.min.js'), 'utf8').slice(0, 300);
    return cabecera.match(/@supabase\/supabase-js v?([\d.]+)/)?.[1] || null;
  } catch {
    return null;
  }
}

console.log(`📦 @supabase/supabase-js ${version}`);

const temporal = join(RAIZ, '.vendor-tmp');
rmSync(temporal, { recursive: true, force: true });
mkdirSync(temporal, { recursive: true });
writeFileSync(join(temporal, 'package.json'), '{"private":true}');

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
execFileSync(npm, ['install', `@supabase/supabase-js@${version}`, 'esbuild@0.24.2', '--no-audit', '--no-fund', '--silent'], {
  cwd: temporal,
  stdio: 'inherit',
});

const esbuild = join(temporal, 'node_modules', '.bin', process.platform === 'win32' ? 'esbuild.cmd' : 'esbuild');
mkdirSync(DESTINO, { recursive: true });
const salida = join(DESTINO, 'supabase-js.min.js');

execFileSync(esbuild, [
  '--bundle',
  '--format=esm',
  '--minify',
  '--target=es2020',
  '--legal-comments=none',
  `--define:process.env.NODE_ENV="production"`,
  `--outfile=${salida}`,
  join(temporal, 'node_modules', '@supabase', 'supabase-js', 'dist', 'module', 'index.js'),
], { stdio: 'inherit' });

// La cabecera deja rastro de la versión y de su licencia (MIT).
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
