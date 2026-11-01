// One queue for edits, explicit saves, retries and navigation. Only the latest pending
// snapshot is retained; an in-flight write must finish before its successor starts.
export function createAutosave({save,onStatus=()=>{},delay=900}){
 let pending=null,running=null,timer=null,disposed=false;
 const status=(value,error)=>{if(!disposed)onStatus(value,error);};
 function schedule(layout){pending=structuredClone(layout);clearTimeout(timer);status('pending');timer=setTimeout(()=>{flush().catch(()=>{});},delay);}
 function flush(){
  clearTimeout(timer);
  if(running)return running;
  if(!pending)return Promise.resolve();
  running=(async()=>{
   while(pending){
    const next=pending;pending=null;status('saving');
    try{await save(next);}catch(error){if(!pending)pending=next;status('error',error);throw error;}
   }
   status('saved');
  })().finally(()=>{running=null;});
  return running;
 }
 return {schedule,flush,get dirty(){return Boolean(pending||running);},dispose(){disposed=true;clearTimeout(timer);flush().catch(()=>{});}};
}
