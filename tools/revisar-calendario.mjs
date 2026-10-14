#!/usr/bin/env node
/**
 * revisar-calendario.mjs
 * ---------------------------------------------------------------------------
 * Comprueba la regla fijada el 14 de octubre de 2026:
 *
 *     El contenido se guía solo por los libros de la Biblia,
 *     no por el calendario religioso.
 *
 *     node tools/revisar-calendario.mjs
 *
 * ¿Por qué existe? `tools/revisar-biblia.mjs` vigila la traducción, el canon y
 * el vocabulario, pero NO el encuadre de temporada. Por ese hueco se colaron
 * tres líneas —«El cierre natural para Semana Santa», «si quieres cerrar en
 * Semana Santa» y «La Navidad se trata sobre todo de los regalos»— que hubo
 * que buscar a mano y corregir. Una lección bíblica sirve cualquier domingo
 * del año; una clase hecha «para una fecha» se queda guardada once meses.
 *
 * Lo que busca: adviento, cuaresma, Semana Santa, Domingo de Ramos, Jueves,
 * Viernes y Sábado Santo, Miércoles de Ceniza, vigilia pascual, Corpus
 * Christi, fiesta patronal, tiempo ordinario, año y calendario litúrgicos,
 * Domingo de Pascua, Navidad, Epifanía y Día de Reyes.
 *
 * Los archivos que hablan *sobre* la regla (README, IDEAS, MEJORAS y
 * ESENCIAL) quedan exentos, igual que en `revisar-biblia.mjs`: nombran lo
 * prohibido justamente para explicarlo.
 *
 * No necesita instalar nada: usa únicamente Node.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..');

const EXTENSIONES = new Set(['.html', '.js', '.json', '.md', '.css']);
const IGNORAR = new Set(['node_modules', '.git', 'images', 'videos', 'audio', 'fonts', 'tools']);

/** Archivos que explican la regla y por eso nombran lo que la regla prohíbe. */
const EXENTOS = new Set(['README.md', 'IDEAS.md', 'MEJORAS.md', 'ESENCIAL.md']);

/*
 * Ojo con los límites de palabra: el `\b` de JavaScript solo entiende
 * [A-Za-z0-9_], así que «Epifanía\b» no coincide y se colaría. Se usan los
 * mismos límites propios que en `revisar-biblia.mjs`, que sí entienden acentos.
 */
const INICIO = '(?<![\\p{L}\\p{N}_])';
const FIN = '(?![\\p{L}\\p{N}_])';
const palabras = (alternativas) => new RegExp(`${INICIO}(?:${alternativas})${FIN}`, 'giu');

const REGLAS = [
  { nombre: 'Temporada de adviento', patron: palabras('advient\\w*') },
  { nombre: 'Temporada de cuaresma', patron: palabras('cuaresm\\w*') },
  { nombre: 'Semana Santa', patron: palabras('semanas?\\s+santas?') },
  { nombre: 'Domingo de Ramos', patron: palabras('domingo\\s+de\\s+ramos') },
  { nombre: 'Jueves Santo', patron: palabras('jueves\\s+santo') },
  { nombre: 'Viernes Santo', patron: palabras('viernes\\s+santo') },
  { nombre: 'Sábado Santo', patron: palabras('s[áa]bado\\s+(?:santo|de\\s+gloria)') },
  { nombre: 'Miércoles de Ceniza', patron: palabras('mi[eé]rcoles\\s+de\\s+ceniza') },
  { nombre: 'Vigilia pascual', patron: palabras('vigilia\\s+pascual') },
  { nombre: 'Corpus Christi', patron: palabras('corpus\\s+christi') },
  { nombre: 'Fiesta patronal', patron: palabras('fiestas?\\s+patronales?') },
  { nombre: 'Tiempo ordinario', patron: palabras('tiempo\\s+ordinario') },
  { nombre: 'Año litúrgico', patron: palabras('a[ñn]os?\\s+lit[úu]rgicos?') },
  { nombre: 'Calendario litúrgico', patron: palabras('calendarios?\\s+lit[úu]rgicos?') },
  { nombre: 'Domingo de Pascua', patron: palabras('domingos?\\s+de\\s+pascua') },
  { nombre: 'Encuadre de Navidad', patron: palabras('navidad\\w*') },
  { nombre: 'Epifanía', patron: palabras('epifan[íi]as?') },
  { nombre: 'Día de Reyes', patron: palabras('d[íi]as?\\s+de\\s+reyes') },
];

/** Cada archivo de texto del sitio, sin las carpetas de recursos. */
function* archivos(dir) {
  for (const nombre of readdirSync(dir).sort()) {
    if (IGNORAR.has(nombre) || nombre.startsWith('.')) continue;
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) yield* archivos(ruta);
    else if (EXTENSIONES.has(extname(nombre))) yield ruta;
  }
}

const hallazgos = [];
let revisados = 0;

for (const ruta of archivos(RAIZ)) {
  const corta = relative(RAIZ, ruta);
  if (EXENTOS.has(corta)) continue;

  const texto = readFileSync(ruta, 'utf8');
  revisados += 1;

  for (const regla of REGLAS) {
    regla.patron.lastIndex = 0;
    for (const coincidencia of texto.matchAll(regla.patron)) {
      const previo = texto.slice(0, coincidencia.index);
      const linea = previo.split('\n').length;
      const contexto = texto
        .slice(Math.max(0, coincidencia.index - 50), coincidencia.index + coincidencia[0].length + 50)
        .replace(/\s+/g, ' ')
        .trim();
      hallazgos.push({ archivo: corta, linea, regla: regla.nombre, texto: coincidencia[0], contexto });
    }
  }
}

/* --------------------------------------------------------------------------- */
console.log('\n🗓️  Revisión del calendario religioso\n');
console.log(`   Archivos revisados: ${revisados}`);
console.log(`   Reglas:             ${REGLAS.length} (adviento, cuaresma, Semana Santa, Navidad…)\n`);

if (!hallazgos.length) {
  console.log('✅ Ninguna lección ni página se guía por el calendario religioso: sirven cualquier domingo.\n');
  process.exit(0);
}

console.log(`❌ ${hallazgos.length} hallazgo(s):\n`);
for (const hallazgo of hallazgos) {
  console.log(`   ${hallazgo.archivo}:${hallazgo.linea}`);
  console.log(`   ⚠️  ${hallazgo.regla} → «${hallazgo.texto}»`);
  console.log(`   … ${hallazgo.contexto} …`);
  console.log('   ✔️  La clase se elige por el pasaje que enseña, no por la fecha del año.\n');
}
process.exit(1);
