import {siteUrl,siteTitle,siteDescription} from '@/src/lib/site';
import '@/src/styles.css';
import '@/src/marketing/marketing.css';

export const metadata = {
  metadataBase:new URL(siteUrl),
  title:{default:siteTitle,template:'%s · Vela'},
  description:siteDescription,
  applicationName:'Vela',
  alternates:{canonical:'/'},
  icons:{icon:[{url:'/favicon-32x32.png',sizes:'32x32',type:'image/png'},{url:'/favicon-16x16.png',sizes:'16x16',type:'image/png'}],shortcut:'/favicon.ico',apple:[{url:'/apple-touch-icon.png',sizes:'180x180'}]},
  manifest:'/site.webmanifest',
  openGraph:{type:'website',url:siteUrl,siteName:'Vela',title:'Vela — Thoughtful spaces. Beautifully presented.',description:siteDescription,images:[{url:'/brand/vela-social.png',width:1200,height:630,alt:'Vela — olive and champagne architectural V, with an ivory wordmark.'}]},
  twitter:{card:'summary_large_image',title:siteTitle,description:siteDescription,images:['/brand/vela-social.png']},
};
export const viewport = {width:'device-width',initialScale:1,themeColor:'#1d211c'};
export default function RootLayout({children}) {
 return <html lang="en"><body>{children}</body></html>;
}
