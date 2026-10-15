import type { Metadata } from "next";
import { CATEGORIES, LESSONS } from "@/lib/lessons";
import { LessonsExplorer } from "@/components/lessons-explorer";

export const metadata: Metadata = {
  title: "Lecciones",
  description: `Explora las ${LESSONS.length} lecciones bíblicas de Semillitas de Fe: busca por personaje, tema o versículo, y filtra por Antiguo o Nuevo Testamento.`,
};

export default async function LeccionesPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const pedida = decodeURIComponent(categoria ?? "").trim();
  const inicial =
    CATEGORIES.find((c) => c.toLocaleLowerCase("es") === pedida.toLocaleLowerCase("es")) ??
    "Todas";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Lecciones
        </h1>
        <p className="mt-2 leading-relaxed text-ink-500">
          Busca por personaje, tema o versículo, filtra por testamento y abre
          la clase completa: historia, quiz, dinámica, manualidad e imprimibles.
        </p>
      </header>
      <LessonsExplorer lessons={LESSONS} initialCategory={inicial} />
    </div>
  );
}
