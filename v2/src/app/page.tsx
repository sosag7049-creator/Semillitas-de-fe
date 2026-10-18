import Link from "next/link";
import { CATEGORIES, CATEGORY_META, LESSONS } from "@/lib/lessons";
import { LessonCard } from "@/components/lesson-card";

/* Los seis momentos del plan de clase de 60 minutos. */
const PASOS = [
  { emoji: "🎵", titulo: "Alabanza", minutos: "10 min", texto: "Canciones con movimientos para abrir el corazón." },
  { emoji: "📖", titulo: "Historia", minutos: "15 min", texto: "El relato bíblico contado por escenas, con preguntas." },
  { emoji: "✍️", titulo: "Versículo", minutos: "5 min", texto: "Un versículo RV1960 para memorizar en familia." },
  { emoji: "❓", titulo: "Preguntas", minutos: "10 min", texto: "Conversación guiada según la edad de los niños." },
  { emoji: "🎲", titulo: "Dinámica", minutos: "10 min", texto: "Una actividad para vivir la lección, no solo oírla." },
  { emoji: "✂️", titulo: "Manualidad", minutos: "10 min", texto: "Para llevar la semilla a casa entre las manos." },
];

/* Lecciones ideales para una primera visita. */
const DESTACADAS = [
  "la-creacion",
  "david-y-goliat",
  "jonas",
  "jesus-vive",
];

export default function HomePage() {
  const destacadas = DESTACADAS.map((slug) => LESSONS.find((l) => l.slug === slug))
    .filter((lesson) => lesson !== undefined);
  const porCategoria = Object.fromEntries(
    CATEGORIES.map((c) => [c, LESSONS.filter((l) => l.category === c).length]),
  );

  return (
    <>
      {/* Héroe */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -left-24 top-8 size-72 rounded-full bg-leaf-200/40 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 size-80 rounded-full bg-sun-200/40 blur-3xl" />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <p className="chip mx-auto border border-leaf-300 bg-white/80 text-leaf-700">
            🌱 {LESSONS.length} lecciones listas para enseñar
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-semibold leading-tight text-ink-900 sm:text-6xl">
            Siembra fe en{" "}
            <span className="text-leaf-600">corazones pequeños</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-500">
            Clases bíblicas completas para maestros de niños y niñas de 3 a 10
            años: historia, versículo, preguntas, dinámica, quiz, manualidad y
            oración. Basadas en la Reina-Valera 1960 y listas para proyectar o
            imprimir.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/lecciones" className="btn btn-primary">
              🔍 Explorar lecciones
            </Link>
            <a href="#una-clase" className="btn btn-ghost">
              ¿Cómo funciona una clase?
            </a>
          </div>
          <dl className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-bold text-ink-500">
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Lecciones</dt>
              <dd>📚 {LESSONS.length} lecciones</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Testamentos</dt>
              <dd>🌐 2 testamentos</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Edades</dt>
              <dd>🧒 3 a 10 años</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Precio</dt>
              <dd>💛 100% gratuita</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Temas */}
      <section aria-labelledby="temas" className="mx-auto w-full max-w-6xl px-4 pb-4 sm:px-6">
        <h2 id="temas" className="font-display text-2xl font-semibold sm:text-3xl">
          Explora por tema
        </h2>
        <p className="mt-2 text-ink-500">
          Cuatro caminos para recorrer la Biblia con los pequeños.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => {
            const meta = CATEGORY_META[category];
            return (
              <li key={category}>
                <Link
                  href={`/lecciones?categoria=${encodeURIComponent(category)}`}
                  className="card group flex h-full flex-col gap-2 p-6 transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(43,38,32,0.10)]"
                >
                  <span aria-hidden className="text-4xl">
                    {meta.emoji}
                  </span>
                  <h3 className="font-display text-lg font-semibold group-hover:text-leaf-700">
                    {category}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-500">
                    {meta.blurb}
                  </p>
                  <span className="mt-auto pt-3 text-xs font-bold text-ink-300">
                    {porCategoria[category]} lecciones →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Plan de clase */}
      <section id="una-clase" aria-labelledby="plan" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
        <div className="card overflow-hidden">
          <div className="border-b border-cream-200/80 bg-cream-50/70 px-6 py-8 sm:px-10">
            <h2 id="plan" className="font-display text-2xl font-semibold sm:text-3xl">
              Una clase completa en 60 minutos
            </h2>
            <p className="mt-2 max-w-2xl text-ink-500">
              Cada lección sigue el mismo plan probado en clase, para que el
              maestro solo tenga que llegar, abrir y enseñar.
            </p>
          </div>
          <ol className="grid gap-px bg-cream-200/70 sm:grid-cols-2 lg:grid-cols-3">
            {PASOS.map((paso, i) => (
              <li key={paso.titulo} className="bg-white p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <span aria-hidden className="text-3xl">
                    {paso.emoji}
                  </span>
                  <span className="chip bg-cream-100 text-ink-500">
                    {paso.minutos}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold">
                  <span className="mr-2 text-leaf-600">{i + 1}.</span>
                  {paso.titulo}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-500">
                  {paso.texto}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Destacadas */}
      <section aria-labelledby="destacadas" className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="destacadas" className="font-display text-2xl font-semibold sm:text-3xl">
              Para comenzar
            </h2>
            <p className="mt-2 text-ink-500">
              Cuatro clásicos perfectos para una primera clase.
            </p>
          </div>
          <Link href="/lecciones" className="btn btn-ghost px-4 py-2 text-sm">
            Ver las {LESSONS.length} →
          </Link>
        </div>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destacadas.map((lesson) => (
            <li key={lesson.slug}>
              <LessonCard lesson={lesson} />
            </li>
          ))}
        </ul>
      </section>

      {/* Cierre */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-br from-leaf-600 to-leaf-800 px-6 py-14 text-center text-white sm:px-10">
          <span aria-hidden className="text-4xl">
            🌻
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">
            ¿Listo para tu próxima clase?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-leaf-100">
            Elige una lección, proyéctala o imprímela, y llega al domingo con
            todo preparado.
          </p>
          <Link
            href="/lecciones"
            className="btn mt-6 bg-white text-leaf-700 shadow-sm hover:bg-leaf-50"
          >
            Elegir una lección
          </Link>
        </div>
      </section>
    </>
  );
}
