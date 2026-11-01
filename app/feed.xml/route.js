import {posts} from '@/src/lib/blog';
import {siteUrl} from '@/src/lib/site';
export const dynamic='force-static';
function xml(value){return String(value).replace(/[<>&"']/g,char=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[char]));}
export function GET(){
 const items=posts.map(post=>`<item><title>${xml(post.title)}</title><link>${siteUrl}/blog/${post.slug}</link><guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid><description>${xml(post.description)}</description><pubDate>${new Date(`${post.published}T00:00:00+05:30`).toUTCString()}</pubDate></item>`).join('');
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Vela planning journal</title><link>${siteUrl}/blog</link><description>Practical interior planning and Vela guides</description><language>en</language><atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`,{headers:{'Content-Type':'application/rss+xml; charset=utf-8','Cache-Control':'public, max-age=3600'}});
}
