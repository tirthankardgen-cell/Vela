import test from 'node:test';
import assert from 'node:assert/strict';
import {planRoom,cleanFaces} from '../planner/rooms.js';
const polygon=[[0,0],[8,0],[8,6],[0,6]],edges=polygon.map((a,i)=>({a,b:polygon[(i+1)%4]}));
test('rooms create four walls and reuse a shared wall with the opposite inward face',()=>{
 const first=planRoom({x:.5,y:.5,width:2,depth:2},polygon,edges);
 assert.equal(first.filter(s=>s.index<0).length,4);
 const all=[...edges,...first.map(({a,b},i)=>({a,b,id:`wall-${i}`}))];
 const second=planRoom({x:2.5,y:.5,width:2,depth:2},polygon,all);
 assert.equal(second.filter(s=>s.index<0).length,3);
 assert.equal(second[3].index,5);assert.equal(second[3].side,'b');
 assert.throws(()=>planRoom({x:1,y:1,width:2,depth:2},polygon,all),/overlap|intersect/);
 assert.throws(()=>planRoom({x:2.5,y:1,width:2,depth:1},polygon,all),/overlap/);
});
test('room bounds, concave footprints and imported colours are validated',()=>{
 assert.throws(()=>planRoom({x:7,y:1,width:2,depth:2},polygon,edges),/inside/);
 assert.throws(()=>planRoom({x:1,y:1,width:NaN,depth:2},polygon,edges),/valid/);
 const concave=[[0,0],[5,0],[5,5],[3,5],[3,2],[2,2],[2,5],[0,5]];
 assert.throws(()=>planRoom({x:1,y:1,width:3,depth:3},concave,concave.map((a,i)=>({a,b:concave[(i+1)%8]}))),/inside|overlap|intersect/);
 assert.deepEqual(cleanFaces({a:'#abcdef',b:'url(bad)',c:'#123456'}),{a:'#abcdef'});
});
