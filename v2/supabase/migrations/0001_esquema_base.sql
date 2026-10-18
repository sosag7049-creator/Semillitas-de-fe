-- Semillitas de Fe · esquema de referencia para la v2
-- =====================================================
-- El proyecto de producción ya tiene estas tablas (las creó la v1).
-- Este archivo documenta el contrato exacto que la app espera, para
-- reproducirlo en un entorno nuevo o revisarlo con calma.
--
-- Regla de oro: cada fila pertenece a un maestro (auth.users) y RLS
-- garantiza que nadie más pueda leerla ni escribirla.

-- Perfil público del maestro ------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  church_name  text,
  updated_at   timestamptz
);

-- Lecciones marcadas como favoritas ----------------------------------------
create table if not exists public.lesson_favorites (
  user_id     uuid not null references auth.users (id) on delete cascade,
  lesson_slug text not null,
  created_at  timestamptz not null default now(),
  primary key (user_id, lesson_slug)
);

-- Progreso de la lección (status = 'completed' al terminar el quiz) ---------
create table if not exists public.lesson_progress (
  user_id      uuid not null references auth.users (id) on delete cascade,
  lesson_slug  text not null,
  status       text,
  completed_at timestamptz,
  updated_at   timestamptz,
  primary key (user_id, lesson_slug)
);

-- Notas privadas del maestro, una por lección ------------------------------
create table if not exists public.teacher_notes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  lesson_slug text not null,
  content     text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Seguridad a nivel de fila: el dueño manda --------------------------------
alter table public.profiles         enable row level security;
alter table public.lesson_favorites enable row level security;
alter table public.lesson_progress  enable row level security;
alter table public.teacher_notes    enable row level security;

-- Perfiles: cada usuario ve y edita el suyo.
drop policy if exists "perfil_propio" on public.profiles;
create policy "perfil_propio" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Favoritos, progreso y notas: mismo patrón con user_id.
do $$
declare
  t text;
begin
  foreach t in array array['lesson_favorites', 'lesson_progress', 'teacher_notes']
  loop
    execute format(
      'drop policy if exists %L on public.%I',
      t || '_propietario', t
    );
    execute format(
      'create policy %I on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)',
      t || '_propietario', t
    );
  end loop;
end $$;
