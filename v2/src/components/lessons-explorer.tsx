"use client";

import { useMemo, useState } from "react";
import {
  CATEGORIES,
  CATEGORY_META,
  normalizar,
} from "@/lib/lessons";
import type { Lesson, Testament } from "@/lib/types";
import { LessonCard } from "./lesson-card";

type CategoryFilter = "Todas" | (typeof CATEGORIES)[number];
type TestamentFilter = Testament | "todas";

const TESTAMENT_OPTIONS: { value: TestamentFilter; label: string }[] = [
  { value: "todas", label: "Todos" },
  { value: "antiguo", label: "Antiguo Testamento" },
  { value: "nuevo", label: "Nuevo Testamento" },
];

export function LessonsExplorer({
  lessons,
  initialCategory = "Todas",
}: {
  lessons: Lesson[];
  initialCategory?: CategoryFilter;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);
  const [testament, setTestament] = useState<TestamentFilter>("todas");

  const counts = useMemo(() => {
    const porCategoria: Record<string, number> = { Todas: lessons.length };
    for (const c of CATEGORIES) porCategoria[c] = 0;
    for (const lesson of lessons) {
      porCategoria[lesson.category] = (porCategoria[lesson.category] ?? 0) + 1;
    }
    return porCategoria;
  }, [lessons]);

  const results = useMemo(() => {
    const term = normalizar(query.trim());
    return lessons.filter((lesson) => {
      if (category !== "Todas" && lesson.category !== category) return false;
      if (testament !== "todas" && lesson.testament !== testament) return false;
      if (!term) return true;
      const haystack = normalizar(
        [
          lesson.title,
          lesson.objective,
          lesson.reference,
          lesson.category,
          lesson.memory.text,
          lesson.memory.reference,
          ...lesson.story.map((part) => `${part.title} ${part.text}`),
        ].join(" "),
      );
      return haystack.includes(term);
    });
  }, [lessons, query, category, testament]);

  const hayFiltros = query !== "" || category !== "Todas" || testament !== "todas";

  function limpiar() {
    setQuery("");
    setCategory("Todas");
    setTestament("todas");
  }

  return (
    <div className="space-y-6">
      {/* Búsqueda */}
      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-lg"
        >
          🔍
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Busca una lección: «david», «perdón», «Génesis»…"
          aria-label="Buscar lecciones"
          className="w-full rounded-full border-2 border-cream-200 bg-white py-4 pl-13 pr-5 text-base font-semibold text-ink-900 shadow-sm outline-none transition placeholder:font-normal placeholder:text-ink-300 focus:border-leaf-400 focus:ring-4 focus:ring-leaf-100"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Filtrar por tema"
          className="flex flex-wrap gap-2"
        >
          {(["Todas", ...CATEGORIES] as CategoryFilter[]).map((c) => {
            const activo = category === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={activo}
                className={`chip border px-4 py-2 text-sm transition ${
                  activo
                    ? "border-leaf-600 bg-leaf-600 text-white"
                    : c === "Todas"
                      ? "border-cream-300 bg-white text-ink-700 hover:border-leaf-400"
                      : `${CATEGORY_META[c].pill} border`
                }`}
              >
                {c === "Todas" ? "🌈 Todas" : `${CATEGORY_META[c].emoji} ${c}`}
                <span className={activo ? "text-leaf-100" : "text-ink-300"}>
                  {counts[c] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="group"
          aria-label="Filtrar por testamento"
          className="inline-flex self-start rounded-full border-2 border-cream-200 bg-white p-1 text-sm font-bold text-ink-500"
        >
          {TESTAMENT_OPTIONS.map((option) => {
            const activo = testament === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setTestament(option.value)}
                aria-pressed={activo}
                className={`rounded-full px-4 py-1.5 transition ${
                  activo ? "bg-leaf-100 text-leaf-700" : "hover:text-ink-900"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resultados */}
      <p className="text-sm font-bold text-ink-500" role="status">
        {results.length === lessons.length
          ? `${lessons.length} lecciones`
          : `${results.length} de ${lessons.length} lecciones`}
      </p>

      {results.length > 0 ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((lesson) => (
            <li key={lesson.slug}>
              <LessonCard lesson={lesson} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
          <span aria-hidden className="text-5xl">
            🌾
          </span>
          <h2 className="font-display text-xl font-semibold">
            No encontramos esa lección
          </h2>
          <p className="max-w-sm text-sm text-ink-500">
            Prueba con otro personaje, tema o versículo — o limpia los filtros
            para ver todo el catálogo.
          </p>
          {hayFiltros && (
            <button type="button" onClick={limpiar} className="btn btn-primary mt-2 text-sm">
              Ver todas las lecciones
            </button>
          )}
        </div>
      )}
    </div>
  );
}
