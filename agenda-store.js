import { request } from './teacher-store.js';
import { validateEvent } from './agenda-model.js';
const FIELDS='id,title,event_type,event_date,event_time,description,annual,reminder_days,created_at,updated_at';
export function createAgendaStore(client) {
  let user=null, epoch=0, serial=0, loading=false, loaded=false, error='', rows=[], busy=false;
  const listeners=new Set();
  const snapshot=()=>({user,rows:rows.map(r=>({...r})),loading,loaded,error,busy});
  const emit=()=>listeners.forEach(fn=>fn(snapshot()));
  async function refresh() {
    if(!user || busy)return;
    const uid=user.id, revision=epoch, read=++serial;loading=true;error='';emit();
    try {
      let all=[],offset=0;
      while(true){
        const {data}=await request(client.from('teacher_agenda').select(FIELDS).eq('user_id',uid).order('event_date').order('id').range(offset,offset+499));
        if(revision!==epoch || read!==serial)return;
        all.push(...data);if(data.length<500)break;offset+=500;
      }
      if(revision===epoch && read===serial){rows=all;loaded=true;}
    } catch { if(revision===epoch && read===serial)error='No pudimos cargar tu agenda. Revisa tu conexión y pulsa Actualizar.'; }
    finally{if(revision===epoch && read===serial){loading=false;emit();}}
  }
  async function setUser(next){
    if(user?.id===next?.id){user=next;return;}
    epoch++;serial++;user=next;rows=[];loaded=false;loading=false;busy=false;error='';emit();if(user)await refresh();
  }
  async function save(input) {
    if(!user || !loaded)throw Error('Inicia sesión y carga tu agenda antes de guardar.');
    if(busy)throw Error('Espera a que termine el cambio anterior.');
    const values=validateEvent(input), uid=user.id, revision=epoch;
    if(input.id && !rows.some(r=>r.id===input.id))throw Error('Actualiza la agenda antes de editar este evento.');
    serial++;loading=false;busy=true;emit();
    try{
      const query=input.id ? client.from('teacher_agenda').update(values).eq('id',input.id).eq('user_id',uid).eq('updated_at',input.updated_at) : client.from('teacher_agenda').insert({...values,user_id:uid});
      const {data}=await request(query.select(FIELDS).maybeSingle());
      if(!data)throw Error('El evento cambió en otra sesión. Copia tus cambios y actualiza la agenda.');
      if(revision===epoch){rows=[...rows.filter(r=>r.id!==data.id),data];error='';}
      return data;
    } finally{if(revision===epoch){busy=false;emit();}}
  }
  async function remove(id,version){
    if(!user || !loaded)throw Error('Inicia sesión para eliminar eventos.');
    if(busy)throw Error('Espera a que termine el cambio anterior.');
    const revision=epoch,uid=user.id;serial++;loading=false;busy=true;emit();
    try {
      const {data}=await request(client.from('teacher_agenda').delete().eq('id',id).eq('user_id',uid).eq('updated_at',version).select('id').maybeSingle());
      if(!data)throw Error('El evento cambió o ya fue eliminado. Actualiza la agenda.');
      if(revision===epoch)rows=rows.filter(r=>r.id!==id);
    }finally{if(revision===epoch){busy=false;emit();}}
  }
  return {snapshot,setUser,refresh,save,remove,subscribe(fn){listeners.add(fn);fn(snapshot());return()=>listeners.delete(fn);}};
}
