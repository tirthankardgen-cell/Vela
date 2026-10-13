import {build} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {viteSingleFile} from 'vite-plugin-singlefile';
import {zipSync} from 'fflate';
import {readFile,writeFile,mkdir} from 'node:fs/promises';

await import('./brand.mjs');
await build({configFile:false,plugins:[react(),tailwindcss(),viteSingleFile()],publicDir:false,build:{outDir:'.build/standalone',assetsInlineLimit:Infinity,chunkSizeWarningLimit:1500},});
let html=await readFile('.build/standalone/index.html','utf8');
const favicon=(await readFile('public/favicon-32x32.png')).toString('base64');
html=html.replace(/<link[^>]+rel="(?:icon|shortcut icon|apple-touch-icon|manifest)"[^>]*>/g,'');
html=html.replace('</head>',`<link rel="icon" href="data:image/png;base64,${favicon}"></head>`);
for (const font of ['manrope','cormorant-garamond']) {
 const data=(await readFile(`public/fonts/${font}.ttf`)).toString('base64');
 html=html.replaceAll(`/fonts/${font}.ttf`,`data:font/ttf;base64,${data}`);
}
await mkdir('downloads',{recursive:true});
await writeFile('downloads/Vela.html',html);
const files={
 'Vela.html':new TextEncoder().encode(html),
 'READ-ME.txt':await readFile('downloads/READ-ME.txt'),
 'THIRD_PARTY_NOTICES.md':await readFile('THIRD_PARTY_NOTICES.md'),
 'THREE-LICENSE.txt':await readFile('planner/THREE-LICENSE.txt')
};
for(const font of ['Manrope','Cormorant-Garamond']) files[`licenses/${font}-OFL.txt`]=await readFile(`brand/licenses/${font}-OFL.txt`);
await writeFile('downloads/Vela.zip',zipSync(files,{level:9}));
console.log('Standalone React app packaged as downloads/Vela.html and downloads/Vela.zip.');
