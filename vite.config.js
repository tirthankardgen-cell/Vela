import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export function resolveSiteOrigin(env) {
  const value = env.VITE_SITE_URL || env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL;
  if (!value) return null;
  const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('Use a public HTTP(S) origin for VITE_SITE_URL.');
  return url.origin;
}
export function socialMetadata(origin) {
  return {
    name: 'vela-social-metadata',
    transformIndexHtml(html) {
      if (!origin) return html;
      const escape = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
      const safe = escape(origin);
      html = html.replaceAll('content="/brand/vela-social.png"', `content="${safe}/brand/vela-social.png"`);
      return {html,tags:[{tag:'link',attrs:{rel:'canonical',href:`${origin}/`},injectTo:'head'},{tag:'meta',attrs:{property:'og:url',content:`${origin}/`},injectTo:'head'}]};
    }
  };
}
export default defineConfig(({mode}) => {
  const env = {...loadEnv(mode,process.cwd(),''),...process.env};
  return {
    plugins:[react(),tailwindcss(),socialMetadata(resolveSiteOrigin(env))],
    server:{host:'127.0.0.1',port:8766,strictPort:true},
    preview:{host:'127.0.0.1',port:8767,strictPort:true},
    build:{outDir:'dist',target:'es2022',chunkSizeWarningLimit:900},
  };
});
