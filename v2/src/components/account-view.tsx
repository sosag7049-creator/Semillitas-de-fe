"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import {
  createSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import { getLessonBySlug } from "@/lib/lessons";
import type { Lesson } from "@/lib/types";
import { AuthForms } from "./auth-forms";
import { LessonCard } from "./lesson-card";
import { ProfileForm } from "./profile-form";

interface Perfil {
  display_name: string | null;
  church_name: string | null;
}

/**
 * Vista de «Mi cuenta». Corre en el cliente a propósito: el navegador del
 * maestro habla directo con Supabase, así que el login y los favoritos
 * funcionan incluso donde el servidor no tiene salida a internet
 * (p. ej. entornos de preview) y la página puede quedar pre-renderizada.
 */
export function AccountView() {
  const [user, setUser] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [favoritas, setFavoritas] = useState<Lesson[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setCargando(false);
      return;
    }
    const supabase = createSupabaseBrowserClient();
    let vigente = true;

    async function cargar(u: User | null) {
      setUser(u);
      if (!u) {
        setPerfil(null);
        setFavoritas([]);
        setCargando(false);
        return;
      }
      const [{ data: p }, { data: f }] = await Promise.all([
        supabase
          .from("profiles")
          .select("display_name,church_name")
          .eq("id", u.id)
          .maybeSingle(),
        supabase.from("lesson_favorites").select("lesson_slug").eq("user_id", u.id),
      ]);
      if (!vigente) return;
      setPerfil(p ?? null);
      setFavoritas(
        (f ?? [])
          .map((fila) => getLessonBySlug(fila.lesson_slug))
          .filter((lesson): lesson is Lesson => lesson !== undefined),
      );
      setCargando(false);
    }

    void supabase.auth
      .getSession()
      .then(({ data }) => cargar(data.session?.user ?? null));

    // Entrar, salir o confirmar correo en otra pestaña: todo se refleja aquí.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, sesion) => {
      void cargar(sesion?.user ?? null);
    });

    return () => {
      vigente = false;
      subscription.unsubscribe();
    };
  }, []);

  /* Proyecto de Supabase sin configurar (fork recién clonado). */
  if (!isSupabaseConfigured()) {
    return (
      <div className="card mx-auto max-w-xl space-y-3 p-8 text-center">
        <span aria-hidden className="text-5xl">
          🔧
        </span>
        <h2 className="font-display text-2xl font-semibold">
          Cuentas no configuradas todavía
        </h2>
        <p className="text-sm leading-relaxed text-ink-500">
          Crea el archivo{" "}
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
    );
  }

  if (cargando) {
    return (
      <div
        role="status"
        aria-label="Cargando tu cuenta"
        className="card mx-auto flex max-w-md flex-col items-center gap-3 p-10"
      >
        <span aria-hidden className="animate-bounce text-4xl">
          🌱
        </span>
        <p className="text-sm font-bold text-ink-500">Preparando tu cuenta…</p>
      </div>
    );
  }

  /* Visitante: formularios de acceso. */
  if (!user) {
    return (
      <>
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
      </>
    );
  }

  const metadataPerfil = (user.user_metadata ?? {}) as {
    display_name?: string;
    full_name?: string;
  };
  const nombre =
    perfil?.display_name ||
    metadataPerfil.display_name ||
    metadataPerfil.full_name ||
    "Maestro/a";

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Perfil */}
      <section className="card h-fit space-y-4 p-6 sm:p-7" aria-labelledby="perfil">
        <h2 id="perfil" className="title-section">
          <span aria-hidden>👤</span> Mi perfil
        </h2>
        <ProfileForm
          nombreInicial={nombre}
          iglesiaInicial={perfil?.church_name ?? ""}
          email={user.email ?? ""}
        />
      </section>

      {/* Favoritas */}
      <section className="space-y-5 lg:col-span-2" aria-labelledby="favoritas">
        <div className="card p-6 sm:p-7">
          <h2 id="favoritas" className="title-section">
            <span aria-hidden>❤️</span> Lecciones guardadas
          </h2>
          <p className="text-sm text-ink-500">
            {favoritas.length === 0
              ? "Aún no guardas ninguna. Abre una lección y pulsa «Guardar esta lección»."
              : `${favoritas.length} ${
                  favoritas.length === 1 ? "lección guardada" : "lecciones guardadas"
                } y listas para tu próxima clase.`}
          </p>
        </div>

        {favoritas.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2">
            {favoritas.map((lesson) => (
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
              Explora el catálogo y guarda las lecciones que quieras tener a un
              clic antes del domingo.
            </p>
            <Link href="/lecciones" className="btn btn-primary mt-1 text-sm">
              Explorar lecciones
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
