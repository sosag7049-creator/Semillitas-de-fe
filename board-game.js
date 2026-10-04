const $=id=>document.getElementById(id);
export const jumps={3:14,8:19,17:29,24:33,12:5,22:10,30:18,35:26};
export const destination=(position,roll)=>Math.min(36,position+roll);
const prompts=[
 ['¿Quién construyó el arca?','Noé. Génesis 6:13–22.'],
 ['¿Quién venció a Goliat?','David, confiando en Dios. 1 Samuel 17:45–50.'],
 ['¿Quién oraba y fue echado al foso de los leones?','Daniel. Daniel 6:10–23.'],
 ['¿Quién creó los cielos y la tierra?','Dios. Génesis 1:1.'],
 ['¿Qué hizo Jesús cuando le llevaron niños?','Los recibió y los bendijo. Marcos 10:13–16.'],
 ['¿Quién ayudó al hombre herido del camino?','El samaritano. Lucas 10:30–37.'],
 ['¿Qué hizo Jesús durante la tormenta?','Reprendió al viento y al mar, y hubo calma. Marcos 4:39.'],
 ['¿Quién guio al pueblo al cruzar el Mar Rojo?','Moisés, siguiendo a Dios. Éxodo 14:21–22.'],
 ['Reto en equipo: representen cómo entran los animales al arca.','Participen desde su lugar, sin correr. Génesis 7:8–9.'],
 ['Reto: cada equipo diga una forma de ayudar a alguien esta semana.','Escuchen una propuesta amable. Gálatas 6:2.'],
 ['Reto: mencionen juntos tres cosas que Dios creó.','Pueden nombrar luz, plantas y animales. Génesis 1.'],
 ['Reto: hagan un gesto de alegría y den gracias por algo.','Todos pueden participar con palabras o gestos. 1 Tesalonicenses 5:18.'],
 ['Reto: expliquen cómo compartirían sus colores con un compañero.','La maestra acepta una propuesta generosa. Hebreos 13:16.'],
 ['¿Qué buscó el pastor que tenía cien ovejas?','La oveja perdida. Lucas 15:4–6.'],
 ['Reto: digan una frase amable para alguien que está triste.','Escuchen y animen sin burlas. 1 Tesalonicenses 5:11.'],
 ['¿Qué hizo Jesús con cinco panes y dos peces?','Alimentó a la multitud. Mateo 14:17–21.']
];
const colors=['#007d99','#b44f26','#684ac2','#287546'];
const avatars=['david','maestra','maestro','noe'];
export function cellPoint(n){const row=Math.floor((n-1)/6),col=(n-1)%6;return {x:(row%2?5-col:col)*100+50,y:(5-row)*100+50}}
if(typeof document!=='undefined'&&$('game-board')){
 let teams=[],turn=0,busy=false,pending=null,epoch=0,deck=[];
 const board=$('journeyBoard'),status=$('journeyStatus'),roll=$('journeyRoll');
 function render(){
  let cells='';for(let row=5;row>=0;row--)for(let col=0;col<6;col++){const n=row*6+(row%2?6-col:col+1),end=jumps[n];cells+=`<div class="journey-cell ${end?(end>n?'ladder-cell':'snake-cell'):''}" style="grid-row:${6-row};grid-column:${col+1}"><b>${n}</b><small>${n===36?'META':end?`${end>n?'Sube':'Baja'} a ${end}`:n%4===0?'Reto':''}</small></div>`}
  board.innerHTML=cells;
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 600 600');svg.classList.add('journey-paths');svg.setAttribute('aria-hidden','true');
  for(const [start,end] of Object.entries(jumps)){const a=cellPoint(+start),b=cellPoint(end),line=document.createElementNS(ns,'path');line.setAttribute('d',`M${a.x},${a.y} Q${a.x+35},${(a.y+b.y)/2} ${b.x},${b.y}`);line.setAttribute('class',end>+start?'ladder-path':'snake-path');svg.append(line)}board.append(svg);
  teams.forEach((t,i)=>{const p=cellPoint(Math.max(1,t.pos)),token=document.createElement('span');token.className='journey-token';token.style.cssText=`left:calc(${p.x/6}% + ${(i%2)*18-9}px);top:calc(${p.y/6}% + ${Math.floor(i/2)*18-9}px);border-color:${colors[i]}`;token.innerHTML=`<span class="avatar-art avatar-art-${avatars[i]}"></span><b>${i+1}</b>`;token.title=`Equipo ${i+1}: ${t.pos===0?'salida':'casilla '+t.pos}`;board.append(token)});
  $('journeyTeams').innerHTML=teams.map((t,i)=>`<span class="journey-team ${i===turn?'current':''}" style="border-color:${colors[i]}">Equipo ${i+1} · ${t.pos||'Salida'}</span>`).join('');
 }
 function next(){pending=null;$('journeyChallenge').hidden=true;if(teams[turn].pos>=36){status.textContent=`¡Equipo ${turn+1} llegó a la meta! Un aplauso para todos. Nueva partida para volver a jugar.`;busy=true;roll.disabled=true;return}turn=(turn+1)%teams.length;busy=false;roll.disabled=false;status.textContent=`Turno del equipo ${turn+1}. ¡Lancen el dado!`;render()}
 function reset(){epoch++;teams=Array.from({length:Number($('journeyCount').value)},()=>({pos:0}));turn=0;busy=false;pending=null;deck=[];roll.disabled=false;$('journeyDie').textContent='—';$('journeyChallenge').hidden=true;status.textContent='Turno del equipo 1. ¡Comienza la aventura!';render()}
 function challenge(){if(!deck.length)deck=prompts.map((_,i)=>i).sort(()=>Math.random()-.5);const [q,a]=prompts[deck.pop()],pos=teams[turn].pos;pending={pos,to:jumps[pos]};$('journeyPrompt').textContent=q;$('journeyHelp').textContent=a;$('journeyHelp').hidden=true;$('journeyReveal').textContent='Ver orientación';$('journeyRule').textContent=pending.to?(pending.to>pos?`Escalera: si resuelven el reto, suben a ${pending.to}; si necesitan practicar, se quedan aquí.`:`Serpiente: si resuelven el reto, se quedan aquí; si necesitan practicar, bajan a ${pending.to}.`):'Conversen y participen. Después continúa el siguiente equipo.';$('journeyChallenge').hidden=false;status.textContent=`Equipo ${turn+1}: la maestra lee la consigna.`}
 roll.addEventListener('click',async()=>{if(busy)return;busy=true;roll.disabled=true;const ticket=epoch,value=1+Math.floor(Math.random()*6),target=destination(teams[turn].pos,value);$('journeyDie').textContent=value;status.textContent=`Equipo ${turn+1} sacó ${value}.`;while(teams[turn].pos<target){await new Promise(r=>setTimeout(r,matchMedia('(prefers-reduced-motion: reduce)').matches?0:230));if(ticket!==epoch)return;teams[turn].pos++;render()}if(target===36){next();return}if(jumps[target]||target%4===0)challenge();else next()});
 function resolve(ok){if(!pending)return;const {pos,to}=pending;if(to&&((to>pos&&ok)||(to<pos&&!ok)))teams[turn].pos=to;render();next()}
 $('journeyYes').addEventListener('click',()=>resolve(true));$('journeyNo').addEventListener('click',()=>resolve(false));$('journeyReveal').addEventListener('click',()=>{const help=$('journeyHelp');help.hidden=!help.hidden;$('journeyReveal').textContent=help.hidden?'Ver orientación':'Ocultar orientación'});
 $('journeyReset').addEventListener('click',()=>{if(teams.some(t=>t.pos>0)&&!confirm('¿Comenzar una partida nueva? Se reiniciarán las posiciones.'))return;reset()});$('journeyCount').addEventListener('change',reset);reset();
}
