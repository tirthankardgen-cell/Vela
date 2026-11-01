import test from 'node:test';
import assert from 'node:assert/strict';
import {createAutosave} from '../src/lib/autosave.js';
import {encodeProject,decodeProject} from '../src/lib/project-data.js';
import {createFlatTemplate} from '../planner/templates.js';
import {writeDraft,readDraft,clearDraft,listDrafts} from '../src/lib/drafts.js';

test('full flat geometry round-trips without image bytes, including nested coordinates',()=>{
 const layout=createFlatTemplate();layout.notes='A complete plan';layout.room.reference={data:'data:image/jpeg;base64,AAAA',path:'old/storage/path',opacity:.5};
 layout.camera={position:[1,2,3],target:[0,0,0]};
 const encoded=encodeProject(layout),expected=structuredClone(layout);delete expected.room.reference;
 assert.deepEqual(decodeProject(encoded,layout.project.id),expected);
 assert.ok(layout.room.reference);assert.ok(!encoded.layoutJson.includes('data:image'));assert.ok(!encoded.layoutJson.includes('old/storage/path'));
});
test('invalid and oversized documents fail before reaching Firestore',()=>{
 const layout=createFlatTemplate();layout.project.id='../another-user';assert.throws(()=>encodeProject(layout),{code:'project/invalid'});
 layout.project.id='valid';layout.notes='😀'.repeat(230000);assert.throws(()=>encodeProject(layout),{code:'project/too-large'});
});
test('manual save flushes the latest edit after an in-flight autosave',async()=>{
 let release;const calls=[];const gate=new Promise(resolve=>{release=resolve;});
 const saver=createAutosave({delay:60000,save:async value=>{calls.push(value);if(calls.length===1)await gate;}});
 saver.schedule({version:1});const first=saver.flush();
 saver.schedule({version:2});saver.schedule({version:3});const manual=saver.flush();
 release();await Promise.all([first,manual]);assert.deepEqual(calls,[{version:1},{version:3}]);assert.equal(saver.dirty,false);saver.dispose();
});
test('failed saves retain the latest edit and can retry on reconnect',async()=>{
 let fail=true;const calls=[];
 const saver=createAutosave({delay:60000,save:async value=>{if(fail)throw new Error('offline');calls.push(value);}});
 saver.schedule({version:1});await assert.rejects(saver.flush());assert.equal(saver.dirty,true);
 saver.schedule({version:2});fail=false;await saver.flush();assert.deepEqual(calls,[{version:2}]);assert.equal(saver.dirty,false);saver.dispose();
});
test('unmount flushes a pending edit',async()=>{
 const calls=[];const saver=createAutosave({delay:60000,save:async value=>calls.push(value)});
 saver.schedule({version:1});saver.dispose();await saver.flush();assert.deepEqual(calls,[{version:1}]);
});
test('cloud acknowledgements never erase a newer draft or another account draft',()=>{
 const data={};globalThis.localStorage={setItem(k,v){data[k]=v;this[k]=v;},getItem:k=>data[k]??null,removeItem(k){delete data[k];delete this[k];}};
 const first={project:{id:'one'},notes:'first'},latest={project:{id:'one'},notes:'latest'};
 writeDraft('alice',first);writeDraft('alice',latest);writeDraft('bob',first);clearDraft('alice','one',first);
 assert.deepEqual(readDraft('alice','one').layout,latest);assert.equal(listDrafts('alice').length,1);
 clearDraft('alice','one',latest);assert.equal(readDraft('alice','one'),null);assert.ok(readDraft('bob','one'));delete globalThis.localStorage;
});
