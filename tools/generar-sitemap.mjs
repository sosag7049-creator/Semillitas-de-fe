#!/usr/bin/env node
/**
 * Genera sitemap.xml a partir de las páginas reales del sitio.
 *
 * Uso:  node tools/generar-sitemap.mjs
 *
 * Hay que volver a ejecutarlo cada vez que se agregue una lección nueva
 * o una página suelta. No necesita instalar nada.
 */
import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITIO = 'https://semillitasbiblicas.space';

/** Páginas fijas: [ruta, prioridad, frecuencia de cambio] */
const PAGINAS_FIJAS = [
  ['/', '1.0', 'weekly'],
  ['/lecciones/', '0.9', 'weekly'],
  ['/series/', '0.9', 'weekly'],
  ['/juegos/', '0.8', 'monthly'],
  ['/printables.html', '0.8', 'monthly'],
  ['/maestros/', '0.7', 'monthly'],
  ['/contacto.html', '0.4', 'yearly'],
  ['/privacidad.html', '0.3', 'yearly'],
  ['/terminos.html', '0.3', 'yearly'],
];

/** Fecha de la última modificación del archivo, en formato AAAA-MM-DD. */
function ultimaModificacion(rutaRelativa) {
  const candidatos = rutaRelativa.endsWith('/')
    ? [join(RAIZ, rutaRelativa, 'index.html')]
    : [join(RAIZ, rutaRelativa)];
  for (const archivo of candidatos) {
    if (existsSync(archivo)) return statSync(archivo).mtime.toISOString().slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}

// Cada carpeta dentro de /lecciones/ que tenga index.html es una lección.
const lecciones = readdirSync(join(RAIZ, 'lecciones'), { withFileTypes: true })
  .filter(entrada => entrada.isDirectory())
  .map(entrada => `/lecciones/${entrada.name}/`)
  .filter(ruta => existsSync(join(RAIZ, ruta, 'index.html')))
  .sort();

const urls = [
  ...PAGINAS_FIJAS.map(([ruta, prioridad, frecuencia]) => ({ ruta, prioridad, frecuencia })),
  ...lecciones.map(ruta => ({ ruta, prioridad: '0.7', frecuencia: 'monthly' })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generado con: node tools/generar-sitemap.mjs -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ ruta, prioridad, frecuencia }) => `  <url>
    <loc>${SITIO}${ruta}</loc>
    <lastmod>${ultimaModificacion(ruta)}</lastmod>
    <changefreq>${frecuencia}</changefreq>
    <priority>${prioridad}</priority>
  </url>`).join('\n')}
</urlset>
`;

writeFileSync(join(RAIZ, 'sitemap.xml'), xml);
console.log(`✅ sitemap.xml generado con ${urls.length} direcciones (${lecciones.length} lecciones).`);
