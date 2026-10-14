import test from 'node:test';
import assert from 'node:assert/strict';
import {resizeItem} from '../planner/resize.js';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
const original={x:3,y:4,w:2,d:1,rotation:0,offset:2};
test('all eight handles preserve the opposite anchor at arbitrary rotations',()=>{
 for(const rotation of [0,37,90,225])for(const handle of ['nw','n','ne','e','se','s','sw','w']){
  const o={...original,rotation},a=rotation*Math.PI/180,c=Math.cos(a),s=Math.sin(a),sx=handle.includes('e')?1:handle.includes('w')?-1:0,sy=handle.includes('s')?1:handle.includes('n')?-1:0;
  const result=resizeItem(o,handle,{x:sx*.4*c-sy*.3*s,y:sx*.4*s+sy*.3*c});
  close(result.w,o.w+(sx?.4:0));close(result.d,o.d+(sy?.3:0));
  close(result.x-sx*result.w/2*c+sy*result.d/2*s,o.x-sx*o.w/2*c+sy*o.d/2*s);
  close(result.y-sx*result.w/2*s-sy*result.d/2*c,o.y-sx*o.w/2*s-sy*o.d/2*c);
 }
});
test('resize clamps dimensions, snaps, and keeps openings on their wall',()=>{
 const snap=v=>Math.round(v/.05)*.05;
 const r=resizeItem(original,'e',{x:.123,y:3},{snap,opening:true,maxWidth:2.5});close(r.w,2.1);close(r.d,1);close(r.y,4);close(r.offset,2.05);
 close(resizeItem(original,'e',{x:40,y:0},{maxWidth:2.5}).w,2.5);
 close(resizeItem(original,'nw',{x:40,y:40}).w,.05);
 close(resizeItem(original,'nw',{x:40,y:40}).d,.05);
});
