/**
 * series-page.js — Planes de enseñanza
 * ---------------------------------------------------------------------------
 * Arma /series/ a partir de `series-data.js` y del catálogo de lecciones.
 *
 * El avance NO se guarda aparte: se calcula leyendo el mismo progreso que ya
 * registra cada lección (`semillitas-class-<id>`). Así, si el maestro marcó
 * una clase como terminada, el plan lo refleja solo y no hay dos verdades
 * distintas sobre lo mismo.
 */

import { LESSONS } from '/lesson-data.js?v=11';
import { SERIES, SERIE_RECOMENDADA } from '/series-data.js?v=1';

const safe = (value) =>
  String(value).replace(/[&<>"']/g, (char) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

const porSlug = new Map(LESSONS.map((lesson) => [lesson.slug, lesson]));

/** ¿El maestro marcó esta lección como completada? */
function completada(lesson) {
  try {
    const guardado = JSON.parse(
      localStorage.getItem(`semillitas-class-${lesson.id}`) || '{}',
    );
    return Boolean(guardado.completed);
  } catch {
    return false;
  }
}

/** Resuelve los slugs de una serie a lecciones reales y calcula su avance. */
function prepararSerie(serie) {
  const lessons = serie.lessons
    .map((slug) => porSlug.get(slug))
    .filter(Boolean);
  const hechas = lessons.filter(completada).length;
  const siguiente = lessons.find((lesson) => !completada(lesson)) || null;
  return { ...serie, lessons, hechas, siguiente, total: lessons.length };
}

const series = SERIES.map(prepararSerie).filter((serie) => serie.total > 0);

/* --------------------------------------------------------------------------
 * «¿Qué enseño este domingo?»
 *
 * Se propone la serie empezada que esté más avanzada pero sin terminar; si no
 * hay ninguna empezada, la serie recomendada. Es una heurística sencilla y
 * predecible: el maestro siempre entiende por qué se le sugiere eso.
 * ----------------------------------------------------------------------- */
function proximaClase() {
  const empezadas = series
    .filter((serie) => serie.hechas > 0 && serie.hechas < serie.total)
    .sort((a, b) => b.hechas - a.hechas);
  const serie =
    empezadas[0] ||
    series.find((item) => item.id === SERIE_RECOMENDADA) ||
    series[0];
  return serie && serie.siguiente ? { serie, lesson: serie.siguiente } : null;
}

/** Fecha del próximo domingo, en texto legible. */
function proximoDomingo() {
  const hoy = new Date();
  const faltan = (7 - hoy.getDay()) % 7; // 0 = hoy es domingo
  const fecha = new Date(hoy);
  fecha.setDate(hoy.getDate() + faltan);
  const texto = fecha.toLocaleDateString('es-GT', {
    day: 'numeric',
    month: 'long',
  });
  return faltan === 0 ? `hoy, ${texto}` : `el domingo ${texto}`;
}

function pintarProxima() {
  const caja = document.getElementById('next');
  const dato = proximaClase();
  if (!caja) return;

  if (!dato) {
    caja.innerHTML = `
      <div class="next-emoji">🎉</div>
      <div>
        <span class="label">¿Qué enseño este domingo?</span>
        <h2>Terminaste todos los planes</h2>
        <p class="meta">Puedes repetir una serie con un grupo nuevo o revisar el catálogo completo.</p>
      </div>
      <a class="next-go" href="/lecciones/">Ver las 31 clases</a>`;
    return;
  }

  const { serie, lesson } = dato;
  const semana = serie.lessons.indexOf(lesson) + 1;
  caja.innerHTML = `
    <div class="next-emoji">${safe(lesson.icon || '📖')}</div>
    <div>
      <span class="label">¿Qué enseño ${safe(proximoDomingo())}?</span>
      <h2>${safe(lesson.title)}</h2>
      <p class="meta">Semana ${semana} de ${serie.total} · <b>${safe(serie.title)}</b> · 📖 ${safe(lesson.reference)}</p>
    </div>
    <a class="next-go" href="/lecciones/${safe(lesson.slug)}/">Abrir la clase →</a>`;
}

function pintarSeries() {
  const grid = document.getElementById('seriesGrid');
  if (!grid) return;

  grid.innerHTML = series
    .map((serie) => {
      const pct = serie.total ? Math.round((serie.hechas / serie.total) * 100) : 0;
      const terminada = serie.hechas === serie.total;
      const destino = serie.siguiente || serie.lessons[0];

      const semanas = serie.lessons
        .map((lesson, i) => {
          const hecha = completada(lesson);
          return `<li class="week${hecha ? ' is-done' : ''}">
            <span class="week-no">${hecha ? '✓' : String(i + 1).padStart(2, '0')}</span>
            <span class="week-title">
              <a href="/lecciones/${safe(lesson.slug)}/">${safe(lesson.title)}</a>
              <span class="week-ref">📖 ${safe(lesson.reference)}</span>
            </span>
            <a class="week-print" href="/printables.html?leccion=${safe(lesson.id)}">🖨️ Imprimir</a>
          </li>`;
        })
        .join('');

      return `<article class="serie-card tono-${safe(serie.tone)}">
        <div class="serie-top">
          <span class="serie-emoji" aria-hidden="true">${safe(serie.emoji)}</span>
          <div>
            <h2>${safe(serie.title)}</h2>
            <p class="serie-tagline">${safe(serie.tagline)}</p>
          </div>
        </div>
        <div class="serie-body">
          <div class="serie-badges">
            <span class="badge weeks">${serie.total} semanas</span>
            <span class="badge">👶 ${safe(serie.audience)}</span>
            ${terminada ? '<span class="badge done">✅ Completada</span>' : ''}
          </div>
          <p>${safe(serie.description)}</p>
          <p class="serie-verse">${safe(serie.keyVerse)}</p>
          <div class="progress" role="img" aria-label="Avance: ${serie.hechas} de ${serie.total} clases">
            <i style="width:${pct}%"></i>
          </div>
          <p class="progress-text">${serie.hechas} de ${serie.total} clases completadas</p>
          <div class="serie-actions">
            <button class="serie-toggle" type="button"
                    aria-expanded="false" aria-controls="weeks-${safe(serie.id)}">
              Ver el plan
            </button>
            <a class="serie-start" href="/lecciones/${safe(destino.slug)}/">
              ${serie.hechas ? 'Continuar' : 'Empezar'} →
            </a>
          </div>
          <ol class="weeks" id="weeks-${safe(serie.id)}" hidden>${semanas}</ol>
        </div>
      </article>`;
    })
    .join('');
}

/* Un solo escuchador para toda la rejilla, en vez de uno por tarjeta. */
document.getElementById('seriesGrid')?.addEventListener('click', (event) => {
  const boton = event.target.closest('.serie-toggle');
  if (!boton) return;
  const lista = document.getElementById(boton.getAttribute('aria-controls'));
  if (!lista) return;
  const abierto = boton.getAttribute('aria-expanded') === 'true';
  boton.setAttribute('aria-expanded', String(!abierto));
  boton.textContent = abierto ? 'Ver el plan' : 'Ocultar el plan';
  lista.hidden = abierto;
});

pintarSeries();
pintarProxima();

const total = series.reduce((suma, serie) => suma + serie.total, 0);
const linea = document.getElementById('seriesIntro');
if (linea) {
  linea.textContent = `${series.length} planes · ${total} clases programadas · las mismas 31 lecciones, ordenadas de distintas formas`;
}

/* El panel del maestro y el asistente Sion leen el catálogo desde este global.
 * Hay que publicarlo ANTES de cargar auth.js: ese módulo lo lee al evaluarse y,
 * si no existe, la pantalla de «Mi cuenta» no llega a montarse en esta página. */
if (!window.Semillitas) {
  window.Semillitas = Object.freeze({
    lessons: Object.freeze(
      LESSONS.map((lesson, index) =>
        Object.freeze({
          id: String(lesson.id),
          index,
          title: lesson.title,
          reference: lesson.reference,
          category: lesson.category,
          emoji: lesson.icon || '📖',
          objective: lesson.objective,
        }),
      ),
    ),
    openLesson: (id) => {
      const lesson = LESSONS.find((item) => String(item.id) === String(id));
      if (lesson) location.href = `/lecciones/${lesson.slug}/`;
    },
  });
}

await import('/auth.js?v=12');
