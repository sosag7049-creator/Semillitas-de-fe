const CACHE='semillitas-v70-sion-ia';
// Refresh the account presentation for installed/mobile visitors.
// Retratos dibujados del sitio (antes eran cuadros de un único sprite WebP).
const ACCOUNT_ASSETS=['/account-ui.css?v=4','/images/avatars/semilla.svg','/images/avatars/adan.svg','/images/avatars/noe.svg','/images/avatars/maestro.svg','/images/avatars/david.svg','/images/avatars/leon.svg','/images/avatars/maestra.svg','/images/avatars/biblia.svg','/images/avatars/paloma.svg','/images/avatars/juan.svg','/images/avatars/rut.svg','/images/avatars/jonas.svg'];
const CORE=['/board-game.js?v=3','/board-game.css?v=2','/agenda.js?v=2','/agenda-model.js','/agenda-store.js','/agenda.css?v=1','/','/index.html','/lecciones/','/juegos/','/juegos/index.html','/juegos.js?v=9','/juegos.css?v=8','/juegos-3d.js?v=1','/juegos-3d.css?v=1','/home-cinematic.css?v=8','/media/hero-amanecer.svg','/lessons-page.css?v=6','/lessons-page.js?v=9','/offline.html','/404.html','/manifest.webmanifest','/auth.css','/auth-fixes.css?v=2','/teacher-store.js','/teacher-panel.js?v=2','/teacher-panel.css','/printables-home.js?v=4','/printables-home.css','/printables.html','/printables-page.js?v=4','/printables-page.css?v=3','/printables-data.js','/lesson-data.js?v=17','/lesson-page.js?v=17','/lesson-page.css?v=10','/images/lessons/la-creacion.svg','/images/lessons/noe-y-el-arca.svg','/images/lessons/david-y-goliat.svg','/icons/icon-192.png','/icons/icon-512.png','/icons/apple-touch-icon.png'];
CORE.push('/sion-widget.js?v=6','/sion-widget.css?v=2','/images/compartir.jpg');
CORE.push('/accessibility.css?v=2','/pwa-register.js?v=1');
// Tipografías propias: sin estos dos archivos el modo sin conexión pierde la
// letra del sitio (antes venían de Google y no había forma de guardarlas).
CORE.push('/fonts.css?v=1','/fonts/baloo-2-latin.woff2','/fonts/nunito-latin.woff2');
// Cliente de Supabase empaquetado en el sitio: antes venía de esm.sh y no se
// podía guardar para el modo sin conexión.
CORE.push('/vendor/supabase-js.min.js?v=2.57.4');
CORE.push('/privacidad.html','/terminos.html','/contacto.html','/pagina.css?v=1');
CORE.push('/preschool-data.json','/additional-lessons.js?v=2','/additional-lessons-2.js?v=1','/additional-lessons-3.js?v=1','/additional-lessons-4.js?v=1','/sion-ui.css?v=3','/icons/sion-bible.webp?v=3','/auth.js?v=16','/sion-ai.js?v=3');
CORE.push('/series/','/series/index.html','/series-page.css?v=1','/series-page.js?v=5','/series-data.js?v=3');
// Portada corta: accesos rápidos, lecciones destacadas, planes y botón único.
CORE.push('/home.css?v=2','/home.js?v=3','/home-destacadas.js?v=3','/home-dock.css?v=1','/home-dock.js?v=3');
// Lo que salió de la portada (método, programa, recursos, videos y canales).
CORE.push('/maestros/','/maestros/index.html','/maestros.css?v=1');
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll([...CORE,...ACCOUNT_ASSETS])).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('message',event=>{
  const message=event.data;
  if(message?.type!=='CACHE_CURRENT_PAGE'||typeof message.url!=='string')return;
  let url;
  try{url=new URL(message.url,location.origin)}catch{return}
  if(url.origin!==location.origin||url.search)return;
  url.hash='';
  const request=new Request(url.href,{method:'GET',credentials:'same-origin'});
  event.waitUntil(fetch(request).then(response=>{
    if(!response.ok||new URL(response.url).origin!==location.origin)return;
    return caches.open(CACHE).then(cache=>cache.put(request,response));
  }).catch(()=>{}));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin)return; // Never cache Supabase account data.
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{
      // OAuth callback URLs must not be stored in an offline navigation cache.
      if(response.ok&&!url.search){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)))}
      return response;
    }).catch(async()=>
      // Sin internet: primero la página exacta que el maestro pidió (si ya la
      // visitó, por ejemplo una lección), y solo después la portada o el aviso.
      await caches.match(event.request,{ignoreSearch:true})
      ||await caches.match('/index.html')
      ||await caches.match('/offline.html')
    ));
    return;
  }
  if(CORE.includes(url.pathname+url.search)||/^\/images\/lessons\/[a-z0-9-]+\.(?:webp|svg)$/.test(url.pathname)||/^\/media\/portada-(?:trigo|galilea)\.jpg$/.test(url.pathname)||/^\/vendor\/three[.\w-]*\.js$/.test(url.pathname))event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)))}return response}).catch(()=>caches.match(event.request)));
});
