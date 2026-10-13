'use client';
import {useEffect} from 'react';

export default function LandingMotion(){
 useEffect(()=>{
  const root=document.querySelector('.landing');if(!root)return;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const reveals=[...root.querySelectorAll('[data-reveal]')];
  const images=[...root.querySelectorAll('[data-parallax]')];
  let frame=0;
  const observer=typeof IntersectionObserver==='undefined'?null:new IntersectionObserver(entries=>{
   entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('reveal-pending');entry.target.classList.add('reveal-shown');observer.unobserve(entry.target);}});
  },{threshold:.08,rootMargin:'0px 0px -24px 0px'});
  function draw(){
   frame=0;
   const range=document.documentElement.scrollHeight-innerHeight;
   root.style.setProperty('--scroll-progress',String(range>0?Math.min(1,Math.max(0,scrollY/range)):0));
   images.forEach(img=>{
    if(preference.matches){img.style.removeProperty('--parallax-y');return;}
    const rect=img.parentElement.getBoundingClientRect();
    if(rect.bottom>0&&rect.top<innerHeight)img.style.setProperty('--parallax-y',`${Math.max(-32,Math.min(32,(innerHeight/2-rect.top-rect.height/2)*.065))}px`);
   });
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(draw);}
  function configure(){
   observer?.disconnect();
   reveals.forEach(el=>{el.classList.remove('reveal-pending');if(!preference.matches&&observer&&el.getBoundingClientRect().top>=innerHeight){el.classList.add('reveal-pending');observer.observe(el);}});
   draw();
  }
  configure();window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);preference.addEventListener('change',configure);
  return()=>{observer?.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);preference.removeEventListener('change',configure);reveals.forEach(el=>el.classList.remove('reveal-pending'));images.forEach(img=>img.style.removeProperty('--parallax-y'));};
 },[]);
 return null;
}
