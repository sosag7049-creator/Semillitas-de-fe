import { EVENT_TYPES,dateKey,parseDate,upcoming,inMonth,remindersDue } from './agenda-model.js';
import { createAgendaStore } from './agenda-store.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pretty=d=>new Intl.DateTimeFormat('es',{day:'numeric',month:'long'}).format(d);
export function mountAgenda({client,teacherStore,container,openAgenda}) {
  const store=createAgendaStore(client);
  let state=store.snapshot(),month=new Date(new Date().getFullYear(),new Date().getMonth(),1,12), selected=dateKey(new Date()),editing=null,dirty=false,owner=null,saveGeneration=0;
  const seen=new Set();let renderedReminders='';
  document.head.insertAdjacentHTML('beforeend','<link rel="stylesheet" href="/agenda.css?v=1">');
  container.innerHTML=`
  <div class="agenda-heading"><div><h3>Agenda del maestro</h3><p>Celebra, prepara y recuerda cada encuentro.</p></div><button type="button" id="agendaNew" class="teacher-primary">+ Nuevo evento</button></div>
  <p class="agenda-private">🔒 Solo tu cuenta puede ver esta agenda. Las horas corresponden al reloj de tu dispositivo.</p>
  <div id="agendaStatus" role="status" aria-live="polite"></div>
  <div id="agendaNotices" class="agenda-notices" aria-label="Recordatorios de tu agenda"></div>
  <div class="agenda-summary"><section><h4>🎂 Próximos cumpleaños</h4><div id="agendaBirthdays"></div></section><section><h4>📅 Eventos de esta semana</h4><div id="agendaWeek"></div></section></div>
  <div class="agenda-layout"><div class="agenda-calendar"><div class="agenda-month-nav"><button id="agendaPrev" type="button" aria-label="Mes anterior">‹</button><h4 id="agendaMonth" aria-live="polite"></h4><button id="agendaNext" type="button" aria-label="Mes siguiente">›</button><button id="agendaToday" type="button">Hoy</button></div><p class="agenda-calendar-hint">Elige un día para ver sus eventos.</p><div class="agenda-weekdays" aria-hidden="true">${['L','M','X','J','V','S','D'].map(d=>`<span>${d}</span>`).join('')}</div><div id="agendaDays" class="agenda-days" role="group" aria-label="Días del mes"></div><h4 id="agendaSelected"></h4><div id="agendaDayEvents"></div></div>
  <form id="agendaForm" class="agenda-form"><fieldset id="agendaFields"><legend id="agendaFormTitle">Nuevo evento</legend>
  <label>Tipo<select name="event_type" id="agendaType">${Object.entries(EVENT_TYPES).map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></label>
  <label>Nombre o título<input name="title" id="agendaTitle" maxlength="160" required placeholder="Ej.: Samuel o clase del domingo"></label>
  <div id="agendaDateWrap"><label>Fecha<input type="date" name="event_date" id="agendaDate" min="1900-01-01" max="9998-12-31"></label></div>
  <div id="agendaBirthdayWrap" class="agenda-form-row"><label>Mes<select id="agendaBirthMonth">${Array.from({length:12},(_,i)=>`<option value="${i+1}">${new Intl.DateTimeFormat('es',{month:'long'}).format(new Date(2000,i,1))}</option>`).join('')}</select></label><label>Día<input id="agendaBirthDay" type="number" min="1" max="31"></label></div>
  <p id="agendaBirthdayHint" class="agenda-hint">Se repite cada año. No pedimos el año de nacimiento. El 29 de febrero se recuerda el 28 en años no bisiestos.</p>
  <label>Hora (opcional)<input name="event_time" type="time" id="agendaTime"></label>
  <label>Descripción<textarea name="description" id="agendaDescription" maxlength="2000" rows="3" placeholder="Materiales, lugar o detalles para preparar…"></textarea></label>
  <label class="agenda-check" id="agendaAnnualWrap"><input type="checkbox" id="agendaAnnual"> Repetir cada año</label>
  <label>Avisarme<select id="agendaReminder"><option value="-1">Sin aviso</option><option value="0">El mismo día</option><option value="1" selected>1 día antes</option><option value="3">3 días antes</option><option value="7">7 días antes</option></select></label>
  <p class="agenda-hint">Los avisos aparecen dentro de la página cuando inicias sesión. No envían correo ni notificaciones con la app cerrada.</p>
  <div class="agenda-form-actions"><button type="submit" class="teacher-primary" id="agendaSave">Guardar evento</button><button type="button" id="agendaCancel">Cancelar edición</button></div><p id="agendaFeedback" role="status" aria-live="polite"></p>
  </fieldset></form></div>
  <details class="agenda-all"><summary>Todos mis registros</summary><div id="agendaAll"></div></details>`;
  const $=id=>container.querySelector('#'+id),form=$('agendaForm');
  const banner=document.createElement('div');banner.className='agenda-banner';banner.hidden=true;
  banner.innerHTML='<span id="agendaBannerText"></span><button type="button" data-agenda-open>Ver agenda</button><button type="button" data-agenda-dismiss aria-label="Cerrar aviso">✕</button>';
  document.body.append(banner);
  const dismiss=()=>{remindersDue(state.rows).forEach(e=>seen.add(`${state.user?.id}:${e.id}:${e.dateKey}:${e.updated_at}`));banner.hidden=true;};
  banner.querySelector('[data-agenda-dismiss]').onclick=dismiss;
  banner.querySelector('[data-agenda-open]').onclick=()=>{dismiss();openAgenda();};
  function configureType(){
    const b=$('agendaType').value==='birthday';
    $('agendaDateWrap').hidden=b;$('agendaDate').required=!b;
    $('agendaBirthdayWrap').hidden=!b;$('agendaBirthdayHint').hidden=!b;
    $('agendaBirthDay').required=b;$('agendaBirthMonth').required=b;$('agendaAnnualWrap').hidden=b;
    if(b)limitarDiaDelMes();
  }
  // Ajusta el maximo de dias al mes elegido: antes se podia escribir "30 de febrero"
  // y el aviso que salia era generico en vez de explicar el problema.
  function limitarDiaDelMes(){
    const mes=Number($('agendaBirthMonth').value)||1;
    const tope=new Date(2000,mes,0).getDate();
    const dia=$('agendaBirthDay');
    dia.max=String(tope);
    if(Number(dia.value)>tope)dia.value=String(tope);
  }
  function reset(date=selected){
    saveGeneration++;editing=null;dirty=false;form.reset();$('agendaType').value='class';$('agendaDate').value=date;
    const d=parseDate(date)||new Date();$('agendaBirthMonth').value=d.getMonth()+1;$('agendaBirthDay').value=d.getDate();
    $('agendaFormTitle').textContent='Nuevo evento';$('agendaFeedback').textContent='';configureType();
  }
  function mayDiscard(){if(state.busy)return false;return !dirty || confirm('Hay un evento sin guardar. ¿Descartar los cambios?');}
  function card(e){const d=e.date||parseDate(e.event_date);return `<article class="agenda-event"><div><small>${esc(EVENT_TYPES[e.event_type])} · ${esc(pretty(d))}${e.event_time?' · '+esc(e.event_time.slice(0,5)):''}${e.annual?' · Anual':''}</small><strong>${esc(e.title)}</strong>${e.description?`<p>${esc(e.description)}</p>`:''}</div><div class="agenda-event-actions"><button type="button" data-agenda-edit="${esc(e.id)}">Editar</button><button type="button" data-agenda-delete="${esc(e.id)}" class="teacher-delete">Eliminar</button></div></article>`;}
  function brief(e){return `<button class="agenda-brief" type="button" data-agenda-date="${e.dateKey}"><span>${esc(e.title)}</span><small>${e.days===0?'Hoy':e.days===1?'Mañana':`En ${e.days} días`} · ${esc(pretty(e.date))}</small></button>`;}
  function render(){
    $('agendaFields').disabled=!state.user || !state.loaded || state.busy;
    $('agendaNew').disabled=!state.loaded || state.busy;
    $('agendaSave').textContent=state.busy?'Guardando…':'Guardar evento';
    $('agendaStatus').textContent=state.error || (state.loading?'Actualizando agenda…':!state.loaded?'Cargando agenda…':'');
    const upcomingRows=upcoming(state.rows),birthdays=upcomingRows.filter(e=>e.event_type==='birthday').slice(0,5);
    const endOfWeek=6-((new Date().getDay()+6)%7),week=upcomingRows.filter(e=>e.days<=endOfWeek);
    $('agendaBirthdays').innerHTML=birthdays.map(brief).join('')||'<p>Aún no hay cumpleaños próximos.</p>';
    $('agendaWeek').innerHTML=week.map(brief).join('')||'<p>No tienes eventos pendientes esta semana.</p>';
    const due=remindersDue(state.rows);
    $('agendaNotices').innerHTML=due.map(e=>`<p>🔔 ${esc(e.event_type==='birthday'?'El cumpleaños de '+e.title:e.title)} ${e.days===0?'es hoy':e.days===1?'es mañana':`es en ${e.days} días`}${e.event_time?' a las '+esc(e.event_time.slice(0,5)):''}.</p>`).join('');
    const unread=due.filter(e=>!seen.has(`${state.user?.id}:${e.id}:${e.dateKey}:${e.updated_at}`));
    const reminderKey=unread.map(e=>e.id+e.dateKey+e.updated_at).join('|');
    if(reminderKey!==renderedReminders){renderedReminders=reminderKey;banner.hidden=!unread.length || !state.user;banner.querySelector('#agendaBannerText').textContent=`🔔 Tienes ${unread.length} ${unread.length===1?'recordatorio':'recordatorios'} en tu agenda.`;}
    if(!state.user)banner.hidden=true;
    $('agendaMonth').textContent=new Intl.DateTimeFormat('es',{month:'long',year:'numeric'}).format(month);
    const y=month.getFullYear(),m=month.getMonth(),monthRows=inMonth(state.rows,y,m),offset=(month.getDay()+6)%7,total=new Date(y,m+1,0).getDate();
    $('agendaDays').innerHTML='<span aria-hidden="true"></span>'.repeat(offset)+Array.from({length:total},(_,i)=>{
      const day=new Date(y,m,i+1,12),key=dateKey(day),n=monthRows.filter(e=>e.dateKey===key).length;
      return `<button type="button" data-agenda-date="${key}" aria-label="${esc(pretty(day))}: ${n} eventos" aria-pressed="${key===selected}" ${key===dateKey(new Date())?'aria-current="date"':''}><span>${i+1}</span>${n?`<small>${n} ${n===1?'evento':'eventos'}</small>`:'<small aria-hidden="true">·</small>'}</button>`;
    }).join('');
    $('agendaSelected').textContent=pretty(parseDate(selected));
    $('agendaDayEvents').innerHTML=monthRows.filter(e=>e.dateKey===selected).map(card).join('')||'<p class="agenda-empty">No hay eventos en este día. Puedes añadir uno con el formulario.</p>';
    $('agendaAll').innerHTML=state.rows.slice().sort((a,b)=>a.event_date.localeCompare(b.event_date)).map(card).join('')||'<p>Todavía no has guardado registros.</p>';
  }
  store.subscribe(next=>{state=next;if(owner!==state.user?.id){owner=state.user?.id;reset(dateKey(new Date()));seen.clear();renderedReminders='';banner.hidden=true;}render();});
  teacherStore.subscribe(s=>{void store.setUser(s.user);});
  $('agendaType').addEventListener('change',configureType);
  form.addEventListener('input',()=>{dirty=true;});
  form.addEventListener('change',()=>{dirty=true;});
  $('agendaNew').onclick=()=>{if(mayDiscard()){reset();$('agendaTitle').focus();}};
  $('agendaCancel').onclick=()=>{if(mayDiscard())reset();};
  function setMonth(delta){const y=month.getFullYear(),m=month.getMonth();const next=new Date(y,m+delta,1,12);if(next.getFullYear()<1900 || next.getFullYear()>9998)return;month=next;selected=dateKey(month);if(!dirty&&!editing)$('agendaDate').value=selected;render();}
  $('agendaBirthMonth').addEventListener('change',limitarDiaDelMes);
  $('agendaPrev').onclick=()=>setMonth(-1);$('agendaNext').onclick=()=>setMonth(1);
  $('agendaToday').onclick=()=>{const n=new Date();month=new Date(n.getFullYear(),n.getMonth(),1,12);selected=dateKey(n);if(!dirty&&!editing)$('agendaDate').value=selected;render();};
  container.addEventListener('click',async event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.agendaDate){selected=button.dataset.agendaDate;const d=parseDate(selected);month=new Date(d.getFullYear(),d.getMonth(),1,12);if(!dirty&&!editing)$('agendaDate').value=selected;render();container.querySelector(`[data-agenda-date="${selected}"]`)?.focus({preventScroll:true});}
    if(button.dataset.agendaEdit && mayDiscard()){
      const e=state.rows.find(r=>r.id===button.dataset.agendaEdit);if(!e)return;
      reset(e.event_date);editing={...e};$('agendaTitle').value=e.title;$('agendaType').value=e.event_type;$('agendaDescription').value=e.description;$('agendaTime').value=e.event_time?.slice(0,5)||'';$('agendaAnnual').checked=e.annual;$('agendaReminder').value=e.reminder_days;configureType();$('agendaFormTitle').textContent='Editar evento';$('agendaTitle').focus();
    }
    if(button.dataset.agendaDelete){
      const e=state.rows.find(r=>r.id===button.dataset.agendaDelete);if(!e||!confirm(`¿Eliminar «${e.title}»${e.annual?' y su repetición anual':''}?`))return;
      const uid=state.user?.id;
      try{await store.remove(e.id,e.updated_at);if(state.user?.id===uid){if(editing?.id===e.id)reset();$('agendaFeedback').textContent='Evento eliminado.';}}
      catch(e){if(state.user?.id===uid)$('agendaFeedback').textContent=e.message;}
    }
  });
  form.addEventListener('submit',async event=>{
    event.preventDefault();const uid=state.user?.id,generation=++saveGeneration,birthday=$('agendaType').value==='birthday';
    const input={id:editing?.id,updated_at:editing?.updated_at,title:$('agendaTitle').value,event_type:$('agendaType').value,event_date:birthday?`2000-${String($('agendaBirthMonth').value).padStart(2,'0')}-${String($('agendaBirthDay').value).padStart(2,'0')}`:$('agendaDate').value,event_time:$('agendaTime').value,description:$('agendaDescription').value,annual:$('agendaAnnual').checked,reminder_days:$('agendaReminder').value};
    $('agendaFeedback').textContent='Guardando en tu cuenta…';
    try{const saved=await store.save(input);if(state.user?.id!==uid||generation!==saveGeneration)return;dirty=false;editing=saved;$('agendaFormTitle').textContent='Editar evento';$('agendaFeedback').textContent='✓ Evento guardado.';}
    catch(e){if(state.user?.id===uid&&generation===saveGeneration)$('agendaFeedback').textContent=e.message;}
  });
  window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){render();void store.refresh();}});
  setInterval(()=>{if(!document.hidden)render();},60000);
  reset();return {refresh:()=>store.refresh(),mayDiscard};
}
