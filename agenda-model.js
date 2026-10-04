export const EVENT_TYPES = { birthday:'🎂 Cumpleaños', church:'⛪ Actividad de iglesia', class:'📖 Clase bíblica', celebration:'🎉 Celebración', trip:'🚌 Excursión o visita', reminder:'🔔 Recordatorio', note:'📝 Nota importante' };
export const dateKey = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  const [y,m,d]=value.split('-').map(Number), date=new Date(y,m-1,d,12);
  return y>=1900 && y<=9998 && dateKey(date)===value ? date : null;
}
export function validateEvent(input) {
  const title=String(input.title || '').trim(), description=String(input.description || '').trim();
  if (!title || title.length>160) throw Error('Escribe un título de hasta 160 caracteres.');
  if (!Object.hasOwn(EVENT_TYPES,input.event_type)) throw Error('Selecciona un tipo de evento.');
  if (!parseDate(input.event_date)) throw Error('Selecciona una fecha válida.');
  if (description.length>2000) throw Error('La descripción puede tener hasta 2.000 caracteres.');
  const time=input.event_time || null;
  if (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw Error('Selecciona una hora válida.');
  const reminder=Number(input.reminder_days);
  if (![-1,0,1,3,7].includes(reminder)) throw Error('Selecciona cuándo quieres el aviso.');
  const birthday=input.event_type==='birthday';
  const event_date=birthday ? '2000'+input.event_date.slice(4) : input.event_date;
  if (!parseDate(event_date)) throw Error('Revisa el día y mes del cumpleaños.');
  return {title,description,event_type:input.event_type,event_date,event_time:time,annual:birthday || Boolean(input.annual),reminder_days:reminder};
}
export function occurrence(event,year) {
  const base=parseDate(event.event_date); if(!base) return null;
  if(!event.annual) return base;
  if(event.event_type!=='birthday' && year<base.getFullYear()) return null;
  const month=base.getMonth(), day=Math.min(base.getDate(),new Date(year,month+1,0).getDate());
  return new Date(year,month,day,12); // Feb 29 is observed Feb 28 in non-leap years.
}
export function daysBetween(a,b) {
  return Math.round((Date.UTC(b.getFullYear(),b.getMonth(),b.getDate())-Date.UTC(a.getFullYear(),a.getMonth(),a.getDate()))/86400000);
}
export function upcoming(events,from=new Date(),days=366) {
  const rows=[];
  for(const e of events) {
    const years=e.annual ? [from.getFullYear(),from.getFullYear()+1,from.getFullYear()+2] : [0];
    for(const year of years) {
      const date=occurrence(e,year);if(!date)continue;
      const distance=daysBetween(from,date);
      if(distance>=0 && distance<=days)rows.push({...e,date,dateKey:dateKey(date),days:distance});
    }
  }
  return rows.sort((a,b)=>a.dateKey.localeCompare(b.dateKey)||(a.event_time||'').localeCompare(b.event_time||'')||a.title.localeCompare(b.title,'es'));
}
export function inMonth(events,year,month) {
  return events.map(e=>({...e,date:occurrence(e,year)})).filter(e=>e.date && e.date.getFullYear()===year && e.date.getMonth()===month).map(e=>({...e,dateKey:dateKey(e.date)})).sort((a,b)=>a.dateKey.localeCompare(b.dateKey)||(a.event_time||'').localeCompare(b.event_time||''));
}
export function remindersDue(events,now=new Date()) {
  return upcoming(events,now,7).filter(e=>e.reminder_days>=0 && e.days<=e.reminder_days && (e.days!==0 || !e.event_time || e.event_time.slice(0,5)>=`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`));
}
