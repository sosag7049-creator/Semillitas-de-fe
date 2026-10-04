const heroVideo=document.querySelector('.hero-background');
if(heroVideo&&matchMedia('(prefers-reduced-motion: reduce)').matches)heroVideo.pause();
document.addEventListener('visibilitychange',()=>{if(!heroVideo)return;if(document.hidden)heroVideo.pause();else if(!matchMedia('(prefers-reduced-motion: reduce)').matches)heroVideo.play().catch(()=>{})});

// El video pesa 1.7 MB en movil y 3.1 MB en escritorio. En Centroamerica eso
// es dinero del maestro, asi que solo se descarga si la conexion lo permite.
// Si no, se queda el poster (162 KB), que ya se ve bien.
(()=>{
  if(!heroVideo)return;
  const net=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  const tipo=net&&net.effectiveType||'';
  const ahorroDatos=!!(net&&net.saveData);
  const lenta=/(^|-)(slow-)?2g$/.test(tipo)||tipo==='3g';
  const reduceMovimiento=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(ahorroDatos||lenta||reduceMovimiento)return; // se queda solo el poster
  const cargar=()=>{
    let cambio=false;
    // Cargar UNA sola fuente: la que coincide con el ancho real del aparato.
    // Antes se asignaban las dos y el celular bajaba 4,8 MB en vez de 1,7 MB.
    var fuentes = Array.prototype.slice.call(heroVideo.querySelectorAll('source[data-src]'));
    var elegida = null;
    for (var k = 0; k < fuentes.length; k++) {
      var m = fuentes[k].getAttribute('media');
      if (!m || window.matchMedia(m).matches) { elegida = fuentes[k]; break; }
    }
    if (!elegida) return;
    fuentes.forEach(function (f) { if (f !== elegida) f.parentNode.removeChild(f); });
    elegida.src = elegida.dataset.src;
    elegida.removeAttribute('data-src');
    heroVideo.preload = 'auto';
    heroVideo.load();
    heroVideo.play().catch(()=>{});
  };
  'requestIdleCallback' in window ? requestIdleCallback(cargar,{timeout:2500}) : setTimeout(cargar,1200);
})();
