/**
 * home.js — Las partes vivas de la portada
 * ---------------------------------------------------------------------------
 * La portada es ahora una página de entrada corta. Este archivo arma las tres
 * zonas que dependen de datos reales:
 *
 *   1. «Continúa donde quedaste»  → solo aparece si el maestro ya empezó algo.
 *   2. «Lecciones destacadas»     → tarjetas con duración, edad, pasaje y
 *                                    materiales (ver `home-destacadas.js`).
 *   3. «Planes de enseñanza»      → tres planes, con el avance ya guardado.
 *
 * El avance NO se guarda aparte: se lee el mismo `semillitas-class-<id>` que
 * escribe cada lección, igual que hace /series/. Así nunca hay dos verdades
 * distintas sobre lo mismo, y funciona aunque el maestro no tenga cuenta.
 */

import { LESSONS } from '/lesson-data.js?v=11';
import { SERIES, SERIE_RECOMENDADA } from '/series-data.js?v=1';
import {
  DESTACADAS, MATERIALES, MATERIALES_POR_DEFECTO, ROTACION_SEMANAL, semanaActual,
} from '/home-destacadas.js?v=1';

const safe = (valor) => String(valor ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Versión de 800 px de una portada, para que el celular no baje la de escritorio. */
const pequena = (url) => (typeof url === 'string' && url.endsWith('.webp') ? `${url.slice(0, -5)}-800.webp` : url);

const porSlug = new Map(LESSONS.map((leccion) => [leccion.slug, leccion]));
const porId = new Map(LESSONS.map((leccion) => [String(leccion.id), leccion]));

const PARTES = ['story', 'bible', 'video', 'activity', 'quiz'];

/* --------------------------------------------------------------------------
 * Avance guardado en este dispositivo
 * ----------------------------------------------------------------------- */

function avance(leccion) {
  try {
    const guardado = JSON.parse(localStorage.getItem(`semillitas-class-${leccion.id}`) || '{}');
    const hechas = PARTES.filter((parte) => guardado.parts?.[parte]).length;
    return { hechas, total: PARTES.length, completada: Boolean(guardado.completed), cuando: Number(guardado.updatedAt) || 0 };
  } catch {
    return { hechas: 0, total: PARTES.length, completada: false, cuando: 0 };
  }
}

/** La clase que el maestro tocó por última vez, si quedó algo por hacer. */
function ultimaClase() {
  let candidata = null;
  try {
    const marca = JSON.parse(localStorage.getItem('semillitas-ultima-clase') || 'null');
    const leccion = marca && porId.get(String(marca.id));
    if (leccion) candidata = { leccion, cuando: Number(marca.at) || 0 };
  } catch { /* el navegador puede bloquear localStorage: seguimos sin tarjeta */ }

  // Respaldo: si no hay marca (o es de una lección borrada), se busca la clase
  // empezada más reciente entre las que sí tienen avance guardado.
  if (!candidata) {
    for (const leccion of LESSONS) {
      const estado = avance(leccion);
      if (!estado.hechas && !estado.completada) continue;
      if (!candidata || estado.cuando > candidata.cuando) candidata = { leccion, cuando: estado.cuando };
    }
  }
  return candidata?.leccion || null;
}

/* --------------------------------------------------------------------------
 * 1. «Continúa donde quedaste»
 * ----------------------------------------------------------------------- */

function siguienteDe(leccion) {
  const indice = LESSONS.indexOf(leccion);
  return LESSONS[indice + 1] || LESSONS[0];
}

function pintarContinuar() {
  const zona = document.getElementById('homeResume');
  if (!zona) return;
  const ultima = ultimaClase();
  if (!ultima) return; // visitante nuevo: la tarjeta simplemente no existe

  const estado = avance(ultima);
  const seguir = estado.completada ? siguienteDe(ultima) : ultima;
  const porcentaje = Math.round((estado.hechas / estado.total) * 100);

  zona.innerHTML = `
    <article class="resume-card">
      <img class="resume-cover" src="${safe(pequena(seguir.coverImage))}" alt="" width="800" height="533" loading="lazy" decoding="async">
      <div class="resume-body">
        <span class="resume-label">${estado.completada ? '✓ Terminaste «' + safe(ultima.title) + '»' : '⏱️ Continúa donde quedaste'}</span>
        <h3>${safe(seguir.title)}</h3>
        <p>${safe(seguir.objective)}.</p>
        ${estado.completada ? '' : `<div class="resume-bar" role="img" aria-label="${estado.hechas} de ${estado.total} partes completadas"><span style="width:${porcentaje}%"></span></div>
        <small class="resume-steps">${estado.hechas} de ${estado.total} partes completadas</small>`}
        <a class="resume-go" href="/lecciones/${safe(seguir.slug)}/">${estado.completada ? 'Empezar la siguiente clase' : 'Seguir con esta clase'} →</a>
      </div>
    </article>`;
  zona.hidden = false;
}

/* --------------------------------------------------------------------------
 * 2. Lecciones destacadas
 * ----------------------------------------------------------------------- */

function leccionDestacada(ficha) {
  if (ficha.rotatoria) {
    const disponibles = ROTACION_SEMANAL.map((slug) => porSlug.get(slug)).filter(Boolean);
    return disponibles.length ? disponibles[semanaActual() % disponibles.length] : null;
  }
  return porSlug.get(ficha.slug) || null;
}

function tarjetaDestacada(ficha, leccion) {
  const materiales = MATERIALES[leccion.slug] || MATERIALES_POR_DEFECTO;
  const estado = avance(leccion);
  return `
    <article class="feat-card feat-${safe(ficha.tono)}">
      <a class="feat-cover" href="/lecciones/${safe(leccion.slug)}/" tabindex="-1" aria-hidden="true">
        <img src="${safe(pequena(leccion.coverImage))}" alt="" width="800" height="533" loading="lazy" decoding="async">
        <span class="feat-badge">${safe(ficha.etiqueta)}</span>
      </a>
      <div class="feat-body">
        <h3><a href="/lecciones/${safe(leccion.slug)}/">${safe(leccion.title)}</a></h3>
        <p class="feat-why">${safe(ficha.motivo)}</p>
        <ul class="feat-facts">
          <li><span aria-hidden="true">⏱️</span> ${safe(leccion.duration)}</li>
          <li><span aria-hidden="true">👧🏽👦🏻</span> ${safe(leccion.age)}</li>
          <li><span aria-hidden="true">📖</span> ${safe(leccion.reference)}</li>
        </ul>
        <p class="feat-materials"><b>🧺 Materiales:</b> ${materiales.map(safe).join(' · ')}</p>
        ${estado.completada ? '<p class="feat-done">✓ Ya impartiste esta clase</p>' : ''}
        <div class="feat-actions">
          <a class="feat-open" href="/lecciones/${safe(leccion.slug)}/">Abrir la clase</a>
          <a class="feat-print" href="/printables.html?leccion=${safe(leccion.id)}">🖨️ Imprimibles</a>
        </div>
        ${ficha.enlace ? `<a class="feat-more" href="${safe(ficha.enlace.href)}">${safe(ficha.enlace.texto)} →</a>` : ''}
      </div>
    </article>`;
}

function pintarDestacadas() {
  const zona = document.getElementById('homeFeatured');
  if (!zona) return;
  const tarjetas = DESTACADAS
    .map((ficha) => ({ ficha, leccion: leccionDestacada(ficha) }))
    .filter((par) => par.leccion)
    .map((par) => tarjetaDestacada(par.ficha, par.leccion));
  if (tarjetas.length) zona.innerHTML = tarjetas.join('');
}

/* --------------------------------------------------------------------------
 * 3. Planes de enseñanza
 * ----------------------------------------------------------------------- */

function prepararPlan(serie) {
  const lecciones = serie.lessons.map((slug) => porSlug.get(slug)).filter(Boolean);
  const hechas = lecciones.filter((leccion) => avance(leccion).completada).length;
  const siguiente = lecciones.find((leccion) => !avance(leccion).completada) || null;
  return { ...serie, lecciones, hechas, siguiente, total: lecciones.length };
}

/** Primero el plan que ya empezó, después el recomendado, después el resto. */
function planesDestacados() {
  const planes = SERIES.map(prepararPlan).filter((plan) => plan.total > 0);
  const puntaje = (plan) => {
    if (plan.hechas > 0 && plan.hechas < plan.total) return 0;
    if (plan.id === SERIE_RECOMENDADA) return 1;
    return 2;
  };
  return planes
    .map((plan, orden) => ({ plan, orden }))
    .sort((a, b) => puntaje(a.plan) - puntaje(b.plan) || b.plan.hechas - a.plan.hechas || a.orden - b.orden)
    .slice(0, 3)
    .map((item) => item.plan);
}

function pintarPlanes() {
  const zona = document.getElementById('homePlans');
  if (!zona) return;
  const planes = planesDestacados();
  if (!planes.length) return;
  zona.innerHTML = planes.map((plan) => {
    const empezado = plan.hechas > 0;
    const porcentaje = Math.round((plan.hechas / plan.total) * 100);
    return `
      <article class="plan-card plan-${safe(plan.tone)}">
        <span class="plan-emoji" aria-hidden="true">${safe(plan.emoji)}</span>
        <h3><a href="/series/#${safe(plan.id)}">${safe(plan.title)}</a></h3>
        <p class="plan-tagline">${safe(plan.tagline)}</p>
        <p class="plan-meta">${plan.total} clases · ${safe(plan.audience)}</p>
        ${empezado ? `<div class="plan-bar" role="img" aria-label="${plan.hechas} de ${plan.total} clases impartidas"><span style="width:${porcentaje}%"></span></div>
        <small class="plan-steps">${plan.hechas} de ${plan.total} impartidas</small>` : ''}
        ${plan.siguiente
          ? `<a class="plan-next" href="/lecciones/${safe(plan.siguiente.slug)}/">${empezado ? 'Sigue' : 'Empieza'} con «${safe(plan.siguiente.title)}» →</a>`
          : '<p class="plan-next plan-finished">🏆 Plan completo</p>'}
      </article>`;
  }).join('');
}

/* ----------------------------------------------------------------------- */

pintarContinuar();
pintarDestacadas();
pintarPlanes();
