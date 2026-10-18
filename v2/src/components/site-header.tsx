import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-cream-200/70 bg-cream-50/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span
            aria-hidden
            className="grid size-10 place-items-center rounded-2xl bg-leaf-500 text-xl shadow-sm transition-transform group-hover:-rotate-6"
          >
            🌱
          </span>
          <span className="font-display text-lg font-semibold leading-tight text-ink-900">
            Semillitas <span className="text-leaf-600">de Fe</span>
          </span>
        </Link>

        <nav
          aria-label="Principal"
          className="flex items-center gap-1 text-sm font-bold text-ink-700 sm:gap-2"
        >
          <Link
            href="/lecciones"
            className="rounded-full px-3 py-2 transition hover:bg-leaf-100/70 hover:text-leaf-700"
          >
            Lecciones
          </Link>
          <span
            aria-hidden
            className="hidden rounded-full bg-cream-200/70 px-2.5 py-1 text-xs text-ink-500 md:inline"
          >
            Juegos · muy pronto
          </span>
          <a
            href="/cuenta"
            className="rounded-full px-3 py-2 transition hover:bg-leaf-100/70 hover:text-leaf-700"
          >
            Mi cuenta
          </a>
          <a
            href="https://github.com/sosag7049-creator/Semillitas-de-fe"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full px-3 py-2 transition hover:bg-leaf-100/70 hover:text-leaf-700 md:inline"
          >
            GitHub
          </a>
          <Link href="/lecciones" className="btn btn-primary ml-1 px-4 py-2 text-sm">
            Explorar
          </Link>
        </nav>
      </div>
    </header>
  );
}
