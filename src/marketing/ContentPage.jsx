import Link from 'next/link';
import SiteHeader from './SiteHeader';
import PublicLinks from './PublicLinks';
import Wordmark from './Wordmark';
import JsonLd from './JsonLd';
import {pageGraph} from '../lib/structured-data';
import '@/src/marketing/landing.css';
import './content.css';

export default function ContentPage({title,description,path,kicker='VELA / PLAN WITH CLARITY',type,items=[],children}) {
 return <main className="marketing landing content-page">
  <SiteHeader activePage={path.slice(1).split('/')[0]}/>
  <JsonLd data={pageGraph({title,description,path,type,items})}/>
  <div className="content-shell landing-width">
   <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link>{items.map(item=><Link key={item.path} href={item.path}>{item.name}</Link>)}<span aria-current="page">{title}</span></nav>
   <header className="content-heading"><span className="lux-kicker">{kicker}</span><h1>{title}</h1><p>{description}</p></header>
   {children}
  </div>
  <footer className="landing-footer landing-width"><div><Wordmark/><p>Thoughtful spaces.<br/>Beautifully presented.</p></div><PublicLinks/><div className="footer-bottom"><small>© {new Date().getFullYear()} Vela</small><a href="mailto:contact@velastudio.space">contact@velastudio.space</a></div></footer>
 </main>;
}

export function PlanningCta() {
 return <section className="content-cta"><div><span className="lux-kicker">MAKE ROOM FOR YOUR IDEA</span><h2>Start with your space.</h2><p>Bring your measurements, compare arrangements and keep an editable backup.</p></div><Link href="/signup" className="lux-button lux-button-dark">Open Vela →</Link></section>;
}
