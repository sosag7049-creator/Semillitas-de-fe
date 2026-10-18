import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** ¿Hay credenciales públicas configuradas para conectar a Supabase? */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

/** Cliente de Supabase para el navegador (sesión en cookies). */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}
