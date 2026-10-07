(() => {
  'use strict';

  const hero = document.querySelector('.hero-cinematic');
  const sceneRoot = document.getElementById('heroScenes');
  const canvas = document.getElementById('heroAmbient');

  // Sin canvas no se inicia ninguna animación: el póster sigue siendo el fondo.
  if (!hero || !sceneRoot || !canvas || typeof window.CanvasRenderingContext2D === 'undefined') return;
  if (typeof window.requestAnimationFrame !== 'function') return;

  let context;
  try {
    context = canvas.getContext('2d', { alpha: true });
  } catch {
    return;
  }
  if (!context) return;

  const POSTER = '/media/hero-poster.webp';
  const SCENES = [
    '/media/portada-amanecer.jpg',
    '/media/portada-trigo.jpg',
    '/media/portada-galilea.jpg',
  ];
  const SCENE_INTERVAL = 8500;
  const motionPreference = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };
  const smallScreen = window.matchMedia
    ? window.matchMedia('(max-width: 600px)')
    : { matches: window.innerWidth <= 600 };
  const finePointer = window.matchMedia
    ? window.matchMedia('(hover: hover) and (pointer: fine)')
    : { matches: false };
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const imageCache = new Map();

  let posterLayer = sceneRoot.querySelector('.hero-scene.is-active') || sceneRoot.querySelector('.hero-scene');
  let transitionLayer = null;
  let activeLayer = posterLayer;
  let nextKenBurns = 'b';
  let nextSceneIndex = 0;
  let sceneStarted = false;
  let sceneLoading = false;
  let sceneRequestToken = 0;
  let sceneTimer = null;
  let sceneDeadline = 0;
  let sceneRemaining = SCENE_INTERVAL;
  let frameHandle = 0;
  let lastFrame = 0;
  let animationClock = 0;
  let initialized = false;
  let idlePending = false;
  let idleHandle = null;
  let idleKind = '';
  let heroVisible = !('IntersectionObserver' in window);
  let resizeObserver = null;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let seeds = [];
  let targetParallaxX = 0;
  let targetParallaxY = 0;
  let parallaxX = 0;
  let parallaxY = 0;

  function usePosterOnly() {
    const type = String(connection && connection.effectiveType || '').toLowerCase();
    const slowConnection = /^(?:slow-)?2g$/.test(type) || type === '3g';
    return Boolean(motionPreference.matches || (connection && connection.saveData) || slowConnection);
  }

  function isAnimationActive() {
    return initialized && !usePosterOnly() && heroVisible && !document.hidden;
  }

  function createPosterLayer() {
    const layer = document.createElement('div');
    layer.className = 'hero-scene is-active';
    layer.style.backgroundImage = `url('${POSTER}')`;
    sceneRoot.appendChild(layer);
    return layer;
  }

  function restorePoster() {
    const layers = Array.from(sceneRoot.querySelectorAll('.hero-scene'));
    if (!posterLayer || !posterLayer.parentNode) posterLayer = layers[0] || createPosterLayer();
    layers.forEach(layer => {
      if (layer !== posterLayer) layer.remove();
    });
    if (!posterLayer.parentNode) sceneRoot.appendChild(posterLayer);
    posterLayer.className = 'hero-scene is-active';
    posterLayer.style.backgroundImage = `url('${POSTER}')`;
    posterLayer.style.animationPlayState = '';
    activeLayer = posterLayer;
    transitionLayer = null;
    sceneRoot.style.transform = '';
  }

  function prepareSceneLayers() {
    restorePoster();
    posterLayer.className = 'hero-scene is-active kenburns-a';
    transitionLayer = document.createElement('div');
    transitionLayer.className = 'hero-scene';
    sceneRoot.appendChild(transitionLayer);
    activeLayer = posterLayer;
    nextKenBurns = 'b';
  }

  function cancelDeferredStart() {
    if (!idlePending) return;
    if (idleKind === 'idle' && typeof window.cancelIdleCallback === 'function') {
      window.cancelIdleCallback(idleHandle);
    } else if (idleKind === 'timeout') {
      window.clearTimeout(idleHandle);
    }
    idlePending = false;
    idleHandle = null;
    idleKind = '';
  }

  function pauseFrameLoop() {
    if (frameHandle) window.cancelAnimationFrame(frameHandle);
    frameHandle = 0;
    lastFrame = 0;
    if (activeLayer) activeLayer.style.animationPlayState = 'paused';
    targetParallaxX = 0;
    targetParallaxY = 0;
  }

  function pauseSceneTimer() {
    if (sceneTimer === null) return;
    sceneRemaining = Math.max(0, sceneDeadline - Date.now());
    window.clearTimeout(sceneTimer);
    sceneTimer = null;
  }

  function resetCanvas() {
    if (width && height) context.clearRect(0, 0, width, height);
    seeds = [];
    width = 0;
    height = 0;
    dpr = 1;
  }

  function returnToPoster() {
    cancelDeferredStart();
    pauseFrameLoop();
    pauseSceneTimer();
    sceneRequestToken++;
    sceneLoading = false;
    sceneStarted = false;
    sceneRemaining = SCENE_INTERVAL;
    initialized = false;
    nextSceneIndex = 0;
    nextKenBurns = 'b';
    animationClock = 0;
    parallaxX = 0;
    parallaxY = 0;
    restorePoster();
    resetCanvas();
  }

  function createSeed(startBelow = false) {
    return {
      x: Math.random() * width,
      y: startBelow ? height + Math.random() * height * 0.25 : Math.random() * height,
      r: 0.8 + Math.random() * 1.5,
      vel: 0.009 + Math.random() * 0.022,
      vaiven: 3 + Math.random() * 14,
      fase: Math.random() * Math.PI * 2,
      brillo: 0.24 + Math.random() * 0.64,
    };
  }

  function resizeCanvas() {
    const bounds = hero.getBoundingClientRect();
    const nextWidth = Math.max(1, bounds.width);
    const nextHeight = Math.max(1, bounds.height);
    const nextDpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const count = smallScreen.matches ? 26 : 60;
    const changed = Math.abs(nextWidth - width) > 0.5
      || Math.abs(nextHeight - height) > 0.5
      || nextDpr !== dpr
      || seeds.length !== count;

    if (!changed) return;

    width = nextWidth;
    height = nextHeight;
    dpr = nextDpr;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    seeds = Array.from({ length: count }, () => createSeed());
  }

  function loadScene(url) {
    if (imageCache.has(url)) return imageCache.get(url);
    const request = new Promise(resolve => {
      const image = new window.Image();
      let settled = false;
      const finish = loaded => {
        if (settled) return;
        settled = true;
        resolve(loaded);
      };
      image.onload = () => finish(true);
      image.onerror = () => finish(false);
      image.decoding = 'async';
      image.src = url;
      if (image.complete && image.naturalWidth > 0) finish(true);
    });
    imageCache.set(url, request);
    return request;
  }

  function activateScene(url) {
    if (!transitionLayer || !isAnimationActive()) return false;
    const incoming = activeLayer === posterLayer ? transitionLayer : posterLayer;
    incoming.style.backgroundImage = `url('${url}')`;
    incoming.style.animationPlayState = '';
    incoming.className = `hero-scene kenburns-${nextKenBurns}`;
    // Fuerza el estado transparente antes de iniciar el fundido.
    void incoming.offsetWidth;
    incoming.classList.add('is-active');
    if (activeLayer) activeLayer.classList.remove('is-active');
    activeLayer = incoming;
    nextKenBurns = nextKenBurns === 'a' ? 'b' : 'a';
    return true;
  }

  function scheduleScene(delay) {
    if (!isAnimationActive() || sceneLoading) return;
    if (sceneTimer !== null) window.clearTimeout(sceneTimer);
    sceneRemaining = Math.max(0, delay);
    sceneDeadline = Date.now() + sceneRemaining;
    sceneTimer = window.setTimeout(() => {
      sceneTimer = null;
      advanceScene();
    }, sceneRemaining);
  }

  async function advanceScene() {
    if (!isAnimationActive() || sceneLoading) return;
    sceneLoading = true;
    const token = ++sceneRequestToken;
    const index = nextSceneIndex;
    const loaded = await loadScene(SCENES[index]);
    if (token !== sceneRequestToken) return;

    sceneLoading = false;
    if (!isAnimationActive()) {
      sceneRemaining = SCENE_INTERVAL;
      return;
    }

    if (loaded) activateScene(SCENES[index]);
    nextSceneIndex = (index + 1) % SCENES.length;
    sceneRemaining = SCENE_INTERVAL;
    scheduleScene(SCENE_INTERVAL);
  }

  function resumeSceneCycle() {
    if (!isAnimationActive() || sceneTimer !== null || sceneLoading) return;
    if (!sceneStarted) {
      sceneStarted = true;
      advanceScene();
    } else {
      scheduleScene(sceneRemaining);
    }
  }

  function paintSunRays(clock) {
    const sunX = width * 0.74;
    const sunY = height * 0.1;
    const length = Math.hypot(width, height) * 1.22;
    const directions = [0.48, 0.86, 1.25, 1.66];
    const slowTurn = Math.sin(clock * 0.00009) * 0.035 + clock * 0.000003;

    context.save();
    context.globalCompositeOperation = 'screen';
    for (let i = 0; i < 4; i++) {
      const angle = directions[i] + slowTurn + Math.sin(clock * 0.00013 + i * 1.7) * 0.025;
      const spread = 0.055 + 0.025 * (0.5 + 0.5 * Math.sin(clock * 0.00011 + i));
      const fromX = sunX + Math.cos(angle - spread) * length;
      const fromY = sunY + Math.sin(angle - spread) * length;
      const toX = sunX + Math.cos(angle + spread) * length;
      const toY = sunY + Math.sin(angle + spread) * length;
      const tipX = sunX + Math.cos(angle) * length;
      const tipY = sunY + Math.sin(angle) * length;
      const glow = context.createLinearGradient(sunX, sunY, tipX, tipY);
      glow.addColorStop(0, 'rgba(255,222,130,0.15)');
      glow.addColorStop(0.42, 'rgba(255,222,130,0.075)');
      glow.addColorStop(1, 'rgba(255,222,130,0)');
      context.fillStyle = glow;
      context.beginPath();
      context.moveTo(sunX, sunY);
      context.lineTo(fromX, fromY);
      context.lineTo(toX, toY);
      context.closePath();
      context.fill();
    }
    context.restore();
  }

  function paintMist(clock) {
    const radius = Math.max(130, width * 0.3);
    const travel = width + radius * 2;

    context.save();
    context.globalCompositeOperation = 'screen';
    for (let i = 0; i < 2; i++) {
      const x = ((clock * 0.012 + i * travel * 0.58) % travel) - radius;
      const y = height * (0.66 + 0.07 * Math.sin(clock * 0.00012 + i * 2.2));
      context.save();
      context.translate(x, y);
      context.scale(1, 0.34);
      const fog = context.createRadialGradient(0, 0, 0, 0, 0, radius);
      fog.addColorStop(0, 'rgba(255,255,255,0.075)');
      fog.addColorStop(0.48, 'rgba(255,248,225,0.035)');
      fog.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = fog;
      context.beginPath();
      context.arc(0, 0, radius, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
    context.restore();
  }

  function paintSeeds(delta, clock) {
    context.save();
    context.globalCompositeOperation = 'lighter';
    for (const seed of seeds) {
      seed.y -= seed.vel * delta;
      if (seed.y < -seed.r * 5) {
        seed.y = height + seed.r * 2 + Math.random() * 24;
        seed.x = Math.random() * width;
        seed.fase = Math.random() * Math.PI * 2;
      }

      const x = seed.x + Math.sin(clock * 0.00042 + seed.fase) * seed.vaiven;
      const pulse = 0.56 + 0.44 * Math.sin(clock * 0.0022 + seed.fase);
      const alpha = seed.brillo * (0.46 + pulse * 0.5);
      const glowRadius = seed.r * 3.5;
      const light = context.createRadialGradient(x, seed.y, 0, x, seed.y, glowRadius);
      light.addColorStop(0, `rgba(255,246,205,${alpha})`);
      light.addColorStop(0.35, `rgba(255,222,130,${alpha * 0.58})`);
      light.addColorStop(1, 'rgba(255,222,130,0)');
      context.fillStyle = light;
      context.fillRect(x - glowRadius, seed.y - glowRadius, glowRadius * 2, glowRadius * 2);
      context.fillStyle = `rgba(255,247,218,${Math.min(0.9, alpha + 0.12)})`;
      context.beginPath();
      context.ellipse(x, seed.y, seed.r * 0.9, seed.r * 0.52, Math.sin(seed.fase) * 0.4, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  }

  function updateParallax(delta) {
    if (!finePointer.matches) return;
    const easing = Math.min(1, delta * 0.004);
    parallaxX += (targetParallaxX - parallaxX) * easing;
    parallaxY += (targetParallaxY - parallaxY) * easing;
    sceneRoot.style.transform = `translate3d(${parallaxX.toFixed(2)}px,${parallaxY.toFixed(2)}px,0)`;
  }

  function drawFrame(now) {
    frameHandle = 0;
    if (!isAnimationActive()) return;
    if (!width || !height) resizeCanvas();

    const delta = lastFrame ? Math.min(48, Math.max(0, now - lastFrame)) : 16;
    lastFrame = now;
    animationClock += delta;
    context.clearRect(0, 0, width, height);
    paintSunRays(animationClock);
    paintMist(animationClock);
    paintSeeds(delta, animationClock);
    updateParallax(delta);
    frameHandle = window.requestAnimationFrame(drawFrame);
  }

  function startFrameLoop() {
    if (!frameHandle && isAnimationActive()) frameHandle = window.requestAnimationFrame(drawFrame);
  }

  function scheduleDeferredStart() {
    if (idlePending || initialized || usePosterOnly() || !heroVisible || document.hidden) return;
    idlePending = true;
    const start = () => {
      idlePending = false;
      idleHandle = null;
      idleKind = '';
      initialize();
    };
    if (typeof window.requestIdleCallback === 'function') {
      idleKind = 'idle';
      idleHandle = window.requestIdleCallback(start, { timeout: 2200 });
    } else {
      idleKind = 'timeout';
      idleHandle = window.setTimeout(start, 1200);
    }
  }

  function initialize() {
    if (initialized || usePosterOnly() || !heroVisible || document.hidden) return;
    prepareSceneLayers();
    resizeCanvas();
    initialized = true;
    sceneStarted = false;
    sceneRemaining = SCENE_INTERVAL;
    syncActivity();
  }

  function syncActivity() {
    if (usePosterOnly()) {
      if (initialized || transitionLayer) returnToPoster();
      else cancelDeferredStart();
      return;
    }

    if (!heroVisible || document.hidden) {
      if (initialized) {
        pauseFrameLoop();
        pauseSceneTimer();
      } else {
        cancelDeferredStart();
      }
      return;
    }

    if (!initialized) {
      scheduleDeferredStart();
      return;
    }

    if (activeLayer) activeLayer.style.animationPlayState = '';
    resizeCanvas();
    startFrameLoop();
    resumeSceneCycle();
  }

  function onPointerMove(event) {
    if (!finePointer.matches || (event.pointerType && event.pointerType !== 'mouse')) return;
    const bounds = hero.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    targetParallaxX = -x * 12;
    targetParallaxY = -y * 8;
  }

  hero.addEventListener('pointermove', onPointerMove, { passive: true });
  hero.addEventListener('pointerleave', () => {
    targetParallaxX = 0;
    targetParallaxY = 0;
  }, { passive: true });
  document.addEventListener('visibilitychange', syncActivity);

  if (typeof window.IntersectionObserver === 'function') {
    const observer = new window.IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
      }
      syncActivity();
    }, { threshold: 0.01 });
    observer.observe(hero);
  }

  if (typeof window.ResizeObserver === 'function') {
    resizeObserver = new window.ResizeObserver(() => {
      if (initialized) resizeCanvas();
    });
    resizeObserver.observe(hero);
  } else {
    window.addEventListener('resize', () => {
      if (initialized) resizeCanvas();
    }, { passive: true });
  }

  function listenForChange(query) {
    if (query && typeof query.addEventListener === 'function') query.addEventListener('change', syncActivity);
    else if (query && typeof query.addListener === 'function') query.addListener(syncActivity);
  }
  listenForChange(motionPreference);
  listenForChange(smallScreen);
  listenForChange(finePointer);
  if (connection && typeof connection.addEventListener === 'function') {
    connection.addEventListener('change', syncActivity);
  }

  syncActivity();
})();
