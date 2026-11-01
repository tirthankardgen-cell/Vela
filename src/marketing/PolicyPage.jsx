import SiteHeader from './SiteHeader';
import PublicLinks from './PublicLinks';
import JsonLd from './JsonLd';
import {pageGraph} from '../lib/structured-data';
import '@/src/marketing/landing.css';
import '@/src/marketing/policy.css';
export default function PolicyPage({title,intro,path,children}){return <main className="marketing landing policy-page"><SiteHeader/>{path&&<JsonLd data={pageGraph({title,description:intro,path})}/>}<article className="policy-content"><span className="lux-kicker">VELA / INFORMATION</span><h1>{title}</h1><p className="policy-updated">Last updated: 2 November 2026</p><p>{intro}</p>{children}</article><footer className="policy-footer"><PublicLinks/></footer></main>;}
