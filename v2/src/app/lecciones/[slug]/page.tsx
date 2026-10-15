import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Quiz } from "@/components/quiz";
import {
  CATEGORY_META,
  LESSONS,
  TESTAMENT_LABEL,
  getLessonBySlug,
  getLessonNeighbors,
} from "@/lib/lessons";

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) return { title: "Lección no encontrada" };
  return {
    title: lesson.title,
    description: `${lesson.title} (${lesson.reference}): ${lesson.objective}. Clase bíblica para niños de 3 a 10 años con historia, quiz, dinámica, manualidad e imprimibles.`,
  };
}

function SectionCard({
  emoji,
  titulo,
  children,
  className = "",
}: {
  emoji: string;
  titulo: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`card space-y-4 p-6 sm:p-8 ${className}`}>
      <h2 className="title-section">
        <span aria-hidden>{emoji}</span> {titulo}
      </h2>
      {children}
    </section>
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) notFound();

  const meta = CATEGORY_META[lesson.category];
  const { prev, next } = getLessonNeighbors(slug);
  const videoEmbed = lesson.videoId
    ? `https://www.youtube-nocookie.com/embed/${lesson.videoId}`
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: lesson.title,
    description: `${lesson.title} (${lesson.reference}): ${lesson.objective}`,
    inLanguage: "es",
    learningResourceType: "Clase bíblica",
    educationalLevel: `Niños de ${lesson.age}`,
    isAccessibleForFree: true,
    bibleVersion: lesson.bibleVersion,
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/lecciones"
        className="inline-flex items-center gap-1 text-sm font-bold text-ink-500 transition hover:text-leaf-700"
      >
        ← Todas las lecciones
      </Link>

      {/* Encabezado */}
      <header className="card mt-4 overflow-hidden">
        <div className="relative h-40 bg-cream-100 sm:h-56">
          {lesson.coverImage && (
            <Image
              src={lesson.coverImage}
              alt={`Ilustración de la lección ${lesson.title}`}
              fill
              priority
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="object-cover"
            />
          )}
          <span
            aria-hidden
            className="absolute bottom-4 left-6 grid size-16 place-items-center rounded-3xl bg-white/95 text-4xl shadow-md"
          >
            {lesson.icon}
          </span>
        </div>
        <div className="space-y-4 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`chip ${meta.chip}`}>
              {meta.emoji} {lesson.category}
            </span>
            <span className="chip bg-cream-100 text-ink-500">
              {TESTAMENT_LABEL[lesson.testament]}
            </span>
            <span className="chip bg-cream-100 text-ink-500">
              Lección N.º {lesson.number}
            </span>
          </div>
          <h1 className="font-display text-3xl font-semibold leading-tight text-ink-900 sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="max-w-3xl leading-relaxed text-ink-500">
            {lesson.objective}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm font-bold text-ink-500">
            <span>📖 {lesson.reference}</span>
            <span>👧 {lesson.age}</span>
            <span>⏱ {lesson.duration}</span>
            <span>📕 {lesson.bibleVersion}</span>
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Columna principal */}
        <div className="space-y-8 lg:col-span-2">
          <SectionCard emoji="📖" titulo="La historia">
            <ol className="space-y-6">
              {lesson.story.map((parte, i) => (
                <li key={parte.title} className="flex gap-4">
                  <span
                    aria-hidden
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-leaf-100 font-display font-semibold text-leaf-700"
                  >
                    {i + 1}
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-display font-semibold text-ink-900">
                      {parte.title}
                    </h3>
                    <p className="leading-relaxed text-ink-700">{parte.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </SectionCard>

          <SectionCard emoji="💬" titulo="Para conversar con los niños">
            <ul className="space-y-2.5">
              {lesson.questions.map((pregunta) => (
                <li
                  key={pregunta}
                  className="flex gap-3 rounded-2xl bg-cream-50 px-4 py-3 text-sm font-semibold leading-relaxed text-ink-700"
                >
                  <span aria-hidden className="text-leaf-500">
                    ◆
                  </span>
                  {pregunta}
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard emoji="🧠" titulo="Quiz de la lección">
            <Quiz questions={lesson.quiz} />
          </SectionCard>

          <SectionCard emoji="🎲" titulo={`Dinámica: ${lesson.activity.title}`}>
            <ol className="space-y-3">
              {lesson.activity.steps.map((paso, i) => (
                <li key={paso} className="flex gap-3 text-sm leading-relaxed text-ink-700">
                  <span
                    aria-hidden
                    className="grid size-6 shrink-0 place-items-center rounded-full bg-sun-100 text-xs font-bold text-sun-700"
                  >
                    {i + 1}
                  </span>
                  {paso}
                </li>
              ))}
            </ol>
          </SectionCard>

          {lesson.craft && (
            <SectionCard emoji="✂️" titulo="Manualidad">
              <p className="leading-relaxed text-ink-700">{lesson.craft}</p>
            </SectionCard>
          )}
        </div>

        {/* Columna lateral */}
        <aside className="space-y-8">
          <section className="card space-y-3 bg-gradient-to-br from-leaf-600 to-leaf-800 p-6 text-white sm:p-7">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <span aria-hidden>✍️</span> Versículo para memorizar
            </h2>
            <blockquote className="font-display text-xl font-medium leading-relaxed">
              «{lesson.memory.text}»
            </blockquote>
            <p className="text-sm font-bold text-leaf-200">
              — {lesson.memory.reference} ({lesson.bibleVersion})
            </p>
            {lesson.memory.sourceUrl && (
              <a
                href={lesson.memory.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block pt-1 text-xs font-bold text-leaf-100 underline decoration-leaf-400 underline-offset-4 transition hover:text-white"
              >
                Leer en Bible.com ↗
              </a>
            )}
          </section>

          <SectionCard emoji="🌻" titulo="Semillas para llevar">
            <ul className="space-y-2.5">
              {lesson.takeaways.map((idea) => (
                <li key={idea} className="flex gap-2.5 text-sm leading-relaxed text-ink-700">
                  <span aria-hidden>🌱</span>
                  {idea.replace(/^[\p{Extended_Pictographic}\uFE0F]+\s*/u, "")}
                </li>
              ))}
            </ul>
          </SectionCard>

          {videoEmbed && (
            <SectionCard emoji="📺" titulo="Video para proyectar">
              <div className="aspect-video overflow-hidden rounded-2xl bg-ink-900">
                <iframe
                  src={videoEmbed}
                  title={`Video de la lección ${lesson.title}`}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="size-full"
                />
              </div>
            </SectionCard>
          )}

          {lesson.drawPrompt && (
            <SectionCard emoji="🖍️" titulo="Para dibujar">
              <p className="leading-relaxed text-ink-700">{lesson.drawPrompt}</p>
            </SectionCard>
          )}

          <SectionCard emoji="🙏" titulo="Oración de cierre">
            <p className="italic leading-relaxed text-ink-700">{lesson.prayer}</p>
          </SectionCard>

          {lesson.printableUrl && (
            <a
              href={lesson.printableUrl}
              target="_blank"
              rel="noreferrer"
              className="card flex items-center justify-between gap-3 p-5 text-sm font-bold text-ink-700 transition hover:-translate-y-0.5 hover:text-leaf-700 hover:shadow-[0_12px_32px_rgba(43,38,32,0.10)]"
            >
              <span>🖨️ Hojas imprimibles de esta lección</span>
              <span aria-hidden>↗</span>
            </a>
          )}
        </aside>
      </div>

      {/* Anterior / Siguiente */}
      <nav
        aria-label="Lecciones cercanas"
        className="mt-12 flex flex-col justify-between gap-3 border-t border-cream-200 pt-6 sm:flex-row"
      >
        {prev ? (
          <Link
            href={`/lecciones/${prev.slug}`}
            className="card group flex-1 p-4 transition hover:-translate-y-0.5"
          >
            <span className="text-xs font-bold text-ink-300">← Anterior</span>
            <p className="font-display font-semibold group-hover:text-leaf-700">
              {prev.icon} {prev.title}
            </p>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link
            href={`/lecciones/${next.slug}`}
            className="card group flex-1 p-4 text-right transition hover:-translate-y-0.5"
          >
            <span className="text-xs font-bold text-ink-300">Siguiente →</span>
            <p className="font-display font-semibold group-hover:text-leaf-700">
              {next.title} {next.icon}
            </p>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </nav>
    </div>
  );
}
