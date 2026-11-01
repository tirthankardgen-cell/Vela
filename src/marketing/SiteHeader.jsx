import Link from 'next/link';
import Wordmark from './Wordmark';
import Icon from '../components/Icon';
export default function SiteHeader({activePage}) {
 return <header className="site-header">
  <Wordmark dark/>
  <nav className="site-primary-nav" aria-label="Main navigation">
   <Link href="/features" aria-current={activePage==='features'?'page':undefined}>Features</Link>
   <Link href="/blog" aria-current={activePage==='blog'?'page':undefined}>Guides</Link>
   <Link href="/faq" aria-current={activePage==='faq'?'page':undefined}>FAQ</Link>
   <Link href="/about" aria-current={activePage==='about'?'page':undefined}>About</Link>
  </nav>
  <div className="site-header-actions">
   <Link href="/login">Sign in</Link>
   <Link className="lux-button lux-button-dark" href="/signup">Begin your space <Icon name="arrow" size={16}/></Link>
  </div>
 </header>;
}
