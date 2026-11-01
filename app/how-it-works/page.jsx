import Link from 'next/link';
import {publicMetadata} from '@/src/lib/site';
import ContentPage,{PlanningCta} from '@/src/marketing/ContentPage';
const title='How to plan your room with Vela';
const description='Go from measurements to a furnished concept: create a room, arrange walls and furniture, review in 3D, then export a plan and editable backup.';
export const metadata=publicMetadata(title,description,'/how-it-works');
const steps=[
 ['Measure your space','Record walls, openings and ceiling height. Choose centimetres or feet and inches. Distinguish clear internal measurements from the wall centre lines used in Vela.','/blog/how-to-measure-a-room-for-a-floor-plan','Read the measuring guide'],
 ['Choose a starting point','Start an empty room, choose a furnished 1BHK–4BHK flat, or upload a floor plan as a tracing reference. Check the overall footprint before you start arranging furniture.','/templates','Explore flat templates'],
 ['Build the layout in 2D','Add internal walls and attached doors and windows. Place furniture, set its real dimensions and check door swings, storage access and walking routes.','/blog/small-living-room-furniture-layout','Plan a furniture layout'],
 ['Review height, colour and proportion','Switch to the matching 3D view. Compare object heights and finishes, then return to 2D to confirm that any visual changes preserve usable space.','/blog/2d-vs-3d-interior-design-planning','Compare the two views'],
 ['Save and share your concept','Export JSON for an editable backup, SVG for the plan, PNG for a 3D image, or a presentation to print as PDF. Check the downloaded files before sharing.','/blog/export-and-back-up-your-interior-design','Choose an export format'],
];
export default function HowItWorks(){return <ContentPage title={title} description={description} path="/how-it-works"><div className="content-grid">{steps.map(([heading,copy,href,label],i)=><section className="content-card" key={heading}><span className="step-number">0{i+1}</span><h2>{heading}</h2><p>{copy}</p><Link className="landing-text-link" href={href}>{label} →</Link></section>)}</div><div className="content-prose"><h2>What to check before you finish</h2><p>Signed-in plans sync to your private cloud workspace. Wait for the saved status before leaving and keep JSON backups, especially for tracing images that stay local. A Vela plan is a design concept: verify measurements, construction decisions and local requirements before implementing it.</p></div><PlanningCta/></ContentPage>;}
