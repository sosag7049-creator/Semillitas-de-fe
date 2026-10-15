"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/** Perfil del maestro: editar nombre/iglesia y cerrar sesión. */
export function ProfileForm({
  nombreInicial,
  iglesiaInicial,
  email,
}: {
  nombreInicial: string;
  iglesiaInicial: string;
  email: string;
}) {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [saliendo, setSaliendo] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function guardar(formData: FormData) {
    const supabase = createSupabaseBrowserClient();
    setCargando(true);
    setAviso(null);
    setError(null);
    const nombre = String(formData.get("display_name") || "").trim();
    const iglesia = String(formData.get("church_name") || "").trim();

    const { error: errorPerfil } = await supabase
      .from("profiles")
      .update({
        display_name: nombre,
        church_name: iglesia,
        updated_at: new Date().toISOString(),
      })
      .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "");

    if (!errorPerfil) {
      await supabase.auth.updateUser({
        data: { display_name: nombre },
      });
    }
    setCargando(false);
    if (errorPerfil) {
      setError("No se pudo guardar: " + errorPerfil.message);
      return;
    }
    setAviso("Perfil guardado ✅");
    router.refresh();
  }

  async function salir() {
    const supabase = createSupabaseBrowserClient();
    setSaliendo(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const estiloInput =
    "w-full rounded-2xl border-2 border-cream-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition placeholder:font-normal placeholder:text-ink-300 focus:border-leaf-400 focus:ring-4 focus:ring-leaf-100";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void guardar(new FormData(event.currentTarget));
      }}
      className="space-y-3"
    >
      <div className="rounded-2xl bg-cream-50 px-4 py-3 text-sm">
        <span className="font-bold text-ink-500">Correo:</span>{" "}
        <span className="text-ink-700">{email}</span>
      </div>
      <div>
        <label
          htmlFor="perfil-nombre"
          className="mb-1 block text-xs font-bold text-ink-500"
        >
          Nombre para mostrar
        </label>
        <input
          id="perfil-nombre"
          name="display_name"
          defaultValue={nombreInicial}
          maxLength={80}
          className={estiloInput}
        />
      </div>
      <div>
        <label
          htmlFor="perfil-iglesia"
          className="mb-1 block text-xs font-bold text-ink-500"
        >
          Iglesia o congregación (opcional)
        </label>
        <input
          id="perfil-iglesia"
          name="church_name"
          defaultValue={iglesiaInicial}
          maxLength={120}
          className={estiloInput}
        />
      </div>

      {aviso && (
        <p role="status" className="text-sm font-bold text-leaf-700">
          {aviso}
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm font-bold text-berry-600">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3 pt-1">
        <button
          type="submit"
          disabled={cargando}
          className="btn btn-primary px-5 py-2.5 text-sm disabled:opacity-60"
        >
          {cargando ? "Guardando…" : "Guardar perfil"}
        </button>
        <button
          type="button"
          onClick={() => void salir()}
          disabled={saliendo}
          className="btn btn-ghost px-5 py-2.5 text-sm disabled:opacity-60"
        >
          {saliendo ? "Saliendo…" : "Cerrar sesión"}
        </button>
      </div>
    </form>
  );
}
