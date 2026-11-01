'use client';
import {useEffect,useState} from 'react';
import {onAuthStateChanged} from 'firebase/auth';
import {firebase,firebaseConfigured,friendlyError} from '../lib/firebase';
import {demoMode,readDemoSession} from '../lib/demo-auth';
export function useSession(){
 const [session,setSession]=useState({loading:true,user:null,configured:demoMode||firebaseConfigured});
 useEffect(()=>{
  if(demoMode){const update=()=>setSession({loading:false,user:readDemoSession(),configured:true,isDemo:true});update();window.addEventListener('vela:session',update);return ()=>window.removeEventListener('vela:session',update);}
  if(!firebaseConfigured){setSession({loading:false,user:null,configured:false});return;}
  const fail=error=>setSession({loading:false,user:null,configured:true,error:friendlyError(error)});
  try{return onAuthStateChanged(firebase().auth,user=>setSession({loading:false,user,configured:true}),fail);}catch(error){fail(error);}
 },[]);
 return session;
}
