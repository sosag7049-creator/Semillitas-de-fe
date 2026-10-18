import { NextResponse } from "next/server";

/**
 * A dónde regresan los enlaces de Supabase (Google OAuth, confirmación de
 * correo y recuperación de contraseña).
 *
 * El `?code=…` del flujo PKCE se pasa tal cual a /cuenta: el cliente de
 * Supabase en el navegador lo detecta, lo cambia por una sesión y limpia
 * la URL. Así el canje ocurre en el navegador del maestro (que sí tiene
 * salida a Supabase) y la ruta no necesita red en el servidor.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    return NextResponse.redirect(
      `${origin}/cuenta?code=${encodeURIComponent(code)}`,
    );
  }
  return NextResponse.redirect(`${origin}/cuenta`);
}
