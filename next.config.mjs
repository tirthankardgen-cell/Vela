import {fileURLToPath} from 'node:url';
const projectRoot=fileURLToPath(new URL('.',import.meta.url));
/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack:{root:projectRoot},
  outputFileTracingRoot:projectRoot,
  async redirects() {
    return ['vela-dgen.vercel.app','www.velastudio.space'].map(host=>({source:'/:path*',has:[{type:'host',value:host}],destination:'https://velastudio.space/:path*',permanent:true}));
  },
  async headers() {
    return [{source:'/:path*',headers:[
      {key:'X-Content-Type-Options',value:'nosniff'},
      {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
    ]}];
  },
};
export default nextConfig;
