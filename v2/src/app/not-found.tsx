import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-4 py-28 text-center">
      <span aria-hidden className="text-6xl">
        🐑
      </span>
      <h1 className="font-display text-3xl font-semibold">
        Esta página se había perdido
      </h1>
      <p className="max-w-md leading-relaxed text-ink-500">
        Como la oveja de la parábola… pero aquí ya la encontramos. Vuelve al
        redil y sigue explorando las lecciones.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-ghost text-sm">
          Ir al inicio
        </Link>
        <Link href="/lecciones" className="btn btn-primary text-sm">
          Ver lecciones
        </Link>
      </div>
    </div>
  );
}
