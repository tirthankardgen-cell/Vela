'use client';
import {getApp,getApps,initializeApp} from 'firebase/app';
import {getAuth,connectAuthEmulator} from 'firebase/auth';
import {getFirestore,connectFirestoreEmulator} from 'firebase/firestore';

const config={
 apiKey:process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
 authDomain:process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
 projectId:process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
 messagingSenderId:process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
 appId:process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
export const firebaseConfigured=Boolean(config.apiKey&&config.authDomain&&config.projectId&&config.appId);
let services;
export function firebase(){
 if(!firebaseConfigured)throw new Error('Account services are temporarily unavailable. Please try again later.');
 if(!services){
  const app=getApps().length?getApp():initializeApp(config);
  const auth=getAuth(app),db=getFirestore(app);
  // Explicit, development-only opt-in. Production bundles cannot connect to emulators.
  if(process.env.NODE_ENV==='development'&&process.env.NEXT_PUBLIC_FIREBASE_EMULATORS==='true'&&!globalThis.__velaEmulators){
   connectAuthEmulator(auth,'http://127.0.0.1:9099');connectFirestoreEmulator(db,'127.0.0.1',8080);globalThis.__velaEmulators=true;
  }
  services={auth,db};
 }
 return services;
}
export function friendlyError(error){
 const messages={
 'auth/invalid-credential':'That email and password did not match. Please try again.',
 'auth/invalid-email':'Enter a valid email address.',
 'auth/user-not-found':'That email and password did not match. Please try again.',
 'auth/wrong-password':'That email and password did not match. Please try again.',
 'auth/user-disabled':'This account is disabled. Please contact support.',
 'auth/password-does-not-meet-requirements':'Choose a stronger password that meets the account password policy.',
 'auth/account-exists-with-different-credential':'This email uses another sign-in method. Sign in with that method first.',
 'auth/email-already-in-use':'An account already uses this email. Sign in instead.',
 'auth/weak-password':'Choose a password with at least 8 characters.',
 'auth/too-many-requests':'Too many attempts. Please wait a moment and try again.',
 'auth/network-request-failed':'Check your connection and try again.',
 'auth/unauthorized-domain':'Sign-in is not available on this domain yet. Please try the main Vela website.',
 'auth/operation-not-allowed':'This sign-in method is not available yet.',
 'auth/popup-closed-by-user':'The sign-in window was closed. You can try again.',
 'auth/popup-blocked':'Allow the sign-in popup, or sign in with your email.',
 'permission-denied':'This project could not be saved. Check your account access and try again.',
 'unavailable':'Cloud storage is unavailable. Your browser draft is kept; reconnect and try again.',
 'project/conflict':'This project changed on another device or tab. Export your edits, then reopen the cloud version. You can also recover your draft as a separate project.',
 'project/not-found':'This project no longer exists. You can recover a browser draft from your projects.',
 'project/too-large':'This project is too large to sync. Export a JSON backup and reduce its size.',
 'project/invalid':'This project file is invalid. Please import a valid Vela layout.',
 };
 return messages[error?.code]||'We couldn’t complete that request. Please try again.';
}
