import type { Metadata } from "next";
import Link from "next/link";
import { getLessonBySlug } from "@/lib/lessons";
import { getCurrentUser, createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { AuthForms } from "@/components/auth-forms";
import { LessonCard } from "@/components/lesson-card";
import { ProfileForm } from "@/components/profile-form";

export const metadata: Metadata = {
  title: "Mi cuenta",
  description:
    "Espacio del maestro: inicia sesión con tu correo o Google, guarda lecciones favoritas y personaliza tu perfil.",
  robots: { index: false },
};

export default async function CuentaPage() {
  /* Sin Supabase configurado (p. ej. un fork recién clonado): instrucciones. */
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-20 sm:px-6">
        <div className="card space-y-3 p-8 text-center">
          <span aria-hidden className="text-5xl">
            🔧
          </span>
          <h1 className="font-display text-2xl font-semibold">
            Cuentas no configuradas todavía
          </h1>
          <p className="text-sm leading-relaxed text-ink-500">
            Para activar las cuentas de maestro, crea el archivo{" "}
            <code className="rounded bg-cream-100 px-1.5 py-0.5 font-bold">
              .env.local
            </code>{" "}
            dentro de <code className="font-bold">v2/</code> con las claves
            públicas de tu proyecto de Supabase (mira{" "}
            <code className="rounded bg-cream-100 px-1.5 py-0.5 font-bold">
              .env.example
            </code>
            ) y reinicia el servidor.
          </p>
        </div>
      </div>
    );
  }

  const user = await getCurrentUser();

  /* Visitante: formularios de acceso. */
  if (!user) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <header className="mx-auto mb-8 max-w-xl text-center">
          <span aria-hidden className="text-4xl">
            👩‍🏫
          </span>
          <h1 className="mt-2 font-display text-3xl font-semibold">
            Mi cuenta de maestro
          </h1>
          <p className="mt-2 leading-relaxed text-ink-500">
            Guarda lecciones favoritas, lleva el progreso de tu clase y ten tu
            material a la mano. Gratis, igual que todo el sitio.
          </p>
        </header>
        <AuthForms />
      </div>
    );
  }

  /* Maestro con sesión: perfil + favoritas. */
  const supabase = await createSupabaseServerClient();
  const [{ data: profile }, { data: favoritos }] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name,church_name")
      .eq("id", user.id)
      .maybeSingle(),
    supabase.from("lesson_favorites").select("lesson_slug").eq("user_id", user.id),
  ]);

  const metadataPerfil = (user.user_metadata ?? {}) as {
    display_name?: string;
    full_name?: string;
  };
  const nombre =
    profile?.display_name ||
    metadataPerfil.display_name ||
    metadataPerfil.full_name ||
    "Maestro/a";
  const email = user.email ?? "";

  const leccionesFavoritas = (favoritos ?? [])
    .map((f) => getLessonBySlug(f.lesson_slug))
    .filter((lesson) => lesson !== undefined);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <p className="chip border border-leaf-300 bg-leaf-50 text-leaf-700">
          🌱 Sesión iniciada
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold">
          ¡Hola, {nombre}!
        </h1>
        <p className="mt-1 text-ink-500">
          Tu espacio para preparar la próxima clase con todo a la mano.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Perfil */}
        <section className="card h-fit space-y-4 p-6 sm:p-7" aria-labelledby="perfil">
          <h2 id="perfil" className="title-section">
            <span aria-hidden>👤</span> Mi perfil
          </h2>
          <ProfileForm
            nombreInicial={nombre}
            iglesiaInicial={profile?.church_name ?? ""}
            email={email}
          />
        </section>

        {/* Favoritas */}
        <section className="space-y-5 lg:col-span-2" aria-labelledby="favoritas">
          <div className="card p-6 sm:p-7">
            <h2 id="favoritas" className="title-section">
              <span aria-hidden>❤️</span> Lecciones guardadas
            </h2>
            <p className="text-sm text-ink-500">
              {leccionesFavoritas.length === 0
                ? "Aún no guardas ninguna. Abre una lección y pulsa «Guardar esta lección»."
                : `${leccionesFavoritas.length} ${
                    leccionesFavoritas.length === 1 ? "lección" : "lecciones"
                  } listas para tu próxima clase.`}
            </p>
          </div>

          {leccionesFavoritas.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2">
              {leccionesFavoritas.map((lesson) => (
                <li key={lesson.slug}>
                  <LessonCard lesson={lesson} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
              <span aria-hidden className="text-5xl">
                🗂️
              </span>
              <p className="max-w-sm text-sm leading-relaxed text-ink-500">
                Explora el catálogo y guarda las lecciones que quieras tener a
                un clic antes del domingo.
              </p>
              <Link href="/lecciones" className="btn btn-primary mt-1 text-sm">
                Explorar lecciones
              </Link>
            </div>
          )}
        </section>
      </div>

      <p className="mt-10 text-center text-xs leading-relaxed text-ink-300">
        Tus datos son privados: solo tú ves tus favoritas y tu perfil. Las
        cuentas son para adultos; no pedimos información de los niños.
      </p>
    </div>
  );
}
