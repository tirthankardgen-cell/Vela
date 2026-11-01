'use client';
const SESSION='vela-preview-session';
const PROFILES='vela-preview-profiles';
// Preview accounts must be explicitly enabled; missing config never creates fake accounts.
export const demoMode=process.env.NEXT_PUBLIC_AUTH_MODE==='demo';
export function readDemoSession(){try{return JSON.parse(sessionStorage.getItem(SESSION)||'null');}catch{return null;}}
export async function signInDemo({email,name}){
 const normalized=String(email).trim().toLowerCase();
 const profiles=JSON.parse(localStorage.getItem(PROFILES)||'{}');
 const key=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(normalized)))).map(v=>v.toString(16).padStart(2,'0')).join('').slice(0,24);
 const user={uid:`demo-${key}`,email:normalized,displayName:name||profiles[key]?.displayName||normalized.split('@')[0],isDemo:true};
 profiles[key]=user;localStorage.setItem(PROFILES,JSON.stringify(profiles));sessionStorage.setItem(SESSION,JSON.stringify(user));window.dispatchEvent(new Event('vela:session'));return user;
}
export function signOutDemo(){sessionStorage.removeItem(SESSION);window.dispatchEvent(new Event('vela:session'));}
// Passwords are deliberately never accepted by this module, compared, or stored.
