import { LESSONS } from '/lesson-data.js?v=11';
import { SERIES } from '/series-data.js?v=1';
// Versión de 800 px de una portada, para que el celular no baje la de escritorio.
const small = url => (typeof url === 'string' && url.endsWith('.webp') ? url.slice(0, -5) + '-800.webp' : url);

const safe=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const grid=document.getElementById('grid');
const search=document.getElementById('lessonSearch');
const resultLine=document.getElementById('resultLine');
let category='Todos';

/* ---------------------------------------------------------------------------
 * Filtro por edad
 *
 * No esconde lecciones: las 31 sirven para todo el grupo y el sitio entero se
 * apoya en que los hermanos aprendan juntos. Lo que cambia es QUÉ se muestra
 * de cada clase: cómo participan los pequeños o cómo profundizan los mayores.
 *
 * Las «ideales para empezar» salen de la serie «Mis primeras historias», así
 * que esa lista vive en un solo lugar (series-data.js) y no se duplica aquí.
 * ------------------------------------------------------------------------ */
const EDAD_GUARDADA='semillitas-edad';
const IDEALES=new Set(SERIES.find(serie=>serie.id==='primeras-historias')?.lessons||[]);
let age='todas';
try{const previa=localStorage.getItem(EDAD_GUARDADA);if(['todas','3-5','6-10'].includes(previa))age=previa}catch{}

// Las consignas de dibujo de 3 a 5 años viven en un JSON aparte. Se carga solo
// cuando hace falta, para no retrasar la vista normal del catálogo.
let parvulos=null;
async function cargarParvulos(){
  if(parvulos)return parvulos;
  parvulos=await fetch('/preschool-data.json').then(r=>r.ok?r.json():[]).catch(()=>[]);
  return parvulos;
}

const gamesLink=document.createElement('a');
gamesLink.href='/juegos/'; gamesLink.className='home-link';
// El texto va en .home-label para que en movil colapse a icono como el resto de la barra.
gamesLink.innerHTML='<span aria-hidden="true">\u{1F3B2}</span> <span class="home-label">Juegos</span>';
gamesLink.setAttribute('aria-label','Juegos bíblicos');
document.querySelector('.nav-actions')?.insertBefore(gamesLink, document.querySelector('.home-link'));

window.Semillitas=Object.freeze({
  lessons:Object.freeze(LESSONS.map((lesson,index)=>Object.freeze({id:String(lesson.id),index,title:lesson.title,reference:lesson.reference,category:lesson.category,emoji:lesson.icon||'📖',objective:lesson.objective}))),
  openLesson:id=>{const lesson=LESSONS.find(item=>String(item.id)===String(id));if(lesson)location.href=`/lecciones/${lesson.slug}/`}
});

function localStatus(lesson){
  let saved={};
  try{saved=JSON.parse(localStorage.getItem(`semillitas-class-${lesson.id}`)||'{}')}catch{}
  const parts=Object.values(saved.parts||{}).filter(Boolean).length;
  if(saved.completed)return ['✅ Completada','complete'];
  if(parts)return ['📖 En progreso','progress'];
  return ['🌱 No comenzada',''];
}

/** Bloque con la adaptación a la edad elegida. Vacío en el modo «todas». */
function bloqueEdad(lesson){
  if(age==='3-5'){
    const dibujo=parvulos?.[lesson.number-1]?.[0]||lesson.draw_prompt||'';
    return `<div class="age-note age-small">
      <b>👶 Cómo participan</b>
      <span>${safe(lesson.simple||'Participan señalando y repitiendo.')}</span>
      ${dibujo?`<b>✏️ Para dibujar</b><span>${safe(dibujo)}</span>`:''}
    </div>`;
  }
  if(age==='6-10'){
    return `<div class="age-note age-big">
      <b>🧒 Para profundizar</b>
      <span>${safe(lesson.deep||'Explican la enseñanza con sus palabras.')}</span>
    </div>`;
  }
  return '';
}

/** En 3-5 el enlace lleva directo a la hoja de dibujo y trazos. */
function enlaceImprimible(lesson){
  const hoja=age==='3-5'?'&hoja=pequenos':'';
  const texto=age==='3-5'?'🖨️ Hoja para pequeños':'🖨️ Material imprimible';
  return `<a class="print-link" href="/printables.html?leccion=${safe(lesson.id)}${hoja}">${texto}</a>`;
}

function render(){
  const term=search.value.trim().toLocaleLowerCase('es');
  let filtered=LESSONS.filter(lesson=>(category==='Todos'||lesson.category===category)&&[lesson.title,lesson.reference,lesson.objective,lesson.category].join(' ').toLocaleLowerCase('es').includes(term));

  // En 3 a 5 años las más sencillas van primero, pero ninguna se oculta.
  if(age==='3-5'){
    filtered=[...filtered].sort((a,b)=>(IDEALES.has(b.slug)?1:0)-(IDEALES.has(a.slug)?1:0));
  }

  const cuantas=`${filtered.length} ${filtered.length===1?'clase encontrada':'clases encontradas'}`;
  const coletilla=age==='3-5'?' · mostrando la versión para 3 a 5 años'
    :age==='6-10'?' · mostrando la versión para 6 a 10 años':'';
  resultLine.textContent=cuantas+coletilla;

  grid.innerHTML=filtered.map(lesson=>{
    const status=localStatus(lesson);
    const ideal=age==='3-5'&&IDEALES.has(lesson.slug);
    return `<article class="lesson-card"><img class="lesson-cover" src="${safe(lesson.coverImage)}" srcset="${safe(small(lesson.coverImage))} 800w, ${safe(lesson.coverImage)} 1200w" sizes="(max-width:600px) 92vw, (max-width:900px) 46vw, 31vw" alt="Ilustración infantil de ${safe(lesson.title)}" width="1200" height="800" loading="lazy" decoding="async"><div class="lesson-body"><div class="lesson-top"><span class="lesson-number">LECCIÓN ${String(Number(lesson.id)+1).padStart(2,'0')}</span><span class="lesson-category">${safe(lesson.category)}</span></div><h2>${safe(lesson.title)}</h2>${ideal?'<span class="ideal-badge">⭐ Ideal para empezar</span>':''}<p>${safe(lesson.objective)}</p>${bloqueEdad(lesson)}<span class="lesson-reference">📖 ${safe(lesson.reference)}</span><span class="lesson-status ${status[1]}">${status[0]}</span><div class="lesson-actions"><a class="open" data-i="${safe(lesson.id)}" href="/lecciones/${safe(lesson.slug)}/">Abrir clase completa</a>${enlaceImprimible(lesson)}</div></div></article>`}).join('')||'<div class="empty"><h2>No encontramos esa lección</h2><p>Prueba con otro personaje, pasaje o tema.</p></div>';
  document.dispatchEvent(new CustomEvent('semillitas:catalog-rendered'));
}

search.addEventListener('input',render);
document.querySelector('.filters').addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(!button)return;category=button.dataset.category;document.querySelectorAll('[data-category]').forEach(item=>item.classList.toggle('active',item===button));render()});

/* Botones de edad */
const ages=document.querySelector('.age-filters');
ages?.addEventListener('click',async event=>{
  const button=event.target.closest('[data-age]');
  if(!button)return;
  age=button.dataset.age;
  try{localStorage.setItem(EDAD_GUARDADA,age)}catch{}
  ages.querySelectorAll('[data-age]').forEach(item=>{
    const activo=item===button;
    item.classList.toggle('active',activo);
    item.setAttribute('aria-pressed',String(activo));
  });
  /* --------------------------------------------------------------------------
 * Llegadas desde fuera: /lecciones/?categoria=Jesús o /lecciones/?buscar=perdón
 *
 * La portada y las tarjetas destacadas enlazan aquí con el filtro ya puesto,
 * para que el maestro no tenga que repetir la búsqueda al llegar.
 * ----------------------------------------------------------------------- */
{
  const parametros=new URLSearchParams(location.search);
  const pedida=(parametros.get('categoria')||'').trim();
  if(pedida){
    const chip=[...document.querySelectorAll('[data-category]')]
      .find(item=>item.dataset.category.toLocaleLowerCase('es')===pedida.toLocaleLowerCase('es'));
    if(chip){
      category=chip.dataset.category;
      document.querySelectorAll('[data-category]').forEach(item=>item.classList.toggle('active',item===chip));
    }
  }
  const texto=(parametros.get('buscar')||'').trim();
  if(texto)search.value=texto.slice(0,80);
}

if(age==='3-5')await cargarParvulos();
  render();
});
// Dejar marcada la edad recordada de la visita anterior.
ages?.querySelectorAll('[data-age]').forEach(item=>{
  const activo=item.dataset.age===age;
  item.classList.toggle('active',activo);
  item.setAttribute('aria-pressed',String(activo));
});

if(age==='3-5')await cargarParvulos();
render();
await import('/auth.js?v=13');
