"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Estado = "cargando" | "sin-sesion" | "guardada" | "no-guardada";

/**
 * Botón «guardar lección» (favoritos). vive en páginas estáticas, así que
 * consulta la sesión en el cliente y degrada con elegancia: si el maestro
 * no ha entrado, invita a iniciar sesión en lugar de fallar.
 */
export function FavoriteButton({ lessonSlug }: { lessonSlug: string }) {
  const [estado, setEstado] = useState<Estado>("cargando");
  const [trabajando, setTrabajando] = useState(false);

  useEffect(() => {
    let vigente = true;
    const supabase = createSupabaseBrowserClient();
    void (async () => {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user.id;
      if (!vigente) return;
      if (!userId) {
        setEstado("sin-sesion");
        return;
      }
      const { data: fila } = await supabase
        .from("lesson_favorites")
        .select("lesson_slug")
        .eq("user_id", userId)
        .eq("lesson_slug", lessonSlug)
        .maybeSingle();
      if (vigente) setEstado(fila ? "guardada" : "no-guardada");
    })();
    return () => {
      vigente = false;
    };
  }, [lessonSlug]);

  async function alternar() {
    if (trabajando || estado !== "guardada" && estado !== "no-guardada") return;
    const objetivo = estado === "guardada" ? "no-guardada" : "guardada";
    setEstado(objetivo); // optimista
    setTrabajando(true);
    const supabase = createSupabaseBrowserClient();
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    if (!userId) {
      setEstado("sin-sesion");
      setTrabajando(false);
      return;
    }
    if (objetivo === "guardada") {
      const { error } = await supabase
        .from("lesson_favorites")
        .upsert(
          { user_id: userId, lesson_slug: lessonSlug },
          { onConflict: "user_id,lesson_slug" },
        );
      if (error) setEstado("no-guardada");
    } else {
      const { error } = await supabase
        .from("lesson_favorites")
        .delete()
        .eq("user_id", userId)
        .eq("lesson_slug", lessonSlug);
      if (error) setEstado("guardada");
    }
    setTrabajando(false);
  }

  if (estado === "cargando") {
    return (
      <div
        aria-hidden
        className="card h-[76px] animate-pulse bg-cream-100/70"
      />
    );
  }

  if (estado === "sin-sesion") {
    return (
      <div className="card flex items-center justify-between gap-3 p-5">
        <p className="text-sm font-semibold text-ink-500">
          ❤️ Entra a tu cuenta para guardar tus lecciones favoritas.
        </p>
        <Link href="/cuenta" className="btn btn-primary shrink-0 px-4 py-2 text-sm">
          Entrar
        </Link>
      </div>
    );
  }

  const guardada = estado === "guardada";
  return (
    <button
      type="button"
      onClick={() => void alternar()}
      disabled={trabajando}
      aria-pressed={guardada}
      className={`card flex w-full items-center justify-between gap-3 p-5 text-left transition hover:-translate-y-0.5 disabled:opacity-70 ${
        guardada ? "border-berry-500/40 bg-berry-100/40" : ""
      }`}
    >
      <span className="text-sm font-bold text-ink-700">
        {guardada ? "❤️ Lección guardada" : "🤍 Guardar esta lección"}
      </span>
      <span aria-hidden className="text-xl">
        {trabajando ? "…" : guardada ? "✓" : "+"}
      </span>
    </button>
  );
}
