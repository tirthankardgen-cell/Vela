import Link from 'next/link';
import {notFound} from 'next/navigation';
import {posts,getPost,readingMinutes} from '@/src/lib/blog';
import {publicMetadata,siteUrl} from '@/src/lib/site';
import {organization} from '@/src/lib/structured-data';
import ContentPage,{PlanningCta} from '@/src/marketing/ContentPage';
import BlogCard from '@/src/marketing/BlogCard';
import JsonLd from '@/src/marketing/JsonLd';

export const dynamicParams=false;
export function generateStaticParams(){return posts.map(post=>({slug:post.slug}));}
export async function generateMetadata({params}) {
 const {slug}=await params;const post=getPost(slug);if(!post)return {title:'Guide not found',robots:{index:false,follow:false}};
 const metadata=publicMetadata(post.title,post.description,`/blog/${slug}`);
 return {...metadata,openGraph:{...metadata.openGraph,type:'article',publishedTime:post.published,modifiedTime:post.updated,authors:['Vela'],images:[{url:post.image,alt:post.imageAlt}]}};
}
export default async function BlogArticle({params}) {
 const {slug}=await params;const post=getPost(slug);if(!post)notFound();
 const path=`/blog/${slug}`;
 const schema={'@context':'https://schema.org','@type':'BlogPosting','@id':`${siteUrl}${path}#article`,headline:post.title,description:post.description,datePublished:`${post.published}T00:00:00+05:30`,dateModified:`${post.updated}T00:00:00+05:30`,image:`${siteUrl}${post.image}`,author:organization,publisher:organization,mainEntityOfPage:{'@id':`${siteUrl}${path}#page`},inLanguage:'en',articleSection:post.category};
 const related=post.related.map(getPost).filter(Boolean);
 return <ContentPage title={post.title} description={post.description} path={path} type="WebPage" items={[{name:'Blog',path:'/blog'}]} kicker={`VELA / ${post.category.toUpperCase()}`}>
  <JsonLd data={schema}/>
  <p className="article-byline">By <Link href="/about">Vela</Link> · Published <time dateTime={post.published}>{new Date(`${post.published}T12:00:00Z`).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Kolkata'})}</time> · {readingMinutes(post)} min read{post.updated!==post.published&&<> · Updated <time dateTime={post.updated}>{post.updated}</time></>}</p>
  <div className="article-layout"><article className="content-prose"><div className="content-answer"><h2>The quick answer</h2><p>{post.answer}</p></div>{post.sections.map((section,i)=><section key={section.heading} aria-labelledby={`section-${i+1}`}><h2 id={`section-${i+1}`}>{section.heading}</h2>{section.paragraphs?.map(p=><p key={p}>{p}</p>)}{section.list&&<ul>{section.list.map(item=><li key={item}>{item}</li>)}</ul>}</section>)}<section><h2>Continue planning</h2><p>Explore <Link href="/features">Vela’s current features</Link>, follow <Link href="/how-it-works">the planning workflow</Link> or browse the <Link href="/faq">FAQ</Link>. For product questions, <Link href="/contact">contact Vela</Link>.</p></section></article><aside className="article-toc"><h2>In this guide</h2><ol>{post.sections.map((section,i)=><li key={section.heading}><a href={`#section-${i+1}`}>{section.heading}</a></li>)}</ol></aside></div>
  <section className="related-guides"><h2>Keep the idea moving.</h2><div className="blog-grid">{related.map(item=><BlogCard key={item.slug} post={item}/>)}</div></section><p className="content-note">Concept planning guidance. Verify critical measurements and consult qualified professionals before construction or purchasing.</p><PlanningCta/>
 </ContentPage>;
}
