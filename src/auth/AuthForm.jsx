'use client';
import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail,updateProfile,GoogleAuthProvider,signInWithPopup,sendEmailVerification} from 'firebase/auth';
import {firebase,firebaseConfigured,friendlyError} from '../lib/firebase';
import {demoMode,signInDemo} from '../lib/demo-auth';
import Wordmark from '../marketing/Wordmark';
import {siteUrl} from '../lib/site';
import {GoogleIcon} from '../components/Icon';

export default function AuthForm({mode='login'}){
 const router=useRouter();const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
 const [artReady,setArtReady]=useState(false);
 const signup=mode==='signup',reset=mode==='reset';
 async function submit(event){
  event.preventDefault();setMessage('');setError('');if(!demoMode&&!firebaseConfigured)return;
  const data=new FormData(event.currentTarget),email=String(data.get('email')).trim(),password=String(data.get('password')||'');
  if(signup&&password.length<8){setError('Use at least 8 characters for your password.');return;}
  setBusy(true);
  try{
   if(demoMode){if(reset){setMessage('Preview only: no email was sent. You can sign in with any demo password.');}else{await signInDemo({email,name:signup?String(data.get('name')).trim():undefined});router.push(signup?'/start':'/projects');}return;}
   const {auth}=firebase();
   if(reset){await sendPasswordResetEmail(auth,email,{url:`${siteUrl}/login`});setMessage('If that email has an account, a reset link is on its way.');}
   else if(signup){const {user}=await createUserWithEmailAndPassword(auth,email,password);await updateProfile(user,{displayName:String(data.get('name')).trim().slice(0,80)});sendEmailVerification(user,{url:`${siteUrl}/projects`}).catch(()=>{});router.push('/start');}
   else {await signInWithEmailAndPassword(auth,email,password);router.push('/projects');}
  }catch(err){if(reset&&err.code==='auth/user-not-found')setMessage('If that email has an account, a reset link is on its way.');else setError(friendlyError(err));}finally{setBusy(false);}
 }
 async function google(){setError('');setBusy(true);try{if(demoMode){await signInDemo({email:'designer@vela.example',name:'Preview Designer'});router.push('/projects');return;}await signInWithPopup(firebase().auth,new GoogleAuthProvider());router.push('/projects');}catch(err){setError(friendlyError(err));}finally{setBusy(false);}}
 return <main className="marketing auth-page auth-minimal auth-split"><header className="auth-header"><Wordmark/><Link href="/" className="auth-back">← Back to home</Link></header><div className={`auth-art ${artReady?'is-ready':''}`} aria-hidden="true"><img src="/images/auth/room-capsule.webp" alt="" width="1440" height="1080" fetchPriority="high" onLoad={()=>setArtReady(true)} ref={node=>{if(node?.complete&&node.naturalWidth)setArtReady(true);}}/></div><section className="auth-panel" aria-labelledby="auth-title"><div className="auth-form-wrap"><h1 id="auth-title">{signup?'Create an account':reset?'Reset password':'Welcome back'}</h1><p className="auth-intro">{signup?'A little space for your next idea.':reset?'We’ll email you a reset link.':'Sign in to your design space.'}</p>
 {!demoMode&&!firebaseConfigured&&<div className="form-notice" role="status">Account services are being prepared. You can explore the studio as a guest in the meantime.</div>}
 <>{demoMode&&<p className="auth-preview" role="status">Preview · passwords aren’t saved or checked. Projects stay on this device.</p>}</><form onSubmit={submit} className="lux-form">
 {signup&&<label>Your name<input name="name" autoComplete="name" maxLength={80} placeholder="Full name" required/></label>}
 <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required/></label>
 {!reset&&<label>Password<input name="password" type="password" autoComplete={signup?'new-password':'current-password'} minLength={signup?8:1} placeholder={signup?'At least 8 characters':'Your password'} required/></label>}
 {!signup&&!reset&&<Link className="forgot-link" href="/reset-password">Forgot password?</Link>}
 {error&&<p className="form-error" role="alert">{error}</p>}{message&&<p className="form-success" role="status">{message}</p>}
 <button className="lux-button lux-button-dark" disabled={busy||(!demoMode&&!firebaseConfigured)}>{busy?'Please wait…':signup?'Create your account':reset?'Send reset link':'Sign in'}</button>
 </form>
 {!reset&&<><div className="form-divider"><span>or</span></div><button className="google-button" onClick={google} disabled={busy||(!demoMode&&!firebaseConfigured)}><GoogleIcon/> {demoMode?"Try Google sign-in (preview)":"Continue with Google"}</button></>}
 <p className="auth-switch">{signup?'Already have an account? ':reset?'Remember your password? ':'New to Vela? '}<Link href={signup||reset?'/login':'/signup'}>{signup||reset?'Sign in':'Create an account'}</Link></p><Link href="/start?demo=1" className="guest-link">Explore without an account →</Link></div></section><footer className="auth-footer"><Link href="/terms">Terms</Link><span aria-hidden="true">·</span><Link href="/privacy">Privacy</Link><span aria-hidden="true">·</span><Link href="/#faq">Help</Link></footer></main>;
}
