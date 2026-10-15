import lessonsData from "@/data/lessons.json";
import type { Category, Lesson, Testament } from "./types";

export const LESSONS = lessonsData as Lesson[];

export const LESSONS_BY_SLUG = new Map<string, Lesson>(
  LESSONS.map((lesson) => [lesson.slug, lesson]),
);

export const CATEGORIES = ["Jesús", "Fe", "Carácter", "Dios"] as const;

export const TESTAMENT_LABEL: Record<Testament, string> = {
  antiguo: "Antiguo Testamento",
  nuevo: "Nuevo Testamento",
};

export interface CategoryMeta {
  emoji: string;
  blurb: string;
  /** Chip sobre fondo de color. */
  chip: string;
  /** Botón/píldora con borde. */
  pill: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  "Jesús": {
    emoji: "🐟",
    blurb: "Su vida, sus milagros y sus parábolas",
    chip: "bg-sea-100 text-sea-700",
    pill: "border-sea-300 bg-sea-50 text-sea-700 hover:bg-sea-100",
  },
  "Fe": {
    emoji: "☀️",
    blurb: "Confiar en Dios aunque cueste",
    chip: "bg-sun-100 text-sun-700",
    pill: "border-sun-300 bg-sun-50 text-sun-700 hover:bg-sun-100",
  },
  "Carácter": {
    emoji: "🌱",
    blurb: "Valentía, perdón, honestidad y servicio",
    chip: "bg-leaf-100 text-leaf-700",
    pill: "border-leaf-300 bg-leaf-50 text-leaf-700 hover:bg-leaf-100",
  },
  "Dios": {
    emoji: "👑",
    blurb: "Quién es Dios y cómo cuida a su pueblo",
    chip: "bg-grape-100 text-grape-700",
    pill: "border-grape-200 bg-grape-50 text-grape-700 hover:bg-grape-100",
  },
};

export function getLessonBySlug(slug: string): Lesson | undefined {
  return LESSONS_BY_SLUG.get(slug);
}

/** Lección anterior y siguiente según el orden del catálogo. */
export function getLessonNeighbors(slug: string): {
  prev: Lesson | null;
  next: Lesson | null;
} {
  const index = LESSONS.findIndex((lesson) => lesson.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? LESSONS[index - 1] : null,
    next: index < LESSONS.length - 1 ? LESSONS[index + 1] : null,
  };
}

/** Minúsculas y sin acentos, para que «jesus» encuentre «Jesús». */
export function normalizar(texto: string): string {
  return texto
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
