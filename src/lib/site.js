export const siteUrl = 'https://velastudio.space';
export const siteName = 'Vela';
export const supportEmail = 'contact@velastudio.space';
export const contentUpdated = '2026-11-02';
export const adsensePublisher = 'pub-6693217545827146';
export const adsenseClient = `ca-${adsensePublisher}`;
export const publicPaths = ['/', '/about', '/features', '/how-it-works', '/templates', '/pricing', '/faq', '/blog', '/contact', '/privacy', '/terms', '/cookies'];
export function isPublicPath(path,blogPaths=[]) { return publicPaths.includes(path) || blogPaths.includes(path); }
export const siteTitle = 'Vela — 2D & 3D Home and Interior Design Planner';
export const siteDescription = 'Plan your house or flat with Vela: draw internal walls, arrange furniture, customise wall colours and explore in 3D. Start from measurements or a floor plan.';
export function publicMetadata(title,description,path){return {title,description,alternates:{canonical:path},openGraph:{type:'website',siteName:'Vela',title:`${title} · Vela`,description,url:`${siteUrl}${path}`,images:[{url:'/brand/vela-social.png',width:1200,height:630,alt:'Vela interior design studio'}]},twitter:{card:'summary_large_image',title:`${title} · Vela`,description,images:['/brand/vela-social.png']}};}
