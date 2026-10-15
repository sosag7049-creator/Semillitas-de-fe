import Image from "next/image";
import Link from "next/link";
import { CATEGORY_META } from "@/lib/lessons";
import type { Lesson } from "@/lib/types";

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const meta = CATEGORY_META[lesson.category];

  return (
    <Link
      href={`/lecciones/${lesson.slug}`}
      className="card group flex flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(43,38,32,0.10)]"
    >
      <div className="relative aspect-[16/10] bg-cream-100">
        {lesson.coverImage && (
          <Image
            src={lesson.coverImage}
            alt={`Ilustración de la lección ${lesson.title}`}
            fill
            sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.04]"
          />
        )}
        <span
          aria-hidden
          className="absolute left-3 top-3 grid size-11 place-items-center rounded-2xl bg-white/95 text-2xl shadow-sm"
        >
          {lesson.icon}
        </span>
        <span className={`chip absolute right-3 top-3 ${meta.chip}`}>
          {lesson.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink-900 transition group-hover:text-leaf-700">
          {lesson.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-ink-500">
          {lesson.objective}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs font-bold text-ink-300">
          <span>📖 {lesson.reference}</span>
          <span>⏱ {lesson.duration}</span>
        </div>
      </div>
    </Link>
  );
}
