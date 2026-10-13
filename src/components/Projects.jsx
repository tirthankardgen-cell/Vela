'use client';
import {useEffect,useState,useMemo} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {signOut} from 'firebase/auth';
import {firebase,friendlyError} from '../lib/firebase';
import {demoMode,signOutDemo} from '../lib/demo-auth';
import {demoProjectStore} from '../lib/demo-projects';
import {projectStore} from '../lib/projects';
import AccountGate from '../auth/AccountGate';
import Wordmark from '../marketing/Wordmark';
function ProjectList({user}){const router=useRouter(),store=useMemo(()=>demoMode?demoProjectStore(user.uid):projectStore(user.uid),[user.uid]);const [projects,setProjects]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[confirm,setConfirm]=useState(null);
 const load=()=>{setError('');setLoading(true);return store.list().then(setProjects).catch(e=>setError(friendlyError(e))).finally(()=>setLoading(false));};
 useEffect(()=>{load();},[store]);
 async function remove(id){if(confirm!==id){setConfirm(id);return;}try{await store.remove(id);setProjects(projects.filter(p=>p.id!==id));setConfirm(null);}catch(e){setError(friendlyError(e));}}
 return <main className="marketing projects-page"><header className="setup-header"><Wordmark/><div className="projects-account"><span>{user.displayName||user.email}</span><button onClick={async()=>{if(demoMode)signOutDemo();else await signOut(firebase().auth);router.replace('/login');}}>Sign out</button></div></header><section className="projects-heading"><div><span className="lux-kicker">YOUR PERSONAL ATELIER</span><h1>Room for <em>your ideas.</em></h1><p>{demoMode?"Preview workspace · your projects are saved on this device.":"A collection of spaces, each with a story to tell."}</p></div><Link href="/start" className="lux-button lux-button-dark">New space <span>+</span></Link></section>{error&&<div className="form-error" role="alert">{error} <button onClick={load}>Try again</button></div>}{loading?<p>Opening your collection…</p>:<div className="cloud-project-grid"><Link className="new-project-card" href="/start"><span>+</span><h2>Begin a new space.</h2><p>From a floor plan or a blank canvas.</p></Link>{projects.map(p=><article className="cloud-project-card" key={p.id}><Link href={`/studio?project=${encodeURIComponent(p.id)}`}><div className="project-drawing">⌑<span>{p.layout?.items?.length||0} PIECES</span></div><h2>{p.name}</h2><p>{p.layout?.project?.client||'Personal design'} · {typeof p.updatedAt==='string'?new Date(p.updatedAt).toLocaleDateString():p.updatedAt?.toDate?.().toLocaleDateString()||'Just saved'}</p></Link><button className="project-remove" onClick={()=>remove(p.id)} aria-label={`Remove ${p.name}`}>{confirm===p.id?'Confirm delete':'Remove'}</button>{confirm===p.id&&<button className="project-remove" onClick={()=>setConfirm(null)}>Cancel</button>}</article>)}</div>}</main>;
}
export default function Projects(){return <AccountGate>{user=><ProjectList user={user}/>}</AccountGate>;}
