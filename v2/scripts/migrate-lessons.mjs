// Convierte el catálogo de lecciones del sitio v1 (módulos ES planos, sin
// empaquetador) en un único JSON tipado para la app v2.
//
//   Uso:  npm run migrate   (dentro de v2/)
//
// El v1 compone `LESSONS` mezclando `printables-data.js` (datos base con
// título, categoría, objetivo…) con arreglos paralelos en `lesson-data.js`
// (historias, quiz, actividades) y bloques `additional-lessons*.js`. Aquí
// simplemente importamos ese módulo tal cual y normalizamos el resultado.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const v2Dir = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(v2Dir, "..");
const tmpDir = path.join(v2Dir, ".migrate-tmp");

const SOURCES = [
  "printables-data.js",
  "additional-lessons.js",
  "additional-lessons-2.js",
  "additional-lessons-3.js",
  "additional-lessons-4.js",
  "lesson-data.js",
];

// Lecciones del Antiguo Testamento (28). El resto del catálogo (11) es del
// Nuevo Testamento. Lista explícita: es más fácil de revisar que deducirla.
const ANTIGUO_TESTAMENTO = new Set([
  "la-creacion", "adan-y-eva", "noe-y-el-arca", "abraham-espera",
  "jose-perdona", "moises-y-la-zarza", "dios-abre-el-mar", "diez-mandamientos",
  "josue-y-jerico", "rut-es-fiel", "samuel-escucha", "david-y-goliat",
  "david-y-jonatan", "salomon-y-la-sabiduria", "elias-y-la-viuda",
  "ester-actua", "daniel-y-la-oracion", "jonas", "ama-a-dios-de-corazon",
  "confia-de-todo-corazon", "debora-sirve-con-valentia", "gedeon-y-los-300",
  "isaias-es-llamado", "job-confia-en-dios", "el-senor-es-mi-pastor",
  "los-doce-espias", "naaman-sana", "nehemias-y-el-muro",
]);

function importarModulosV1() {
  mkdirSync(tmpDir, { recursive: true });
  for (const file of SOURCES) {
    const code = readFileSync(path.join(repoRoot, file), "utf8");
    // El v1 importa con rutas absolutas del sitio (`/printables-data.js?v=2`).
    // Las reescribimos a rutas relativas del directorio temporal.
    const rewritten = code.replace(
      /from\s+['"]\/([^'"]+?)(\?[^'"]*)?['"]/g,
      (_match, route) => `from './${route.replace(/\.js$/, "")}.mjs'`,
    );
    writeFileSync(path.join(tmpDir, file.replace(/\.js$/, ".mjs")), rewritten);
  }
  return import(pathToFileURL(path.join(tmpDir, "lesson-data.mjs")).href);
}

function normalizar(lessons) {
  return lessons.map((l) => {
    const quiz = (l.quiz ?? []).map((q) => ({
      question: q.question,
      options: [...q.options],
      answer: q.answer,
    }));
    return {
      id: String(l.id),
      number: l.number,
      slug: l.slug,
      title: l.title,
      icon: l.icon ?? "🌱",
      category: l.category,
      testament: ANTIGUO_TESTAMENTO.has(l.slug) ? "antiguo" : "nuevo",
      reference: l.reference ?? "",
      objective: l.objective ?? "",
      application: l.application ?? "",
      narration: l.narration ?? "",
      dynamic: l.dynamic ?? "",
      craft: l.craft ?? "",
      drawPrompt: l.draw_prompt ?? "",
      age: l.age ?? "3 a 10 años",
      duration: l.duration ?? "60 minutos",
      bibleVersion: l.bibleVersion ?? "Reina-Valera 1960",
      coverImage: l.coverImage ?? null,
      story: (l.story ?? []).map(([title, text]) => ({ title, text })),
      takeaways: l.takeaways ?? [],
      questions: l.questions ?? [],
      quiz,
      activity: {
        title: l.activity?.title ?? "",
        steps: l.activity?.steps ?? [],
      },
      memory: {
        text: l.memory?.text ?? "",
        reference: l.memory?.reference ?? "",
        excerpt: Boolean(l.memory?.excerpt),
        sourceUrl: l.memory?.sourceUrl ?? "",
      },
      videoId: l.videoId ?? null,
      videoQuery: l.videoQuery ?? null,
      videoUrl: l.videoUrl ?? null,
      printableUrl: l.printable
        ? `https://semillitasbiblicas.space${l.printable}`
        : null,
      prayer: l.prayer ?? "",
    };
  });
}

function validar(lessons) {
  const errores = [];
  lessons.forEach((l, i) => {
    if (!l.slug || !l.title) errores.push(`[${i}] sin slug o título`);
    if (!l.story.length) errores.push(`[${l.slug}] sin historia`);
    if (!l.quiz.length) errores.push(`[${l.slug}] sin quiz`);
    l.quiz.forEach((q, j) => {
      if (q.answer < 0 || q.answer >= q.options.length) {
        errores.push(`[${l.slug}] quiz ${j}: índice de respuesta inválido`);
      }
    });
    if (!l.memory.text) errores.push(`[${l.slug}] sin versículo`);
  });
  if (errores.length) throw new Error(`Datos inválidos:\n${errores.join("\n")}`);
}

const { LESSONS } = await importarModulosV1();
if (!Array.isArray(LESSONS) || LESSONS.length < 30) {
  throw new Error(`Se esperaban ~39 lecciones y llegaron ${LESSONS?.length}`);
}

const lessons = normalizar(LESSONS);
validar(lessons);

const destDir = path.join(v2Dir, "src", "data");
mkdirSync(destDir, { recursive: true });
writeFileSync(
  path.join(destDir, "lessons.json"),
  JSON.stringify(lessons, null, 2) + "\n",
);

rmSync(tmpDir, { recursive: true, force: true });

const at = lessons.filter((l) => l.testament === "antiguo").length;
const categorias = {};
for (const l of lessons) categorias[l.category] = (categorias[l.category] ?? 0) + 1;
console.log(`✓ ${lessons.length} lecciones migradas a v2/src/data/lessons.json`);
console.log(`  Antiguo Testamento: ${at} · Nuevo Testamento: ${lessons.length - at}`);
console.log(`  Categorías: ${JSON.stringify(categorias)}`);
