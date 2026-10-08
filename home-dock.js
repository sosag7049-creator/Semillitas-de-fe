/**
 * home-dock.js — Un solo botón flotante en la portada
 * ---------------------------------------------------------------------------
 * En el celular coincidían cuatro elementos flotantes: Sion, Mi cuenta,
 * Instalar la aplicación y los avisos de la agenda. Competían entre ellos y
 * quitaban espacio de lectura.
 *
 * Aquí se crea un único botón («Mi espacio») que abre una bandeja pequeña con
 * esas acciones. No se reimplementa nada: los botones originales siguen en la
 * página con todos sus eventos, solo que ocultos, y la bandeja los pulsa.
 * Si alguno no llega a existir (por ejemplo, la cuenta cuando no hay internet),
 * su fila simplemente no se muestra.
 */

(() => {
  const existente = document.querySelector('.dock');
  if (existente) return;

  document.body.classList.add('has-dock');

  const dock = document.createElement('div');
  dock.className = 'dock';
  dock.innerHTML = `
    <div class="dock-tray" id="dockTray" role="group" aria-label="Acciones rápidas" hidden>
      <span class="dock-tray-title">Tu espacio</span>
      <button class="dock-item dock-item-sion" type="button" data-dock="sion">
        <span class="dock-icon" aria-hidden="true"><img src="/icons/sion-bible.webp?v=3" alt="" width="26" height="26"></span>
        <span><b>Hablar con Sion</b><small>Te ayuda a elegir y preparar la clase</small></span>
      </button>
      <button class="dock-item dock-item-cuenta" type="button" data-dock="cuenta" hidden>
        <span class="dock-icon" aria-hidden="true">👤</span>
        <span><b class="dock-cuenta-label">Mi cuenta</b><small>Favoritas, progreso y notas</small></span>
      </button>
      <button class="dock-item dock-item-agenda" type="button" data-open-agenda>
        <span class="dock-icon" aria-hidden="true">📅</span>
        <span><b>Mi agenda</b><small>Cumpleaños, clases y recordatorios</small></span>
      </button>
      <button class="dock-item dock-item-instalar" type="button" data-dock="instalar" hidden>
        <span class="dock-icon" aria-hidden="true">📲</span>
        <span><b>Instalar la aplicación</b><small>Para abrirla sin internet</small></span>
      </button>
    </div>
    <button class="dock-toggle" id="dockToggle" type="button" aria-expanded="false" aria-controls="dockTray"
            aria-label="Abrir acciones rápidas: Sion, mi cuenta, mi agenda e instalar la aplicación">
      <span class="dock-mark" aria-hidden="true">🌱</span>
      <span class="dock-label">Mi espacio</span>
      <span class="dock-caret" aria-hidden="true">▾</span>
    </button>`;
  document.body.append(dock);

  const toggle = dock.querySelector('#dockToggle');
  const tray = dock.querySelector('#dockTray');
  const pulsar = (selector) => document.querySelector(selector)?.click();

  function abrir(si) {
    tray.hidden = !si;
    toggle.setAttribute('aria-expanded', String(si));
    dock.querySelector('.dock-caret').textContent = si ? '▴' : '▾';
    if (si) tray.querySelector('.dock-item:not([hidden])')?.focus();
  }

  toggle.addEventListener('click', () => abrir(tray.hidden));
  document.addEventListener('click', (evento) => { if (!dock.contains(evento.target) && !tray.hidden) abrir(false); });
  document.addEventListener('keydown', (evento) => {
    if (evento.key !== 'Escape' || tray.hidden) return;
    abrir(false);
    toggle.focus();
  });

  tray.addEventListener('click', (evento) => {
    const item = evento.target.closest('.dock-item');
    if (!item) return;
    abrir(false);
    if (item.dataset.dock === 'sion') pulsar('#jerubiLaunch');
    if (item.dataset.dock === 'cuenta') pulsar('#accountLaunch');
    // «Mi agenda» lleva data-open-agenda: lo atiende auth.js en todo el documento.
  });

  // Cualquier tarjeta de la página puede abrir a Sion con data-open-sion.
  document.addEventListener('click', (evento) => {
    if (!evento.target.closest('[data-open-sion]')) return;
    evento.preventDefault();
    pulsar('#jerubiLaunch');
  });

  /* --- Mi cuenta ---------------------------------------------------------
   * auth.js crea #accountLaunch cuando termina de cargar y le cambia el texto
   * según haya sesión («Mi cuenta» / «Mi panel»). Copiamos ese texto en la
   * bandeja para que ambas cosas digan siempre lo mismo.
   */
  const fila = dock.querySelector('.dock-item-cuenta');
  const etiqueta = fila.querySelector('.dock-cuenta-label');
  let vigilandoCuenta = null;

  function enlazarCuenta() {
    const boton = document.getElementById('accountLaunch');
    if (!boton) return false;
    const sincronizar = () => {
      const texto = boton.textContent.trim();
      if (texto && etiqueta.textContent !== texto) etiqueta.textContent = texto;
      if (fila.hidden) fila.hidden = false;
    };
    sincronizar();
    vigilandoCuenta?.disconnect();
    vigilandoCuenta = new MutationObserver(sincronizar);
    vigilandoCuenta.observe(boton, { childList: true, subtree: true, characterData: true });
    return true;
  }

  if (!enlazarCuenta()) {
    const espera = new MutationObserver(() => { if (enlazarCuenta()) espera.disconnect(); });
    espera.observe(document.body, { childList: true });
    setTimeout(() => espera.disconnect(), 20000);
  }

  /* --- Aviso de la agenda ------------------------------------------------
   * Cuando hay un recordatorio sin leer aparece la barra `.agenda-banner`.
   * Se marca el botón con un punto para que se note aunque la bandeja esté
   * cerrada.
   */
  const punto = document.createElement('span');
  punto.className = 'dock-dot';
  punto.hidden = true;
  punto.setAttribute('aria-hidden', 'true');
  toggle.append(punto);
  const vigilarAvisos = new MutationObserver(() => {
    const banner = document.querySelector('.agenda-banner');
    const oculto = !banner || banner.hidden;
    /* Escribir `hidden` con el mismo valor vuelve a encolar un registro de
     * mutación y el observador se llamaría a sí mismo sin parar (la página se
     * congelaría). Sólo se escribe cuando el estado cambia de verdad. */
    if (punto.hidden !== oculto) punto.hidden = oculto;
  });
  vigilarAvisos.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });

  /* --- Instalar la aplicación -------------------------------------------
   * Chrome y Edge avisan con `beforeinstallprompt`; iOS no tiene nada
   * equivalente, así que allí se explican los dos pasos a mano.
   */
  const instalar = dock.querySelector('.dock-item-instalar');
  const yaInstalada = window.matchMedia?.('(display-mode: standalone)')?.matches === true || navigator.standalone === true;
  let aviso = null;

  window.addEventListener('beforeinstallprompt', (evento) => {
    evento.preventDefault();
    aviso = evento;
    if (!yaInstalada) instalar.hidden = false;
  });
  window.addEventListener('appinstalled', () => { instalar.hidden = true; aviso = null; });

  const esIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (esIOS && !yaInstalada) instalar.hidden = false;

  instalar.addEventListener('click', async () => {
    if (aviso) {
      aviso.prompt();
      const { outcome } = await aviso.userChoice.catch(() => ({ outcome: 'dismissed' }));
      if (outcome === 'accepted') instalar.hidden = true;
      aviso = null;
      return;
    }
    let dialogo = document.getElementById('installDialog');
    if (!dialogo) {
      dialogo = document.createElement('dialog');
      dialogo.id = 'installDialog';
      dialogo.className = 'install-dialog';
      dialogo.innerHTML = `
        <div class="install-card">
          <div class="app-mark" aria-hidden="true">🌱</div>
          <h2>Instalar Semillitas</h2>
          <p>Queda como una aplicación más en tu teléfono y las clases que ya abriste funcionan sin internet.</p>
          <div class="install-steps">
            <div class="install-step">1 · Pulsa <b>Compartir</b> en la barra del navegador.</div>
            <div class="install-step">2 · Elige <b>Añadir a pantalla de inicio</b>.</div>
            <div class="install-step">3 · Confirma con <b>Añadir</b>.</div>
          </div>
          <button class="install-close" type="button">Entendido</button>
        </div>`;
      document.body.append(dialogo);
      dialogo.querySelector('.install-close').addEventListener('click', () => dialogo.close());
      dialogo.addEventListener('click', (evento) => { if (evento.target === dialogo) dialogo.close(); });
    }
    dialogo.showModal();
  });
})();
