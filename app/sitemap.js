import {siteUrl} from '@/src/lib/site';
export default function sitemap(){return ['', '/about', '/terms', '/privacy'].map(path=>({url:`${siteUrl}${path}`,changeFrequency:path?'monthly':'weekly',priority:path?0.5:1}));}
