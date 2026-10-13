import Link from 'next/link';
export default function Wordmark({dark=false}) {
 return <Link href="/" className={`wordmark ${dark?'wordmark-dark':''}`} aria-label="Vela home"><span className="wordmark-symbol"><img src="/brand/vela-mark.png" alt="" width="38" height="38"/></span><span className="wordmark-name">vela</span><span className="wordmark-label">DESIGN STUDIO</span></Link>;
}
