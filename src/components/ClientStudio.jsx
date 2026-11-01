'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import AccountGate from '../auth/AccountGate';
import {demoMode} from '../lib/demo-auth';
import {demoProjectStore} from '../lib/demo-projects';
import {projectStore} from '../lib/projects';
import {friendlyError} from '../lib/firebase';
import {readDraft,clearDraft} from '../lib/drafts';
import App from '../App';

function Workspace({user,guest,newSpace,projectId,draftId}){
 const [setup,setSetup]=useState(null),[error,setError]=useState(''),[draftWarning,setDraftWarning]=useState(false);
 useEffect(()=>{
  let cancelled=false;
  async function load(){
   try{
    const owner=user?.uid||'guest',key=`vela-new-room:${owner}`,pending=newSpace?sessionStorage.getItem(key):null;
    const baseStore=user?(demoMode?demoProjectStore(owner):projectStore(owner)):null;
    const draft=draftId&&user?readDraft(owner,draftId):null;
    if(projectId&&user&&readDraft(owner,projectId)&&!cancelled)setDraftWarning(true);
    let initialLayout;
    if(draftId){
     if(!draft)throw new Error('Draft not found');
     initialLayout=structuredClone(draft.layout);
     initialLayout.project={...initialLayout.project,id:crypto.randomUUID(),name:`${initialLayout.project.name.slice(0,85)} recovered`};
    }else initialLayout=pending?JSON.parse(pending):projectId&&baseStore?await baseStore.get(projectId):null;
    if(user&&!initialLayout){if(!cancelled)setError('Choose a saved project or start a new space.');return;}
    const store=baseStore?{...baseStore,async save(layout){
     await baseStore.save(layout);if(draft)clearDraft(owner,draftId,draft.layout);if(pending)sessionStorage.removeItem(key);
     if(!cancelled&&location.pathname==='/studio')history.replaceState(history.state,'',`/studio?project=${encodeURIComponent(layout.project.id)}`);
    }}:null;
    if(!cancelled)setSetup({owner,store,initialLayout,saveOnStart:Boolean(pending||draft),pendingKey:pending?key:null});
   }catch(err){if(!cancelled)setError(friendlyError(err));}
  }
  load();return()=>{cancelled=true;};
 },[user?.uid,guest,newSpace,projectId,draftId]);
 if(error)return <main className="marketing route-loading"><p role="alert">{error}</p><Link href={guest?'/start?demo=1':'/projects'}>Return to projects and browser drafts</Link></main>;
 if(draftWarning)return <main className="marketing route-loading"><p>This project has unsynced edits in this browser. Recover them as a separate project, or discard the draft and open the cloud version.</p><Link href={`/studio?draft=${encodeURIComponent(projectId)}`}>Recover draft as a copy</Link><button onClick={()=>{clearDraft(user.uid,projectId);setDraftWarning(false);}}>Discard draft and open cloud version</button><Link href="/projects">Return to projects</Link></main>;
 if(!setup)return <main className="marketing route-loading"><p>Preparing your space…</p></main>;
 return <div id="root"><App owner={setup.owner} store={setup.store} initialLayout={setup.initialLayout} saveOnStart={setup.saveOnStart} onStarted={()=>{if(!setup.store&&setup.pendingKey)sessionStorage.removeItem(setup.pendingKey);}}/></div>;
}
export default function ClientStudio({guest=false,newSpace=false,projectId=null,draftId=null}){return <AccountGate guest={guest}>{user=><Workspace key={`${user?.uid||'guest'}:${newSpace}:${projectId}:${draftId}`} user={user} guest={guest} newSpace={newSpace} projectId={projectId} draftId={draftId}/>}</AccountGate>;}
