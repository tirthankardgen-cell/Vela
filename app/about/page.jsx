import {publicMetadata} from '@/src/lib/site';
import Link from 'next/link';
import PublicLinks from '@/src/marketing/PublicLinks';
import SiteHeader from '@/src/marketing/SiteHeader';
import Wordmark from '@/src/marketing/Wordmark';
import Icon from '@/src/components/Icon';
import JsonLd from '@/src/marketing/JsonLd';
import {pageGraph} from '@/src/lib/structured-data';
import '@/src/marketing/landing.css';
import './about.css';

const description='Meet Vela: a thoughtful place to plan rooms, explore layouts and imagine a home that feels like you.';
export const metadata=publicMetadata('About',description,'/about');
export default function About(){
 return <main className="marketing landing about-page">
  <JsonLd data={pageGraph({title:'About Vela',description,path:'/about',type:'AboutPage'})}/>
  <section className="about-hero" aria-labelledby="about-title">
   <SiteHeader activePage="about"/>
   <div className="about-heading landing-width"><span className="lux-kicker">THE IDEA BEHIND VELA</span><h1 id="about-title">A little intention.<br/><em>A place to belong.</em></h1><p>We believe a beautiful room begins with the way you want to live. Vela gives those ideas a place to take shape.</p></div>
  </section>
  <section className="about-story about-product landing-width" aria-labelledby="about-product-title"><div><span className="lux-kicker">THE PRODUCT TODAY</span><h2 id="about-product-title">A practical place<br/><em>to begin.</em></h2><p>Vela is a browser-based 2D and 3D concept planner. The current free planner includes measured room layouts, eight furnished flat templates and design exports. Configured accounts can save private plans in Firestore and reopen them on another device. Guests, recovery drafts and tracing images remain in the browser; keep JSON backups and check save status.</p><p>Our <Link href="/blog">planning guides</Link> explain measured layouts and the features available in the current product. Editorial interior images are AI-created inspiration, while the studio uses schematic models. We distinguish those examples so you can choose tools with clear expectations.</p><p>Have a product or privacy question? <Link href="/contact">Contact Vela</Link> at <a href="mailto:contact@velastudio.space">contact@velastudio.space</a>.</p></div></section>
  <section className="about-story landing-width" aria-labelledby="about-story-title">
   <figure><img src="/images/vela-bedroom.webp" width="1536" height="1024" alt="An inviting bedroom with natural wood, soft linen and an olive reading chair"/><figcaption>AI-created interior inspiration, not a Vela rendering.</figcaption></figure>
   <div><span className="lux-kicker">SPACE, WITH INTENTION</span><h2 id="about-story-title">Your everyday.<br/><em>Reimagined.</em></h2><p>A comfortable corner. A clearer path through the room. A table with space for everyone. Good design begins with small, personal decisions.</p><p>Start with your measurements or a floor plan, explore furniture arrangements, and see your space from a new perspective. From a single room to a whole flat, Vela helps you consider how the pieces fit together.</p></div>
  </section>
  <section className="about-values landing-width" aria-label="Our approach">
   {[
    ['home','Life comes first.','Design around your routines, your favourite things and the people you share your space with.'],
    ['plan','Clarity at every step.','Explore proportions and layouts in 2D, then look at your arrangement in 3D. Refine it at your own pace.'],
    ['palette','Room for your perspective.','A home can look a thousand different ways. Start in feet, inches or centimetres, and make the details your own.'],
   ].map(([icon,title,copy])=><article key={title}><Icon name={icon} size={28}/><h3>{title}</h3><p>{copy}</p></article>)}
  </section>
  <section className="landing-closing"><span className="lux-kicker">MAKE ROOM FOR POSSIBILITY</span><h2>Your space.<br/><em>Your story.</em></h2><Link className="lux-button lux-button-light" href="/signup">Begin your space <Icon name="arrow" size={18}/></Link></section>
  <footer className="landing-footer landing-width"><Wordmark/><nav aria-label="Footer navigation"><Link href="/">Home</Link><Link href="/#inspiration">Inspiration</Link><Link href="/about" aria-current="page">About</Link><Link href="/login">Sign in</Link></nav><PublicLinks/><div className="footer-bottom"><small>© {new Date().getFullYear()} Vela</small><span>DESIGNED AROUND YOU</span></div></footer>
 </main>;
}
