import {siteUrl,publicPaths,contentUpdated} from '@/src/lib/site';
import {posts} from '@/src/lib/blog';
export default function sitemap(){return [
 ...publicPaths.map(path=>({url:`${siteUrl}${path==='/'?'':path}`,lastModified:contentUpdated,changeFrequency:path==='/blog'?'weekly':'monthly',priority:path==='/'?1:['/terms','/privacy','/cookies'].includes(path)?0.3:0.7})),
 ...posts.map(post=>({url:`${siteUrl}/blog/${post.slug}`,lastModified:post.updated,changeFrequency:'monthly',priority:0.6})),
];}
