import Link from 'next/link';
import Wordmark from './Wordmark';
export default function SiteHeader(){return <header className="site-header"><Wordmark/><nav aria-label="Main navigation"><a href="/#possibilities">The studio</a><a href="/#process">How it works</a><Link href="/login">Sign in</Link><Link className="lux-button lux-button-dark" href="/signup">Create a space <span>↗</span></Link></nav></header>;}
