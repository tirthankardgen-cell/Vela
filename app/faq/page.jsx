import {publicMetadata} from '@/src/lib/site';
import {faqs,moreFaqs} from '@/src/lib/faq';
import {faqSchema} from '@/src/lib/structured-data';
import JsonLd from '@/src/marketing/JsonLd';
import ContentPage,{PlanningCta} from '@/src/marketing/ContentPage';
const title='Vela FAQ: room planning, accounts and exports';
const description='Answers about Vela’s 2D and 3D planner, measurements, floor-plan uploads, flat templates, cloud and guest project storage, the free planner and design exports.';
export const metadata=publicMetadata(title,description,'/faq');
const answers=[...faqs,...moreFaqs];
export default function Faq(){return <ContentPage title={title} description={description} path="/faq"><JsonLd data={{'@context':'https://schema.org',...faqSchema(answers)}}/><div className="faq-list" id="faq">{answers.map(f=><details key={f.question}><summary>{f.question}</summary><p>{f.answer}</p></details>)}</div><PlanningCta/></ContentPage>;}
