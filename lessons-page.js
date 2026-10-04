import { LESSONS } from '/lesson-data.js?v=10';

const safe=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const grid=document.getElementById('grid');
const search=document.getElementById('lessonSearch');
const resultLine=document.getElementById('resultLine');
let category='Todos';

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

function render(){
  const term=search.value.trim().toLocaleLowerCase('es');
  const filtered=LESSONS.filter(lesson=>(category==='Todos'||lesson.category===category)&&[lesson.title,lesson.reference,lesson.objective,lesson.category].join(' ').toLocaleLowerCase('es').includes(term));
  resultLine.textContent=`${filtered.length} ${filtered.length===1?'clase encontrada':'clases encontradas'}`;
  grid.innerHTML=filtered.map(lesson=>{const status=localStatus(lesson);return `<article class="lesson-card"><img class="lesson-cover" src="${safe(lesson.coverImage)}" alt="Ilustración infantil de ${safe(lesson.title)}" width="1200" height="800" loading="lazy" decoding="async"><div class="lesson-body"><div class="lesson-top"><span class="lesson-number">LECCIÓN ${String(Number(lesson.id)+1).padStart(2,'0')}</span><span class="lesson-category">${safe(lesson.category)}</span></div><h2>${safe(lesson.title)}</h2><p>${safe(lesson.objective)}</p><span class="lesson-reference">📖 ${safe(lesson.reference)}</span><span class="lesson-status ${status[1]}">${status[0]}</span><div class="lesson-actions"><a class="open" data-i="${safe(lesson.id)}" href="/lecciones/${safe(lesson.slug)}/">Abrir clase completa</a><a class="print-link" href="/printables.html?leccion=${safe(lesson.id)}">🖨️ Material imprimible</a></div></div></article>`}).join('')||'<div class="empty"><h2>No encontramos esa lección</h2><p>Prueba con otro personaje, pasaje o tema.</p></div>';
  document.dispatchEvent(new CustomEvent('semillitas:catalog-rendered'));
}

search.addEventListener('input',render);
document.querySelector('.filters').addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(!button)return;category=button.dataset.category;document.querySelectorAll('[data-category]').forEach(item=>item.classList.toggle('active',item===button));render()});
render();
await import('/auth.js?v=10');
