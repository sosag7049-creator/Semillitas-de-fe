#!/usr/bin/env node
/**
 * revisar-biblia.mjs
 * ---------------------------------------------------------------------------
 * Comprueba que todo el contenido del sitio respete la regla del proyecto:
 *
 *     Reina-Valera 1960, Biblia evangélica (66 libros). No católica.
 *
 * Revisa el texto que ven los niños y los maestros en busca de:
 *   1. Libros deuterocanónicos (Tobías, Macabeos, Judit...).
 *   2. Otras versiones de la Biblia citadas (NVI, NTV, TLA...).
 *   3. Vocabulario devocional católico (rosario, purgatorio, intercesión...).
 *   4. «San/Santa» antepuesto a un personaje bíblico.
 *   5. «Yahvé» en lugar de «Jehová», que es como traduce la RVR1960.
 *   6. Referencias a libros que no existen en el canon de 66.
 *
 * Uso:
 *     node tools/revisar-biblia.mjs
 *
 * Devuelve código de salida 1 si encuentra algo, para poder usarlo como
 * barrera antes de publicar.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(fileURLToPath(new URL('.', import.meta.url)), '..');

const EXTENSIONES = new Set(['.html', '.js', '.json', '.md', '.css']);
const IGNORAR = new Set([
  'node_modules', '.git', 'images', 'videos', 'audio', 'fonts', 'tools',
]);

/** Archivos que hablan *sobre* la regla y por eso nombran lo prohibido. */
const EXENTOS = new Set(['README.md', 'IDEAS.md', 'MEJORAS.md']);

// ---------------------------------------------------------------------------
// Canon evangélico: 66 libros
// ---------------------------------------------------------------------------
const CANON = new Set([
  'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio', 'Josué', 'Jueces',
  'Rut', '1 Samuel', '2 Samuel', '1 Reyes', '2 Reyes', '1 Crónicas',
  '2 Crónicas', 'Esdras', 'Nehemías', 'Ester', 'Job', 'Salmo', 'Salmos',
  'Proverbios', 'Eclesiastés', 'Cantares', 'Isaías', 'Jeremías',
  'Lamentaciones', 'Ezequiel', 'Daniel', 'Oseas', 'Joel', 'Amós', 'Abdías',
  'Jonás', 'Miqueas', 'Nahúm', 'Habacuc', 'Sofonías', 'Hageo', 'Zacarías',
  'Malaquías', 'Mateo', 'Marcos', 'Lucas', 'Juan', 'Hechos', 'Romanos',
  '1 Corintios', '2 Corintios', 'Gálatas', 'Efesios', 'Filipenses',
  'Colosenses', '1 Tesalonicenses', '2 Tesalonicenses', '1 Timoteo',
  '2 Timoteo', 'Tito', 'Filemón', 'Hebreos', 'Santiago', '1 Pedro', '2 Pedro',
  '1 Juan', '2 Juan', '3 Juan', 'Judas', 'Apocalipsis',
]);

// ---------------------------------------------------------------------------
// Reglas de revisión
// ---------------------------------------------------------------------------
/*
 * Ojo con los límites de palabra: el `\b` de JavaScript solo entiende
 * [A-Za-z0-9_], así que «Yahvé\b» NO coincide (la «é» no cuenta como letra) y
 * se colaría sin avisar. Usamos límites propios que sí entienden acentos.
 */
const INICIO = '(?<![\\p{L}\\p{N}_])';
const FIN = '(?![\\p{L}\\p{N}_])';

/** Arma una expresión regular con límites de palabra que respetan acentos. */
const palabras = (alternativas, banderas = 'giu') =>
  new RegExp(`${INICIO}(?:${alternativas})${FIN}`, banderas);

const REGLAS = [
  {
    nombre: 'Libro deuterocanónico (no está en los 66)',
    patron: palabras(
      'tob[ií]as|judit|macabeos?|eclesi[áa]stico|sir[áa]cida|' +
        'sabidur[ií]a de salom[óo]n|baruc|bel y el drag[óo]n|' +
        'or[áa]ci[óo]n de azar[ií]as|c[áa]ntico de los tres j[óo]venes',
    ),
    arreglo: 'Usar solo los 66 libros del canon evangélico.',
  },
  {
    nombre: 'Otra versión de la Biblia',
    patron: palabras(
      'NVI|NTV|TLA|LBLA|DHH|PDT|Nueva Versi[óo]n Internacional|' +
        'Nueva Traducci[óo]n Viviente|Traducci[óo]n en Lenguaje Actual|' +
        'Dios Habla Hoy|Biblia Latinoamericana|Biblia de Jerusal[ée]n|Vulgata',
      'gu',
      'gu', // sin «i»: distingue la sigla NVI de «envió», «invitar»…
    ),
    arreglo: 'Citar siempre la Reina-Valera 1960.',
  },
  {
    nombre: 'Vocabulario devocional católico',
    patron: palabras(
      'rosario|purgatorio|inmaculada|eucarist[ií]a|sacramentos?|penitencia|' +
        'confesionario|virgen mar[ií]a|santa mar[ií]a|madre de dios|' +
        'ave mar[ií]a|asunci[óo]n de mar[ií]a|' +
        'interced(?:e|er|an)\\s+por\\s+nosotros|pont[ií]fice',
    ),
    arreglo: 'La Biblia es la única autoridad; se ora a Dios por medio de Jesucristo.',
  },
  {
    nombre: '«San/Santa» antepuesto a un personaje bíblico',
    patron: palabras(
      '(?:San|Santa|Santo)\\s+(?:Pedro|Pablo|Juan|Mateo|Marcos|Lucas|Jos[ée]|' +
        'Mar[ií]a|Tom[áa]s|Andr[ée]s|Felipe|Esteban|Santiago|Bartolom[ée])',
      'gu',
    ),
    arreglo: 'Nombrarlos como lo hace la RVR1960: «Pedro», «Pablo», «María».',
  },
  {
    nombre: '«Yahvé» en vez de «Jehová»',
    patron: palabras('yahv[ée]h?|yahweh|jahv[ée]|adonai'),
    arreglo: 'La RVR1960 traduce el nombre divino como «Jehová».',
  },
];

// ---------------------------------------------------------------------------
// Recorrido de archivos
// ---------------------------------------------------------------------------
function* archivos(dir) {
  for (const nombre of readdirSync(dir).sort()) {
    if (IGNORAR.has(nombre) || nombre.startsWith('.')) continue;
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) yield* archivos(ruta);
    else if (EXTENSIONES.has(extname(nombre))) yield ruta;
  }
}

/** Línea y columna de un índice dentro del texto. */
function ubicar(texto, indice) {
  const previo = texto.slice(0, indice);
  const linea = previo.split('\n').length;
  return { linea, columna: indice - previo.lastIndexOf('\n') };
}

/** Un trocito de contexto alrededor del hallazgo, en una sola línea. */
function contexto(texto, indice, largo) {
  return texto
    .slice(Math.max(0, indice - 45), indice + largo + 45)
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// Revisión
// ---------------------------------------------------------------------------
const hallazgos = [];
const librosVistos = new Map();
let revisados = 0;

for (const ruta of archivos(RAIZ)) {
  const corta = relative(RAIZ, ruta);
  if (EXENTOS.has(corta)) continue;

  const texto = readFileSync(ruta, 'utf8');
  revisados += 1;

  for (const regla of REGLAS) {
    regla.patron.lastIndex = 0;
    for (const m of texto.matchAll(regla.patron)) {
      const { linea, columna } = ubicar(texto, m.index);
      hallazgos.push({
        archivo: corta,
        linea,
        columna,
        regla: regla.nombre,
        arreglo: regla.arreglo,
        texto: m[0],
        contexto: contexto(texto, m.index, m[0].length),
      });
    }
  }

  const citas = /\b((?:[123]\s)?[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)\s+\d+[:\d\s,;–-]*/gu;
  for (const m of texto.matchAll(citas)) {
    const libro = m[1].trim();
    if (!CANON.has(libro)) continue;
    librosVistos.set(libro, (librosVistos.get(libro) ?? 0) + 1);
  }
}

// ---------------------------------------------------------------------------
// Informe
// ---------------------------------------------------------------------------
console.log('\n📖 Revisión bíblica — Reina-Valera 1960, Biblia evangélica\n');
console.log(`   Archivos revisados: ${revisados}`);
console.log(`   Libros citados:     ${librosVistos.size} (todos del canon de 66)\n`);

if (librosVistos.size) {
  const orden = [...librosVistos.entries()].sort((a, b) => b[1] - a[1]);
  const lista = orden.map(([libro, n]) => `${libro} (${n})`).join(' · ');
  console.log(`   ${lista}\n`);
}

if (!hallazgos.length) {
  console.log('✅ Todo el contenido respeta la regla del proyecto.\n');
  process.exit(0);
}

console.log(`❌ ${hallazgos.length} posible(s) problema(s):\n`);
for (const h of hallazgos) {
  console.log(`   ${h.archivo}:${h.linea}:${h.columna}`);
  console.log(`   ⚠️  ${h.regla} → «${h.texto}»`);
  console.log(`   … ${h.contexto} …`);
  console.log(`   ✔️  ${h.arreglo}\n`);
}
console.log('Revisa cada caso: puede ser un falso positivo dentro de otra palabra.\n');
process.exit(1);
