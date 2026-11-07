import { LESSONS } from '/lesson-data.js?v=17';
const $=id=>document.getElementById(id),safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tabs=[...document.querySelectorAll('.game-tab')],panels={roulette:$('game-roulette'),memory:$('game-memory'),who:$('game-who'),board:$('game-board'),pastor:$('game-pastor')};
// El juego 3D pesa más que los otros cuatro juntos, así que su código se pide
// solo cuando alguien abre la pestaña. Quien vino a la ruleta no lo descarga.
let pastor=null,pastorCargando=false;
function abrirPastor(){
  if(pastor){pastor.reanudar();return}
  if(pastorCargando)return;
  pastorCargando=true;
  import('/juegos-3d.js?v=1').then(({iniciarPastor})=>{pastor=iniciarPastor($('pastorStage'))}).catch(()=>{
    const aviso=$('pastorPoster')?.querySelector('.pastor-poster-nota');
    if(aviso)aviso.textContent='No pudimos cargar el juego 3D. Revisa tu conexión y vuelve a intentarlo; los otros juegos siguen disponibles.';
  }).finally(()=>{pastorCargando=false});
}
tabs.forEach(tab=>tab.addEventListener('click',()=>{
  const activo=tab.dataset.game;
  tabs.forEach(x=>{const on=x===tab;x.classList.toggle('active',on);x.setAttribute('aria-selected',String(on))});
  Object.entries(panels).forEach(([key,p])=>{if(p)p.hidden=key!==activo});
  if(activo==='pastor')abrirPastor();
  else pastor?.pausar();
}));
// Ruleta: questions are generated from the selected lesson, so the teacher can reuse it every week.
const theme=$('gameTheme'),questions=$('rouletteQuestion'),answer=$('rouletteAnswer'),meta=$('rouletteMeta'),wheel=$('bigWheel'),count=$('rouletteCount'),reveal=$('revealAnswer');
LESSONS.forEach((l,i)=>{const option=document.createElement('option');option.value=i;option.textContent=`${String(i+1).padStart(2,'0')} · ${l.title}`;theme.append(option)});
let used=[],rotation=0,spinning=false;const current=()=>LESSONS[Number(theme.value)||0];
function pool(l){const qs=(l.questions||[]);return [{q:`¿Cómo se llama la historia de hoy?`,a:l.title},{q:`¿En qué pasaje encontramos esta historia?`,a:l.reference},{q:`¿Qué enseñanza principal recordamos?`,a:l.objective},...qs.map(q=>({q,a:`Lean juntos ${l.reference} y conversen sobre la respuesta.`})),{q:'¿Cómo podemos vivir esta enseñanza esta semana?',a:l.application||l.objective},{q:'Reto: representa una parte de la historia con un gesto.',a:'¡Todos pueden participar!'}].slice(0,12)}
function resetRoulette(){used=[];answer.textContent='';answer.classList.add('hidden-answer');reveal.disabled=true;reveal.textContent='Mostrar respuesta';questions.textContent='El maestro elige el tema y pulsa “Girar pregunta”.';meta.textContent='Listos para empezar';count.textContent='0 preguntas';$('spinGame').disabled=false}
theme.addEventListener('change',resetRoulette);$('resetGame').addEventListener('click',resetRoulette);$('spinGame').addEventListener('click',()=>{if(spinning)return;const all=pool(current()),available=all.map((_,i)=>i).filter(i=>!used.includes(i));if(!available.length){questions.textContent='¡Completaron todas las preguntas! Pulsa Reiniciar para comenzar otra vez.';$('spinGame').disabled=true;return}spinning=true;$('spinGame').disabled=true;reveal.disabled=true;answer.classList.add('hidden-answer');rotation+=1080+Math.floor(Math.random()*360);wheel.style.transform=`rotate(${rotation}deg)`;questions.textContent='La ruleta está girando…';setTimeout(()=>{const i=available[Math.floor(Math.random()*available.length)],item=all[i];used.push(i);questions.textContent=item.q;answer.textContent=item.a;meta.textContent=`${current().title} · pregunta ${used.length} de ${all.length}`;count.textContent=`${used.length} preguntas`;reveal.disabled=false;$('spinGame').disabled=false;spinning=false},1100)});reveal.addEventListener('click',()=>{answer.classList.toggle('hidden-answer');reveal.textContent=answer.classList.contains('hidden-answer')?'Mostrar respuesta':'Ocultar respuesta'});
// Memoria: diez figuras bíblicas; el maestro elige 6, 8 o 10 parejas según el grupo.
// Cada figura es [tipo, clave, nombre]: 'art' usa un dibujo propio de /images/avatars/<clave>.svg y 'emoji' dibuja un emoji grande.
export const memoryFigures=[
 ['art','semilla','Creación'],['art','adan','Adán y Eva'],['art','noe','Noé'],['art','maestro','Moisés'],
 ['art','david','David'],['art','leon','Daniel'],['art','maestra','Ester'],['art','biblia','Jesús'],
 ['art','paloma','Paloma'],['art','juan','Juan el Bautista'],['art','rut','Rut'],['art','jonas','Jonás']];
const pairSizes=[6,8,10];let memoryState=[];let open=[];let locked=false;let matches=0;let memoryTimer;let memoryTotal=6;
const pairCount=()=>{const n=Number($('memoryPairs')?.value);return pairSizes.includes(n)?n:pairSizes[0]};
const figureArt=card=>card.kind==='art'?`<span class="memory-art avatar-art avatar-art-${card.key}" aria-hidden="true"></span>`:`<span class="memory-emoji" aria-hidden="true">${card.key}</span>`;
function renderMemory(){const board=$('memoryBoard');board.classList.toggle('memory-10',memoryTotal===10);board.innerHTML=memoryState.map((card,i)=>`<button class="memory-card ${card.flipped?'flipped':''} ${card.matched?'matched':''}" data-memory="${i}" type="button" aria-label="Tarjeta ${card.flipped||card.matched?safe(card.label):'oculta'}">${card.flipped||card.matched?figureArt(card):'<span>?</span>'}</button>`).join('');$('memoryScore').textContent=`${matches} / ${memoryTotal} parejas`}
function resetMemory(){clearTimeout(memoryTimer);memoryTotal=pairCount();const figures=[...memoryFigures].sort(()=>Math.random()-.5).slice(0,memoryTotal);memoryState=figures.flatMap(([kind,key,label])=>[{kind,key,label,flipped:false,matched:false},{kind,key,label,flipped:false,matched:false}]).sort(()=>Math.random()-.5);open=[];locked=false;matches=0;$('memoryMessage').textContent=`Encuentra las ${memoryTotal} parejas.`;renderMemory()}
$('memoryReset').addEventListener('click',resetMemory);$('memoryPairs').addEventListener('change',resetMemory);$('memoryBoard').addEventListener('click',event=>{const button=event.target.closest('[data-memory]');if(!button||locked)return;const i=Number(button.dataset.memory),card=memoryState[i];if(card.flipped||card.matched)return;card.flipped=true;open.push(i);renderMemory();if(open.length<2)return;locked=true;const [a,b]=open;if(memoryState[a].key===memoryState[b].key){memoryState[a].matched=memoryState[b].matched=true;matches++;open=[];locked=false;$('memoryMessage').textContent=matches===memoryTotal?'🏆 ¡Todas las parejas! Celebra el repaso.':`¡Pareja encontrada! Van ${matches} de ${memoryTotal}.`;renderMemory()}else{memoryTimer=setTimeout(()=>{memoryState[a].flipped=memoryState[b].flipped=false;open=[];locked=false;$('memoryMessage').textContent='Prueben otra vez y recuerden la historia.';renderMemory()},750)}});resetMemory();
// ¿Quién soy?: el maestro revela hasta tres pistas, una a la vez, antes de mostrar el personaje.
// Cada tarjeta es [figura, nombre, [pista 1, pista 2, pista 3]], de la más sutil a la más clara.
// Cada personaje lleva su propio retrato dibujado, con el detalle que lo identifica.
export const whoCards=[
 [['art','adan'],'Adán y Eva',['Fuimos la primera familia del mundo.','Vivíamos en un jardín hermoso que Dios mismo plantó.','Dios nos encargó cuidar su creación y poner nombre a los animales.']],
 [['art','noe'],'Noé',['Dios me pidió construir algo muy grande.','Los animales entraron conmigo de dos en dos.','Construí un arca y obedecí a Dios, aunque otros no entendían.']],
 [['art','maestro'],'Moisés',['Dios me llamó desde una zarza que ardía.','Guié al pueblo de Dios fuera de Egipto.','Con la ayuda de Dios el mar se abrió y pasamos en seco.']],
 [['art','rut'],'Rut',['Quise mucho a mi suegra Noemí y no la dejé sola.','Recogía espigas en el campo de Booz.','Llegué a ser parte de la familia del rey David.']],
 [['art','david'],'David',['De niño cuidaba las ovejas de mi padre.','Tocaba el arpa y escribí muchos salmos.','Enfrenté al gigante Goliat confiando en Dios.']],
 [['art','leon'],'Daniel',['Oraba a Dios tres veces al día, sin esconderme.','Me echaron a un foso con animales salvajes.','Dios envió su ángel y cerró la boca de los leones.']],
 [['art','maestra'],'Ester',['Llegué a ser reina en un país lejano.','Arriesgué todo para pedir ayuda por mi pueblo.','Dios me puso en el palacio para un momento como ese.']],
 [['art','jonas'],'Jonás',['Huí en barco cuando Dios me dio una misión.','Pasé tres días dentro de un gran pez.','Al final obedecí y predicqué en la ciudad de Nínive.']],
 [['art','biblia'],'Jesús',['Nací en un pesebre en Belén.','Enseñé con parábolas y sané a los enfermos.','Morí en la cruz y resucité al tercer día.']],
 [['art','juan'],'Juan el Bautista',['Anunciaba que vendría alguien más grande que yo.','Bautizaba en el río Jordán a quienes se arrepentían.','Bauticé a Jesús y vi al Espíritu descender como paloma.']]];
let whoIndex=0;let whoShown=0;
const figureSymbol=([kind,key])=>kind==='art'?{cls:`who-symbol avatar-art avatar-art-${key}`,txt:''}:{cls:'who-symbol who-emoji',txt:key};
function renderWho(){const [,name]=whoCards[whoIndex];whoShown=0;$('whoSymbol').className='who-symbol who-question';$('whoSymbol').textContent='?';$('whoClues').innerHTML='';$('whoProgress').textContent='Pulsa «Dar una pista» para comenzar.';$('whoAnswer').textContent=name;$('whoAnswer').classList.add('hidden-answer');$('showWho').textContent='Revelar personaje';const hintBtn=$('whoHint');hintBtn.disabled=false;hintBtn.textContent='Dar una pista';$('whoCount').textContent=`${whoIndex+1} de ${whoCards.length}`}
$('whoHint').addEventListener('click',()=>{const [,,hints]=whoCards[whoIndex];if(whoShown>=hints.length)return;whoShown++;const li=document.createElement('li');li.innerHTML=`<b>Pista ${whoShown}.</b> ${safe(hints[whoShown-1])}`;$('whoClues').append(li);$('whoProgress').textContent=whoShown<hints.length?`Van ${whoShown} de ${hints.length} pistas. ¿Ya saben quién es?`:'Ya están las tres pistas. ¡A adivinar!';if(whoShown>=hints.length){const hintBtn=$('whoHint');hintBtn.disabled=true;hintBtn.textContent='Sin más pistas'}});
$('showWho').addEventListener('click',()=>{const hidden=$('whoAnswer').classList.toggle('hidden-answer');if(hidden){$('whoSymbol').className='who-symbol who-question';$('whoSymbol').textContent='?';$('showWho').textContent='Revelar personaje'}else{const symbol=figureSymbol(whoCards[whoIndex][0]);$('whoSymbol').className=symbol.cls;$('whoSymbol').textContent=symbol.txt;$('showWho').textContent='Ocultar personaje'}});
$('nextWho').addEventListener('click',()=>{whoIndex=(whoIndex+1)%whoCards.length;renderWho()});renderWho();
$('tvMode').addEventListener('click',async()=>{document.body.classList.toggle('tv-mode');const active=document.body.classList.contains('tv-mode');$('tvMode').textContent=active?'↙ Salir de modo TV':'⛶ Activar modo TV';if(active&&!document.fullscreenElement){try{await document.documentElement.requestFullscreen()}catch{}}else if(!active&&document.fullscreenElement){try{await document.exitFullscreen()}catch{}}});
