import test from 'node:test';
import assert from 'node:assert/strict';
import {doorPose} from '../planner/doors.js';
test('hinge and swing cover all four configurations with matching plan and 3D direction',()=>{
 for(const hinge of ['left','right'])for(const swing of ['a','b']){
  const pose=doorPose({hinge,swing}),leaf=pose.leaves[0];
  assert.equal(leaf.hinge,hinge==='right'?.5:-.5);
  assert.equal(pose.mirrorX,hinge==='right'?-1:1);
  assert.equal(-Math.sin(leaf.angle)*leaf.direction,pose.side);
  assert.equal(pose.side,swing==='b'?-1:1);
 }
 assert.equal(doorPose({flip:true}).side,-1);
 assert.equal(doorPose({flip:true,swing:'a'}).side,1);
 assert.deepEqual(doorPose({}),doorPose({hinge:'left',swing:'a'}));
});
test('double doors retain opposite hinges while reversing both leaves',()=>{
 for(const swing of ['a','b']){
  const pose=doorPose({swing,hinge:'right'},'double');
  assert.deepEqual(pose.leaves.map(l=>l.hinge),[-.5,.5]);
  assert.equal(pose.leaves.reduce((n,l)=>n+l.width,0),1);
  for(const leaf of pose.leaves)assert.equal(-Math.sin(leaf.angle)*leaf.direction,pose.side);
 }
});
