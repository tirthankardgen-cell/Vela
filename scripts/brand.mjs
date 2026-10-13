import {resolve} from 'node:path';
process.env.XDG_CACHE_HOME ||= resolve('.build/cache');
await (await import('node:fs/promises')).mkdir(process.env.XDG_CACHE_HOME, {recursive:true});
const {default:sharp} = await import('sharp');
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('public/brand', {recursive: true});
await mkdir('src/assets', {recursive: true});
const mark = await sharp('brand/vela-logo-original.png').trim().resize(800, 800, {fit: 'contain', background: '#00000000'}).png().toBuffer();
await sharp(mark).resize(256,256).png().toFile('src/assets/vela-mark.png');
await sharp(mark).png().toFile('public/brand/vela-mark.png');
const brandData=(await (await import('node:fs/promises')).readFile('src/assets/vela-mark.png')).toString('base64');
await writeFile('src/assets/brand-data.js',`export const logoDataUrl = 'data:image/png;base64,${brandData}';\n`);

async function icon(size, file, padding=.15) {
 const inner = Math.round(size * (1-padding*2));
 const symbol = await sharp(mark).resize(inner,inner).toBuffer();
 await sharp({create:{width:size,height:size,channels:4,background:'#faf9f2'}})
  .composite([{input:symbol,gravity:'centre'}]).png().toFile(file);
}
for (const size of [16,32,48]) await icon(size,`public/favicon-${size}x${size}.png`,.09);
await icon(180,'public/apple-touch-icon.png');
await icon(192,'public/brand/icon-192.png');
await icon(512,'public/brand/icon-512.png');
await icon(512,'public/brand/icon-maskable-512.png',.22);

// Standard ICO directory with embedded PNG images for 16/32/48 px clients.
const sizes=[16,32,48], buffers=await Promise.all(sizes.map(s=>sharp(`public/favicon-${s}x${s}.png`).toBuffer()));
const header=Buffer.alloc(6+16*sizes.length);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);
let offset=header.length;
buffers.forEach((buffer,i)=>{const p=6+i*16;header[p]=sizes[i];header[p+1]=sizes[i];header.writeUInt16LE(1,p+4);header.writeUInt16LE(32,p+6);header.writeUInt32LE(buffer.length,p+8);header.writeUInt32LE(offset,p+12);offset+=buffer.length;});
await writeFile('public/favicon.ico',Buffer.concat([header,...buffers]));

const card = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#1d211c"/><path d="M80 80H160" stroke="#978365" stroke-width="5"/><text x="80" y="142" font-family="Arial,sans-serif" font-size="12" letter-spacing="4" fill="#cbc0aa">A SPACE, THOUGHTFULLY YOURS.</text><text x="73" y="294" font-family="Arial,sans-serif" font-weight="500" font-size="130" letter-spacing="-7" fill="#faf9f2">vela</text><text x="82" y="344" font-family="Arial,sans-serif" font-size="13" letter-spacing="5" fill="#cbc0aa">INTERIOR DESIGN STUDIO</text><text x="80" y="446" font-family="Georgia,serif" font-size="38" fill="#faf9f2">Thoughtful spaces.</text><text x="80" y="494" font-family="Georgia,serif" font-size="38" fill="#faf9f2">Beautifully presented.</text><rect x="824" y="183" width="296" height="296" rx="44" fill="#faf9f2"/><path d="M80 560H1120" stroke="#45473e"/><text x="80" y="594" font-family="Arial,sans-serif" font-size="10" letter-spacing="3" fill="#b9a88d">DESIGN / REFINE / PRESENT</text><text x="1120" y="594" text-anchor="end" font-family="Arial,sans-serif" font-size="10" letter-spacing="3" fill="#b9a88d">VELA STUDIO</text></svg>`);
const socialMark=await sharp(mark).resize(224,224).toBuffer();
await sharp(card).composite([{input:socialMark,left:860,top:219}]).png().toFile('public/brand/vela-social.png');
await writeFile('public/site.webmanifest',JSON.stringify({id:'/',name:'Vela — Interior design studio',short_name:'Vela',description:'Thoughtful spaces. Beautifully presented.',start_url:'/',scope:'/',display:'standalone',background_color:'#faf9f2',theme_color:'#1d211c',icons:[{src:'/brand/icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},{src:'/brand/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any'},{src:'/brand/icon-maskable-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]},null,2)+'\n');
console.log('Vela brand assets built: header mark, favicons, app icons and 1200 × 630 social card.');
