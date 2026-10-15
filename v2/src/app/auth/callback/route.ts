import { NextResponse } from "next/server";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

/**
 * A dónde regresan los enlaces de Supabase (Google OAuth, confirmación de
 * correo y recuperación de contraseña). Recibe `?code=…` del flujo PKCE,
 * lo cambia por una sesión en cookies y manda al maestro a su cuenta.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const pedido = searchParams.get("next") ?? "/cuenta";
  // Solo rutas internas: evita redirecciones abiertas.
  const destino = pedido.startsWith("/") ? pedido : "/cuenta";

  if (code && isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${destino}`);
    }
  }

  return NextResponse.redirect(`${origin}/cuenta?error=auth`);
}
