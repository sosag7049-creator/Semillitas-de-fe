/* ---------------------------------------------------------------------------
 * Fondo del hero de la portada
 * ------------------------------------------------------------------------ *
 * El hero es una ESCENA VECTORIAL: `media/hero-amanecer.svg`, dibujada con el
 * mismo kit que las 39 portadas de lección (tools/generar-hero.mjs). Su
 * movimiento —sol, nubes, niebla, trigo y semillas de luz— es CSS dentro del
 * propio SVG, así que lo anima el compositor del navegador y no cuesta CPU.
 *
 * Antes esto era otro motor: tres fotos de 1584 × 672 px que se ampliaban
 * hasta 3,2× en pantallas retina (de ahí el aspecto borroso) y un canvas que
 * redibujaba rayos, niebla y partículas en cada fotograma. Ese canvas se
 * retiró junto con las fotos: el SVG hace lo mismo mejor y gratis.
 *
 * Lo que queda aquí es solo el parallax del ratón: en pantallas con puntero
 * fino la escena se desplaza unos píxeles siguiendo el cursor. Es opcional y
 * se apaga con `prefers-reduced-motion`.
 * ------------------------------------------------------------------------ */
(() => {
  'use strict';

  const hero = document.getElementById('inicio');
  if (!hero || typeof window.matchMedia !== 'function') return;

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const sceneRoot = document.getElementById('heroScenes');
  if (!sceneRoot) return;

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  function useStillScene() {
    const type = String((connection && connection.effectiveType) || '').toLowerCase();
    return Boolean(motionPreference.matches
      || (connection && connection.saveData)
      || /^(?:slow-)?2g$/.test(type));
  }

  let targetX = 0;
  let targetY = 0;
  let x = 0;
  let y = 0;
  let frame = 0;

  function paint() {
    frame = 0;
    const easing = 0.08;
    x += (targetX - x) * easing;
    y += (targetY - y) * easing;
    sceneRoot.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`;
    if (Math.abs(targetX - x) > 0.1 || Math.abs(targetY - y) > 0.1) {
      frame = window.requestAnimationFrame(paint);
    }
  }

  hero.addEventListener('pointermove', event => {
    if (!finePointer.matches || useStillScene()) return;
    if (event.pointerType && event.pointerType !== 'mouse') return;
    const bounds = hero.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    targetX = -((event.clientX - bounds.left) / bounds.width - 0.5) * 14;
    targetY = -((event.clientY - bounds.top) / bounds.height - 0.5) * 9;
    if (!frame) frame = window.requestAnimationFrame(paint);
  }, { passive: true });

  const rest = () => {
    targetX = 0;
    targetY = 0;
    if (!frame) frame = window.requestAnimationFrame(paint);
  };
  hero.addEventListener('pointerleave', rest, { passive: true });

  const onChange = () => {
    if (useStillScene()) {
      sceneRoot.style.transform = '';
      targetX = 0;
      targetY = 0;
      x = 0;
      y = 0;
    }
  };
  if (typeof motionPreference.addEventListener === 'function') motionPreference.addEventListener('change', onChange);
  if (connection && typeof connection.addEventListener === 'function') connection.addEventListener('change', onChange);
})();
