'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import AccountGate from '../auth/AccountGate';
import {demoMode} from '../lib/demo-auth';
import {demoProjectStore} from '../lib/demo-projects';
import {projectStore} from '../lib/projects';
import {friendlyError} from '../lib/firebase';
import App from '../App';

function Workspace({user,guest,newSpace,projectId}){
 const [setup,setSetup]=useState(null),[error,setError]=useState('');
 useEffect(()=>{let cancelled=false;async function load(){try{const owner=user?.uid||'guest',key=`vela-new-room:${owner}`,pending=newSpace?sessionStorage.getItem(key):null,store=user?(demoMode?demoProjectStore(user.uid):projectStore(user.uid)):null;const initialLayout=pending?JSON.parse(pending):projectId&&store?await store.get(projectId):null;if(!cancelled){setSetup({owner,store,initialLayout,pendingKey:pending?key:null});}}catch(err){if(!cancelled)setError('We couldn’t open this project. Please return to your projects and try again.');}}load();return ()=>{cancelled=true;};},[user?.uid,guest,newSpace,projectId]);
 if(error)return <main className="marketing route-loading"><p role="alert">{error}</p><Link href={guest?'/start?demo=1':'/projects'}>Return to projects</Link></main>;
 if(!setup)return <main className="marketing route-loading"><p>Preparing your space…</p></main>;
 return <div id="root"><App owner={setup.owner} store={setup.store} initialLayout={setup.initialLayout} onStarted={()=>{if(setup.pendingKey)sessionStorage.removeItem(setup.pendingKey);}}/></div>;
}
export default function ClientStudio({guest=false,newSpace=false,projectId=null}){return <AccountGate guest={guest}>{user=><Workspace user={user} guest={guest} newSpace={newSpace} projectId={projectId}/>}</AccountGate>;}
