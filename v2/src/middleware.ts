import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresca los tokens de sesión de Supabase en cada navegación, de modo
 * que los Server Components siempre reciban cookies vigentes.
 * Sin variables de entorno (p. ej. en un build de CI) simplemente pasa.
 */
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Importante: llamar getUser() (no getSession) para que el middleware
  // valide y rote el token de acceso si está por vencer.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Todo excepto archivos estáticos (imágenes, iconos, manifest…).
    "/((?!_next/static|_next/image|images|icons|icon.png|favicon.ico|manifest.webmanifest|.*\\.(?:webp|png|jpg|jpeg|svg|ico|xml|txt|webmanifest)$).*)",
  ],
};
