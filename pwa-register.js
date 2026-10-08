// Registra el modo sin conexión desde cualquier página, incluso si alguien
// llega directamente a una lección desde un buscador o un enlace compartido.
(() => {
  if (!('serviceWorker' in navigator)) return;

  async function registrar() {
    try {
      const registro = await navigator.serviceWorker.register('/sw.js');
      const activo = await navigator.serviceWorker.ready;
      const pagina = new URL(location.href);

      // No guardar parámetros de OAuth, búsquedas ni datos de sesión.
      if (pagina.search || pagina.pathname === '/offline.html') return;
      pagina.hash = '';

      let yaGuardada = false;
      try {
        yaGuardada = Boolean(await caches.match(pagina.href));
      } catch {
        // Si Cache Storage está bloqueado, el sitio sigue funcionando online.
      }

      if (!yaGuardada) {
        (navigator.serviceWorker.controller || activo.active || registro.active)
          ?.postMessage({ type: 'CACHE_CURRENT_PAGE', url: pagina.href });
      }
    } catch {
      // Un fallo de instalación no debe impedir usar el sitio conectado.
    }
  }

  if (document.readyState === 'complete') {
    registrar();
  } else {
    window.addEventListener('load', registrar, { once: true });
  }
})();
