import Link from "next/link";
import { CATEGORIES, CATEGORY_META, LESSONS } from "@/lib/lessons";

export function SiteFooter() {
  return (
    <footer className="border-t border-cream-200/70 bg-cream-100/60">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <p className="flex items-center gap-2 font-display text-lg font-semibold">
            <span aria-hidden className="grid size-9 place-items-center rounded-2xl bg-leaf-500 text-lg">
              🌱
            </span>
            Semillitas de Fe
          </p>
          <p className="text-sm leading-relaxed text-ink-500">
            Lecciones, dinámicas y materiales bíblicos para maestros de niños y
            niñas de 3 a 10 años. Basados en la Reina-Valera 1960. Gratuito y
            libre para iglesias y familias.
          </p>
        </div>

        <nav aria-label="Explorar" className="space-y-3 text-sm">
          <p className="font-display font-semibold text-ink-900">Explorar</p>
          <ul className="space-y-1.5 text-ink-500">
            <li>
              <Link href="/lecciones" className="transition hover:text-leaf-700">
                Todas las lecciones ({LESSONS.length})
              </Link>
            </li>
            {CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  href={`/lecciones?categoria=${encodeURIComponent(category)}`}
                  className="transition hover:text-leaf-700"
                >
                  {CATEGORY_META[category].emoji} Tema: {category}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="El proyecto" className="space-y-3 text-sm">
          <p className="font-display font-semibold text-ink-900">El proyecto</p>
          <ul className="space-y-1.5 text-ink-500">
            <li>
              <a
                href="https://github.com/sosag7049-creator/Semillitas-de-fe"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-leaf-700"
              >
                Código abierto en GitHub
              </a>
            </li>
            <li>
              <a
                href="https://semillitasbiblicas.space"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-leaf-700"
              >
                Versión original del sitio
              </a>
            </li>
            <li className="pt-2 text-xs text-ink-300">
              Esta es la versión 2.0 en desarrollo: Next.js, TypeScript y
              Tailwind CSS.
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-cream-200/70 py-4 text-center text-xs text-ink-300">
        Hecho con 🌱 por Gerardo Sosa · «Así también la fe, si no tiene obras,
        es muerta» (Santiago 2:26)
      </div>
    </footer>
  );
}
