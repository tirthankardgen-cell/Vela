import Link from 'next/link';
import Wordmark from './Wordmark';
import Icon from '../components/Icon';
export default function SiteHeader(){return <header className="site-header"><Wordmark/><nav aria-label="Main navigation"><a href="/#inspiration">Inspiration</a><a href="/#process">The approach</a><Link href="/login">Sign in</Link><Link className="lux-button lux-button-dark" href="/signup">Begin your space <Icon name="arrow" size={16}/></Link></nav></header>;}
