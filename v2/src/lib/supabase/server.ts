import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./client";
import type { Database } from "./database.types";

export { isSupabaseConfigured } from "./client";

/**
 * Cliente de Supabase para Server Components y Route Handlers.
 * Lee y escribe la sesión en las cookies de la petición.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Llamado desde un Server Component: no se puede escribir
          // cookies ahí; el middleware se encarga de refrescarlas.
        }
      },
    },
  });
}

/**
 * Devuelve el usuario autenticado de la petición actual, o `null`.
 * Verifica el token con el servidor de auth (no confía solo en la cookie).
 */
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
