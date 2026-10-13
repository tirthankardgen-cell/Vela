'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useSession} from './useSession';
export default function AccountGate({guest=false,children}){
 const session=useSession(),router=useRouter();
 useEffect(()=>{if(!guest&&!session.loading&&!session.user)router.replace('/login');},[guest,session.loading,session.user,router]);
 if(!guest&&(session.loading||!session.user))return <main className="marketing route-loading" aria-live="polite"><span className="lux-kicker">VELA STUDIO</span><p>Opening your workspace…</p></main>;
 return children(guest?null:session.user);
}
