"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Tab = "entrar" | "crear";

/** Traduce los errores de Supabase a mensajes claros en español. */
function mensajeAmigable(error: { message: string }): string {
  const m = error.message;
  if (m.includes("Invalid login credentials"))
    return "Correo o contraseña incorrectos. Revisa e intenta de nuevo.";
  if (m.includes("Email not confirmed"))
    return "Tu correo aún no está confirmado: busca el enlace que te enviamos.";
  if (m.includes("User already registered") || m.includes("already been registered"))
    return "Ya existe una cuenta con ese correo. Inicia sesión o recupera tu contraseña.";
  if (m.includes("Password should be at least"))
    return "La contraseña debe tener al menos 8 caracteres.";
  if (m.includes("rate limit") || m.includes("Too many"))
    return "Demasiados intentos seguidos. Espera un minuto y vuelve a intentar.";
  if (m.includes("Failed to fetch") || m.includes("NetworkError"))
    return "No pudimos conectar con el servidor. Revisa tu internet e intenta de nuevo.";
  return m;
}

export function AuthForms() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("entrar");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  async function enviarLogin(formData: FormData) {
    const supabase = createSupabaseBrowserClient();
    setCargando(true);
    setError(null);
    setAviso(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    });
    setCargando(false);
    if (error) {
      setError(mensajeAmigable(error));
      return;
    }
    router.refresh();
  }

  async function enviarRegistro(formData: FormData) {
    const supabase = createSupabaseBrowserClient();
    setCargando(true);
    setError(null);
    setAviso(null);
    const nombre = String(formData.get("display_name") || "").trim();
    const { data, error } = await supabase.auth.signUp({
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      options: {
        data: { display_name: nombre },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setCargando(false);
    if (error) {
      setError(mensajeAmigable(error));
      return;
    }
    if (data.session) {
      router.refresh();
      return;
    }
    setAviso(
      "¡Casi listo! Te enviamos un correo para confirmar tu cuenta; ábrelo y sigue el enlace.",
    );
  }

  async function olvidarContrasena(formData: FormData) {
    const email = String(formData.get("email") || "");
    if (!email) {
      setError("Escribe tu correo arriba y luego pulsa «Olvidé mi contraseña».");
      return;
    }
    const supabase = createSupabaseBrowserClient();
    setCargando(true);
    setError(null);
    setAviso(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/cuenta`,
    });
    setCargando(false);
    if (error) {
      setError(mensajeAmigable(error));
      return;
    }
    setAviso("Te enviamos un enlace para crear una contraseña nueva.");
  }

  async function entrarConGoogle() {
    const supabase = createSupabaseBrowserClient();
    setCargando(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setCargando(false);
      setError(mensajeAmigable(error));
    }
  }

  const estiloInput =
    "w-full rounded-2xl border-2 border-cream-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition placeholder:font-normal placeholder:text-ink-300 focus:border-leaf-400 focus:ring-4 focus:ring-leaf-100";
  const estiloBotonTexto =
    "text-left font-semibold text-leaf-700 underline decoration-leaf-300 underline-offset-4 transition hover:text-leaf-800";

  return (
    <div className="card mx-auto w-full max-w-md p-6 sm:p-8">
      {/* Google */}
      <button
        type="button"
        onClick={entrarConGoogle}
        disabled={cargando}
        className="flex w-full items-center justify-center gap-3 rounded-full border-2 border-cream-200 bg-white px-4 py-3 font-display text-base font-semibold text-ink-900 transition hover:border-ink-300 disabled:opacity-60"
      >
        <span
          aria-hidden
          className="font-display text-lg font-bold text-sea-600"
        >
          G
        </span>
        Continuar con Google
      </button>

      <div className="my-5 flex items-center gap-3 text-xs font-bold text-ink-300">
        <span className="h-px flex-1 bg-cream-200" />
        o usa tu correo
        <span className="h-px flex-1 bg-cream-200" />
      </div>

      {/* Pestañas */}
      <div
        role="tablist"
        aria-label="Entrar o crear cuenta"
        className="mb-4 grid grid-cols-2 rounded-full bg-cream-100 p-1 text-sm font-bold text-ink-500"
      >
        {(["entrar", "crear"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => {
              setTab(t);
              setError(null);
              setAviso(null);
            }}
            className={`rounded-full px-4 py-2 transition ${
              tab === t ? "bg-white text-leaf-700 shadow-sm" : "hover:text-ink-900"
            }`}
          >
            {t === "entrar" ? "Iniciar sesión" : "Crear cuenta"}
          </button>
        ))}
      </div>

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-2xl bg-berry-100 px-4 py-3 text-sm font-semibold text-berry-700"
        >
          {error}
        </p>
      )}
      {aviso && (
        <p
          role="status"
          className="mb-4 rounded-2xl bg-leaf-50 px-4 py-3 text-sm font-semibold text-leaf-700"
        >
          {aviso}
        </p>
      )}

      {tab === "entrar" ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void enviarLogin(new FormData(event.currentTarget));
          }}
          className="space-y-3"
        >
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Correo electrónico"
            aria-label="Correo electrónico"
            className={estiloInput}
          />
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            placeholder="Contraseña"
            aria-label="Contraseña"
            className={estiloInput}
          />
          <button
            type="submit"
            disabled={cargando}
            className="btn btn-primary w-full disabled:opacity-60"
          >
            {cargando ? "Entrando…" : "Entrar"}
          </button>
          <button
            type="button"
            onClick={(event) => void olvidarContrasena(new FormData(event.currentTarget.form!))}
            className={`${estiloBotonTexto} text-sm`}
          >
            Olvidé mi contraseña
          </button>
        </form>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void enviarRegistro(new FormData(event.currentTarget));
          }}
          className="space-y-3"
        >
          <input
            name="display_name"
            autoComplete="name"
            required
            maxLength={80}
            placeholder="Tu nombre de maestro/a"
            aria-label="Tu nombre de maestro o maestra"
            className={estiloInput}
          />
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Correo electrónico"
            aria-label="Correo electrónico"
            className={estiloInput}
          />
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="Contraseña (mínimo 8 caracteres)"
            aria-label="Contraseña nueva"
            className={estiloInput}
          />
          <label className="flex items-start gap-2.5 text-sm text-ink-500">
            <input
              type="checkbox"
              required
              className="mt-0.5 size-4 accent-[var(--color-leaf-600)]"
            />
            Confirmo que soy maestro/a o adulto responsable. Las cuentas son
            solo para adultos.
          </label>
          <button
            type="submit"
            disabled={cargando}
            className="btn btn-primary w-full disabled:opacity-60"
          >
            {cargando ? "Creando…" : "Crear cuenta gratuita"}
          </button>
        </form>
      )}

      <p className="mt-5 text-center text-xs leading-relaxed text-ink-300">
        ¿Ya tenías cuenta en el sitio original?{" "}
        <strong className="text-ink-500">Funciona aquí igual</strong>: entra con
        el mismo correo y contraseña, o con Google.{" "}
        <Link href="/" className="underline underline-offset-2 hover:text-leaf-700">
          Volver al inicio
        </Link>
      </p>
    </div>
  );
}
