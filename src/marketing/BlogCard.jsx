import Link from 'next/link';
import {readingMinutes} from '../lib/blog';
export default function BlogCard({post}) {
 return <article className="blog-card"><Link href={`/blog/${post.slug}`} aria-label={post.title}><img src={post.image} alt={post.imageAlt} width="1536" height="1024" loading="lazy"/></Link><div><span className="lux-kicker">{post.category}</span><h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.description}</p><span className="article-meta"><time dateTime={post.published}>{new Date(`${post.published}T12:00:00Z`).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Kolkata'})}</time> · {readingMinutes(post)} min read</span><Link className="landing-text-link" href={`/blog/${post.slug}`}>Read the guide →</Link></div></article>;
}
