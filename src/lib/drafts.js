const prefix=owner=>`vela-cloud-draft:${owner}:`;
export function writeDraft(owner,layout){localStorage.setItem(prefix(owner)+layout.project.id,JSON.stringify({layout,updatedAt:Date.now()}));}
export function readDraft(owner,id){try{return JSON.parse(localStorage.getItem(prefix(owner)+id)||'null');}catch{return null;}}
export function clearDraft(owner,id,layout){
 try{const saved=readDraft(owner,id);if(!layout||JSON.stringify(saved?.layout)===JSON.stringify(layout))localStorage.removeItem(prefix(owner)+id);}catch{/* Keep the draft if browser storage is unavailable. */}
}
export function listDrafts(owner){
 try{return Object.keys(localStorage).filter(key=>key.startsWith(prefix(owner))).map(key=>JSON.parse(localStorage.getItem(key))).filter(d=>d?.layout?.project?.id).sort((a,b)=>b.updatedAt-a.updatedAt);}catch{return [];}
}
