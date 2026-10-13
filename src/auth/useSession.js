'use client';
import {useEffect,useState} from 'react';
import {onAuthStateChanged} from 'firebase/auth';
import {firebase,firebaseConfigured} from '../lib/firebase';
import {demoMode,readDemoSession} from '../lib/demo-auth';
export function useSession(){
 const [session,setSession]=useState({loading:true,user:null,configured:demoMode||firebaseConfigured});
 useEffect(()=>{
  if(demoMode){const update=()=>setSession({loading:false,user:readDemoSession(),configured:true,isDemo:true});update();window.addEventListener('vela:session',update);return ()=>window.removeEventListener('vela:session',update);}
  if(!firebaseConfigured){setSession({loading:false,user:null,configured:false});return;}
  return onAuthStateChanged(firebase().auth,user=>setSession({loading:false,user,configured:true}),()=>setSession({loading:false,user:null,configured:true}));
 },[]);
 return session;
}
