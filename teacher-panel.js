import { mountAgenda } from './agenda.js?v=2';
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const statusNames = { '': 'Sin empezar', planned: 'En preparación', completed: 'Impartida' };

export function mountTeacherPanel({ store, lessons, openAccount, errorMessage, client }) {
  const catalog = new Map(lessons.map(lesson => [lesson.id, lesson]));
  let state = store.snapshot(), tab = 'favorites', filter = '', profileName = '';
  let draftId = null, draftVersion = null, dirty = false, editingUser = null, toastTimer, noteSaveGeneration = 0;
  document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="/teacher-panel.css">');
  document.body.insertAdjacentHTML('beforeend', `
    <dialog id="teacherPanel" class="teacher-panel" aria-labelledby="teacherTitle">
      <div class="teacher-header">
        <div class="teacher-header-copy"><div class="teacher-identity"><span id="teacherHeaderAvatar" class="avatar-art avatar-art-semilla" aria-hidden="true"></span><div><small>SEMILLITAS DE FE · PANEL DEL MAESTRO</small><h2 id="teacherTitle">Mi panel de maestro</h2><p id="teacherGreeting">Tu preparación, en un solo lugar.</p></div></div></div>
        <button id="teacherClose" class="teacher-icon-button" type="button" aria-label="Cerrar el panel">✕</button>
      </div>
      <div class="teacher-toolbar"><span>🔒 Apuntes y progreso privados de tu cuenta</span><div><button id="teacherRefresh" type="button">Actualizar</button><button id="teacherProfile" type="button">Editar perfil</button></div></div>
      <div class="teacher-scroll">
        <div id="teacherMessage" class="teacher-message" role="status" aria-live="polite" hidden></div>
        <div class="teacher-stats" aria-label="Resumen personal">
          <button data-summary="favorites" type="button"><span aria-hidden="true">♥</span><strong id="teacherFavoriteCount">—</strong><small>Favoritas</small></button>
          <button data-summary="planned" type="button"><span aria-hidden="true">📖</span><strong id="teacherPlannedCount">—</strong><small>En preparación</small></button>
          <button data-summary="completed" type="button"><span aria-hidden="true">✓</span><strong id="teacherCompletedCount">—</strong><small>Impartidas</small></button>
          <button data-summary="notes" type="button"><span aria-hidden="true">✎</span><strong id="teacherNoteCount">—</strong><small>Notas privadas</small></button>
        </div>
        <div class="teacher-tabs" role="tablist" aria-label="Secciones del panel">
          <button id="teacherTabFavorites" role="tab" aria-controls="teacherFavorites" data-tab="favorites" aria-selected="true" type="button">Mis favoritas</button>
          <button id="teacherTabProgress" role="tab" aria-controls="teacherProgress" data-tab="progress" aria-selected="false" tabindex="-1" type="button">Mi progreso</button>
          <button id="teacherTabAgenda" role="tab" aria-controls="teacherAgenda" data-tab="agenda" aria-selected="false" tabindex="-1" type="button">Agenda del maestro</button>
          <button id="teacherTabNotes" role="tab" aria-controls="teacherNotes" data-tab="notes" aria-selected="false" tabindex="-1" type="button">Mis notas</button>
        </div>
        <section id="teacherAgenda" class="teacher-section" role="tabpanel" aria-labelledby="teacherTabAgenda" hidden></section>
        <section id="teacherFavorites" class="teacher-section" role="tabpanel" aria-labelledby="teacherTabFavorites"><p class="teacher-description">Las lecciones que quieres tener a mano para tu clase.</p><div id="teacherFavoritesList" class="teacher-lesson-list"></div></section>
        <section id="teacherProgress" class="teacher-section" role="tabpanel" aria-labelledby="teacherTabProgress" hidden>
          <div class="teacher-progress-top"><div><h3>Tu recorrido por las lecciones</h3><p id="teacherProgressLabel">Cargando tu progreso…</p><progress id="teacherProgressBar" max="${lessons.length}" value="0" aria-label="Lecciones impartidas"></progress></div>
          <label>Mostrar<select id="teacherProgressFilter"><option value="">Todas las lecciones</option><option value="not_started">Sin empezar</option><option value="planned">En preparación</option><option value="completed">Impartidas</option></select></label></div>
          <p class="teacher-description">Elige «En preparación» mientras organizas la clase y «Impartida» cuando la hayas enseñado. Puedes cambiarlo después.</p><div id="teacherProgressList" class="teacher-lesson-list"></div>
        </section>
        <section id="teacherNotes" class="teacher-section" role="tabpanel" aria-labelledby="teacherTabNotes" hidden>
          <div class="teacher-notebook">
            <form id="teacherNoteForm" class="teacher-note-editor"><fieldset id="teacherNoteFields">
              <div class="teacher-editor-head"><h3 id="teacherNoteTitle">Nueva nota</h3><span class="teacher-private">Privada</span></div>
              <label for="teacherNoteLesson">Relacionar con una lección</label><select id="teacherNoteLesson"><option value="">Nota general</option>${lessons.map(l => `<option value="${escape(l.id)}">${escape(l.title)}</option>`).join('')}</select>
              <label for="teacherNoteContent">Tu apunte</label><textarea id="teacherNoteContent" rows="8" maxlength="5000" required placeholder="Ideas para contar la historia, materiales que necesito, qué mejorar en la próxima clase…" aria-describedby="teacherNoteHint teacherNoteLength"></textarea>
              <div class="teacher-editor-meta"><small id="teacherNoteHint">No escribas datos personales de los niños.</small><small id="teacherNoteLength">0 / 5.000</small></div>
              <div class="teacher-editor-actions"><button class="teacher-primary" id="teacherSaveNote" type="submit">Guardar nota</button><button id="teacherNewNote" type="button">Nueva / cancelar edición</button></div>
              <p id="teacherNoteFeedback" role="status" aria-live="polite"></p>
            </fieldset></form>
            <div><h3 class="teacher-notes-heading">Tus apuntes guardados</h3><div id="teacherNotesList"></div><button id="teacherMoreNotes" type="button" hidden>Cargar más notas</button></div>
          </div>
        </section>
      </div>
      <div class="teacher-bottom"><span id="teacherSync">Conectando tus datos…</span><small>Creado por Gerardo Sosa</small></div>
    </dialog>
    <div id="teacherToast" class="teacher-toast" role="status" aria-live="polite" hidden></div>
  `);
  const $ = id => document.getElementById(id);
  const panel = $('teacherPanel');
  const noteContent = $('teacherNoteContent'), noteLesson = $('teacherNoteLesson');
  const sections = { favorites: $('teacherFavorites'), progress: $('teacherProgress'), notes: $('teacherNotes'), agenda: $('teacherAgenda') };
  const agenda = mountAgenda({client, teacherStore:store, container:$('teacherAgenda'), openAgenda:()=>open('agenda')});
  function tell(message, error = false) {
    const lessonMessage = $('dlg')?.open && $('lessonTeacherMessage');
    const el = panel.open ? $('teacherMessage') : lessonMessage || $('teacherToast');
    el.textContent = message; el.hidden = !message; el.classList.toggle('is-error', error);
    if (el === $('teacherToast')) { clearTimeout(toastTimer); toastTimer = setTimeout(() => el.hidden = true, 6000); }
  }
  function switchTab(next) {
    tab = next;
    panel.querySelectorAll('[role="tab"]').forEach(button => {
      const selected = button.dataset.tab === tab;
      button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1;
    });
    Object.entries(sections).forEach(([key, section]) => section.hidden = key !== tab);
  }
  function open(next = 'favorites') {
    if (!store.snapshot().user) { openAccount('Inicia sesión para abrir tu panel personal.'); return; }
    document.getElementById('accountDialog')?.close();
    document.getElementById('dlg')?.close();
    switchTab(next); if (!panel.open) panel.showModal();
    store.refresh(); agenda.refresh();
  }
  function resetDraft(lesson = '') {
    noteSaveGeneration++;
    draftId = null; draftVersion = null; dirty = false;
    noteContent.value = ''; noteLesson.value = lesson;
    $('teacherNoteFields').disabled = false;
    $('teacherSaveNote').textContent = 'Guardar nota';
    $('teacherNoteTitle').textContent = 'Nueva nota';
    $('teacherNoteLength').textContent = '0 / 5.000';
    $('teacherNoteFeedback').textContent = '';
  }
  const mayDiscard = () => {
    if ($('teacherNoteFields').disabled) { tell('Espera a que termine el guardado de tu nota.'); return false; }
    return agenda.mayDiscard() && (!dirty || window.confirm('Tienes un apunte sin guardar. ¿Quieres descartarlo?'));
  };
  function newNote(lesson = '') {
    if (!mayDiscard()) return;
    open('notes'); resetDraft(lesson); noteContent.focus();
  }
  function stateControl(id) {
    const value = state.progress.get(id)?.status || '';
    const disabled = state.pending.has('progress:' + id) || !state.loaded.progress;
    return `<label class="teacher-status-control">Estado<select data-progress="${escape(id)}" data-focus-key="progress-${escape(id)}" ${disabled ? 'disabled' : ''} aria-label="Estado de ${escape(catalog.get(id)?.title || 'la lección')}">${Object.entries(statusNames).map(([key,label]) => `<option value="${key}" ${key === value ? 'selected' : ''}>${label}</option>`).join('')}</select></label>`;
  }
  function lessonCard(lesson, isFavorite) {
    const completed = state.progress.get(lesson.id)?.status === 'completed';
    return `<article class="teacher-lesson ${completed ? 'is-completed' : ''}"><span class="teacher-lesson-emoji" aria-hidden="true">${escape(lesson.emoji)}</span><div class="teacher-lesson-copy"><small>${escape(lesson.category)} · Lección ${lesson.index + 1}</small><h3>${escape(lesson.title)}</h3><p>${escape(lesson.reference)}</p><div class="teacher-lesson-actions"><button data-open-lesson="${escape(lesson.id)}" type="button" class="teacher-primary">Abrir lección</button><button data-new-note="${escape(lesson.id)}" type="button">Escribir nota</button>${isFavorite ? `<button class="favorite-auth-btn" data-lesson-id="${escape(lesson.id)}" data-focus-key="favorite-${escape(lesson.id)}" type="button">♥ Guardada</button>` : ''}</div></div>${stateControl(lesson.id)}</article>`;
  }
  function replaceList(element, html) {
    const focus = element.contains(document.activeElement) ? document.activeElement?.dataset.focusKey : null;
    element.innerHTML = html;
    if (focus) [...element.querySelectorAll('[data-focus-key]')].find(el => el.dataset.focusKey === focus)?.focus({ preventScroll: true });
  }
  const empty = (title, text) => `<div class="teacher-empty"><h3>${title}</h3><p>${text}</p></div>`;
  function update(stateNow) {
    state = stateNow;
    if (editingUser !== state.user?.id) {
      resetDraft(); profileName = ''; editingUser = state.user?.id;
      $('teacherMessage').textContent = ''; $('teacherMessage').hidden = true;
      $('teacherToast').textContent = ''; $('teacherToast').hidden = true;
    }
    if (!state.user) panel.close();
    const name = profileName || state.user?.user_metadata?.display_name || state.user?.user_metadata?.full_name || '';
    $('teacherGreeting').textContent = name ? `Hola, ${name}. ¿Qué enseñarás hoy?` : 'Tu preparación, en un solo lugar.';
    const knownProgress = [...state.progress].filter(([id]) => catalog.has(id));
    const completed = knownProgress.filter(([,p]) => p.status === 'completed').length;
    $('teacherFavoriteCount').textContent = state.loaded.favorites ? state.favorites.size : '—';
    $('teacherPlannedCount').textContent = state.loaded.progress ? knownProgress.filter(([,p]) => p.status === 'planned').length : '—';
    $('teacherCompletedCount').textContent = state.loaded.progress ? completed : '—';
    $('teacherNoteCount').textContent = state.loaded.notes ? state.notesTotal : '—';
    $('teacherProgressBar').value = completed;
    $('teacherProgressLabel').textContent = state.loaded.progress ? `${completed} de ${lessons.length} lecciones impartidas · ${Math.round(completed / lessons.length * 100)} %` : 'Cargando tu progreso…';
    $('teacherRefresh').disabled = state.loading;
    $('teacherRefresh').textContent = state.loading ? 'Actualizando…' : 'Actualizar';
    $('teacherSync').textContent = state.pending.size ? 'Guardando cambios…' : state.loading ? 'Actualizando tus datos…' : Object.keys(state.errors).length ? 'Sin actualizar. Pulsa «Actualizar» para reintentar.' : state.user ? 'Datos de tu cuenta · guardados en línea' : 'Inicia sesión para guardar tus datos';

    const favorites = lessons.filter(l => state.favorites.has(l.id));
    replaceList($('teacherFavoritesList'), !state.loaded.favorites
      ? empty('Tus favoritas', state.errors.favorites || 'Cargando las lecciones guardadas…')
      : favorites.map(l => lessonCard(l, true)).join('') || empty('Tu primera favorita te espera', 'Busca una lección en la biblioteca y toca el corazón «Guardar». Aquí la encontrarás cuando vuelvas.') + '<button class="teacher-primary" data-library type="button">Explorar lecciones</button>');
    const filtered = lessons.filter(l => !filter || (filter === 'not_started' ? !state.progress.has(l.id) : state.progress.get(l.id)?.status === filter));
    replaceList($('teacherProgressList'), !state.loaded.progress
      ? empty('Tu progreso', state.errors.progress || 'Cargando el estado de tus clases…')
      : filtered.map(l => lessonCard(l, false)).join('') || empty('Todavía no hay lecciones en este estado', 'Cambia el filtro para encontrar otra clase.'));
    const formatDate = value => new Intl.DateTimeFormat('es-GT', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
    replaceList($('teacherNotesList'), !state.loaded.notes
      ? empty('Tus notas', state.errors.notes || 'Cargando tus apuntes…')
      : state.notes.map(note => `<article class="teacher-note-card"><div class="teacher-note-meta"><strong>${escape(catalog.get(note.lesson_slug)?.title || (note.lesson_slug ? 'Lección guardada' : 'Nota general'))}</strong><time datetime="${escape(note.updated_at)}">${formatDate(note.updated_at)}</time></div><p>${escape(note.content)}</p><div class="teacher-note-actions"><button type="button" data-edit-note="${escape(note.id)}" data-focus-key="note-${escape(note.id)}">Editar</button><button class="teacher-delete" type="button" data-delete-note="${escape(note.id)}" ${state.pending.has('notes:' + note.id) ? 'disabled' : ''}>Eliminar</button>${catalog.has(note.lesson_slug) ? `<button type="button" data-open-lesson="${escape(note.lesson_slug)}">Ver lección</button>` : ''}</div></article>`).join('') || empty('Un cuaderno para tus ideas', 'Guarda tu primer apunte. Solo tu cuenta podrá consultarlo.'));
    $('teacherMoreNotes').hidden = state.notes.length >= state.notesTotal;
    $('teacherMoreNotes').disabled = state.loading;
    if (!$('teacherNoteFields').disabled) $('teacherSaveNote').disabled = !state.loaded.notes;
    renderFavorites();
    document.querySelectorAll('#lessonTeacherTools [data-progress]').forEach(select => {
      select.value = state.progress.get(select.dataset.progress)?.status || '';
      select.disabled = !state.loaded.progress || state.pending.has('progress:' + select.dataset.progress);
    });
  }
  function renderFavorites() {
    document.querySelectorAll('.favorite-auth-btn').forEach(button => {
      const id = button.dataset.lessonId, saved = state.favorites.has(id), busy = state.pending.has('favorites:' + id);
      button.classList.toggle('saved', saved); button.classList.toggle('saving', busy);
      button.disabled = busy || Boolean(state.user && !state.loaded.favorites);
      button.textContent = busy ? (saved ? '♥ Guardando…' : '♡ Quitando…') : saved ? '♥ Guardada' : '♡ Guardar';
      button.setAttribute('aria-pressed', String(saved)); button.setAttribute('aria-busy', String(busy));
      button.setAttribute('aria-label', (saved ? 'Quitar de favoritas: ' : 'Guardar como favorita: ') + (catalog.get(id)?.title || 'lección'));
    });
  }
  function installMainButtons() {
    document.querySelectorAll('#grid .card').forEach(card => {
      if (card.querySelector('.favorite-auth-btn')) return;
      const id = card.querySelector('.open')?.dataset.i;
      if (!catalog.has(id)) return;
      const button = document.createElement('button'); button.type = 'button';
      button.className = 'favorite-auth-btn'; button.dataset.lessonId = id;
      card.append(button);
    });
    renderFavorites();
  }
  panel.addEventListener('click', event => {
    const summary = event.target.closest('[data-summary]');
    if (summary) {
      const next = summary.dataset.summary;
      if (['planned','completed'].includes(next)) { filter = next; $('teacherProgressFilter').value = filter; switchTab('progress'); update(state); }
      else switchTab(next);
    }
    const button = event.target.closest('[role="tab"]'); if (button) switchTab(button.dataset.tab);
    const edit = event.target.closest('[data-edit-note]');
    if (edit && mayDiscard()) {
      const note = state.notes.find(n => n.id === edit.dataset.editNote); if (!note) return;
      draftId = note.id; draftVersion = note.updated_at; noteContent.value = note.content; noteLesson.value = note.lesson_slug || '';
      dirty = false; $('teacherNoteTitle').textContent = 'Editar nota'; $('teacherNoteFeedback').textContent = '';
      $('teacherNoteLength').textContent = `${note.content.length} / 5.000`; noteContent.focus();
    }
  });
  panel.querySelector('[role="tablist"]').addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    const tabs = [...panel.querySelectorAll('[role="tab"]')], current = tabs.indexOf(document.activeElement);
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
    event.preventDefault(); switchTab(tabs[index].dataset.tab); tabs[index].focus();
  });
  document.addEventListener('click', async event => {
    const favorite = event.target.closest('.favorite-auth-btn');
    if (favorite) {
      if (!state.user) return openAccount('Inicia sesión para guardar tus lecciones favoritas.');
      try { await store.toggleFavorite(favorite.dataset.lessonId); }
      catch (error) { tell('No se pudo confirmar el cambio: ' + errorMessage(error), true); }
      return;
    }
    const tool = event.target.closest('[data-open-lesson], [data-new-note], [data-delete-note], [data-library]');
    if (!tool || (!panel.contains(tool) && !tool.closest('#lessonTeacherTools'))) return;
    if (tool.hasAttribute('data-open-lesson')) { panel.close(); window.Semillitas.openLesson(tool.dataset.openLesson); }
    if (tool.hasAttribute('data-new-note')) newNote(tool.dataset.newNote);
    if (tool.hasAttribute('data-library')) {
      panel.close();
      const library = document.getElementById('lecciones');
      if (library) library.scrollIntoView({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 'auto' : 'smooth' });
      else location.href = '/lecciones/';
    }
    if (tool.hasAttribute('data-delete-note')) {
      if (!window.confirm('¿Eliminar esta nota? Esta acción no se puede deshacer.')) return;
      try { await store.deleteNote(tool.dataset.deleteNote); if (draftId === tool.dataset.deleteNote) resetDraft(); tell('Nota eliminada.'); }
      catch (error) { tell('No se pudo eliminar la nota: ' + errorMessage(error), true); }
    }
  });
  document.addEventListener('change', async event => {
    const select = event.target.closest('[data-progress]');
    if (!select || (!panel.contains(select) && !select.closest('#lessonTeacherTools'))) return;
    if (!state.user) return openAccount('Inicia sesión para registrar tu progreso.');
    try { await store.setProgress(select.dataset.progress, select.value); tell('Progreso guardado.'); }
    catch (error) { tell('No se pudo confirmar el progreso: ' + errorMessage(error), true); }
  });
  $('teacherProgressFilter').addEventListener('change', event => { filter = event.target.value; update(state); });
  $('teacherClose').addEventListener('click', () => panel.close());
  $('teacherRefresh').addEventListener('click', () => { store.refresh(); agenda.refresh(); });
  $('teacherProfile').addEventListener('click', () => { panel.close(); openAccount(); });
  $('teacherMoreNotes').addEventListener('click', () => store.loadMoreNotes());
  $('teacherNewNote').addEventListener('click', () => { if (mayDiscard()) resetDraft(); });
  [noteContent, noteLesson].forEach(el => el.addEventListener('input', () => {
    dirty = true; $('teacherNoteFeedback').textContent = 'Cambios sin guardar';
    $('teacherNoteLength').textContent = `${noteContent.value.length} / 5.000`;
  }));
  $('teacherNoteForm').addEventListener('submit', async event => {
    event.preventDefault();
    if (!noteContent.value.trim()) { noteContent.focus(); return; }
    draftId ||= crypto.randomUUID();
    const userId = state.user?.id;
    const saveGeneration = ++noteSaveGeneration;
    $('teacherNoteFields').disabled = true; $('teacherSaveNote').textContent = 'Guardando…';
    $('teacherNoteFeedback').textContent = 'Guardando en tu cuenta…';
    try {
      const note = await store.saveNote({ id: draftId, updated_at: draftVersion, content: noteContent.value, lesson_slug: noteLesson.value || null });
      if (state.user?.id !== userId || saveGeneration !== noteSaveGeneration) return;
      draftVersion = note.updated_at; dirty = false; noteContent.value = note.content;
      $('teacherNoteTitle').textContent = 'Editar nota'; $('teacherNoteFeedback').textContent = '✓ Nota guardada en tu cuenta.';
    } catch (error) {
      if (state.user?.id === userId && saveGeneration === noteSaveGeneration) $('teacherNoteFeedback').textContent = 'Tu texto sigue aquí. ' + errorMessage(error);
    } finally {
      if (state.user?.id === userId && saveGeneration === noteSaveGeneration) {
        $('teacherNoteFields').disabled = false; $('teacherSaveNote').disabled = !state.loaded.notes; $('teacherSaveNote').textContent = 'Guardar nota';
      }
    }
  });
  window.addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } });
  document.addEventListener('semillitas:lesson-open', event => {
    const id = event.detail.id; if (!catalog.has(id)) return;
    const container = document.createElement('div'); container.id = 'lessonTeacherTools'; container.className = 'teacher-lesson-tools';
    container.innerHTML = `<h3>Para mi clase</h3><p>Guarda tu avance y tus apuntes de esta lección.</p><div>${stateControl(id)}<button class="favorite-auth-btn" data-lesson-id="${escape(id)}" type="button">Guardar</button><button data-new-note="${escape(id)}" type="button">Escribir nota privada</button></div><p id="lessonTeacherMessage" class="teacher-message" role="status" aria-live="polite" hidden></p>`;
    document.getElementById('body').append(container); renderFavorites();
  });
  installMainButtons();
  const grid = document.getElementById('grid'); if (grid) new MutationObserver(installMainButtons).observe(grid, { childList: true });
  store.subscribe(update);
  return { open, mayDiscard, tell, setName(name) { profileName = name; update(store.snapshot()); }, isOpen: () => panel.open };
}
