'use client';
import {useEffect,useState,useMemo,useCallback} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {signOut,sendEmailVerification,reload} from 'firebase/auth';
import {firebase,friendlyError} from '../lib/firebase';
import {demoMode,signOutDemo} from '../lib/demo-auth';
import {demoProjectStore} from '../lib/demo-projects';
import {projectStore} from '../lib/projects';
import {listDrafts,clearDraft} from '../lib/drafts';
import {siteUrl} from '../lib/site';
import AccountGate from '../auth/AccountGate';
import Wordmark from '../marketing/Wordmark';
function ProjectList({user}){
 const router=useRouter(),store=useMemo(()=>demoMode?demoProjectStore(user.uid):projectStore(user.uid),[user.uid]);
 const [projects,setProjects]=useState([]),[drafts,setDrafts]=useState([]),[cursor,setCursor]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState(''),[notice,setNotice]=useState(''),[confirm,setConfirm]=useState(null),[busy,setBusy]=useState(false),[verified,setVerified]=useState(user.emailVerified);
 const load=useCallback(async(next=null)=>{
  setError('');setLoading(true);setDrafts(listDrafts(user.uid));
  try{
   const result=store.listPage?await store.listPage(next):{projects:await store.list(),cursor:null};
   setProjects(previous=>next?[...previous,...result.projects.filter(p=>!previous.some(existing=>existing.id===p.id))]:result.projects);setCursor(result.cursor);
  }catch(e){setError(friendlyError(e));}finally{setLoading(false);}
 },[store,user.uid]);
 useEffect(()=>{load();},[load]);
 async function remove(id){
  if(confirm!==id){setConfirm(id);return;}
  setBusy(true);setError('');
  try{await store.remove(id);clearDraft(user.uid,id);setDrafts(listDrafts(user.uid));setProjects(previous=>previous.filter(p=>p.id!==id));setConfirm(null);}catch(e){setError(friendlyError(e));}finally{setBusy(false);}
 }
 async function accountAction(action){setBusy(true);setError('');setNotice('');try{await action();}catch(e){setError(friendlyError(e));}finally{setBusy(false);}}
 return <main className="marketing projects-page">
  <header className="setup-header"><Wordmark/><div className="projects-account"><span>{user.displayName||user.email}</span><button disabled={busy} onClick={()=>accountAction(async()=>{if(demoMode)signOutDemo();else await signOut(firebase().auth);router.replace('/login');})}>Sign out</button></div></header>
  <section className="projects-heading"><div><span className="lux-kicker">YOUR PERSONAL ATELIER</span><h1>Room for <em>your ideas.</em></h1><p>{demoMode?'Preview workspace · your projects are saved on this device.':'Your private plans, saved across devices. Tracing images stay in the browser and JSON exports.'}</p></div><Link href="/start" className="lux-button lux-button-dark">New space <span>+</span></Link></section>
  {!demoMode&&!verified&&<div className="form-notice" role="status">Verify your email using the link in your inbox. <button disabled={busy} onClick={()=>accountAction(async()=>{await sendEmailVerification(user,{url:`${siteUrl}/projects`});setNotice('Verification email sent. Check your inbox.');})}>Resend email</button> <button disabled={busy} onClick={()=>accountAction(async()=>{await reload(user);setVerified(user.emailVerified);setNotice(user.emailVerified?'Email verified.':'Verification is still pending. Open the link in your email first.');})}>I have verified</button></div>}
  {notice&&<p className="form-success" role="status">{notice}</p>}
  {error&&<div className="form-error" role="alert">{error} <button onClick={()=>load()}>Try again</button></div>}
  {drafts.length>0&&<section className="form-notice" aria-label="Browser drafts"><h2>Unsynced browser drafts</h2><p>These edits may not be in the cloud. Recover a draft as a separate project to keep both versions.</p>{drafts.map(d=><p key={d.layout.project.id}><Link href={`/studio?draft=${encodeURIComponent(d.layout.project.id)}`}>Recover {d.layout.project.name}</Link></p>)}</section>}
  {loading&&<p role="status">Opening your collection…</p>}
  <div className="cloud-project-grid"><Link className="new-project-card" href="/start"><span>+</span><h2>Begin a new space.</h2><p>From a floor plan or a blank canvas.</p></Link>{projects.map(p=><article className="cloud-project-card" key={p.id}><Link href={`/studio?project=${encodeURIComponent(p.id)}`}><div className="project-drawing">⌑<span>{p.itemCount??p.layout?.items?.length??0} PIECES</span></div><h2>{p.name}</h2><p>{p.client||p.layout?.project?.client||'Personal design'} · {typeof p.updatedAt==='string'?new Date(p.updatedAt).toLocaleDateString():p.updatedAt?.toDate?.().toLocaleDateString()||'Just saved'}</p></Link><button className="project-remove" disabled={busy} onClick={()=>remove(p.id)} aria-label={`Remove ${p.name}`}>{confirm===p.id?'Confirm delete':'Remove'}</button>{confirm===p.id&&<button className="project-remove" onClick={()=>setConfirm(null)}>Cancel</button>}</article>)}</div>
  {cursor&&<button className="lux-button" disabled={loading} onClick={()=>load(cursor)}>Load more projects</button>}
 </main>;
}
export default function Projects(){return <AccountGate>{user=><ProjectList key={user.uid} user={user}/>}</AccountGate>;}
