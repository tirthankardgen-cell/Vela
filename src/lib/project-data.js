// JSON preserves nested coordinate arrays, which Firestore document fields cannot store.
export function projectError(code){return Object.assign(new Error(code),{code:`project/${code}`});}
export function projectId(id){if(typeof id!=='string'||!/^[\w-]{1,80}$/.test(id))throw projectError('invalid');return id;}
export function encodeProject(layout){
 const id=projectId(layout?.project?.id),name=layout.project.name;
 if(layout.format!=='roomnote-layout'||layout.version!==1||layout.units!=='metres'||!layout.room||!Array.isArray(layout.items)||layout.items.length>200||typeof name!=='string'||!name.trim()||name.length>100)throw projectError('invalid');
 const clean=structuredClone(layout);
 // Tracing images are local-only. No image bytes or Storage paths enter Firestore.
 delete clean.room.reference;
 const layoutJson=JSON.stringify(clean);
 if(new TextEncoder().encode(layoutJson).length>900000)throw projectError('too-large');
 return {schemaVersion:2,id,name,client:String(layout.project.client||'').slice(0,100),itemCount:layout.items.length,layoutJson};
}
export function decodeProject(data,id){
 let layout;
 try{layout=data.schemaVersion===2?JSON.parse(data.layoutJson):structuredClone(data.layout);}catch{throw projectError('invalid');}
 if(layout?.project?.id!==id)throw projectError('invalid');
 return layout;
}
