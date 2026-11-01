import Link from 'next/link';
import ContentPage from '@/src/marketing/ContentPage';
export default function NotFound(){return <ContentPage title="Page not found" description="The address may have changed. Return home or find a planning guide." path="/404" kicker="VELA / 404"><div className="content-prose"><p><Link className="lux-button lux-button-dark" href="/">Return home →</Link></p><p><Link href="/blog">Browse the guides</Link> · <Link href="/contact">Contact Vela</Link></p></div></ContentPage>;}
