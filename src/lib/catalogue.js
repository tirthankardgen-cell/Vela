// Browsing metadata is separate from geometry and persisted item IDs.
export const categories=[['furniture','Furniture'],['electronics','Electronics'],['climate','Climate'],['decor','Decor'],['structure','Build']];
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
 ac:{category:'climate',aliases:'air conditioner air conditioning cooling hvac',rooms:[]},
 fan:{category:'climate',aliases:'ceiling fan cooling ventilation',rooms:[]},
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
