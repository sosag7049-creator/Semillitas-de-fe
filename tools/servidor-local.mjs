#!/usr/bin/env node
/**
 * Servidor local que imita el comportamiento de GitHub Pages.
 *
 *   node tools/servidor-local.mjs          → http://localhost:8000
 *   PORT=3000 node tools/servidor-local.mjs
 *
 * Sirve para probar el sitio antes de publicarlo. Reproduce lo mismo que hace
 * GitHub Pages: carpetas con index.html, y /404.html cuando la ruta no existe.
 * No necesita instalar nada.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUERTO = Number(process.env.PORT) || 8000;

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm',
};

async function buscarArchivo(rutaUrl) {
  // normalize + replace evitan que alguien pida /../../etc/passwd
  const limpia = normalize(decodeURIComponent(rutaUrl.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const candidatos = limpia.endsWith('/') ? [join(limpia, 'index.html')] : [limpia, join(limpia, 'index.html')];
  for (const candidato of candidatos) {
    const completa = join(RAIZ, candidato);
    if (!completa.startsWith(RAIZ)) continue;
    try {
      if ((await stat(completa)).isFile()) return completa;
    } catch { /* seguimos probando */ }
  }
  return null;
}

createServer(async (peticion, respuesta) => {
  const archivo = await buscarArchivo(peticion.url || '/');
  if (archivo) {
    const tipo = TIPOS[extname(archivo).toLowerCase()] || 'application/octet-stream';
    respuesta.writeHead(200, { 'Content-Type': tipo, 'Cache-Control': 'no-cache' });
    respuesta.end(await readFile(archivo));
    return;
  }
  // Igual que GitHub Pages: la página 404 propia, con código 404 de verdad.
  try {
    const pagina = await readFile(join(RAIZ, '404.html'));
    respuesta.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
    respuesta.end(pagina);
  } catch {
    respuesta.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    respuesta.end('404');
  }
}).listen(PUERTO, '0.0.0.0', () => {
  console.log(`🌱 Semillitas de Fe en http://localhost:${PUERTO}`);
});
