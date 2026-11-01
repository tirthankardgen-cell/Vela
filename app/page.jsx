import Link from 'next/link';
import {faqs} from '@/src/lib/faq';
import {siteUrl} from '@/src/lib/site';
import {faqSchema} from '@/src/lib/structured-data';
import {posts} from '@/src/lib/blog';
import JsonLd from '@/src/marketing/JsonLd';
import BlogCard from '@/src/marketing/BlogCard';
import PublicLinks from '@/src/marketing/PublicLinks';
import SiteHeader from '@/src/marketing/SiteHeader';
import Wordmark from '@/src/marketing/Wordmark';
import Icon from '@/src/components/Icon';
import LandingMotion from '@/src/marketing/LandingMotion';
import '@/src/marketing/landing.css';
import '@/src/marketing/content.css';

const possibilities=[
 {icon:'plan',number:'01',title:'Start with what’s yours.',copy:'A room, a floor plan, a fresh perspective. Bring your measurements in feet, inches or centimetres.'},
 {icon:'palette',number:'02',title:'Find your own balance.',copy:'Explore arrangements, choose a palette and consider the details that make a space feel like you.'},
 {icon:'present',number:'03',title:'Bring the idea together.',copy:'Move between 2D and 3D, collect your finishes and prepare a considered design presentation.'},
];
export default function Home(){return <main className="marketing landing">
<JsonLd data={{'@context':'https://schema.org','@graph':[{'@type':'SoftwareApplication','@id':siteUrl+'/#planner',name:'Vela',url:siteUrl,applicationCategory:'DesignApplication',operatingSystem:'Web browser',description:'Plan a home concept, arrange furniture, colour walls and export 2D and 3D designs in the current free preview.',isAccessibleForFree:true,publisher:{'@id':siteUrl+'/#organization'}},faqSchema(faqs,'/')]}}/>
<LandingMotion/><div className="reading-progress" aria-hidden="true"/>
<section className="editorial-hero" aria-labelledby="home-title">
 <SiteHeader/>
 <div className="hero-photograph"><img src="/images/vela-interior.webp" alt="Sunlit living room with an ivory sofa, olive lounge chair, walnut table and soft linen curtains" width="1800" height="1200" fetchPriority="high" data-parallax/></div>
 <div className="hero-shade"/><div className="editorial-hero-copy"><span className="lux-kicker">A MORE CONSIDERED HOME</span><h1 id="home-title">Good spaces.<br/><em>Beautiful living.</em></h1><p>Plan your room or flat in 2D. Explore it in 3D.<br/>Vela gives your next home idea a place to take shape.</p><Link href="/signup" className="lux-button hero-cta">Begin your space <Icon name="arrow" size={18}/></Link></div>
 <div className="hero-bottom"><span>VELA / SPACE, WITH INTENTION</span><a href="#inspiration">Discover a different perspective <Icon name="down" size={16}/></a><span>01 — THE LIVING ROOM</span></div>
</section>
<section className="landing-intro landing-width" data-reveal><span className="lux-kicker">THOUGHTFUL BY DESIGN</span><div><h2>More than a room.<br/><em>A reflection of you.</em></h2><p>The quiet corner. The table everyone gathers around. The light at the end of the day. Beautiful spaces begin with the things that matter to you.</p></div><div className="intro-signature"><Icon name="sparkle" size={34}/><span>Imagine freely.<br/>Design thoughtfully.</span></div></section>
<section id="inspiration" className="inspiration-section landing-width"><div className="landing-section-heading" data-reveal><div><span className="lux-kicker">A FEW PLACES TO BEGIN</span><h2>Find your <em>feeling.</em></h2></div><p>Warm textures. Natural light. Room to breathe.<br/>Consider the possibilities.</p></div>
 <div className="inspiration-grid"><article className="inspiration-card" data-reveal><div className="inspiration-image bedroom-image"><img src="/images/vela-bedroom.webp" alt="A calm bedroom with ivory linen, walnut furniture and an olive reading chair" width="1536" height="1024" loading="lazy" data-parallax/><span>01 / REST</span></div><div className="inspiration-caption"><div><h3>A softer kind of sanctuary.</h3><p>Quiet mornings. Unhurried evenings.</p></div><Icon name="arrow" size={22}/></div></article>
 <article className="inspiration-card kitchen-card" data-reveal><div className="inspiration-image"><img src="/images/vela-kitchen.webp" alt="A warm kitchen with a travertine island, olive cabinetry and walnut joinery" width="1536" height="1024" loading="lazy" data-parallax/><span>02 / GATHER</span></div><div className="inspiration-caption"><div><h3>Where life comes together.</h3><p>Everyday rituals, beautifully considered.</p></div><Icon name="arrow" size={22}/></div></article></div>
 <p className="image-provenance">Interior inspiration · AI-created imagery, not Vela renderings.</p>
</section>
<section id="possibilities" className="possibilities-section"><div className="landing-width"><div className="landing-section-heading" data-reveal><div><span className="lux-kicker">FROM INSPIRATION TO INTENTION</span><h2>Your ideas.<br/><em>A little more clarity.</em></h2></div><p>A thoughtful set of tools, giving your imagination<br/>a place to take shape.</p></div><div className="possibility-grid">{possibilities.map(item=><article key={item.number} data-reveal><div className="possibility-top"><Icon name={item.icon} size={30}/><span>{item.number}</span></div><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div></div></section>
<section className="material-story landing-width"><div className="material-visual" data-reveal><div className="material-image"><img src="/images/vela-interior.webp" alt="Ivory upholstery and natural wood textures in a softly lit living room" width="1800" height="1200" loading="lazy" data-parallax/></div><div className="material-note"><span className="swatch-dot" style={{background:'#3e4736'}}/><span className="swatch-dot" style={{background:'#ddd3bd'}}/><span className="swatch-dot" style={{background:'#978365'}}/><span>OLIVE / LINEN / CHAMPAGNE</span></div></div><div className="material-copy" data-reveal><span className="lux-kicker">IT’S ALL IN THE DETAILS</span><h2>Texture. Tone.<br/><em>A sense of belonging.</em></h2><p>A considered palette changes how a room feels. Start with natural tones, explore a different arrangement, and let the details find their place.</p><a className="landing-text-link" href="#process">See how it comes together <Icon name="arrow" size={17}/></a></div></section>
<section id="process" className="landing-process landing-width"><div data-reveal><span className="lux-kicker">A SIMPLE APPROACH</span><h2>Something beautiful,<br/><em>one step at a time.</em></h2></div><ol>{[
 ['Make room.','Begin with your dimensions or upload a floor plan as a reference.'],
 ['Make it yours.','Arrange your space, consider the proportions and refine your palette.'],
 ['See it together.','Explore the design in 3D, then save a layout or share a presentation.'],
 ].map(([title,copy],i)=><li key={title} data-reveal><span>0{i+1}</span><div><h3>{title}</h3><p>{copy}</p></div><Icon name="arrow" size={18}/></li>)}</ol></section>
<section id="journal" className="testimonials-section"><div className="landing-width"><div className="landing-section-heading" data-reveal><div><span className="lux-kicker">THE PLANNING JOURNAL</span><h2>A clearer plan.<br/><em>A thoughtful beginning.</em></h2></div><p>Practical guides for measuring your space,<br/>choosing a layout and keeping your work.</p></div><div className="blog-grid">{posts.slice(0,3).map(post=><BlogCard key={post.slug} post={post}/>)}</div><Link className="landing-text-link" href="/blog">Explore all planning guides →</Link></div></section>
<section id="faq" className="landing-faq landing-width" aria-labelledby="faq-title"><span className="lux-kicker">A LITTLE MORE CLARITY</span><h2 id="faq-title">Your questions.<br/><em>Considered answers.</em></h2><div className="faq-list">{faqs.map(f=><details key={f.question}><summary>{f.question}</summary><p>{f.answer}</p></details>)}</div><Link href="/faq" className="landing-text-link">All questions & answers →</Link></section>
<section className="landing-closing"><div data-reveal><span className="lux-kicker">YOUR NEXT CHAPTER, BEAUTIFULLY ARRANGED</span><h2>Make yourself<br/><em>at home.</em></h2><Link href="/signup" className="lux-button lux-button-light">Begin your space <Icon name="arrow" size={18}/></Link><p>Your space. Your pace. Your point of view.</p></div><div className="closing-orbit" aria-hidden="true"/></section>
<footer className="landing-footer landing-width"><div><Wordmark/><p>Thoughtful spaces.<br/>Beautifully presented.</p></div><nav aria-label="Footer navigation"><a href="#inspiration">Inspiration</a><Link href="/how-it-works">The approach</Link><Link href="/blog">Guides</Link><Link href="/contact">Contact</Link><Link href="/login">Sign in</Link></nav><PublicLinks/><div className="footer-bottom"><small>© {new Date().getFullYear()} Vela</small><span>DESIGNED AROUND YOU</span><a href="#home-title">Back to top <Icon name="up" size={14}/></a></div></footer>
</main>;}
