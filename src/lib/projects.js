'use client';
import {collection,doc,getDoc,getDocs,orderBy,query,setDoc,deleteDoc,serverTimestamp,limit} from 'firebase/firestore';
import {ref,uploadString,getDownloadURL,deleteObject} from 'firebase/storage';
import {firebase} from './firebase';

export function projectStore(uid){
 const {db,storage}=firebase(),uploaded=new Map();
 const ownId=id=>{if(!/^[\w-]{1,80}$/.test(id))throw new Error('Invalid project identifier');return id;};
 const projectRef=id=>doc(db,'users',uid,'projects',ownId(id));
 return {
  async save(layout){
   const clean=JSON.parse(JSON.stringify(layout)),id=ownId(clean.project.id),reference=clean.room.reference;
   if(reference?.data){const path=`users/${uid}/floorplans/${id}.jpg`;if(uploaded.get(id)!==reference.data){await uploadString(ref(storage,path),reference.data,'data_url',{contentType:'image/jpeg'});uploaded.set(id,reference.data);}clean.room.reference={path,opacity:reference.opacity,visible:reference.visible};}
   const current=await getDoc(projectRef(id));
   await setDoc(projectRef(id),{name:clean.project.name,layout:clean,updatedAt:serverTimestamp(),...(current.exists()?{}:{createdAt:serverTimestamp()})},{merge:true});
  },
  async list(){const snapshot=await getDocs(query(collection(db,'users',uid,'projects'),orderBy('updatedAt','desc'),limit(100)));return snapshot.docs.map(d=>({id:d.id,...d.data()}));},
  async get(id){const snapshot=await getDoc(projectRef(id));if(!snapshot.exists())throw new Error('Project not found.');const layout=snapshot.data().layout,reference=layout.room?.reference;
   if(reference?.path){if(!reference.path.startsWith(`users/${uid}/floorplans/`))throw new Error('Invalid reference path');const url=await getDownloadURL(ref(storage,reference.path));const response=await fetch(url);if(!response.ok)throw new Error('Could not load the floor plan.');const blob=await response.blob();reference.data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});uploaded.set(id,reference.data);}
   return layout;
  },
  async remove(id){await deleteDoc(projectRef(id));try{await deleteObject(ref(storage,`users/${uid}/floorplans/${ownId(id)}.jpg`));}catch(error){if(error.code!=='storage/object-not-found')throw error;}uploaded.delete(id);},
 };
}
