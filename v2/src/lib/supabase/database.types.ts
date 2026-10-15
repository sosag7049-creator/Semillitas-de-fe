/**
 * Tipos de la base de datos de Semillitas de Fe, escritos a mano para que
 * las consultas de Supabase tengan autocompletado y verificación estricta.
 *
 * Contrato completo en `supabase/migrations/0001_esquema_base.sql`.
 * `user_id` siempre referencia `auth.users(id)` y todas las tablas usan
 * RLS: cada maestro solo ve sus propias filas.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          church_name: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          church_name?: string | null;
          updated_at?: string | null;
        };
        Update: {
          display_name?: string | null;
          church_name?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      lesson_favorites: {
        Row: {
          user_id: string;
          lesson_slug: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          lesson_slug: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          lesson_slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          user_id: string;
          lesson_slug: string;
          /** Estados actuales del sitio: "completed" o ausente. */
          status: string | null;
          completed_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          user_id: string;
          lesson_slug: string;
          status?: string | null;
          completed_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          user_id?: string;
          lesson_slug?: string;
          status?: string | null;
          completed_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      teacher_notes: {
        Row: {
          id: string;
          user_id: string;
          lesson_slug: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_slug: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_slug?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
