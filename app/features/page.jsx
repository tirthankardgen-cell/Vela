import Link from 'next/link';
import {publicMetadata} from '@/src/lib/site';
import ContentPage,{PlanningCta} from '@/src/marketing/ContentPage';
const title='2D & 3D interior design planner features';
const description='Measure a room, arrange furniture, explore wall finishes and compare a 3D view. Vela brings concept planning and design exports into your browser.';
export const metadata=publicMetadata(title,description,'/features');
const features=[
 ['Measured 2D room planning','Start a room in centimetres or feet and inches. Add internal walls, doors and windows, then review room sizes and attached door swings. Plan dimensions follow wall centre lines.'],
 ['Furniture that fits your idea','Browse furniture, electronics, climate, decor and build items. Set widths, depths and heights, rotate pieces, and use resize handles to compare measured arrangements.'],
 ['A matching 3D view','Explore the same layout in 3D to compare height and proportion. Models are schematic concept tools; they do not promise photorealistic product or lighting previews.'],
 ['Colours, finishes and estimates','Choose wall colours and record finishes, supplier notes and item costs. Enter estimates yourself; changing the currency label does not convert amounts.'],
 ['Furnished flat templates','Choose from eight concept flats: two each for 1BHK, 2BHK, 3BHK and 4BHK. Adapt the furniture and room arrangement to a measured survey of your own space.'],
 ['Floor-plan tracing references','Upload a PNG, JPG, WebP or PDF up to 10 MB. Use the first PDF page as a scaled background and add the walls manually; automatic room recognition is not included.'],
 ['Exports for review and backup','Keep an editable JSON backup, export the 2D plan as SVG or the 3D view as PNG, and prepare a furniture CSV or a design presentation for printing to PDF.'],
 ['Private plans across devices','Explore without installing desktop software. Signed-in plans sync privately through Firestore. Guest designs and tracing images stay local; keep JSON backups.'],
];
export default function Features(){return <ContentPage title={title} description={description} path="/features"><figure className="feature-preview"><img src="/images/studio-preview.png" alt="Actual Vela studio with a measured 2D room layout and furniture library" width="1440" height="1000"/><figcaption>Vela studio interface. The planner uses schematic furniture and room geometry.</figcaption></figure><div className="content-grid">{features.map(([heading,copy])=><section className="content-card" key={heading}><h2>{heading}</h2><p>{copy}</p></section>)}</div><p className="content-note">Concept planning supports a design conversation. Verify dimensions and structural changes with qualified professionals. <Link href="/how-it-works">Follow the planning workflow →</Link></p><PlanningCta/></ContentPage>;}
