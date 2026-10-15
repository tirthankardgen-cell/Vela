import SiteHeader from './SiteHeader';
import PublicLinks from './PublicLinks';
import '@/src/marketing/landing.css';
import '@/src/marketing/policy.css';
export default function PolicyPage({title,intro,children}){return <main className="marketing landing policy-page"><SiteHeader/><article className="policy-content"><span className="lux-kicker">VELA / INFORMATION</span><h1>{title}</h1><p className="policy-updated">Last updated: 15 October 2026</p><p>{intro}</p>{children}</article><footer className="policy-footer"><PublicLinks/></footer></main>;}
