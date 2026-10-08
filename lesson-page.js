import { LESSONS, lessonBySlug } from '/lesson-data.js?v=11';
// Versión de 800 px de una portada, para que el celular no baje la de escritorio.
const small = url => (typeof url === 'string' && url.endsWith('.webp') ? url.slice(0, -5) + '-800.webp' : url);

const root=document.getElementById('lessonApp');
const slug=document.body.dataset.lesson||location.pathname.split('/').filter(Boolean).at(-1);
const lesson=lessonBySlug(slug);
if(!lesson){root.innerHTML='<main class="wrap" style="padding:80px 0"><h1>Lección no encontrada</h1><p><a href="/lecciones/">Volver a todas las lecciones</a></p></main>';throw new Error('Unknown lesson');}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const index=LESSONS.indexOf(lesson),prev=LESSONS[index-1],next=LESSONS[index+1];
const heroArt=lesson.coverImage
 ? `<div class="hero-art illustrated"><img src="${lesson.coverImage}" srcset="${small(lesson.coverImage)} 800w, ${lesson.coverImage} 1200w" sizes="(max-width:800px) 94vw, 470px" alt="Ilustración infantil de ${esc(lesson.title)}" width="1200" height="800" fetchpriority="high" decoding="async"></div>`
 : `<div class="hero-art emoji-art" role="img" aria-label="Ilustración de ${esc(lesson.title)}">${lesson.icon}</div>`;
document.title=`${lesson.title} · Clase bíblica | Semillitas de Fe`;
// Cada /lecciones/<slug>/index.html ya trae su propia descripción, más rica y
// distinta para cada clase. Solo se rellena aquí si viniera vacía, para no
// sobrescribirla con un texto genérico e igual en las 31 lecciones.
const metaDescripcion=document.querySelector('meta[name="description"]');
if(metaDescripcion&&!metaDescripcion.getAttribute('content')?.trim())
  metaDescripcion.setAttribute('content',`${lesson.title} (${lesson.reference}): ${lesson.objective}. Clase bíblica para niños de 3 a 10 años.`);
document.querySelector('link[rel="canonical"]')?.setAttribute('href',`https://semillitasbiblicas.space/lecciones/${lesson.slug}/`);

root.innerHTML=`
<header class="site-head"><nav class="nav wrap"><a class="brand" href="/"><span>🌱</span>Semillitas de Fe</a><a class="back" href="/lecciones/">← Todas las lecciones</a></nav></header>
<div class="progress-shell"><div class="wrap progress-row"><span class="progress-label">Mi progreso</span>${['story','bible','video','quiz','activity'].map((s,i)=>`<button class="step-pill" data-jump="${s}">${['Historia','Biblia','Video','Quiz','Actividad'][i]}</button>`).join('')}<span class="step-pill" id="completePill">🏆 Clase</span><button class="classmode-toggle" id="classModeToggle" aria-pressed="false" title="Agranda el texto para proyectar al televisor">📺 Modo clase</button></div><div class="bar" role="progressbar" aria-label="Progreso de la clase" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span id="progressBar"></span></div></div>
<main>
<section class="class-hero"><div class="wrap hero-grid"><div><span class="eyebrow">LECCIÓN ${String(lesson.number).padStart(2,'0')} DE ${LESSONS.length}</span><h1>${esc(lesson.title)}</h1><p class="promise">${esc(lesson.objective)}.</p><div class="facts"><span>👧🏽👦🏻 ${lesson.age}</span><span>⏱️ ${lesson.duration}</span><span>📖 ${esc(lesson.reference)}</span></div><p class="bible-version">Referencia bíblica: ${esc(lesson.bibleVersion)}</p><button class="primary" id="startClass">Comenzar clase ↓</button></div>${heroArt}</div></section>
<section id="story"><div class="wrap"><div class="section-head"><span class="section-icon">📚</span><div><h2>Historia bíblica</h2><span>Relato adaptado para niños, basado en la RVR1960.</span></div></div><div class="story-grid">${lesson.story.map((part,i)=>`<article class="story-card"><b>${i+1}</b><h3>${esc(part[0])}</h3><p>${esc(part[1])}</p></article>`).join('')}</div><button class="secondary section-action" data-mark="story">✓ Terminé la historia</button></div></section>
<section class="bible-section" id="bible"><div class="wrap"><div class="section-head"><span class="section-icon">📖</span><div><h2>Lectura en la Biblia</h2><span>Base bíblica de la clase</span></div></div><div class="bible-card"><div><div class="bible-ref">${esc(lesson.reference)}</div><p>Busca este pasaje en una Biblia Reina-Valera 1960 (RVR1960). El maestro puede leer los versículos principales y narrar el resto con lenguaje apropiado para la edad.</p><button class="secondary section-action" data-mark="bible">✓ Lectura realizada</button></div><span class="bible-mark">📖</span></div></div></section>
<section class="video-section" id="video"><div class="wrap"><div class="section-head"><span class="section-icon">▶️</span><div><h2>Video de la historia</h2><span>Revisa el contenido antes de mostrarlo al grupo</span></div></div><div class="video-wrap"><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/${lesson.videoId}?rel=0" title="Video: ${esc(lesson.title)} para niños" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div><div class="video-actions"><p class="video-note">Recurso externo: puede usar otra traducción o añadir dramatizaciones. Un adulto debe revisarlo y compararlo con el pasaje en la RVR1960 antes de la clase.</p><a class="secondary" href="${lesson.videoUrl}" target="_blank" rel="noopener">▶ Abrir video directamente</a></div><button class="secondary section-action" data-mark="video">✓ Vimos el video</button></div></section>
<section class="learned"><div class="wrap"><div class="section-head"><span class="section-icon">🌱</span><div><h2>¿Qué aprendimos?</h2><span>Verdades para repetir juntos</span></div></div><div class="takeaways">${lesson.takeaways.map(x=>`<div class="takeaway">${esc(x)}</div>`).join('')}</div></div></section>
<section><div class="wrap"><div class="section-head"><span class="section-icon">💬</span><div><h2>Preguntas para conversar</h2><span>Permite señalar o responder con gestos a los pequeños</span></div></div><div class="questions">${lesson.questions.map(q=>`<article class="question-card"><p>${esc(q)}</p></article>`).join('')}</div><div class="age-split"><div class="age-card small"><b>👶 3 a 5 años</b><p>Pregunta de una en una. Vale responder señalando la ilustración, con un gesto o con una sola palabra.</p></div><div class="age-card big"><b>🧒 6 a 10 años</b><p>Pídeles el porqué de su respuesta y que busquen el pasaje en su propia Biblia RVR1960.</p></div></div></div></section>
<section class="quiz-section" id="quiz"><div class="wrap quiz"><div class="section-head"><span class="section-icon">🧠</span><div><h2>Mini Quiz</h2><span>Responde y descubre inmediatamente si acertaste</span></div></div><div id="quizRoot"></div></div></section>
<section class="activity-section" id="activity"><div class="wrap"><div class="section-head"><span class="section-icon">🎲</span><div><h2>Actividad: ${esc(lesson.activity.title)}</h2><span>Actividad didáctica basada en la historia; no es texto bíblico</span></div></div><div class="activity-board"><p>Toca cada parte cuando el grupo la complete.</p><div class="activity-list">${lesson.activity.steps.map((s,i)=>`<button class="activity-step" type="button" data-activity="${i}" aria-pressed="false">${esc(s)}</button>`).join('')}</div><div class="activity-progress" id="activityProgress" role="status" aria-live="polite"></div><div class="age-split"><div class="age-card small"><b>👶 3 a 5 años</b><p>Asígnales el paso más sencillo y algo que hacer con las manos. Celebra el intento, no el resultado.</p></div><div class="age-card big"><b>🧒 6 a 10 años</b><p>Deja que dirijan un paso y expliquen al grupo qué aprendieron de la historia.</p></div></div></div></div></section>
<section class="print-section"><div class="wrap"><div class="section-head"><span class="section-icon">🖨️</span><div><h2>Material imprimible</h2><span>Recursos preparados para esta lección</span></div></div><div class="print-grid"><a class="print-link" href="/printables.html?leccion=${lesson.id}&hoja=pequenos"><span>🖍️</span><strong>Dibujo y trazos · 3 a 5 años</strong><small>Marco para dibujar, colorear libremente y repasar caminos</small></a><a class="print-link" href="${lesson.printable}" target="_blank" rel="noopener"><span>🎨</span><strong>Paquete completo</strong><small>Guía, actividad, tarjetas, preguntas y hoja familiar</small></a><a class="print-link" href="/printables.html"><span>📚</span><strong>Biblioteca imprimible</strong><small>Las 31 lecciones con sus seis hojas</small></a><button class="print-link" id="printPage"><span>🖨️</span><strong>Imprimir esta clase</strong><small>Historia, preguntas y versículo</small></button></div></div></section>
<section><div class="wrap"><div class="section-head"><span class="section-icon">💛</span><div><h2>Versículo para memorizar</h2><span>Repite una frase cada vez y agrega movimientos</span></div></div><div class="memory-card"><small>${esc(lesson.memory.reference)} · RVR1960${lesson.memory.excerpt?" · Fragmento":""}</small><blockquote>“${esc(lesson.memory.text)}${/[.!?]$/.test(lesson.memory.text)?"":"."}”</blockquote><a class="verse-source" href="${lesson.memory.sourceUrl}" target="_blank" rel="noopener noreferrer">Leer el versículo completo en RVR1960 ↗</a><div class="memory-actions"><button id="memoryMode">🧠 Memorizar</button><button id="copyVerse">📋 Copiar</button><button id="printVerse">🖨️ Imprimir</button></div></div></div></section>
<section><div class="wrap"><div class="section-head"><span class="section-icon">🙏</span><div><h2>Momento de oración</h2><span>Oración sugerida, no una cita bíblica. Pueden usar sus propias palabras.</span></div></div><div class="prayer">${esc(lesson.prayer)}</div></div></section>
<section class="finish"><div class="wrap finish-card"><h2>¿Terminaste las partes principales?</h2><p>Cuando Historia, Biblia, Video, Actividad y Quiz estén completos, celebra el aprendizaje.</p><button class="primary finish-button" id="finishClass" disabled>🏆 ¡Terminé mi clase!</button><p class="sync-note" id="syncNote"></p><div class="celebration" id="celebration"><b>🏆 ¡Clase completada!</b><p>🌱 Ganaste 10 Semillitas.</p></div></div></section>
<nav class="lesson-nav wrap">${prev?`<a href="/lecciones/${prev.slug}/">← ${esc(prev.title)}</a>`:'<span></span>'}<span>Lección ${lesson.number} de ${LESSONS.length}</span>${next?`<a href="/lecciones/${next.slug}/">${esc(next.title)} →</a>`:'<a href="/lecciones/">Todas las lecciones →</a>'}</nav>
</main><footer class="site-footer"><div class="wrap footer-row"><strong>🌱 Semillitas de Fe</strong><span>Referencia bíblica: Reina-Valera 1960 (RVR1960). Relatos, ilustraciones y actividades son adaptaciones educativas.</span><small class="credit">Creado por Gerardo Sosa</small><nav class="legal-links"><a href="/privacidad.html">Privacidad</a><a href="/terminos.html">Términos</a><a href="/contacto.html">Contacto</a></nav></div></footer>`;

const key=`semillitas-class-${lesson.id}`,steps=['story','bible','video','activity','quiz'];
let state={};try{const saved=JSON.parse(localStorage.getItem(key)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))state=saved}catch{}if(!state.parts||typeof state.parts!=='object'||Array.isArray(state.parts))state.parts={};if(!Array.isArray(state.activity))state.activity=[];
// `updatedAt` y `semillitas-ultima-clase` son lo que permite a la portada
// ofrecer «Continúa donde quedaste» sin necesidad de tener cuenta.
const save=()=>{
  state.updatedAt=Date.now();
  try{
    localStorage.setItem(key,JSON.stringify(state));
    localStorage.setItem('semillitas-ultima-clase',JSON.stringify({id:lesson.id,slug:lesson.slug,at:state.updatedAt}));
  }catch{/* el navegador puede bloquear el almacenamiento: la clase sigue funcionando */}
};
try{localStorage.setItem('semillitas-ultima-clase',JSON.stringify({id:lesson.id,slug:lesson.slug,at:Date.now()}))}catch{}
function renderProgress(){
  const done=steps.filter(s=>state.parts[s]).length;
  const percentage=Math.round(done/steps.length*100);
  document.querySelectorAll('[data-jump]').forEach(b=>b.classList.toggle('done',!!state.parts[b.dataset.jump]));
  const bar=document.getElementById('progressBar');
  bar.style.width=`${percentage}%`;
  bar.parentElement?.setAttribute('aria-valuenow',String(percentage));
  document.getElementById('finishClass').disabled=done<steps.length;
  document.querySelectorAll('[data-mark]').forEach(b=>{const yes=!!state.parts[b.dataset.mark];b.textContent=yes?'✓ Completado':'✓ '+({story:'Terminé la historia',bible:'Lectura realizada',video:'Vimos el video'}[b.dataset.mark]);b.classList.toggle('done',yes)});
  if(state.completed){document.getElementById('completePill').classList.add('done');document.getElementById('celebration').classList.add('show')}
}
function mark(part){state.parts[part]=true;save();renderProgress()}
// Modo clase: agranda el texto para proyectar y recuerda la preferencia.
{
  const cmButton=document.getElementById('classModeToggle');
  const setClassMode=on=>{
    document.body.classList.toggle('class-mode',on);
    cmButton.setAttribute('aria-pressed',String(on));
    cmButton.textContent=on?'📺 Salir del modo clase':'📺 Modo clase';
    try{localStorage.setItem('semillitas-class-mode',on?'1':'0')}catch{}
  };
  cmButton.onclick=()=>setClassMode(!document.body.classList.contains('class-mode'));
  let saved='0';try{saved=localStorage.getItem('semillitas-class-mode')||'0'}catch{}
  if(saved==='1')setClassMode(true);
}
const scrollBehavior=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches?'auto':'smooth';
document.getElementById('startClass').onclick=()=>document.getElementById('story').scrollIntoView({behavior:scrollBehavior()});
document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.jump).scrollIntoView({behavior:scrollBehavior()}));
document.querySelectorAll('[data-mark]').forEach(b=>b.onclick=()=>mark(b.dataset.mark));
const activityButtons=[...document.querySelectorAll('[data-activity]')];
const renderActivityProgress=()=>{
  const completed=activityButtons.filter(button=>button.classList.contains('done')).length;
  document.getElementById('activityProgress').textContent=`${completed} de ${activityButtons.length} partes completadas`;
};
activityButtons.forEach((button,index)=>{
  const selected=state.activity.includes(index);
  button.classList.toggle('done',selected);
  button.setAttribute('aria-pressed',String(selected));
  button.onclick=()=>{
    const done=!button.classList.contains('done');
    button.classList.toggle('done',done);
    button.setAttribute('aria-pressed',String(done));
    state.activity=activityButtons.flatMap((item,itemIndex)=>item.classList.contains('done')?[itemIndex]:[]);
    state.parts.activity=activityButtons.length>0&&state.activity.length===activityButtons.length;
    save();
    renderActivityProgress();
    renderProgress();
  };
});
renderActivityProgress();
let qi=0,score=0,answered=false;const quizRoot=document.getElementById('quizRoot');
function renderQuiz(){if(qi>=lesson.quiz.length){quizRoot.innerHTML=`<div class="quiz-result"><strong>🎉 ${score} de ${lesson.quiz.length}</strong><p>${score===lesson.quiz.length?'¡Excelente! Recordaste toda la historia.':'¡Muy bien! Repasen juntos las respuestas.'}</p></div>`;mark('quiz');return}const q=lesson.quiz[qi];quizRoot.innerHTML=`<div class="quiz-card"><div class="quiz-meta">Pregunta ${qi+1} de ${lesson.quiz.length}</div><h3>${esc(q.question)}</h3><div class="quiz-options">${q.options.map((o,i)=>`<button class="quiz-option" data-answer="${i}">${esc(o)}</button>`).join('')}</div><p class="quiz-feedback" aria-live="polite"></p><button class="secondary" id="nextQuestion" hidden>Siguiente pregunta →</button></div>`;answered=false;quizRoot.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>answer(Number(b.dataset.answer)));}
function answer(choice){if(answered)return;answered=true;const q=lesson.quiz[qi],buttons=[...quizRoot.querySelectorAll('[data-answer]')];buttons[q.answer].classList.add('correct');if(choice===q.answer){score++;quizRoot.querySelector('.quiz-feedback').textContent='✅ ¡Correcto!'}else{buttons[choice].classList.add('wrong');quizRoot.querySelector('.quiz-feedback').textContent='💛 Buen intento. Mira la respuesta correcta.'}const nextButton=document.getElementById('nextQuestion');nextButton.hidden=false;nextButton.onclick=()=>{qi++;renderQuiz()}}
renderQuiz();
document.getElementById('printPage').onclick=()=>window.print();document.getElementById('printVerse').onclick=()=>window.print();
async function copyText(text){
  try{if(window.navigator.clipboard?.writeText){await window.navigator.clipboard.writeText(text);return true}}catch{/* intenta el método compatible con navegadores antiguos */}
  const field=document.createElement('textarea');
  field.value=text;field.setAttribute('readonly','');field.style.position='fixed';field.style.opacity='0';
  document.body.appendChild(field);field.select();
  let copied=false;try{copied=document.execCommand?.('copy')===true}catch{}
  field.remove();return copied;
}
document.getElementById('copyVerse').onclick=async e=>{
  const text=`${lesson.memory.text}${/[.!?]$/.test(lesson.memory.text)?'':'.'} — ${lesson.memory.reference} · RVR1960${lesson.memory.excerpt?' (fragmento)':''}`;
  e.currentTarget.textContent=await copyText(text)?'✓ Copiado':'No se pudo copiar';
};
document.getElementById('memoryMode').onclick=e=>{const card=e.currentTarget.closest('.memory-card'),quote=card.querySelector('blockquote');quote.dataset.full ||= quote.textContent;quote.textContent=quote.textContent.includes('_____')?quote.dataset.full:quote.dataset.full.split(' ').map((w,i)=>i%3===2?'_____':w).join(' ');e.currentTarget.textContent=quote.textContent.includes('_____')?'👀 Mostrar':'🧠 Memorizar'};

let supabase=null,user=null;const syncNote=document.getElementById('syncNote');syncNote.textContent='El avance se guarda en este dispositivo. Inicia sesión desde la página principal para sincronizar la clase completada.';
import('https://esm.sh/@supabase/supabase-js@2.57.4').then(async({createClient})=>{supabase=createClient('https://wadfxtlbznxmbutkihkr.supabase.co','sb_publishable_5WPEB0l9NkOyynXkuSEsEQ_dVN9JO2R',{auth:{persistSession:true,autoRefreshToken:true}});const {data}=await supabase.auth.getSession();user=data.session?.user||null;if(user)syncNote.textContent='Tu avance final se guardará en tu cuenta.'}).catch(()=>{});
document.getElementById('finishClass').onclick=async()=>{state.completed=true;state.seeds=10;save();renderProgress();const note=document.getElementById('syncNote');if(!user||!supabase)return;note.textContent='Guardando en tu cuenta…';const now=new Date().toISOString();const {error}=await supabase.from('lesson_progress').upsert({user_id:user.id,lesson_slug:lesson.id,status:'completed',completed_at:now,updated_at:now},{onConflict:'user_id,lesson_slug'});note.textContent=error?'La celebración quedó guardada aquí, pero no se pudo sincronizar. Intenta de nuevo más tarde.':'✓ Clase completada y guardada en tu cuenta.'};
renderProgress();
