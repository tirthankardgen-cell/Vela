// Browsing metadata is separate from geometry and persisted item IDs.
export const categories=[['furniture','Furniture'],['electronics','Electronics'],['decor','Decor'],['structure','Build']];
export const rooms=[['all','All rooms'],['living','Living'],['bedroom','Bedroom'],['dining','Dining'],['office','Office'],['kitchen','Kitchen'],['bathroom','Bathroom']];
export const catalogueMeta={
 sofa:{category:'furniture',aliases:'couch seating settee',rooms:['living']},
 lsofa:{category:'furniture',aliases:'sectional corner couch seating',rooms:['living']},
 chair:{category:'furniture',aliases:'chair seating accent',rooms:['living','bedroom','office']},
 dining:{category:'furniture',aliases:'table chairs dining set',rooms:['dining','kitchen']},
 table:{category:'furniture',aliases:'coffee side occasional table',rooms:['living']},
 bed:{category:'furniture',aliases:'double queen sleeping',rooms:['bedroom']},
 wardrobe:{category:'furniture',aliases:'closet clothes storage cabinet',rooms:['bedroom']},
 shrine:{category:'furniture',aliases:'altar meditation shrine prayer puja optional collection',rooms:['living','bedroom']},
 tv:{category:'electronics',aliases:'television screen display media tv console combined set',rooms:['living','bedroom']},
 ac:{category:'electronics',aliases:'climate control air conditioner air conditioning cooling hvac',rooms:[]},
 fan:{category:'electronics',aliases:'climate control ceiling fan cooling ventilation',rooms:[]},
 heater:{category:'electronics',aliases:'climate control heater heating radiator electric',rooms:[]},
 rug:{category:'decor',aliases:'rug carpet mat textile',rooms:['living','bedroom','dining','office']},
 partition:{category:'structure',aliases:'divider partition screen',rooms:[]},
 wall:{category:'structure',aliases:'wall internal partition',rooms:[]},
 pillar:{category:'structure',aliases:'column pillar structure',rooms:[]},
 door:{category:'structure',aliases:'door opening entrance hinged',rooms:[]},
 window:{category:'structure',aliases:'window glazing opening',rooms:[]},
};
export function matchesCatalogue(kind,label,{category='furniture',room='all',query=''}){
 const meta=catalogueMeta[kind];if(!meta)return false;
 const q=query.trim().toLowerCase();
 return (!q?meta.category===category:q.split(/\s+/).every(word=>`${label} ${meta.aliases} ${meta.category}`.toLowerCase().includes(word)))&&(room==='all'||!meta.rooms.length||meta.rooms.includes(room));
}

export const catalogueGroups={sofa:'Sofas',lsofa:'Sofas',chair:'Chairs',dining:'Dining sets',table:'Tables',bed:'Beds',wardrobe:'Storage',shrine:'Meditation',tv:'TV & media',ac:'Air conditioning',fan:'Fans',heater:'Heaters',rug:'Rugs',partition:'Partitions',wall:'Walls',pillar:'Columns',door:'Doors',window:'Windows'};
// Variants retain the established geometry kind so existing projects remain compatible.
export const catalogueVariants={
 'sofa-loveseat':{kind:'sofa',label:'Loveseat',w:1.5,d:.85,h:.85},
 'sofa-large':{kind:'sofa',label:'Three-seat sofa',w:2.5,d:.95,h:.85},
 'chair-compact':{kind:'chair',label:'Compact accent chair',w:.6,d:.65,h:.8},
 'chair-lounge':{kind:'chair',label:'Lounge chair',w:.9,d:1,h:.85},
 'table-side':{kind:'table',label:'Side table',w:.45,d:.45,h:.55,rooms:['living','bedroom']},
 'table-round':{kind:'table',label:'Round coffee table',w:.8,d:.8,h:.4,form:'round'},
 'table-console':{kind:'table',label:'Console table',w:1.2,d:.35,h:.8,rooms:['living','bedroom']},
 'table-desk':{kind:'table',label:'Writing desk',w:1.2,d:.6,h:.75,rooms:['office','bedroom']},
 'table-dining':{kind:'table',label:'Dining table',w:1.6,d:.9,h:.76,rooms:['dining','kitchen']},
 'dining-square':{kind:'dining',label:'Square dining set',w:1,d:1,h:.76},
 'bed-single':{kind:'bed',label:'Single bed',w:.95,d:2,h:.55},
 'bed-double':{kind:'bed',label:'Double bed',w:1.4,d:2,h:.55},
 'bed-king':{kind:'bed',label:'King bed',w:1.93,d:2.03,h:.55},
 'wardrobe-compact':{kind:'wardrobe',label:'Compact wardrobe',w:.9,d:.6,h:2.1},
 'wardrobe-wide':{kind:'wardrobe',label:'Wide wardrobe',w:2.4,d:.6,h:2.25},
 'tv-compact':{kind:'tv',label:'Compact TV console',w:1.2,d:.35,h:.45},
 'tv-wide':{kind:'tv',label:'Wide media console',w:2.4,d:.4,h:.5},
 'ac-wide':{kind:'ac',label:'Large wall AC',w:1.1,d:.3,h:.32},
 'heater-panel':{kind:'heater',label:'Panel heater',w:1,d:.12,h:.5,e:.15},
 'heater-compact':{kind:'heater',label:'Compact heater',w:.35,d:.25,h:.45},
 'fan-compact':{kind:'fan',label:'Compact ceiling fan',w:.9,d:.9,h:.1},
 'fan-large':{kind:'fan',label:'Large ceiling fan',w:1.5,d:1.5,h:.1},
 'rug-runner':{kind:'rug',label:'Runner rug',w:.8,d:2.5,h:.015},
 'rug-round':{kind:'rug',label:'Round rug',w:1.8,d:1.8,h:.015,form:'round'},
 'partition-wide':{kind:'partition',label:'Wide slatted partition',w:2,d:.08,h:2.2},
 'wall-half':{kind:'wall',label:'Half-height wall',w:1.5,d:.12,h:1.1},
 'wall-thick':{kind:'wall',label:'Thick partition wall',w:2,d:.2,h:2.85},
 'pillar-wide':{kind:'pillar',label:'Wide column',w:.45,d:.45,h:2.85},
 'door-double':{kind:'door',label:'Double hinged door',w:1.6,d:.12,h:2.1,form:'double'},
 'door-sliding':{kind:'door',label:'Sliding door',w:1.8,d:.12,h:2.1,form:'sliding'},
 'door-narrow':{kind:'door',label:'Narrow hinged door',w:.7,d:.12,h:2.1},
 'window-wide':{kind:'window',label:'Wide window',w:2,d:.12,h:1.2,e:.9},
 'window-tall':{kind:'window',label:'Tall window',w:.8,d:.12,h:1.8,e:.4},
 'shrine-compact':{kind:'shrine',label:'Compact meditation altar',w:.5,d:.35,h:1.2},
};
export function catalogueEntries(types,filters){
 return [...Object.entries(types).map(([id,t])=>({id,kind:id,...t})),...Object.entries(catalogueVariants).map(([id,v])=>({id,...types[v.kind],...v}))].filter(v=>{
  const meta=catalogueMeta[v.kind],q=filters.query.trim().toLowerCase(),roomList=v.rooms||meta.rooms;
  return (q?q.split(/\s+/).every(word=>`${v.label} ${meta.aliases} ${meta.category} ${catalogueGroups[v.kind]}`.toLowerCase().includes(word)):meta.category===filters.category)&&(filters.room==='all'||!roomList.length||roomList.includes(filters.room));
 });
}
