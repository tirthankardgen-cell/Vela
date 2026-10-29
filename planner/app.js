import {initializeStudio, validateProject} from './studio.js';
import {catalogueIcons} from '../src/lib/catalogue-icons';
import {catalogueEntries,catalogueGroups,catalogueVariants,catalogueType} from '../src/lib/catalogue';
import {feetAndInches,metric,centimetres} from '../src/lib/measurements';
import {planRoom,cleanFaces,spacePolygon,pointInPolygon} from './rooms.js';
import {doorPose} from './doors.js';
import {resizeItem} from './resize.js';
import {fixtureTypes} from './fixtures.js';
import {planItemShape} from './plan-shapes.js';
import {createFlatTemplate,DEFAULT_FLAT_TEMPLATE,getFlatTemplate,roomMeasurements} from './templates.js';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

export function initializePlanner(options = {}) {
const {owner="guest",store=null,initialLayout=null,onStarted=()=>{},standalone=false}=options;
let saveTimer,saveSequence=0,disposed=false,saveChain=Promise.resolve();
function cloudSave(layout){if(!store)return;const sequence=++saveSequence;clearTimeout(saveTimer);$("save-state").textContent=store.isDemo?"Saving preview…":"Saving to your workspace…";saveTimer=setTimeout(()=>{saveChain=saveChain.catch(()=>{}).then(()=>store.save(layout)).then(()=>{if(!disposed&&sequence===saveSequence)$("save-state").textContent=store.isDemo?"Preview saved on this device":"Saved to your cloud workspace";}).catch(()=>{if(!disposed)$("save-state").textContent=store.isDemo?"Preview save failed · export your project":"Cloud save failed · local draft kept";});},900);}

const abort = new AbortController();
const listen = (target, event, handler, options = {}) => target.addEventListener(event, handler, {...options, signal: abort.signal});
const $=id=>document.getElementById(id), NS='http://www.w3.org/2000/svg';
const copy=x=>JSON.parse(JSON.stringify(x)), clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>globalThis.crypto?.randomUUID?.()||`i-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const TYPES={
 sofa:{label:'Sofa',w:2.1,d:.85,h:.85,color:'#c2c6c5',category:'furniture',icon:'M5 13V7Q5 4 9 4H33Q37 4 37 7V13M4 12H9V23H33V12H39V26H4ZM10 17H32'},
 lsofa:{label:'L-shaped sofa',w:2.14,d:1.42,h:.85,color:'#c2c6c5',category:'furniture',icon:'M5 5H36V26H26V16H5ZM8 8H32V12H8M29 15V23'},
 chair:{label:'Armchair',w:.7,d:.75,h:.85,color:'#c7bba6',category:'furniture',icon:'M10 12V6H32V12M7 12H12V23H30V12H35V27H7ZM13 16H29'},
 dining:{label:'Dining · 4 seats',w:.76,d:1.2,h:.76,color:'#987455',category:'furniture',icon:'M13 4H29V28H13ZM5 5H10V13H5ZM32 5H37V13H32ZM5 19H10V27H5ZM32 19H37V27H32Z'},
 table:{label:'Coffee table',w:.9,d:.5,h:.42,color:'#b3906b',category:'furniture',icon:'M6 8Q6 4 12 4H30Q36 4 36 8V22Q36 27 30 27H12Q6 27 6 22Z'},
 bed:{label:'Queen bed',w:1.63,d:2.08,h:.55,color:'#d5cbbb',category:'furniture',icon:'M8 2H34V29H8ZM10 5H20V11H10ZM22 5H32V11H22ZM8 14H34'},
 wardrobe:{label:'Wardrobe',w:1.8,d:.6,h:2.25,color:'#9d8069',category:'furniture',icon:'M5 4H37V27H5ZM21 4V27M17 12V19M25 12V19'},
 tv:{label:'TV & console',w:1.8,d:.3,h:.45,color:'#987455',category:'furniture',icon:'M6 4H36V20H6ZM21 20V25M12 25H30M3 29H39'},
 shrine:{label:'Meditation altar',w:.76,d:.4,h:1.65,color:'#947151',category:'structure',icon:'M8 12L21 2L34 12M10 12V27H32V12M6 28H36M18 23V17H24V23'},
 partition:{label:'Partition',w:1.13,d:.07,h:1.72,color:'#896649',category:'structure',icon:'M5 3H37V28H5ZM10 3V28M16 3V28M22 3V28M28 3V28M34 3V28'},
 door:{label:'Door',w:.9,d:.12,h:2.1,e:0,color:'#987455',category:'structure',icon:'M5 27V4H28V27M6 26L27 6M28 6Q40 9 39 27',opening:true},
 window:{label:'Window',w:1.2,d:.12,h:1.1,e:.9,color:'#9cc6d0',category:'structure',icon:'M5 5H37V27H5ZM21 5V27M5 16H37',opening:true},
 wall:{label:'Extra wall',w:1.5,d:.12,h:2.85,color:'#b7b5aa',category:'structure',icon:'M3 8H39V25H3ZM3 16H39M14 8V16M29 8V16M9 16V25M23 16V25'},
 pillar:{label:'Pillar',w:.25,d:.25,h:2.85,color:'#aaa99d',category:'structure',icon:'M10 4H32V28H10ZM15 9H27V23H15Z'},
 ac:{label:'AC',w:.8,d:.25,h:.27,e:2.2,color:'#e7e8e3',category:'structure',icon:'M3 6H39V21H3ZM7 16H35M10 24V29M21 24V29M32 24V29'},
 heater:{label:'Radiator heater',w:.65,d:.25,h:.6,color:'#e7e8e3',category:'electronics',icon:'M5 6H37V25H5ZM10 6V25M16 6V25M22 6V25M28 6V25M33 6V25M9 25V29M33 25V29'},
 fan:{label:'Ceiling fan',w:1.2,d:1.2,h:.1,e:2.45,color:'#a39073',category:'structure',icon:'M21 13Q27 1 35 6Q39 12 24 17Q30 29 23 30Q17 30 18 20Q4 23 4 17Q3 10 18 14ZM18 13H24V19H18Z'},
 rug:{label:'Rug',w:2.1,d:1.6,h:.015,color:'#c5bda9',category:'furniture',icon:'M6 5H36V27H6ZM10 9H32V23H10M3 5V27M39 5V27'},
 ...fixtureTypes
};
const STORAGE=owner==='guest'?'vela-layout-v1':`vela-layout-v1:${owner}`;
function item(kind,x,y,options={}){const t=TYPES[kind];return {id:uid(),kind,label:t.label,x,y,w:t.w,d:t.d,h:t.h,e:t.e||0,rotation:0,color:t.color,flip:false,...options};}
function preset(type=DEFAULT_FLAT_TEMPLATE){
 if(type!=='blank')return createFlatTemplate(type);
 return {format:'roomnote-layout',version:1,units:'metres',room:{name:'My room',height:2.85,wallThickness:.12,vertices:[[0,0],[4,0],[4,4],[0,4]],spaces:[],zones:[],floorColor:'#eee9df',wallColor:'#e5e0d5'},items:[],notes:'',camera:null};
}
let state=preset(), selected=null, undoStack=[], redoStack=[], mode='plan', category='furniture', zoom=1, drag=null, loading=false;
let pan={x:0,y:0},fitFrame=null;
let renderer,scene,controls,camera,content,resizeObserver;
const svg=$('plan'),stage=$('stage');
function edges(){const segments=state.room.vertices.map((a,i)=>({a,b:state.room.vertices[(i+1)%state.room.vertices.length]}));for(const o of state.items.filter(o=>o.kind==='wall')){const a=o.rotation*Math.PI/180,dx=Math.cos(a)*o.w/2,dy=Math.sin(a)*o.w/2;segments.push({a:[o.x-dx,o.y-dy],b:[o.x+dx,o.y+dy],id:o.id,label:o.label,h:o.h,t:o.d});}return segments.map(ed=>{const dx=ed.b[0]-ed.a[0],dy=ed.b[1]-ed.a[1],len=Math.hypot(dx,dy);return {...ed,dx,dy,len,angle:Math.atan2(dy,dx)*180/Math.PI};});}
function selectedSpace(){if(selected==='space:layout')return {id:'layout',name:state.room.name,floorColor:state.room.floorColor};return state.room.spaces?.find(r=>selected===`space:${r.id}`);}
function spacePoints(room){return room.id==='layout'?state.room.vertices:spacePolygon(room,edges());}
function layoutBounds(){const points=[...state.room.vertices,...(state.room.spaces||[]).flatMap(r=>spacePolygon(r,edges())||[])],xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);return {x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),d:Math.max(...ys)-Math.min(...ys)};}
function detachSpace(room){
 const all=edges(),shared=room.walls.filter(ref=>!ref.id||(state.room.spaces||[]).some(r=>r.id!==room.id&&r.walls.some(w=>w.id===ref.id)));
 const attachments=ref=>state.items.filter(o=>TYPES[o.kind].opening&&(ref.id?o.wallId===ref.id:!o.wallId&&o.wall===ref.index));
 if(state.items.length+shared.reduce((n,ref)=>n+1+attachments(ref).length,0)>200)throw new Error('Not enough item capacity to separate these shared walls.');
 for(const ref of shared){const ed=all.find((ed,i)=>ref.id?ed.id===ref.id:!ed.id&&i===ref.index),source=ref.id?state.items.find(o=>o.id===ref.id):null,faces=wallFaces(ed,ref.index),openings=attachments(ref).map(copy),wall=source?{...copy(source),id:uid()}:item('wall',(ed.a[0]+ed.b[0])/2,(ed.a[1]+ed.b[1])/2,{w:ed.len,d:state.room.wallThickness,h:state.room.edgeHeights?.[ref.index]||state.room.height,rotation:ed.angle,color:faces.base,faceColors:{a:faces.a,b:faces.b},label:room.name+' · wall'});
 state.items.push(wall);ref.id=wall.id;delete ref.index;
 for(const opening of openings)state.items.push({...opening,id:uid(),wallId:wall.id,wall:edges().findIndex(e=>e.id===wall.id)});
 }
}
function wallFaces(ed,index){const o=ed.id?state.items.find(o=>o.id===ed.id):null,base=o?.color||state.room.edgeColors?.[index]||state.room.wallColor||'#e5e0d5',faces=o?.faceColors||state.room.edgeFaceColors?.[index]||{};return {a:faces.a||base,b:faces.b||base,base};}
function paintFace(ref,color){if(ref.id){const o=state.items.find(o=>o.id===ref.id&&o.kind==='wall');if(o){o.faceColors??={};o.faceColors[ref.side]=color;}}else if(ref.index<state.room.vertices.length){state.room.edgeFaceColors??={};state.room.edgeFaceColors[ref.index]??={};state.room.edgeFaceColors[ref.index][ref.side]=color;}}
function roomPaintOptions(){const current=$('paint-room').value;$('paint-room').innerHTML=`<option value="home">${esc(state.room.name||'My room')}</option>`+(state.room.spaces||[]).map(r=>`<option value="${esc(r.id)}">${esc(r.name)}</option>`).join('');if([...$('paint-room').options].some(o=>o.value===current))$('paint-room').value=current;$('paint-room').onchange?.();}
function bounds(){const xs=state.room.vertices.map(p=>p[0]),ys=state.room.vertices.map(p=>p[1]);return {x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),d:Math.max(...ys)-Math.min(...ys)};}
function anchor(o){if(!TYPES[o.kind].opening)return o;const all=edges();let index=o.wallId?all.findIndex(e=>e.id===o.wallId):o.wall||0;if(index<0){delete o.wallId;index=0;}o.wall=clamp(index,0,all.length-1);const ed=all[o.wall];if(ed.id)o.wallId=ed.id;else delete o.wallId;o.w=clamp(o.w,.03,Math.max(.03,ed.len-.04));o.offset=clamp(o.offset??ed.len/2,o.w/2,ed.len-o.w/2);o.x=ed.a[0]+ed.dx*o.offset/ed.len;o.y=ed.a[1]+ed.dy*o.offset/ed.len;o.rotation=ed.angle;return o;}
function nearestWall(o,x,y){let best=null;edges().forEach((ed,i)=>{const t=clamp(((x-ed.a[0])*ed.dx+(y-ed.a[1])*ed.dy)/(ed.len**2),0,1),qx=ed.a[0]+ed.dx*t,qy=ed.a[1]+ed.dy*t,dist=Math.hypot(qx-x,qy-y);if(!best||dist<best.dist)best={dist,i,offset:t*ed.len};});o.wall=best.i;o.wallId=edges()[best.i].id;o.offset=best.offset;anchor(o);}
const feet=feetAndInches;
function dual(m){return `${centimetres(m)} cm · ${metric(m)} · ≈ ${feet(m)}`;}
function toast(s){$('toast').textContent=s;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),3600);}
function snapshot(){return JSON.stringify(state);}
function remember(before){if(before!==snapshot()){undoStack.push(before);if(undoStack.length>50)undoStack.shift();redoStack=[];}persist();}
function persist(){if(store)cloudSave(copy(state));try{localStorage.setItem(STORAGE,snapshot());if(!store)$('save-state').textContent='All changes saved locally';}catch{$('save-state').textContent='Storage unavailable · export your project';}buttons();}
function buttons(){$('undo').disabled=!undoStack.length;$('redo').disabled=!redoStack.length;}
function mutate(fn){const before=snapshot();fn();state.items.forEach(anchor);remember(before);refresh();}
function undo(){if(!undoStack.length)return;redoStack.push(snapshot());state=JSON.parse(undoStack.pop());selected=null;refresh();persist();}
function redo(){if(!redoStack.length)return;undoStack.push(snapshot());state=JSON.parse(redoStack.pop());selected=null;refresh();persist();}
function selectedOuterWall(){return typeof selected==='string'&&selected.startsWith('outer-wall:')?Number(selected.split(':')[1]):null;}
function selection(){return state.items.find(o=>o.id===selected);}
function point(e){const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());}
const snap=v=>$('snap').checked?Math.round(v/.05)*.05:v;
function pathPoly(points){return points.map((p,i)=>`${i?'L':'M'}${p[0]},${p[1]}`).join(' ')+'Z';}
function shape(o){return planItemShape(o);}
function drawPlan(){state.items.forEach(anchor);const b=fitFrame??(fitFrame=layoutBounds()),r=stage.getBoundingClientRect(),mobile=r.width<=780;
 const panelWidth=id=>$(id).hidden?0:$(id).getBoundingClientRect().width;
 const left=mobile?16:panelWidth('studio-objects')+28,right=mobile?16:panelWidth('studio-properties')+28;
 const top=mobile?190:132,bottom=mobile?94:78,availableW=Math.max(100,r.width-left-right),availableH=Math.max(100,r.height-top-bottom);
 const scale=Math.max(.01,Math.min(availableW/(b.w+.8),availableH/(b.d+.8))*zoom),vw=r.width/scale,vh=r.height/scale;
 svg.setAttribute('viewBox',`${b.x+b.w/2-(left+availableW/2)/scale+pan.x} ${b.y+b.d/2-(top+availableH/2)/scale+pan.y} ${vw} ${vh}`);
 $('studio-canvas').style.setProperty('--canvas-centre',`${left+availableW/2}px`);

 let s=`<defs><pattern id="grid" width=".1" height=".1" patternUnits="userSpaceOnUse"><circle cx=".05" cy=".05" r=".005" fill="#cfd8ca"/></pattern></defs><rect x="-30" y="-30" width="60" height="60" fill="url(#grid)"/><path data-space="layout" d="${pathPoly(state.room.vertices)}" fill="${esc(state.room.floorColor||'#eee9df')}" stroke="#505f56" stroke-width="${state.room.wallThickness}" stroke-linejoin="miter"/>`;
 if(state.room.reference?.data&&state.room.reference.visible!==false)s+=`<image id="floorplan-reference" href="${esc(state.room.reference.data)}" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.d}" opacity="${state.room.reference.opacity??.45}" preserveAspectRatio="none" pointer-events="none"/>`;
 for(const room of state.room.spaces||[]){const points=spacePolygon(room,edges());if(points)s+=`<path data-space="${esc(room.id)}" d="${pathPoly(points)}" fill="${esc(room.floorColor||state.room.floorColor||'#eee9df')}" stroke="${selected===`space:${room.id}`?'#315b4a':'none'}" stroke-width="${2/scale}" stroke-dasharray="${6/scale} ${4/scale}"/>`;}
 for(const z of state.room.zones||[])s+=`<text x="${z.x}" y="${z.y}" font-family="system-ui" font-size=".14" text-anchor="middle" fill="#476855" pointer-events="none">${esc(z.name)}</text>`;
 const eds=edges().slice(0,state.room.vertices.length);eds.forEach((ed,i)=>{
 const faces=wallFaces(ed,i),color=faces.base,active=selectedOuterWall()===i;
 const nx=-ed.dy/ed.len,ny=ed.dx/ed.len,t=state.room.wallThickness;
 for(const [side,sign] of [['a',1],['b',-1]])s+=`<path d="M${ed.a[0]+nx*t*sign/4} ${ed.a[1]+ny*t*sign/4} L${ed.b[0]+nx*t*sign/4} ${ed.b[1]+ny*t*sign/4}" stroke="${esc(faces[side])}" stroke-width="${t/2}" pointer-events="none"/>`;
 s+=`<g data-outer-wall="${i}" style="cursor:pointer"><title>Outer wall ${i+1} · ${dual(ed.len)}</title><path d="M${ed.a[0]} ${ed.a[1]} L${ed.b[0]} ${ed.b[1]}" stroke="${active?'#315b4a':'transparent'}" stroke-width="${active?2/scale:Math.max(state.room.wallThickness,16/scale)}" ${active?'stroke-dasharray=".08 .04"':''} fill="none"/></g>`;
});
 const ordered=[...state.items].sort((a,b)=>(a.kind==='wall'?-2:a.kind==='rug'?-1:TYPES[a.kind].opening?2:0)-(b.kind==='wall'?-2:b.kind==='rug'?-1:TYPES[b.kind].opening?2:0));
 for(const o of ordered){s+=`<g class="furniture" data-id="${esc(o.id)}" transform="translate(${o.x} ${o.y}) rotate(${o.rotation})"><title>${esc(o.label)} · ${centimetres(o.w)} × ${centimetres(o.d)} cm</title>${shape(o)}`;if(o.id===selected)s+=`<rect x="${-o.w/2-.045}" y="${-o.d/2-.045}" width="${o.w+.09}" height="${o.d+.09}" fill="none" stroke="#3a8264" stroke-width=".025" stroke-dasharray=".065 .035" rx=".035"/>`;s+='</g>';if(o.id===selected&&!['fan','rug','pillar','ac','door','window','wall'].includes(o.kind))s+=`<text x="${o.x}" y="${o.y}" text-anchor="middle" dominant-baseline="middle" font-family="system-ui" font-size="${Math.min(.11,11/scale)}" fill="#394d40" pointer-events="none">${esc(o.label.slice(0,25))}</text>`;}
 for(const room of state.room.spaces||[]){
  const m=roomMeasurements(room,edges(),state.room.wallThickness);if(!m)continue;
  const label=room.labelPosition||[.5,.55],x=m.x+m.w*label[0],y=m.y+m.d*label[1],vertical=m.w<1.6&&m.d>m.w*2;
  const available=vertical?m.d:m.w,font=Math.min(11/scale,available/(room.name.length*.6+1));
  const transform=vertical?' transform="rotate(-90 '+x+' '+y+')"':'';
  s+='<text x="'+x+'" y="'+y+'" text-anchor="middle" font-family="system-ui" font-size="'+font+'" fill="#535d4d" stroke="#f5f3ed" stroke-width="'+2/scale+'" paint-order="stroke" stroke-linejoin="round" data-space="'+esc(room.id)+'"'+transform+'>'+esc(room.name);
  if(room.labelPosition)s+='<tspan x="'+x+'" dy="'+font*1.35+'" font-size="'+font*.82+'">'+m.clearWidth.toFixed(2)+' × '+m.clearDepth.toFixed(2)+' m</tspan>';
  s+='</text>';
 }
 const selectedWall=selection();if(selectedWall?.kind==='wall'){const o=selectedWall,a=o.rotation*Math.PI/180;for(const [label,sign] of [['A',1],['B',-1]]){const offset=o.d/2+14/scale;s+=`<text x="${o.x-Math.sin(a)*offset*sign}" y="${o.y+Math.cos(a)*offset*sign}" text-anchor="middle" dominant-baseline="middle" font-size="${11/scale}" fill="#315b4a" pointer-events="none">${label}</text>`;}}
 const chosen=selection();
 if(chosen){const o=chosen,handles=TYPES[o.kind].opening?['w','e']:['nw','n','ne','e','se','s','sw','w'],size=10/scale,hit=22/scale;
 s+=`<g class="selection-handles" data-selection-id="${esc(o.id)}" transform="translate(${o.x} ${o.y}) rotate(${o.rotation})">`;
 for(const h of handles){const x=h.includes('e')?o.w/2:h.includes('w')?-o.w/2:0,y=h.includes('s')?o.d/2:h.includes('n')?-o.d/2:0;
 const angle=(Math.atan2(h.includes('s')?1:h.includes('n')?-1:0,h.includes('e')?1:h.includes('w')?-1:0)*180/Math.PI+o.rotation+360)%180,cursors=['ew-resize','nwse-resize','ns-resize','nesw-resize'],cursor=cursors[Math.round(angle/45)%4];
 s+=`<g data-resize="${h}" style="cursor:${cursor}"><title>Resize ${h.toUpperCase()}</title><rect x="${x-hit/2}" y="${y-hit/2}" width="${hit}" height="${hit}" fill="transparent"/><rect x="${x-size/2}" y="${y-size/2}" width="${size}" height="${size}" rx="${2/scale}" fill="#faf9f2" stroke="#315b4a" stroke-width="${1.5/scale}" pointer-events="none"/></g>`;}
 s+='</g>';}
 if($('edit-walls').checked)state.room.vertices.forEach((p,i)=>s+=`<circle class="vertex" data-vertex="${i}" cx="${p[0]}" cy="${p[1]}" r=".08" fill="#315b4a" stroke="white" stroke-width=".025"/>`);
 svg.innerHTML=s;
}
function inspector(){const room=selectedSpace(),o=selection(),wallIndex=selectedOuterWall(),wall=wallIndex!==null?edges()[wallIndex]:null;
 document.dispatchEvent(new CustomEvent('vela:selection',{detail:{id:o?.id||((wall||room)?selected:null),interacting:!!drag}}));
 $('space-form').hidden=!room;if(room){$('space-hint').textContent=room.id==='layout'?'Drag the original room floor to move the entire layout and its contents.':'Drag this room’s floor or name to move its walls, floor and attached openings. Shared walls separate; neighbouring rooms stay in place.';const points=spacePoints(room);$('space-floor-color').value=room.floorColor||state.room.floorColor||'#eee9df';$('space-measurements').textContent=points?`${dual(Math.max(...points.map(p=>p[0]))-Math.min(...points.map(p=>p[0])))} × ${dual(Math.max(...points.map(p=>p[1]))-Math.min(...points.map(p=>p[1])))}`:'Join the room’s walls to restore its floor.';}$('item-form').hidden=!o;$('outer-wall-form').hidden=!wall;$('empty-inspector').hidden=!!o||!!wall||!!room;
 $('inspector-title').textContent=o?o.label:wall?`Outer wall ${wallIndex+1}`:room?room.name:'Your layout';
 if(wall){$('outer-wall-measurements').textContent=`Centre-line length: ${dual(wall.len)} · Height: ${dual(state.room.edgeHeights?.[wallIndex]||state.room.height)}`;const faces=wallFaces(wall,wallIndex);$('outer-wall-color').value=faces.a;$('outer-wall-back-color').value=faces.b;}
 if(!o)return;
 $('item-label').value=o.label;for(const [field,key] of [['width','w'],['depth','d'],['height','h'],['elevation','e'],['x','x'],['y','y']]){$(`item-${field}`).value=centimetres(o[key]);$(`item-${field}-equivalent`).textContent=`≈ ${feet(o[key])} · ${metric(o[key])}`;}$('item-rotation').value=Math.round(o.rotation);$('item-color').value=o.kind==='wall'?o.faceColors?.a||o.color:o.color;$('item-color-label').textContent=o.kind==='wall'?'Side A colour':'Colour';$('item-back-color-field').hidden=o.kind!=='wall';$('wall-face-note').hidden=o.kind!=='wall';$('item-back-color').value=o.faceColors?.b||o.color;
 const doorForm=catalogueVariants[o.variant]?.form,hinged=o.kind==='door'&&!['sliding','open'].includes(doorForm);$('door-controls').hidden=!hinged;if(hinged){const internal=!!edges()[o.wall]?.id;$('door-swing').options[0].textContent=internal?'Wall side A':'Inside';$('door-swing').options[1].textContent=internal?'Wall side B':'Outside';$('door-swing').value=doorPose(o,doorForm).side<0?'b':'a';$('door-hinge').hidden=doorForm==='double';$('door-swing-note').textContent=doorForm==='double'?'Both leaves open toward the chosen side.':'Flip the hinge to the other end. The plan arc shows where the door opens.';}
 const opening=!!TYPES[o.kind].opening;$('wall-field').hidden=!opening;$('position-fields').hidden=opening;$('rotation-label').hidden=opening;$('rotate-item').disabled=opening;$('mirror-item').hidden=o.kind!=='lsofa';$('mirror-item').textContent=o.kind==='door'?'Flip swing':'Flip chaise';$('item-depth').disabled=opening;
 $('item-wall').innerHTML=edges().map((ed,i)=>`<option value="${i}">${esc(ed.label||`Outer wall ${i+1}`)} · ${feet(ed.len)}</option>`).join('');$('item-wall').value=o.wall??0;
 $('item-note').textContent=opening?'Drag onto an outer or internal wall to move this opening. “Above floor” is the window sill height; doors start at zero. Door swing is schematic.':o.kind==='dining'?'Width and depth measure the table. Chairs extend beyond it; leave room to pull them out.':o.kind==='lsofa'?'Depth includes the chaise. Flip chaise changes its side while keeping the sofa in place.':'Dimensions are in centimetres. Rotation is clockwise in the top plan.';
}
function pointInRoom(x,y){return [state.room.vertices,...(state.room.spaces||[]).map(r=>spacePolygon(r,edges())).filter(Boolean)].some(p=>pointInPolygon([x,y],p));}
function warnings(){const outside=state.items.filter(o=>!TYPES[o.kind].opening&&!pointInRoom(o.x,o.y));const high=state.items.filter(o=>o.e+o.h>state.room.height+.01);return outside.length?`${outside.length} item(s) have their centre outside the room.`:high.length?`${high.length} item(s) extend above the ceiling.`:'';}
function refresh(){roomPaintOptions();$('reference-controls').hidden=!state.room.reference;$('reference-visible').checked=state.room.reference?.visible!==false;$('reference-opacity').value=state.room.reference?.opacity??.45;$('room-preset').value='current';const b=bounds();$('room-title').textContent=state.room.name;$('room-dimensions').textContent=`${feet(b.w)} × ${feet(b.d)} · ${Number(b.w.toFixed(2))} × ${Number(b.d.toFixed(2))} m`;$('room-name').value=state.room.name;$('room-width').value=centimetres(b.w);$('room-depth').value=centimetres(b.d);$('room-height').value=centimetres(state.room.height);$('notes').value=state.notes;$('item-count').textContent=`${state.items.length} items placed`;$('status-message').dataset.warning=String(Boolean(warnings()));$('status-message').textContent=warnings()||(selection()?'Selected: '+selection().label:'Choose an item to see its measurements.');drawPlan();inspector();buttons();if(mode==='3d')build3D();document.dispatchEvent(new Event('vela:change'));}
function add(key,p){const variant=catalogueVariants[key],kind=variant?.kind||key;if(!TYPES[kind])return;const b=bounds();mutate(()=>{const o=item(kind,p?.x??b.x+b.w/2,p?.y??b.y+b.d/2,variant?{label:variant.label,w:variant.w,d:variant.d,h:variant.h,e:variant.e??TYPES[kind].e??0,variant:key}:{});if(TYPES[kind].opening)nearestWall(o,o.x,o.y);if(kind==='fan')o.e=Math.max(0,state.room.height-.4);state.items.push(o);selected=o.id;});toast(`${variant?.label||TYPES[kind].label} added. Drag to place it.`);}
let cataloguePath=[],catalogueAnimation,catalogueTypeFilter='All';
const climateKinds=new Set(['ac','fan','heater']);
function catalogue(direction=0,restoreGroup){
 const query=$('catalogue-search').value,room=$('catalogue-room').value,searching=!!query.trim(),entries=catalogueEntries(TYPES,{category,room,query}),nested=cataloguePath.length>0;
 const current=cataloguePath.at(-1),climate=current==='Climate control',leaf=nested&&!climate;
 let visible=searching?entries:entries.filter(v=>!nested||(climate?climateKinds.has(v.kind):catalogueGroups[v.kind]===current));
 const typeOptions=leaf&&!searching?[...new Set(visible.map(catalogueType).filter(Boolean))]:[];
 if(direction||!typeOptions.includes(catalogueTypeFilter))catalogueTypeFilter='All';
 $('catalogue-type-filters').hidden=typeOptions.length<2;
 $('catalogue-type-filters').innerHTML=typeOptions.length<2?'':`<span>Type</span><div>${['All',...typeOptions].map(type=>`<button type="button" data-type="${esc(type)}" aria-pressed="${catalogueTypeFilter===type}">${esc(type)}</button>`).join('')}</div>`;
 if(catalogueTypeFilter!=='All')visible=visible.filter(v=>catalogueType(v)===catalogueTypeFilter);
 const groups=new Map();
 if(!searching&&!leaf)for(const v of visible){const name=['electronics','all'].includes(category)&&!nested&&climateKinds.has(v.kind)?'Climate control':catalogueGroups[v.kind];if(!groups.has(name))groups.set(name,[]);groups.get(name).push(v);}
 const groupIcon=(name,v)=>catalogueIcons[name]?`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${catalogueIcons[name]}"/></svg>`:icon(v);
 const preview=v=>{const pad=v.kind==='dining'?.45:.16,w=v.w+pad*2,d=Math.max(v.d,v.kind==='door'?v.w*2:v.d)+pad*2;return `<svg class="item-preview" viewBox="${-w/2} ${-d/2} ${w} ${d}" aria-hidden="true">${shape({...v,variant:v.id})}</svg>`;};
 const card=v=>`<button class="catalogue-item-card" draggable="true" data-kind="${v.id}" title="Add ${esc(v.label)}"><div class="item-preview-stage">${preview(v)}</div><span>${esc(v.label)}</span><small>${Math.round(v.w*100)} × ${Math.round(v.d*100)} cm</small></button>`;
 const icon=v=>`<svg viewBox="0 0 42 32" aria-hidden="true"><path d="${v.icon}"/></svg>`;
 $('catalogue').innerHTML=searching||leaf?visible.map(card).join(''):[...groups].map(([name,items])=>`<button data-group="${esc(name)}" aria-label="Open ${esc(name)}">${groupIcon(name,items[0])}<span>${esc(name)}</span></button>`).join('');
 $('catalogue-section-title').textContent=searching?'Results':leaf?'Collection':'Categories';
 const featured=!nested&&!searching&&category==='furniture'?(groups.get('Sofas')||[]):[];
 $('catalogue-featured').hidden=!featured.length;
 $('catalogue-featured').innerHTML=featured.length?`<div class="catalogue-meta"><h3>Sofas</h3><span>${featured.length} items</span></div><div class="catalogue">${featured.map(card).join('')}</div>`:'';
 $('catalogue-empty').hidden=visible.length>0;
 $('catalogue-count').textContent=searching?`${visible.length} results · all categories`:leaf?`${visible.length} options`:`${groups.size} categories`;
 $('collection-count').textContent=leaf||searching?`${visible.length} items`:`${groups.size} categories`;
 $('catalogue-navigation').hidden=!nested&&!searching;
 $('catalogue-title').textContent=searching?'Search results':current||'';$('catalogue-heading-icon').innerHTML=!searching&&visible[0]?groupIcon(current,visible[0]):'';
 const parent=searching?(current||'categories'):(cataloguePath.at(-2)||'categories');
 $('catalogue-back').setAttribute('aria-label',`Back to ${parent}`);$('catalogue-back-label').textContent=parent==='categories'?'All categories':parent;
 $('studio-objects').classList.toggle('catalogue-inside',nested||searching);
 catalogueAnimation?.cancel();
 if(direction){$('studio-objects').scrollTop=0;if(!matchMedia('(prefers-reduced-motion: reduce)').matches)catalogueAnimation=$('catalogue').animate([{transform:`translateX(${direction*40}px)`,opacity:.25},{transform:'translateX(0)',opacity:1}],{duration:240,easing:'cubic-bezier(.22,.68,0,1)'});
 const restored=[...$('catalogue').querySelectorAll('[data-group]')].find(n=>n.dataset.group===restoreGroup);
 (restored||(!nested&&!searching?$('catalogue-search'):$('catalogue-title'))).focus({preventScroll:true});}
}
function chooseCategory(next){category=next;catalogueTypeFilter='All';cataloguePath=[];$('catalogue-search').value='';document.querySelectorAll('[data-category]').forEach(n=>{const active=n.dataset.category===next;n.classList.toggle('active',active);n.setAttribute('aria-pressed',String(active));});$('build-tab').classList.toggle('active',next==='structure');$('design-tab').classList.toggle('active',next!=='structure');catalogue();$('studio-objects').scrollTop=0;}
$('catalogue-back').onclick=()=>{if($('catalogue-search').value.trim()){$('catalogue-search').value='';catalogue(-1);}else{const previous=cataloguePath.pop();catalogue(-1,previous);}};
listen($('catalogue-type-filters'),'click',e=>{const button=e.target.closest('[data-type]');if(!button)return;catalogueTypeFilter=button.dataset.type;catalogue();[...$('catalogue-type-filters').querySelectorAll('[data-type]')].find(b=>b.dataset.type===catalogueTypeFilter)?.focus({preventScroll:true});});
$('catalogue-room').onchange=()=>{catalogueTypeFilter='All';catalogue();};$('catalogue-clear').onclick=()=>{catalogueTypeFilter='All';$('catalogue-search').value='';$('catalogue-room').value='all';cataloguePath=[];catalogue();};
$('build-tab').onclick=()=>{chooseCategory('structure');document.dispatchEvent(new Event('vela:library'));};
listen($('design-tab'),'click',()=>{chooseCategory('furniture');document.dispatchEvent(new Event('vela:library'));});
listen($('catalogue'),'click',e=>{const group=e.target.closest('[data-group]');if(group){cataloguePath.push(group.dataset.group);catalogue(1);return;}const b=e.target.closest('[data-kind]');if(b)add(b.dataset.kind);});
listen($('catalogue-featured'),'click',e=>{const b=e.target.closest('[data-kind]');if(b)add(b.dataset.kind);});
listen($('catalogue-featured'),'dragstart',e=>{const b=e.target.closest('[data-kind]');if(b)e.dataTransfer.setData('text/roomnote-kind',b.dataset.kind);});
listen($('catalogue'),'dragstart',e=>{const b=e.target.closest('[data-kind]');if(b)e.dataTransfer.setData('text/roomnote-kind',b.dataset.kind);});
listen(svg,'dragover',e=>e.preventDefault());listen(svg,'drop',e=>{e.preventDefault();const kind=e.dataTransfer.getData('text/roomnote-kind');if(TYPES[kind]||catalogueVariants[kind])add(kind,point(e));});
document.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>chooseCategory(b.dataset.category));
listen(svg,'contextmenu',e=>e.preventDefault());
listen(svg,'wheel',e=>{e.preventDefault();if(drag||mode!=='plan')return;const before=point(e),delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?stage.clientHeight:1);zoom=clamp(zoom*Math.exp(-clamp(delta,-300,300)*.002),.25,8);drawPlan();const after=point(e);pan.x+=before.x-after.x;pan.y+=before.y-after.y;drawPlan();},{passive:false});
function moveSpace(p){
 const dx=snap(p.x-drag.start.x),dy=snap(p.y-drag.start.y);if(!drag.original&&!dx&&!dy)return;
 if(!drag.original){try{if(drag.space!=='layout'){const room=selectedSpace();if(!spacePoints(room)){toast('Join the room’s walls before moving it.');cancelDrag();return;}detachSpace(room);}drag.original=copy(state);}catch(err){toast(err.message);cancelDrag();return;}}
 state=copy(drag.original);
 if(drag.space==='layout'){
  const xs=state.room.vertices.map(p=>p[0]),ys=state.room.vertices.map(p=>p[1]),mx=clamp(dx,Math.max(-Math.min(...xs),-25-Math.min(...state.items.map(o=>o.x))),Math.min(25-Math.max(...xs),25-Math.max(...state.items.map(o=>o.x)))),my=clamp(dy,Math.max(-Math.min(...ys),-25-Math.min(...state.items.map(o=>o.y))),Math.min(25-Math.max(...ys),25-Math.max(...state.items.map(o=>o.y))));
  state.room.vertices=state.room.vertices.map(([x,y])=>[x+mx,y+my]);state.items.forEach(o=>{if(!TYPES[o.kind].opening){o.x+=mx;o.y+=my;}});(state.room.zones||[]).forEach(z=>{z.x+=mx;z.y+=my;});
 }else{const room=selectedSpace(),ids=new Set(room.walls.map(r=>r.id)),walls=state.items.filter(o=>ids.has(o.id)),mx=clamp(dx,-25-Math.min(...walls.map(o=>o.x)),25-Math.max(...walls.map(o=>o.x))),my=clamp(dy,-25-Math.min(...walls.map(o=>o.y)),25-Math.max(...walls.map(o=>o.y)));walls.forEach(o=>{o.x+=mx;o.y+=my;});}
 state.items.forEach(anchor);drawPlan();inspector();
}
listen(svg,'pointerdown',e=>{if(drag)return;if(e.button===2){e.preventDefault();drag={pan:true,start:{x:e.clientX,y:e.clientY},originalPan:{...pan},scale:svg.getScreenCTM().a,pointerId:e.pointerId};svg.dataset.panning='true';svg.setPointerCapture(e.pointerId);return;}if(e.button!==0)return;const handle=e.target.closest('[data-resize]'),target=e.target.closest('[data-id],[data-selection-id]'),vertex=e.target.closest('[data-vertex]'),outerWall=e.target.closest('[data-outer-wall]'),space=e.target.closest('[data-space]');if(outerWall){selected=`outer-wall:${outerWall.dataset.outerWall}`;drag=null;}else if(vertex){drag={vertex:+vertex.dataset.vertex,before:snapshot()};}else if(target){selected=target.dataset.id||target.dataset.selectionId;const o=selection(),p=point(e);drag={id:o.id,before:snapshot(),pointerId:e.pointerId,dx:p.x-o.x,dy:p.y-o.y,...(handle?{handle:handle.dataset.resize,original:copy(o),start:p}:{})};}else if(space){selected=`space:${space.dataset.space}`;drag={space:space.dataset.space,start:point(e),before:snapshot(),pointerId:e.pointerId};}else{selected=null;drag=null;}drawPlan();inspector();if(drag){svg.setPointerCapture(e.pointerId);e.preventDefault();}});
listen(svg,'pointermove',e=>{if(!drag||drag.pointerId!==undefined&&drag.pointerId!==e.pointerId)return;if(drag.pan){pan={x:drag.originalPan.x-(e.clientX-drag.start.x)/drag.scale,y:drag.originalPan.y-(e.clientY-drag.start.y)/drag.scale};drawPlan();return;}const p=point(e);if(drag.space){moveSpace(p);return;}if(drag.vertex!==undefined){state.room.vertices[drag.vertex]=[clamp(snap(p.x),0,25),clamp(snap(p.y),0,25)];const eds=edges();if(eds.some(ed=>ed.len<.10))return;}else{const o=state.items.find(o=>o.id===drag.id);if(drag.handle){const original=drag.original,opening=!!TYPES[o.kind].opening,ed=opening?edges()[original.wall]:null,sx=drag.handle.includes('e')?1:-1,maxWidth=opening?Math.min(10,sx>0?ed.len-(original.offset-original.w/2):original.offset+original.w/2):10;Object.assign(o,resizeItem(original,drag.handle,{x:p.x-drag.start.x,y:p.y-drag.start.y},{snap,maxWidth,opening}));}else if(TYPES[o.kind].opening)nearestWall(o,p.x,p.y);else{o.x=snap(p.x-drag.dx);o.y=snap(p.y-drag.dy);}}drawPlan();inspector();});
function finishDrag(){if(!drag)return;if(drag.pan){drag=null;delete svg.dataset.panning;return;}const before=drag.before;drag=null;if(!validPolygon(state.room.vertices)){state=JSON.parse(before);toast('That wall shape crosses itself or is too small. Try another position.');}state.items.forEach(anchor);remember(before);refresh();}
listen(svg,'pointerup',finishDrag);
function cancelDrag(){if(!drag)return;if(drag.pan){pan=drag.originalPan;drag=null;delete svg.dataset.panning;drawPlan();return;}state=JSON.parse(drag.before);drag=null;refresh();}
listen(svg,'pointercancel',cancelDrag);listen(svg,'lostpointercapture',cancelDrag);
listen(document,'keydown',e=>{if(e.key==='Escape'&&drag){cancelDrag();e.preventDefault();}});
for(const [id,side] of [['outer-wall-color','a'],['outer-wall-back-color','b']])$(id).onchange=e=>mutate(()=>{const i=selectedOuterWall();if(i!==null)paintFace({index:i,side},e.target.value);});
$('outer-wall-reset').onclick=()=>mutate(()=>{const i=selectedOuterWall();if(i!==null){if(state.room.edgeColors)delete state.room.edgeColors[i];if(state.room.edgeFaceColors)delete state.room.edgeFaceColors[i];}});
listen($('item-form'),'submit',e=>e.preventDefault());
for(const [field,key] of [['width','w'],['depth','d'],['height','h'],['elevation','e'],['x','x'],['y','y']])listen($(`item-${field}`),'change',e=>{const v=Number(e.target.value)/100;if(!Number.isFinite(v))return;mutate(()=>{const o=selection();if(!o)return;o[key]=clamp(v,['x','y'].includes(key)?-20:key==='e'?0:.015,['x','y'].includes(key)?25:key==='e'||key==='h'?6:10);});});
for(const [id,delta] of [['lower-item',-.05],['raise-item',.05]])$(id).onclick=()=>mutate(()=>{const o=selection();if(o)o.e=Math.round(clamp(o.e+delta,0,6)*1e8)/1e8;});
$('door-swing').onchange=e=>mutate(()=>{const o=selection();if(o?.kind==='door'&&!['sliding','open'].includes(catalogueVariants[o.variant]?.form))o.swing=e.target.value==='b'?'b':'a';});
$('door-hinge').onclick=()=>mutate(()=>{const o=selection();if(o?.kind==='door'&&!['sliding','double','open'].includes(catalogueVariants[o.variant]?.form))o.hinge=o.hinge==='right'?'left':'right';});
$('item-label').onchange=e=>mutate(()=>{if(selection())selection().label=e.target.value.slice(0,80)||TYPES[selection().kind].label;});
$('item-rotation').onchange=e=>mutate(()=>{if(selection())selection().rotation=((Number(e.target.value)||0)%360+360)%360;});
$('item-color').onchange=e=>mutate(()=>{const o=selection();if(o?.kind==='wall')paintFace({id:o.id,side:'a'},e.target.value);else if(o)o.color=e.target.value;});
$('item-back-color').onchange=e=>mutate(()=>{if(selection()?.kind==='wall')paintFace({id:selected,side:'b'},e.target.value);});
$('item-wall').onchange=e=>mutate(()=>{if(selection()){selection().wall=+e.target.value;selection().wallId=edges()[+e.target.value].id;selection().offset=edges()[+e.target.value].len/2;}});
function rotate(){if(selection()&&!TYPES[selection().kind].opening)mutate(()=>selection().rotation=(selection().rotation+90)%360);}
function remove(){if(selection())mutate(()=>{state.items=state.items.filter(o=>o.id!==selected);selected=null;});}
function duplicate(){if(!selection())return;mutate(()=>{const o=copy(selection());o.id=uid();o.label+=' copy';o.x+=.2;o.y+=.2;if(TYPES[o.kind].opening)o.offset+=.25;state.items.push(o);selected=o.id;});}
$('rotate-item').onclick=rotate;$('delete-item').onclick=remove;$('duplicate-item').onclick=duplicate;$('mirror-item').onclick=()=>mutate(()=>{if(selection())selection().flip=!selection().flip;});
$('undo').onclick=undo;$('redo').onclick=redo;
listen(document,'keydown',e=>{if(document.querySelector('dialog[open]')||!document.getElementById('presentation').hidden||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redo():undo();return;}if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();remove();}if(e.key.toLowerCase()==='r')rotate();if(e.key.toLowerCase()==='d'&&!e.ctrlKey&&!e.metaKey)duplicate();if(selection()&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();mutate(()=>{const o=selection(),step=e.shiftKey?.01:.05;const x=o.x+(e.key==='ArrowRight'?step:e.key==='ArrowLeft'?-step:0),y=o.y+(e.key==='ArrowDown'?step:e.key==='ArrowUp'?-step:0);if(TYPES[o.kind].opening)nearestWall(o,x,y);else{o.x=x;o.y=y;}});}});
$('paint-room').onchange=()=>{$('room-floor-paint').value=state.room.spaces?.find(r=>r.id===$('paint-room').value)?.floorColor||state.room.floorColor||'#eee9df';$('room-paint-note').textContent=$('paint-room').value==='home'?'Replaces colours on both faces of every wall.':'Paints only the inward-facing sides of this room’s walls.';};
$('space-floor-color').onchange=e=>mutate(()=>{const room=selectedSpace();if(room?.id==='layout')state.room.floorColor=e.target.value;else if(room)room.floorColor=e.target.value;});
$('apply-room-floor').onclick=()=>mutate(()=>{const id=$('paint-room').value,color=$('room-floor-paint').value;if(id==='home'){state.room.floorColor=color;(state.room.spaces||[]).forEach(r=>r.floorColor=color);}else{const room=state.room.spaces?.find(r=>r.id===id);if(room)room.floorColor=color;}});
$('apply-room-paint').onclick=()=>{const target=$('paint-room').value,color=$('room-paint').value;mutate(()=>{if(target==='home'){state.room.wallColor=color;state.room.edgeColors={};state.room.edgeFaceColors={};for(const o of state.items.filter(o=>o.kind==='wall')){o.color=color;o.faceColors={};}}else{const room=state.room.spaces?.find(r=>r.id===target);room?.walls.forEach(ref=>paintFace(ref,color));}});toast('Wall colour applied. Undo restores the previous colours.');};
$('add-room').onclick=()=>{const dialog=$('studio-dialog');$('dialog-title').textContent='Add a room';$('dialog-eyebrow').textContent='BUILD YOUR HOME';$('dialog-content').innerHTML=`<form id="new-room-form"><label>Room name<input id="new-room-name" value="Room ${(state.room.spaces?.length||0)+1}" maxlength="80" required/></label><div class="two-fields"><label>Width · cm<input id="new-room-width" type="number" min="100" max="1000" step="any" value="200" required/></label><label>Depth · cm<input id="new-room-depth" type="number" min="100" max="1000" step="any" value="200" required/></label></div><div class="two-fields"><label>From left · cm<input id="new-room-x" type="number" min="0" step="any" value="25" required/></label><label>From top · cm<input id="new-room-y" type="number" min="0" step="any" value="25" required/></label></div><p class="muted">Positions start at the home’s top-left corner. Measurements follow wall centre lines. Matching full walls are shared; add doors from Build → Doors.</p><p id="new-room-error" role="alert"></p><button type="submit" class="primary">Create room</button></form>`;dialog.showModal();$('new-room-form').onsubmit=e=>{e.preventDefault();try{if((state.room.spaces?.length||0)>=30)throw new Error('This project supports up to 30 named rooms.');const b=bounds(),w=Number($('new-room-width').value)/100,d=Number($('new-room-depth').value)/100,x=b.x+Number($('new-room-x').value)/100,y=b.y+Number($('new-room-y').value)/100,name=$('new-room-name').value.trim()||'Room',all=edges(),segments=planRoom({x,y,width:w,depth:d},state.room.vertices,all);if(segments.every(s=>s.index>=0)&&(state.room.spaces||[]).some(r=>r.walls.length===4&&segments.every(s=>r.walls.some(ref=>ref.side===s.side&&(ref.id?ref.id===all[s.index].id:ref.index===s.index)))))throw new Error('This room already exists. Choose a different position.');if(state.items.length+segments.filter(s=>s.index<0).length>200)throw new Error('This project supports up to 200 items.');let roomId;mutate(()=>{const walls=segments.map((segment,i)=>{if(segment.index>=0){const ed=all[segment.index];return ed.id?{id:ed.id,side:segment.side}:{index:segment.index,side:segment.side};}const {a,b}=segment,o=item('wall',(a[0]+b[0])/2,(a[1]+b[1])/2,{label:`${name} · wall ${i+1}`,w:Math.hypot(b[0]-a[0],b[1]-a[1]),d:state.room.wallThickness,h:state.room.height,rotation:Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI,color:state.room.wallColor||'#e5e0d5'});state.items.push(o);return {id:o.id,side:'a'};});roomId=uid();state.room.spaces??=[];state.room.spaces.push({id:roomId,name,walls,floorColor:state.room.floorColor||'#eee9df'});selected=null;});$('paint-room').value=roomId;$('paint-room').onchange();dialog.close();toast(`${name} added. Select its walls to edit them.`);}catch(err){$('new-room-error').textContent=err.message;}};};
$('edit-walls').onchange=drawPlan;$('zoom-in').onclick=()=>{zoom=clamp(zoom*1.2,.25,8);drawPlan();};$('zoom-out').onclick=()=>{zoom=clamp(zoom/1.2,.25,8);drawPlan();};$('fit').onclick=()=>{zoom=1;pan={x:0,y:0};fitFrame=null;if(mode==='plan')drawPlan();else setCamera('top');};
function applyTemplate(type){
 if(type!=='blank'&&!getFlatTemplate(type))return;
 mutate(()=>{const project=state.project;state=preset(type);state.project=project;selected=null;zoom=1;pan={x:0,y:0};fitFrame=null;});
 if(mode==='3d')setCamera('top');
 toast(type==='blank'?'Empty room created. Undo restores your previous layout.':'Flat template applied. Undo restores your previous layout.');
}
$('room-preset').onchange=e=>applyTemplate(e.target.value);
listen(document,'vela:template',e=>applyTemplate(e.detail?.id));

$('reference-visible').onchange=e=>{if(state.room.reference)mutate(()=>{state.room.reference.visible=e.target.checked;});};
$('reference-opacity').onchange=e=>{if(state.room.reference)mutate(()=>{state.room.reference.opacity=clamp(Number(e.target.value),.1,.9);});};
$('apply-room').onclick=()=>{const w=Number($('room-width').value)/100,d=Number($('room-depth').value)/100,h=Number($('room-height').value)/100,name=$('room-name').value;if(![w,d,h].every(Number.isFinite)||w<1.5||d<1.5||w>20||d>20||h<2.2||h>6){toast('Use room sides from 150–2000 cm and ceiling height from 220–600 cm.');return;}mutate(()=>{const b=bounds();state.room.vertices=state.room.vertices.map(([x,y])=>[(x-b.x)*w/b.w,(y-b.y)*d/b.d]);for(const o of state.items){if(TYPES[o.kind].opening){const ed=edges()[o.wall];o.offset=clamp(o.offset,0,ed.len);}}state.room.height=h;state.room.name=name.trim().slice(0,80)||'My room';});toast('Room resized. Furniture keeps its real size; check positions.');};
$('notes').onchange=e=>mutate(()=>state.notes=e.target.value.slice(0,3000));
function validPolygon(p){if(!Array.isArray(p)||p.length<3||p.length>24||p.some(v=>!Array.isArray(v)||v.length!==2||v.some(n=>!Number.isFinite(n)||n<0||n>25)))return false;let area=0;for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];if(Math.hypot(a[0]-b[0],a[1]-b[1])<.1)return false;area+=a[0]*b[1]-b[0]*a[1];}if(area<1)return false;const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length;j++){if(j===i+1||(i===0&&j===p.length-1))continue;const a=p[i],b=p[(i+1)%p.length],c=p[j],d=p[(j+1)%p.length];if(Math.max(a[0],b[0])>=Math.min(c[0],d[0])&&Math.max(c[0],d[0])>=Math.min(a[0],b[0])&&Math.max(a[1],b[1])>=Math.min(c[1],d[1])&&Math.max(c[1],d[1])>=Math.min(a[1],b[1])&&cross(a,b,c)*cross(a,b,d)<=0&&cross(c,d,a)*cross(c,d,b)<=0)return false;}return true;}
function validate(raw){if(!raw||raw.format!=='roomnote-layout'||raw.version!==1||raw.units!=='metres'||!raw.room||!validPolygon(raw.room.vertices)||!Array.isArray(raw.items)||raw.items.length>200)throw new Error('This is not a valid Vela or Roomnote layout file.');const finite=(v,a,b)=>typeof v==='number'&&Number.isFinite(v)&&v>=a&&v<=b;if(!finite(raw.room.height,2.2,6))throw new Error('Invalid ceiling height.');const room={name:String(raw.room.name||'My room').slice(0,80),height:raw.room.height,wallThickness:finite(raw.room.wallThickness,.05,.4)?raw.room.wallThickness:.12,vertices:copy(raw.room.vertices)};room.edgeFaceColors={};for(const [k,v] of Object.entries(raw.room.edgeFaceColors||{}))if(/^\d+$/.test(k)&&+k<room.vertices.length)room.edgeFaceColors[k]=cleanFaces(v);room.edgeColors={};for(const [k,v] of Object.entries(raw.room.edgeColors||{}))if(/^\d+$/.test(k)&&+k<room.vertices.length&&/^#[0-9a-f]{6}$/i.test(v))room.edgeColors[k]=v;room.edgeHeights={};for(const [k,v] of Object.entries(raw.room.edgeHeights||{}))if(/^\d+$/.test(k)&&+k<room.vertices.length&&finite(v,.3,6))room.edgeHeights[k]=v;room.zones=Array.isArray(raw.room.zones)?raw.room.zones.slice(0,30).filter(z=>z&&finite(z.x,0,25)&&finite(z.y,0,25)).map(z=>({name:String(z.name).slice(0,80),x:z.x,y:z.y})):[];const ids=new Set();const items=raw.items.map(o=>{if(!TYPES[o.kind]||!finite(o.x,-25,25)||!finite(o.y,-25,25)||!finite(o.w,.015,10)||!finite(o.d,.015,10)||!finite(o.h,.01,6)||!finite(o.e,0,6)||!finite(o.rotation,-3600,3600))throw new Error('An item has invalid dimensions.');const out={id:typeof o.id==='string'&&/^[\w-]{1,80}$/.test(o.id)&&!ids.has(o.id)?o.id:uid(),kind:o.kind,label:String(o.label||TYPES[o.kind].label).slice(0,80),x:o.x,y:o.y,w:o.w,d:o.d,h:o.h,e:o.e,rotation:o.rotation,color:/^#[0-9a-f]{6}$/i.test(o.color)?o.color:TYPES[o.kind].color,flip:!!o.flip};if(o.kind==='door'){if(['left','right'].includes(o.hinge))out.hinge=o.hinge;if(['a','b'].includes(o.swing))out.swing=o.swing;}if(o.kind==='wall')out.faceColors=cleanFaces(o.faceColors);if(catalogueVariants[o.variant]?.kind===o.kind)out.variant=o.variant;out.cost=finite(o.cost,0,1e9)?o.cost:0;out.supplier=String(o.supplier||'').slice(0,160);ids.add(out.id);if(TYPES[o.kind].opening){if(!Number.isInteger(o.wall)||o.wall<0||o.wall>=room.vertices.length+raw.items.filter(v=>v.kind==='wall').length||!finite(o.offset,0,40))throw new Error('An opening has an invalid wall.');out.wall=o.wall;out.offset=o.offset;if(typeof o.wallId==='string'&&/^[\w-]{1,80}$/.test(o.wallId))out.wallId=o.wallId;}return out;});let cam=null;if(raw.camera&&['position','target'].every(k=>Array.isArray(raw.camera[k])&&raw.camera[k].length===3&&raw.camera[k].every(v=>finite(v,-100,100))))cam=copy(raw.camera);if(raw.room.reference&&typeof raw.room.reference.data==='string'&&raw.room.reference.data.length<=2500000&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(raw.room.reference.data)){room.reference={data:raw.room.reference.data,opacity:finite(raw.room.reference.opacity,.1,.9)?raw.room.reference.opacity:.45,visible:raw.room.reference.visible!==false};}
room.spaces=Array.isArray(raw.room.spaces)?raw.room.spaces.slice(0,30).filter(r=>r&&typeof r.id==='string'&&/^[\w-]{1,80}$/.test(r.id)&&Array.isArray(r.walls)).map(r=>({id:r.id,name:String(r.name||'Room').slice(0,80),type:['living','bedroom','dining','kitchen','bathroom','balcony','utility','study','dressing','hall'].includes(r.type)?r.type:undefined,templateKey:typeof r.templateKey==='string'&&/^[\w-]{1,80}$/.test(r.templateKey)?r.templateKey:undefined,labelPosition:Array.isArray(r.labelPosition)&&r.labelPosition.length===2&&r.labelPosition.every(v=>finite(v,.05,.95))?copy(r.labelPosition):undefined,floorColor:typeof r.floorColor==='string'&&/^#[0-9a-f]{6}$/i.test(r.floorColor)?r.floorColor:undefined,walls:r.walls.slice(0,24).filter(ref=>ref&&['a','b'].includes(ref.side)&&(ref.id?items.some(o=>o.kind==='wall'&&o.id===ref.id):Number.isInteger(ref.index)&&ref.index>=0&&ref.index<room.vertices.length)).map(ref=>ref.id?{id:ref.id,side:ref.side}:{index:ref.index,side:ref.side})})):[];
room.floorColor=/^#[0-9a-f]{6}$/i.test(raw.room.floorColor)?raw.room.floorColor:'#eee9df';room.wallColor=/^#[0-9a-f]{6}$/i.test(raw.room.wallColor)?raw.room.wallColor:'#e5e0d5';return {format:'roomnote-layout',version:1,units:'metres',room,items,notes:String(raw.notes||'').slice(0,3000),camera:cam,project:validateProject(raw.project)};}
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),5000);}
function filename(){return state.room.name.replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase()||'room';}
$('save-file').onclick=()=>{captureCamera();download(new Blob([JSON.stringify({...state,savedAt:new Date().toISOString(),coordinateSystem:'x right, y down in plan; height/elevation above floor'},null,2)],{type:'application/json'}),`${filename()}-layout.json`);toast('Project exported with geometry, finishes and specifications.');};
$('open-file').onclick=()=>$('file-input').click();$('file-input').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;try{if(f.size>3500000)throw new Error('Layout file is too large.');const imported=validate(JSON.parse(await f.text()));mutate(()=>{state=imported;selected=null;zoom=1;pan={x:0,y:0};fitFrame=null;});if(mode==='3d')restoreCamera();toast('Layout opened.');}catch(err){toast(err.message||'Could not open that layout. Your current room is unchanged.');}};
$('export-image').onclick=()=>{if(mode==='3d'){renderer.render(scene,camera);renderer.domElement.toBlob(blob=>{if(blob)download(blob,`${filename()}-3d.png`);});}else{const clone=svg.cloneNode(true),b=bounds();clone.setAttribute('viewBox',`${b.x-.7} ${b.y-.7} ${b.w+1.4} ${b.d+1.4}`);clone.setAttribute('xmlns',NS);clone.setAttribute('width','1400');clone.setAttribute('height','1200');clone.querySelectorAll('.vertex,.selection-handles').forEach(n=>n.remove());download(new Blob([new XMLSerializer().serializeToString(clone)],{type:'image/svg+xml'}),`${filename()}-plan.svg`);}};

// Every 3D object is derived from the same metric layout used by the editor.
function material(color,rough=.7,metal=0){return new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal});}
function cube(parent,x,y,z,w,h,d,mat){const mesh=new THREE.Mesh(new THREE.BoxGeometry(Math.max(w,.005),Math.max(h,.005),Math.max(d,.005)),mat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
function cylinder(parent,x,y,z,r,h,mat){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,32),mat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
function makeFurniture(o){const g=new THREE.Group(),m=material(o.color),light=material('#eee9df'),wood=material('#8d654a'),dark=material('#202d2e',.35),metal=material('#bba477',.35,.55);const w=o.w,d=o.d,h=o.h;g.position.set(o.x,o.e,o.y);g.rotation.y=-o.rotation*Math.PI/180;const c=(x,y,z,a,b,f,mat=m)=>cube(g,x,y,z,a,b,f,mat);
 if(catalogueVariants[o.variant]?.form==='round'){const top=cylinder(g,0,o.kind==='rug'?h/2:h-.035,0,w/2,o.kind==='rug'?h:.07,m);top.scale.z=d/w;if(o.kind!=='rug')c(0,(h-.07)/2,0,.12,h-.07,.12,wood);}
 else if(o.kind==='rug'){c(0,h/2,0,w,h,d);}
 else if(o.kind==='sofa'||o.kind==='lsofa'||o.kind==='chair'){const body=o.kind==='lsofa'?Math.min(.85,d*.65):d;const sy=-d/2+body/2;c(0,h*.25,sy,w,h*.45,body);c(0,h*.7,-d/2+.075,w,h*.60,.15);c(-w/2+.065,h*.48,sy,.13,h*.48,body);c(w/2-.065,h*.48,sy,.13,h*.48,body);c(0,h*.51,sy+.03,w-.24,h*.12,body-.18,light);if(o.kind==='lsofa'){const cw=Math.min(.72,w*.35),cx=(o.flip?-1:1)*(w/2-cw/2);c(cx,h*.25,0,cw,h*.45,d);c(cx,h*.51,.05,cw-.1,h*.12,d-.16,light);}}
 else if(o.kind==='dining'||o.kind==='table'){c(0,h-.035,0,w,.07,d);for(const x of [-w/2+.08,w/2-.08])for(const z of [-d/2+.08,d/2-.08])c(x,(h-.07)/2,z,.045,h-.07,.045,wood);if(o.kind==='dining'){const chair=(x,z,a)=>{const cg=new THREE.Group();cg.position.set(x,0,z);cg.rotation.y=a;g.add(cg);cube(cg,0,.44,0,.43,.1,.43,light);cube(cg,0,.66,.18,.43,.5,.08,light);for(const xx of [-.15,.15])for(const zz of [-.15,.15])cube(cg,xx,.2,zz,.025,.4,.025,wood);};if(d>=w){for(const z of [-d*.27,d*.27]){chair(-w/2-.24,z,-Math.PI/2);chair(w/2+.24,z,Math.PI/2);}}else{for(const x of [-w*.27,w*.27]){chair(x,-d/2-.24,Math.PI);chair(x,d/2+.24,0);}}if(catalogueVariants[o.variant]?.form==='six-seat'){if(d>=w){chair(0,-d/2-.24,Math.PI);chair(0,d/2+.24,0);}else{chair(-w/2-.24,0,-Math.PI/2);chair(w/2+.24,0,Math.PI/2);}}}}
 else if(o.kind==='bed'){c(0,h*.4,0,w,h*.7,d);c(0,h*.84,0,w-.06,h*.23,d-.05,light);c(0,h*.78,-d/2+.06,w,h*.95,.12);for(const x of [-w*.24,w*.24])c(x,h+.04,-d/2+.3,w*.42,.12,.36,light);}
 else if(o.kind==='tv'){c(0,h/2,0,w,h,d);c(0,h+.55,d/2-.03,w*.72,.64,.05,dark);c(0,h+.035,-d*.2,w*.42,.05,.08,dark);}
 else if(o.kind==='partition'){c(0,.18,0,w,.36,d);c(0,h-.025,0,w,.05,d);const count=Math.max(3,Math.round(w/.10));for(let i=0;i<=count;i++)c(-w/2+w*i/count,(h+.36)/2,0,.025,h-.36,d*.7);}
 else if(o.kind==='shrine'){const bh=h*.45;c(0,bh/2,0,w,bh,d);c(0,bh+.025,0,w+.04,.05,d+.04,light);c(0,h*.74,d/2-.025,w,h*.52,.05,light);for(const x of [-w*.45,w*.45])c(x,h*.74,0,.05,h*.52,.055);c(0,h-.035,0,w+.08,.07,d+.05);for(const x of [-w*.24,0,w*.24]){cylinder(g,x,bh+.13,0,.045,.18,metal);const head=new THREE.Mesh(new THREE.SphereGeometry(.04,12,8),metal);head.position.set(x,bh+.25,0);g.add(head);}}
 else if(o.kind==='counter'){
  c(0,(h-.05)/2,0,w,h-.05,d);c(0,h-.025,0,w+.025,.05,d+.025,light);
  const count=Math.max(1,Math.round(w/.6));for(let i=1;i<count;i++)c(-w/2+w*i/count,h*.45,-d/2-.006,.012,h*.8,.012,light);
 }
 else if(o.kind==='sink'){
  c(0,h/2,0,w,h,d,metal);const bowl=cylinder(g,0,h+.005,0,w*.34,.012,dark);bowl.scale.z=d/w;
  c(0,h+.1,-d*.35,.025,.18,.025,metal);c(w*.1,h+.18,-d*.35,w*.2,.025,.025,metal);
 }
 else if(o.kind==='hob'){
  c(0,h/2,0,w,h,d,dark);for(const x of [-w*.23,w*.23])for(const z of [-d*.23,d*.23])cylinder(g,x,h+.005,z,w*.13,.01,metal);
 }
 else if(o.kind==='fridge'){
  c(0,h/2,0,w,h,d);c(0,h*.68,-d/2-.007,w,.012,.012,dark);c(w*.32,h*.45,-d/2-.025,.025,h*.25,.025,metal);
 }
 else if(o.kind==='washer'){
  c(0,h/2,0,w,h,d);const door=cylinder(g,0,h*.46,-d/2-.01,w*.3,.02,dark);door.rotation.x=Math.PI/2;
  c(0,h*.85,-d/2-.01,w*.8,.05,.02,light);
 }
 else if(o.kind==='toilet'){
  c(0,h*.73,-d*.38,w,h*.5,d*.23,light);cylinder(g,0,h*.22,d*.06,w*.3,h*.4,light);
  const bowl=new THREE.Mesh(new THREE.SphereGeometry(1,24,12),light);bowl.scale.set(w*.5,h*.2,d*.33);bowl.position.set(0,h*.51,d*.06);g.add(bowl);
  const seat=cylinder(g,0,h*.68,d*.06,w*.38,.025,light);seat.scale.z=1.45;
 }
 else if(o.kind==='basin'){
  c(0,h*.42,0,w,h*.8,d,m);c(0,h-.035,0,w+.02,.07,d+.02,light);
  const bowl=cylinder(g,0,h+.004,.02,w*.34,.008,dark);bowl.scale.z=d/w;
  c(0,h+.075,-d*.35,.018,.15,.018,metal);
 }
 else if(o.kind==='shower'){
  c(0,.025,0,w,.05,d,light);const glass=new THREE.MeshStandardMaterial({color:o.color,transparent:true,opacity:.23,roughness:.25,side:THREE.DoubleSide});
  c(0,h/2,-d/2,w,h,.012,glass);c(w/2,h/2,0,.012,h,d,glass);
  for(const [x,z] of [[-w/2,-d/2],[w/2,-d/2],[w/2,d/2]])c(x,h/2,z,.02,h,.02,metal);
  c(-w*.25,h*.8,-d/2+.03,.025,h*.3,.025,metal);c(-w*.1,h*.93,-d*.3,w*.3,.035,.15,metal);
 }
 else if(o.kind==='heater'){c(0,h/2,0,w,h,d*.65);for(let i=0;i<8;i++)c(-w/2+w*(i+.5)/8,h/2,-d*.35,w/12,h*.9,d*.3,light);}
 else if(o.kind==='ac'){c(0,h/2,0,w,h,d);c(0,h*.22,-d/2-.003,w*.8,.04,.007,dark);}
 else if(o.kind==='fan'){cylinder(g,0,h/2,0,.11,h,metal);for(let i=0;i<3;i++){const bg=new THREE.Group();bg.rotation.y=i*Math.PI*2/3;g.add(bg);cube(bg,w*.22,h/2,0,w*.46,.025,.12,m);}}
 else {c(0,h/2,0,w,h,d);if(o.kind==='wardrobe'){c(0,h/2,-d/2-.006,.015,h,.015,light);for(const x of [-.055,.055])c(x,h*.52,-d/2-.025,.015,.18,.025,metal);}}
 if(o.kind==='fan')g.scale.z=d/w;
 return g;
}
function makeWall(ed,index){const g=new THREE.Group();g.position.set(ed.a[0],0,ed.a[1]);g.rotation.y=-ed.angle*Math.PI/180;g.userData.wall=true;const H=ed.h||state.room.edgeHeights?.[index]||state.room.height,t=ed.t||state.room.wallThickness,faces=wallFaces(ed,index),base=material(faces.base),m=[base,base,base,base,material(faces.a),material(faces.b)];const ops=state.items.filter(o=>TYPES[o.kind].opening&&o.wall===index).map(o=>({o,start:clamp(o.offset-o.w/2,0,ed.len),end:clamp(o.offset+o.w/2,0,ed.len),low:clamp(o.e,0,H),high:clamp(o.e+o.h,0,H)}));const cuts=[...new Set([0,ed.len,...ops.flatMap(o=>[o.start,o.end])])].sort((a,b)=>a-b);
 for(let i=0;i<cuts.length-1;i++){const a=cuts[i],b=cuts[i+1],mid=(a+b)/2,holes=ops.filter(o=>mid>o.start-1e-6&&mid<o.end+1e-6).sort((a,b)=>a.low-b.low);let z=0;for(const hole of holes){if(hole.low>z)cube(g,mid,(z+hole.low)/2,0,b-a,hole.low-z,t,m);z=Math.max(z,hole.high);}if(z<H)cube(g,mid,(z+H)/2,0,b-a,H-z,t,m);}
 for(const {o,start,end,low,high} of ops){const frame=material(o.color);for(const xx of [start,end])cube(g,xx,(low+high)/2,0,.035,high-low,t+.02,frame);cube(g,o.offset,high,0,o.w,.04,t+.02,frame);if(o.kind==='window'){cube(g,o.offset,low,0,o.w,.04,t+.02,frame);const glass=new THREE.MeshStandardMaterial({color:'#a8ceda',transparent:true,opacity:.38,roughness:.25,side:THREE.DoubleSide});cube(g,o.offset,(low+high)/2,0,o.w-.05,high-low-.05,.008,glass);cube(g,o.offset,(low+high)/2,0,.025,high-low,.04,frame);}else{const form=catalogueVariants[o.variant]?.form;if(form==='sliding'){cube(g,o.offset-o.w/4,(low+high)/2,-.025,o.w/2,high-low,.028,frame);cube(g,o.offset+o.w/4,(low+high)/2,.025,o.w/2,high-low,.028,frame);}else if(form!=='open'){for(const pose of doorPose(o,form).leaves){const leaf=new THREE.Group(),width=o.w*pose.width;leaf.position.set(o.offset+o.w*pose.hinge,low,0);leaf.rotation.y=pose.angle;g.add(leaf);cube(leaf,pose.direction*width/2,(high-low)/2,0,width,.98*(high-low),.028,frame);}}}}
 g.visible=$('show-walls').checked;return g;
}
function init3D(){if(renderer)return true;try{renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;$('three-view').append(renderer.domElement);scene=new THREE.Scene();scene.background=new THREE.Color('#f1f0e9');camera=new THREE.PerspectiveCamera(45,1,.02,150);controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.maxPolarAngle=Math.PI*.49;controls.minDistance=.3;controls.maxDistance=40;scene.add(new THREE.HemisphereLight('#ffffff','#aea48e',2));const sun=new THREE.DirectionalLight('#fff5df',2.6);sun.position.set(-3,10,6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-12;sun.shadow.camera.right=12;sun.shadow.camera.top=12;sun.shadow.camera.bottom=-12;scene.add(sun);resizeObserver=new ResizeObserver(resize3D);resizeObserver.observe($('three-view'));controls.addEventListener('end',()=>{if(!loading){captureCamera();persist();}});renderer.setAnimationLoop(()=>{if(mode==='3d'){controls.update();renderer.render(scene,camera);}});return true;}catch(err){renderer?.dispose();renderer=null;$('three-view').innerHTML='';toast('3D is unavailable in this browser. The plan editor and saved layouts still work.');return false;}}
function disposeTree(g){g.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});}
function build3D(){if(!renderer)return;if(content){scene.remove(content);disposeTree(content);}content=new THREE.Group();scene.add(content);const shape=new THREE.Shape();state.room.vertices.forEach(([x,y],i)=>i?shape.lineTo(x,-y):shape.moveTo(x,-y));shape.closePath();const floor=new THREE.Mesh(new THREE.ShapeGeometry(shape),material(state.room.floorColor||'#ebe4d5',.5));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;content.add(floor);for(const room of state.room.spaces||[]){const points=spacePolygon(room,edges());if(!points)continue;const outline=new THREE.Shape();points.forEach(([x,y],i)=>i?outline.lineTo(x,-y):outline.moveTo(x,-y));outline.closePath();const mesh=new THREE.Mesh(new THREE.ShapeGeometry(outline),material(room.floorColor||state.room.floorColor||'#eee9df',.5));mesh.rotation.x=-Math.PI/2;mesh.position.y=.002;mesh.receiveShadow=true;content.add(mesh);}edges().forEach((ed,i)=>content.add(makeWall(ed,i)));for(const o of state.items)if(!TYPES[o.kind].opening&&o.kind!=='wall')content.add(makeFurniture(o));resize3D();}
function resize3D(){if(!renderer)return;const r=$('three-view').getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();}
function setCamera(which){if(!camera)return;loading=true;const b=layoutBounds(),cx=b.x+b.w/2,cy=b.y+b.d/2,s=Math.max(b.w,b.d);if(which==='entry'){camera.position.set(b.x+b.w*.59,1.7,b.y+.30);controls.target.set(cx,.9,b.y+b.d*.79);}else if(which==='tv'){camera.position.set(b.x+b.w*.41,1.65,b.y+b.d-.28);controls.target.set(b.x+b.w*.68,1.0,b.y+b.d*.30);}else{camera.position.set(cx+s*.38,s*1.65,cy+s*.45);controls.target.set(cx,0,cy);}controls.update();loading=false;captureCamera();persist();}
function captureCamera(){if(camera&&mode==='3d')state.camera={position:camera.position.toArray(),target:controls.target.toArray(),coordinates:'threejs: x right, y up, z plan-down',fov:camera.fov};}
function restoreCamera(){if(state.camera){loading=true;camera.position.fromArray(state.camera.position);controls.target.fromArray(state.camera.target);camera.fov=clamp(state.camera.fov||45,20,90);camera.updateProjectionMatrix();controls.update();loading=false;}else setCamera('top');}
function setMode(next){if(next==='3d'&&!init3D())return;mode=next;$('plan').hidden=mode!=='plan';$('three-view').hidden=mode!=='3d';$('camera-buttons').hidden=mode!=='3d';$('plan-mode').classList.toggle('active',mode==='plan');$('view-mode').classList.toggle('active',mode==='3d');$('plan-mode').setAttribute('aria-selected',mode==='plan');$('view-mode').setAttribute('aria-selected',mode==='3d');$('export-label').textContent=mode==='plan'?'Plan SVG':'View PNG';$('stage-tag').textContent=mode==='plan'?'Drag to move · handles to resize · R to rotate':'Drag to orbit · scroll to zoom';$('zoom-in').disabled=mode==='3d';$('zoom-out').disabled=mode==='3d';if(mode==='3d'){build3D();restoreCamera();}}
listen(document,'vela:viewport',()=>{drawPlan();});
const planResizeObserver=new ResizeObserver(()=>drawPlan());
planResizeObserver.observe(stage);
$('plan-mode').onclick=()=>setMode('plan');$('view-mode').onclick=()=>setMode('3d');document.querySelectorAll('[data-camera]').forEach(b=>b.onclick=()=>setCamera(b.dataset.camera));$('show-walls').onchange=()=>{content?.children.filter(o=>o.userData.wall).forEach(o=>o.visible=$('show-walls').checked);};
try{const saved=localStorage.getItem(STORAGE);if(initialLayout)state=validate(initialLayout);else if(saved)state=validate(JSON.parse(saved));}catch{toast('Could not restore the browser draft. Open a saved layout file if you have one.');}
initializeStudio({listen,owner,store,standalone,getState:()=>state,selection,mutate,replace:raw=>{state=validate(raw);selected=null;zoom=1;pan={x:0,y:0};fitFrame=null;},newProject:()=>{state=preset('blank');state.project=validateProject({name:'Untitled project'});selected=null;zoom=1;pan={x:0,y:0};fitFrame=null;},refresh,catalogue,toast,download,svg,captureCamera});
catalogue();refresh();if(initialLayout)persist();onStarted();
// A small read-only bridge makes the saved model inspectable for local verification.
window.Vela=window.Roomnote={getLayout:()=>copy(state),validate:raw=>validate(raw),getView:()=>mode};

window.dispatchEvent(new Event('vela:ready'));
return () => {
 disposed=true;clearTimeout(saveTimer);abort.abort();
 clearTimeout(toast.timer);
 catalogueAnimation?.cancel();
 resizeObserver?.disconnect();
 planResizeObserver.disconnect();
 renderer?.setAnimationLoop(null);
 controls?.dispose();
 if (scene) disposeTree(scene);
 renderer?.dispose();
 $('three-view')?.replaceChildren();
 delete window.Vela;
 delete window.Roomnote;
};
}
