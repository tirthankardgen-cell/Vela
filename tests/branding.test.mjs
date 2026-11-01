import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import sharp from 'sharp';
import {siteUrl} from '../src/lib/site.js';
import {measurementToMetres,newRoom} from '../src/lib/room.js';

test('uses the supplied production domain',()=>{
 assert.equal(siteUrl,'https://velastudio.space');
});
test('converts room dimensions without losing inches',()=>{
 assert.equal(measurementToMetres('ft-in',12,6),3.81);
 assert.equal(measurementToMetres('cm',381),3.81);
 assert.throws(()=>measurementToMetres('ft-in',12,12));
 assert.throws(()=>measurementToMetres('cm',0));
 assert.throws(()=>newRoom({width:4,depth:5,height:NaN}));
});
test('sharing and app assets use the platform-required sizes and public paths',async()=>{
 const assets=[['public/brand/vela-social.png',1200,630],['public/favicon-16x16.png',16,16],['public/favicon-32x32.png',32,32],['public/apple-touch-icon.png',180,180]];
 for(const [path,width,height] of assets){const meta=await sharp(path).metadata();assert.equal(meta.width,width);assert.equal(meta.height,height);}
 const manifest=JSON.parse(await readFile('public/site.webmanifest','utf8'));
 for(const icon of manifest.icons){const meta=await sharp('public'+icon.src).metadata();assert.equal(icon.sizes,`${meta.width}x${meta.height}`);}
 const ico=await readFile('public/favicon.ico');assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),3);
});
