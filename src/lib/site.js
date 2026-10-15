export const siteUrl = 'https://vela-dgen.vercel.app';
export const siteTitle = 'Vela — 2D & 3D Home and Interior Design Planner';
export const siteDescription = 'Plan your house or flat with Vela: draw internal walls, arrange furniture, customise wall colours and explore in 3D. Start from measurements or a floor plan.';
export function publicMetadata(title,description,path){return {title,description,alternates:{canonical:path},openGraph:{type:'website',siteName:'Vela',title:`${title} · Vela`,description,url:`${siteUrl}${path}`,images:[{url:'/brand/vela-social.png',width:1200,height:630,alt:'Vela interior design studio'}]},twitter:{card:'summary_large_image',title:`${title} · Vela`,description,images:['/brand/vela-social.png']}};}
