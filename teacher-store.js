// All persistent reads/writes go through Supabase; its RLS enforces ownership.
export async function request(query, timeout = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const result = await query.abortSignal(controller.signal);
    if (result.error) throw result.error;
    return result;
  } finally { clearTimeout(timer); }
}

export function createTeacherStore(client, lessonIds) {
  const knownLessons = new Set(lessonIds);
  const listeners = new Set();
  let user = null, epoch = 0, readId = 0, loading = false, notesLimit = 100;
  let favorites = new Set(), progress = new Map(), notes = [], notesTotal = 0;
  let pending = new Set(), loaded = {}, errors = {};
  let revisions = { favorites: 0, progress: 0, notes: 0 };
  const snapshot = () => ({ user, loading, favorites: new Set(favorites), progress: new Map(progress),
    notes: notes.map(n => ({ ...n })), notesTotal, pending: new Set(pending), loaded: { ...loaded }, errors: { ...errors } });
  const emit = () => { const state = snapshot(); listeners.forEach(fn => fn(state)); };
  const context = (section, lesson) => {
    if (!user) throw new Error('Inicia sesión para guardar tus cambios.');
    if (!loaded[section]) throw new Error('Primero carga tus datos con «Actualizar».');
    if (lesson != null && !knownLessons.has(lesson)) throw new Error('Esta lección no está disponible.');
    return { epoch, userId: user.id };
  };
  const current = c => c.epoch === epoch && c.userId === user?.id;

  async function refresh() {
    if (!user) return;
    const c = { epoch, userId: user.id }, serial = ++readId, atStart = { ...revisions };
    loading = true; emit();
    const queries = [
      ['favorites', client.from('lesson_favorites').select('lesson_slug').eq('user_id', c.userId)],
      ['progress', client.from('lesson_progress').select('lesson_slug,status,completed_at,updated_at').eq('user_id', c.userId)],
      ['notes', client.from('teacher_notes').select('id,lesson_slug,content,created_at,updated_at', { count: 'exact' })
        .eq('user_id', c.userId).order('updated_at', { ascending: false }).range(0, notesLimit - 1)]
    ];
    await Promise.all(queries.map(async ([section, query]) => {
      try {
        const { data, count } = await request(query);
        if (!current(c) || serial !== readId || revisions[section] !== atStart[section]) return;
        // A read started before a pending write must not undo its instant UI state.
        if ([...pending].some(key => key.startsWith(section + ':'))) return;
        if (section === 'favorites') favorites = new Set(data.map(row => String(row.lesson_slug)));
        if (section === 'progress') progress = new Map(data.map(row => [String(row.lesson_slug), row]));
        if (section === 'notes') { notes = data; notesTotal = count ?? data.length; }
        loaded[section] = true; delete errors[section];
      } catch {
        if (current(c) && serial === readId) errors[section] = 'No se pudieron actualizar estos datos. Puedes volver a intentarlo.';
      }
    }));
    if (current(c) && serial === readId) { loading = false; emit(); }
  }

  async function setUser(nextUser) {
    if (user?.id === nextUser?.id) { user = nextUser; emit(); return; }
    epoch++; readId++; user = nextUser; notesLimit = 100;
    favorites = new Set(); progress = new Map(); notes = []; notesTotal = 0;
    pending = new Set(); loaded = {}; errors = {}; loading = false;
    revisions = { favorites: 0, progress: 0, notes: 0 }; emit();
    if (user) await refresh();
  }

  async function toggleFavorite(lesson) {
    const c = context('favorites', lesson), key = 'favorites:' + lesson;
    if (pending.has(key)) return;
    const before = favorites.has(lesson);
    pending.add(key); revisions.favorites++;
    if (before) favorites.delete(lesson); else favorites.add(lesson);
    emit();
    try {
      if (before) await request(client.from('lesson_favorites').delete().eq('user_id', c.userId).eq('lesson_slug', lesson));
      else await request(client.from('lesson_favorites').upsert({ user_id: c.userId, lesson_slug: lesson },
        { onConflict: 'user_id,lesson_slug', ignoreDuplicates: true }));
    } catch (error) {
      if (current(c)) { if (before) favorites.add(lesson); else favorites.delete(lesson); }
      throw error;
    } finally {
      if (current(c)) { pending.delete(key); revisions.favorites++; emit(); }
    }
  }

  async function setProgress(lesson, status) {
    if (!['', 'planned', 'completed'].includes(status)) throw new Error('Estado de lección no válido.');
    const c = context('progress', lesson), key = 'progress:' + lesson;
    if (pending.has(key)) return;
    const before = progress.get(lesson);
    const row = { lesson_slug: lesson, status, completed_at: status === 'completed' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString() };
    pending.add(key); revisions.progress++;
    if (status) progress.set(lesson, row); else progress.delete(lesson);
    emit();
    try {
      if (!status) await request(client.from('lesson_progress').delete().eq('user_id', c.userId).eq('lesson_slug', lesson));
      else {
        const { data } = await request(client.from('lesson_progress').upsert({ ...row, user_id: c.userId },
          { onConflict: 'user_id,lesson_slug' }).select('lesson_slug,status,completed_at,updated_at').single());
        if (current(c)) progress.set(lesson, data);
      }
    } catch (error) {
      if (current(c)) { if (before) progress.set(lesson, before); else progress.delete(lesson); }
      throw error;
    } finally {
      if (current(c)) { pending.delete(key); revisions.progress++; emit(); }
    }
  }

  async function saveNote({ id, content, lesson_slug, updated_at }) {
    const c = context('notes', lesson_slug), key = 'notes:' + id;
    const text = content.trim();
    if (!text || text.length > 5000) throw new Error('Escribe una nota de entre 1 y 5.000 caracteres.');
    if (!id || pending.has(key)) throw new Error('La nota se está guardando.');
    pending.add(key); revisions.notes++; emit();
    const values = { content: text, lesson_slug: lesson_slug || null, updated_at: new Date().toISOString() };
    try {
      // Editing uses a version check so another tab's edits are not silently lost.
      const query = updated_at
        ? client.from('teacher_notes').update(values).eq('id', id).eq('user_id', c.userId).eq('updated_at', updated_at)
        : client.from('teacher_notes').upsert({ ...values, id, user_id: c.userId }, { onConflict: 'id' });
      const { data } = await request(query.select('id,lesson_slug,content,created_at,updated_at').maybeSingle());
      if (!data) throw new Error('Esta nota cambió en otra pestaña. Copia tu texto y actualiza antes de volver a editar.');
      if (current(c)) {
        if (!notes.some(note => note.id === id)) notesTotal++;
        notes = [data, ...notes.filter(note => note.id !== id)].sort((a,b) => b.updated_at.localeCompare(a.updated_at));
      }
      return data;
    } finally {
      if (current(c)) { pending.delete(key); revisions.notes++; emit(); }
    }
  }

  async function deleteNote(id) {
    const c = context('notes'), key = 'notes:' + id;
    if (pending.has(key)) return;
    pending.add(key); revisions.notes++; emit();
    try {
      await request(client.from('teacher_notes').delete().eq('id', id).eq('user_id', c.userId));
      if (current(c)) { notes = notes.filter(note => note.id !== id); notesTotal = Math.max(0, notesTotal - 1); }
    } finally {
      if (current(c)) { pending.delete(key); revisions.notes++; emit(); }
    }
  }

  return {
    snapshot, setUser, refresh, toggleFavorite, setProgress, saveNote, deleteNote,
    loadMoreNotes() { notesLimit += 100; return refresh(); },
    subscribe(fn) { listeners.add(fn); fn(snapshot()); return () => listeners.delete(fn); }
  };
}
