import {readFile} from 'node:fs/promises';
import {before,after,beforeEach,test} from 'node:test';
import assert from 'node:assert/strict';
import {initializeTestEnvironment,assertSucceeds,assertFails} from '@firebase/rules-unit-testing';
import {doc,setDoc,getDoc,deleteDoc,updateDoc,serverTimestamp,collection,getDocs} from 'firebase/firestore';
import {encodeProject} from '../src/lib/project-data.js';
import {projectStore} from '../src/lib/projects.js';
import {createFlatTemplate} from '../planner/templates.js';
let env;
before(async()=>{env=await initializeTestEnvironment({projectId:'demo-vela',firestore:{host:'127.0.0.1',port:8080,rules:await readFile(new URL('../firestore.rules',import.meta.url),'utf8')}});});
beforeEach(()=>env.clearFirestore());
after(()=>env?.cleanup());
const db=uid=>uid?env.authenticatedContext(uid).firestore():env.unauthenticatedContext().firestore();
const path=(database,id='space',owner='alice')=>doc(database,'users',owner,'projects',id);
function layout(id='space'){const value=createFlatTemplate();value.project.id=id;return value;}
const record=()=>({...encodeProject(layout()),revision:1,createdAt:serverTimestamp(),updatedAt:serverTimestamp()});

test('owner can create, read, list, update and delete a plan',async()=>{
 const database=db('alice'),target=path(database);
 await assertSucceeds(setDoc(target,record()));await assertSucceeds(getDoc(target));
 await assertSucceeds(getDocs(collection(database,'users','alice','projects')));
 await assertSucceeds(updateDoc(target,{name:'Updated',revision:2,updatedAt:serverTimestamp()}));await assertSucceeds(deleteDoc(target));
});
test('anonymous users and other accounts cannot read, list, write or delete',async()=>{
 await setDoc(path(db('alice')),record());
 for(const uid of [null,'bob']){
  const database=db(uid),target=path(database);
  await assertFails(getDoc(target));await assertFails(getDocs(collection(database,'users','alice','projects')));
  await assertFails(setDoc(target,record()));await assertFails(deleteDoc(target));
 }
 await assertFails(setDoc(doc(db('alice'),'users','alice'),{role:'admin'}));
});
test('schema, size, ID, timestamps and revisions are enforced',async()=>{
 const target=path(db('alice'));
 for(const change of [{id:'other'},{owner:'alice'},{schemaVersion:1},{revision:2},{itemCount:201},{itemCount:1.5},{name:''},{name:'x'.repeat(101)},{layoutJson:'x'.repeat(900001)},{createdAt:new Date(0)},{updatedAt:new Date(0)}])await assertFails(setDoc(target,{...record(),...change}));
 await setDoc(target,record());
 await assertFails(updateDoc(target,{revision:2,createdAt:serverTimestamp(),updatedAt:serverTimestamp()}));
 await assertFails(updateDoc(target,{revision:1,updatedAt:serverTimestamp()}));
});
test('production adapter saves full geometry and excludes reference images',async()=>{
 const store=projectStore('alice',{db:db('alice')}),value=layout();value.room.reference={data:'data:image/jpeg;base64,AAAA'};
 await store.save(value);const reopened=await store.get('space'),expected=structuredClone(value);delete expected.room.reference;
 assert.deepEqual(reopened,expected);const page=await store.listPage();assert.equal(page.projects[0].itemCount,value.items.length);
 await store.remove('space');assert.equal((await store.listPage()).projects.length,0);
});
test('concurrent devices cannot silently overwrite a newer revision or recreate a deletion',async()=>{
 const a=projectStore('alice',{db:db('alice')}),b=projectStore('alice',{db:db('alice')});
 await a.save(layout());const stale=await b.get('space');const changed=await a.get('space');changed.notes='new device edit';await a.save(changed);
 stale.notes='stale edit';await assert.rejects(b.save(stale),{code:'project/conflict'});
 await b.get('space');await a.remove('space');await assert.rejects(b.save(stale),{code:'project/conflict'});
});
test('the dashboard paginates beyond the first 24 projects',async()=>{
 const store=projectStore('alice',{db:db('alice')});
 for(let i=0;i<25;i++)await store.save(layout(`space-${i}`));
 const first=await store.listPage(),second=await store.listPage(first.cursor);
 assert.equal(first.projects.length,24);assert.equal(second.projects.length,1);assert.equal(second.cursor,null);
 assert.equal(new Set([...first.projects,...second.projects].map(p=>p.id)).size,25);
});
