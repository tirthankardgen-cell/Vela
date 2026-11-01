'use client';
import {useEffect,useRef,useState} from 'react';
import {usePathname} from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import {adsenseClient,isPublicPath,siteUrl} from '../lib/site';
import './consent.css';

const storageKey='vela-cookie-preferences-v1';
const maxAge=180*24*60*60*1000;
const analyticsId=/^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID||'')?process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID:null;
const adsEnabled=process.env.NEXT_PUBLIC_ADSENSE_ENABLED==='true';
const servicesEnabled=Boolean(analyticsId||adsEnabled);
function readPreferences(){
 try {const value=JSON.parse(localStorage.getItem(storageKey)||'null');return value&&typeof value.analytics==='boolean'&&typeof value.advertising==='boolean'&&typeof value.savedAt==='number'&&value.savedAt<=Date.now()&&Date.now()-value.savedAt<maxAge?value:null;}catch{return null;}
}
function removeMeasurementCookies(){
 const domains=['',location.hostname,`.${location.hostname}`,'.velastudio.space'];
 for(const entry of document.cookie.split(';')){
  const name=entry.split('=')[0].trim();if(!/^(_ga(?:_|$)|_gid$|_gat|_gcl_|__gads$|__gpi$|__eoi$)/.test(name))continue;
  for(const domain of domains)document.cookie=`${name}=; Max-Age=0; Path=/;${domain?` Domain=${domain};`:''} SameSite=Lax; Secure`;
 }
}
export default function GoogleServices({blogPaths=[]}){
 const pathname=usePathname();const publicPage=isPublicPath(pathname,blogPaths);
 const [preferences,setPreferences]=useState(null),[loaded,setLoaded]=useState(false),[show,setShow]=useState(false),[customise,setCustomise]=useState(false);
 const [analytics,setAnalytics]=useState(false),[advertising,setAdvertising]=useState(false),[analyticsReady,setAnalyticsReady]=useState(false);
 const lastPage=useRef(null),tagsLoaded=useRef(false);
 useEffect(()=>{
  if(!servicesEnabled)return;
  function sync(event){
   if(event&&event.key!==storageKey&&event.key!==null)return;
   const value=readPreferences();
   if(event&&tagsLoaded.current){window.gtag?.('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});removeMeasurementCookies();location.reload();return;}
   setPreferences(value);setAnalytics(value?.analytics||false);setAdvertising(value?.advertising||false);setShow(!value);setLoaded(true);
  }
  sync();window.addEventListener('storage',sync);
  return()=>window.removeEventListener('storage',sync);
 },[]);
 // A fresh document keeps advertising scripts out of the account and project workspace.
 useEffect(()=>{
  if(!servicesEnabled||!publicPage)return;
  function navigate(event){
   if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const anchor=event.target.closest?.('a[href]');if(!anchor||anchor.target||anchor.hasAttribute('download'))return;
   const url=new URL(anchor.href,location.href);
   if(url.origin===location.origin&&!isPublicPath(url.pathname,blogPaths)){
    event.preventDefault();event.stopPropagation();location.assign(url.href);
   }
  }
  document.addEventListener('click',navigate,true);return()=>document.removeEventListener('click',navigate,true);
 },[publicPage,blogPaths]);
 useEffect(()=>{
  if(!analyticsId)return;
  window[`ga-disable-${analyticsId}`]=!publicPage||!preferences?.analytics;
  if(!analyticsReady||!publicPage||!preferences?.analytics||lastPage.current===pathname)return;
  lastPage.current=pathname;
  window.gtag?.('event','page_view',{send_to:analyticsId,page_location:`${siteUrl}${pathname}`,page_title:document.title,page_referrer:''});
 },[pathname,publicPage,preferences,analyticsReady]);
 useEffect(()=>{
  if(loaded&&preferences&&((analyticsId&&preferences.analytics)||(adsEnabled&&preferences.advertising)))tagsLoaded.current=true;
 },[loaded,preferences]);
 function save(next){
  const value={analytics:Boolean(analyticsId&&next.analytics),advertising:Boolean(adsEnabled&&next.advertising),savedAt:Date.now()};
  try{localStorage.setItem(storageKey,JSON.stringify(value));}catch{/* Session choice still applies if storage is unavailable. */}
  const changed=preferences?.analytics!==value.analytics||preferences?.advertising!==value.advertising;
  if(tagsLoaded.current&&changed){
   window.gtag?.('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
   removeMeasurementCookies();location.reload();return;
  }
  setPreferences(value);setShow(false);setCustomise(false);
 }
 if(!servicesEnabled||!publicPage||!loaded)return null;
 return <>
  {preferences?.analytics&&analyticsId&&<>
   <Script id="vela-analytics-consent" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});window.gtag('js',new Date());window.gtag('config','${analyticsId}',{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:'${siteUrl}${pathname}',page_referrer:''});`}</Script>
   <Script id="vela-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} strategy="afterInteractive" onReady={()=>setAnalyticsReady(true)}/>
  </>}
  {preferences?.advertising&&adsEnabled&&<Script id="vela-adsense" async strategy="afterInteractive" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`} crossOrigin="anonymous"/>}
  {show?<section className="cookie-panel" role="region" aria-labelledby="cookie-title">
   <h2 id="cookie-title">Your privacy choices</h2><p>Vela uses browser storage to keep your projects and privacy choices. With your permission, {analyticsId&&'Google Analytics measures visits'}{analyticsId&&adsEnabled&&' and '}{adsEnabled&&'Google AdSense can show ads on public pages'}. You can change your choice at any time. <Link href="/cookies">Cookie details</Link></p>
   {customise&&<div className="cookie-options"><label><input type="checkbox" checked disabled/> Necessary project storage</label>{analyticsId&&<label><input type="checkbox" checked={analytics} onChange={e=>setAnalytics(e.target.checked)}/> Visit analytics</label>}{adsEnabled&&<label><input type="checkbox" checked={advertising} onChange={e=>setAdvertising(e.target.checked)}/> Advertising</label>}</div>}
   <div className="cookie-actions"><button onClick={()=>save({analytics:false,advertising:false})}>Necessary only</button>{customise?<button onClick={()=>save({analytics,advertising})}>Save choices</button>:<button onClick={()=>{setAnalytics(preferences?.analytics||false);setAdvertising(preferences?.advertising||false);setCustomise(true);}}>Customise</button>}<button onClick={()=>save({analytics:true,advertising:true})}>Accept all</button></div>
  </section>:<button className="cookie-settings" onClick={()=>{setAnalytics(preferences?.analytics||false);setAdvertising(preferences?.advertising||false);setCustomise(true);setShow(true);}}>Privacy choices</button>}
 </>;
}
