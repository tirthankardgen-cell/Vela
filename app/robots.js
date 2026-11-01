import {siteUrl} from '@/src/lib/site';
// Account and studio pages emit noindex. Allow crawling so bots can read that directive.
export default function robots(){return {rules:{userAgent:'*',allow:'/',disallow:'/api/'},sitemap:`${siteUrl}/sitemap.xml`,host:siteUrl};}
