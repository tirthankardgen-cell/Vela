'use client';
import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail,updateProfile,GoogleAuthProvider,signInWithPopup,sendEmailVerification} from 'firebase/auth';
import {firebase,firebaseConfigured,friendlyError} from '../lib/firebase';
import {demoMode,signInDemo} from '../lib/demo-auth';
import Wordmark from '../marketing/Wordmark';
import {GoogleIcon} from '../components/Icon';

export default function AuthForm({mode='login'}){
 const router=useRouter();const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
 const signup=mode==='signup',reset=mode==='reset';
 async function submit(event){
  event.preventDefault();setMessage('');setError('');if(!demoMode&&!firebaseConfigured)return;
  const data=new FormData(event.currentTarget),email=String(data.get('email')).trim(),password=String(data.get('password')||'');
  if(signup&&password.length<8){setError('Use at least 8 characters for your password.');return;}
  setBusy(true);
  try{
   if(demoMode){if(reset){setMessage('Preview only: no email was sent. You can sign in with any demo password.');}else{await signInDemo({email,name:signup?String(data.get('name')).trim():undefined});router.push(signup?'/start':'/projects');}return;}
   const {auth}=firebase();
   if(reset){await sendPasswordResetEmail(auth,email,{url:'https://vela-dgen.vercel.app/login'});setMessage('If that email has an account, a reset link is on its way.');}
   else if(signup){const {user}=await createUserWithEmailAndPassword(auth,email,password);await updateProfile(user,{displayName:String(data.get('name')).trim().slice(0,80)});sendEmailVerification(user).catch(()=>{});router.push('/start');}
   else {await signInWithEmailAndPassword(auth,email,password);router.push('/projects');}
  }catch(err){setError(friendlyError(err));}finally{setBusy(false);}
 }
 async function google(){setError('');setBusy(true);try{if(demoMode){await signInDemo({email:'designer@vela.example',name:'Preview Designer'});router.push('/projects');return;}await signInWithPopup(firebase().auth,new GoogleAuthProvider());router.push('/projects');}catch(err){setError(friendlyError(err));}finally{setBusy(false);}}
 return <main className="marketing auth-page"><section className="auth-story"><Wordmark/><div><span className="lux-kicker">YOUR SPACE. YOUR POINT OF VIEW.</span><h1>Beautiful things<br/>begin with<br/><em>a little space.</em></h1><p>Bring your ideas, your measurements, and your imagination. We’ll make room for them.</p></div><span className="auth-story-footer">VELA / A MORE CONSIDERED HOME</span></section><section className="auth-panel"><Link href="/" className="auth-back">← Back to Vela</Link><div className="auth-form-wrap"><span className="lux-kicker">{signup?'BEGIN SOMETHING BEAUTIFUL':reset?'A FRESH START':'YOUR PERSONAL DESIGN STUDIO'}</span><h2>{signup?'Make yourself at home.':reset?'Reset your password.':'Welcome back.'}</h2><p>{signup?'Create an account to save your spaces and return to every detail.':reset?'Enter your email and we’ll send a password reset link.':'Your ideas are right where you left them.'}</p>
 {!demoMode&&!firebaseConfigured&&<div className="form-notice" role="status">Account services are being prepared. You can explore the studio as a guest in the meantime.</div>}
 <>{demoMode&&<div className="form-notice" role="status">Preview mode · this simulates an account. Passwords are not checked or saved, and projects stay on this device.</div>}</><form onSubmit={submit} className="lux-form">
 {signup&&<label>Your name<input name="name" autoComplete="name" maxLength={80} placeholder="Full name" required/></label>}
 <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required/></label>
 {!reset&&<label>Password<input name="password" type="password" autoComplete={signup?'new-password':'current-password'} minLength={signup?8:1} placeholder={signup?'At least 8 characters':'Your password'} required/></label>}
 {!signup&&!reset&&<Link className="forgot-link" href="/reset-password">Forgot password?</Link>}
 {error&&<p className="form-error" role="alert">{error}</p>}{message&&<p className="form-success" role="status">{message}</p>}
 <button className="lux-button lux-button-dark" disabled={busy||(!demoMode&&!firebaseConfigured)}>{busy?'Please wait…':signup?'Create your account':reset?'Send reset link':'Sign in'} <span>↗</span></button>
 </form>
 {!reset&&<><div className="form-divider"><span>or</span></div><button className="google-button" onClick={google} disabled={busy||(!demoMode&&!firebaseConfigured)}><GoogleIcon/> {demoMode?"Try Google sign-in (preview)":"Continue with Google"}</button></>}
 <p className="auth-switch">{signup?'Already feel at home? ':reset?'Remember your password? ':'New to Vela? '}<Link href={signup||reset?'/login':'/signup'}>{signup||reset?'Sign in':'Create an account'}</Link></p><Link href="/start?demo=1" className="guest-link">Explore without an account →</Link><p className="auth-small">Guest projects stay on this device. {demoMode?"Preview accounts and projects are local simulations.":"Account projects save to your private cloud workspace."}</p></div></section></main>;
}
