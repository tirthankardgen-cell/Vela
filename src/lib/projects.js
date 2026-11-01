'use client';
import {collection,doc,getDocFromServer,getDocsFromServer,orderBy,query,runTransaction,serverTimestamp,limit,startAfter} from 'firebase/firestore';
import {firebase} from './firebase.js';
import {decodeProject,encodeProject,projectError,projectId} from './project-data.js';

export function projectStore(uid,services=firebase()){
 const {db}=services,versions=new Map();
 const projectRef=id=>doc(db,'users',uid,'projects',projectId(id));
 let chain=Promise.resolve();
 const serial=fn=>{const result=chain.catch(()=>{}).then(fn);chain=result;return result;};
 return {
  save(layout){
   // Snapshot immediately so edits made during a request cannot change that request.
   const data=encodeProject(layout),id=data.id;
   return serial(async()=>{
    const target=projectRef(id),expected=versions.get(id)??0;
    const revision=await runTransaction(db,async transaction=>{
     const current=await transaction.get(target),previous=current.data(),actual=previous?.revision??0;
     if(actual!==expected||(current.exists()&&!versions.has(id)))throw projectError('conflict');
     if(!current.exists()&&expected>0)throw projectError('conflict');
     transaction.set(target,{...data,revision:actual+1,createdAt:previous?.createdAt??serverTimestamp(),updatedAt:serverTimestamp()});
     return actual+1;
    });
    versions.set(id,revision);
   });
  },
  async listPage(cursor=null){
   const constraints=[orderBy('updatedAt','desc'),...(cursor?[startAfter(cursor)]:[]),limit(24)];
   const snapshot=await getDocsFromServer(query(collection(db,'users',uid,'projects'),...constraints));
   const projects=snapshot.docs.map(d=>{const data=d.data();versions.set(d.id,data.revision??0);return {id:d.id,name:data.name,client:data.client??data.layout?.project?.client??'',itemCount:data.itemCount??data.layout?.items?.length??0,updatedAt:data.updatedAt};});
   return {projects,cursor:snapshot.size===24?snapshot.docs.at(-1):null};
  },
  async get(id){
   const snapshot=await getDocFromServer(projectRef(id));if(!snapshot.exists())throw projectError('not-found');
   const data=snapshot.data(),layout=decodeProject(data,id);
   versions.set(id,data.revision??0);return layout;
  },
  remove(id){return serial(async()=>{
   const target=projectRef(id);
   await runTransaction(db,async transaction=>{
    const current=await transaction.get(target);
    if(current.exists()&&(current.data().revision??0)!==versions.get(id))throw projectError('conflict');
    transaction.delete(target);
   });
   versions.delete(id);
  });},
 };
}
