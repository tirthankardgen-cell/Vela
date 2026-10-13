'use client';
import {getApp,getApps,initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const config={
 apiKey:process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
 authDomain:process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
 projectId:process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
 storageBucket:process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
 messagingSenderId:process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
 appId:process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
export const firebaseConfigured=Boolean(config.apiKey&&config.authDomain&&config.projectId&&config.storageBucket&&config.appId);
let services;
export function firebase(){
 if(!firebaseConfigured)throw new Error('Account services are temporarily unavailable. Please try again later.');
 if(!services){const app=getApps().length?getApp():initializeApp(config);services={auth:getAuth(app),db:getFirestore(app),storage:getStorage(app)};}
 return services;
}
export function friendlyError(error){
 const messages={
 'auth/invalid-credential':'That email and password did not match. Please try again.',
 'auth/email-already-in-use':'An account already uses this email. Sign in instead.',
 'auth/weak-password':'Choose a password with at least 8 characters.',
 'auth/too-many-requests':'Too many attempts. Please wait a moment and try again.',
 'auth/network-request-failed':'Check your connection and try again.',
 'auth/unauthorized-domain':'Sign-in is not available on this domain yet. Please try the main Vela website.',
 'auth/operation-not-allowed':'This sign-in method is not available yet.',
 'auth/popup-closed-by-user':'The sign-in window was closed. You can try again.',
 'auth/popup-blocked':'Allow the sign-in popup, or sign in with your email.',
 'permission-denied':'This project could not be saved. Check your account access and try again.',
 'storage/unauthorized':'The floor plan could not be uploaded. Check your account access and try again.',
 };
 return messages[error?.code]||'We couldn’t complete that request. Please try again.';
}
