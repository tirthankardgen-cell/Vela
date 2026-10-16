const EPS=1e-6;
const same=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])<EPS;
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
function onSegment(p,a,b){return Math.abs(cross(a,b,p))<EPS&&p[0]>=Math.min(a[0],b[0])-EPS&&p[0]<=Math.max(a[0],b[0])+EPS&&p[1]>=Math.min(a[1],b[1])-EPS&&p[1]<=Math.max(a[1],b[1])+EPS;}
function inside(p,polygon){if(polygon.some((a,i)=>onSegment(p,a,polygon[(i+1)%polygon.length])))return true;let yes=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const a=polygon[i],b=polygon[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;}
export function planRoom({x,y,width,depth},polygon,edges){
 if(![x,y,width,depth].every(Number.isFinite)||width<1||depth<1||width>10||depth>10)throw new Error('Use room sides from 100 to 1,000 cm and valid positions.');
 const points=[[x,y],[x+width,y],[x+width,y+depth],[x,y+depth]],centre=[x+width/2,y+depth/2];
 if(![...points,centre].every(p=>inside(p,polygon)))throw new Error('Keep the new room inside the home outline.');
 const result=points.map((a,i)=>{const b=points[(i+1)%4],match=edges.findIndex(e=>same(e.a,a)&&same(e.b,b)||same(e.a,b)&&same(e.b,a));return {a,b,index:match,side:match<0||same(edges[match].a,a)?'a':'b'};});
 for(const e of edges){
  if(result.some(s=>s.index>=0&&edges[s.index]===e))continue;
  const mid=[(e.a[0]+e.b[0])/2,(e.a[1]+e.b[1])/2];
  if(mid[0]>x+EPS&&mid[0]<x+width-EPS&&mid[1]>y+EPS&&mid[1]<y+depth-EPS)throw new Error('This room overlaps an existing wall. Adjust its position or dimensions.');
  for(const s of result){
   const c1=cross(s.a,s.b,e.a),c2=cross(s.a,s.b,e.b),c3=cross(e.a,e.b,s.a),c4=cross(e.a,e.b,s.b);
   const crossing=c1*c2<-EPS&&c3*c4<-EPS;
   const collinear=Math.abs(c1)<EPS&&Math.abs(c2)<EPS;
   const axis=Math.abs(s.b[0]-s.a[0])>EPS?0:1;
   const overlap=collinear&&Math.min(Math.max(s.a[axis],s.b[axis]),Math.max(e.a[axis],e.b[axis]))-Math.max(Math.min(s.a[axis],s.b[axis]),Math.min(e.a[axis],e.b[axis]))>EPS;
   if(crossing||overlap)throw new Error('Walls intersect or partly overlap. Align a complete shared wall, or leave space between them.');
  }
 }
 return result;
}
export function cleanFaces(value){const out={};for(const side of ['a','b'])if(typeof value?.[side]==='string'&&/^#[0-9a-f]{6}$/i.test(value[side]))out[side]=value[side];return out;}

// Wall references are ordered around the room; side B reverses their direction.
export function spacePolygon(space,edges){
 const segments=space.walls.map(ref=>{const e=edges.find((e,i)=>ref.id?e.id===ref.id:!e.id&&i===ref.index);return e&&(ref.side==='b'?{a:e.b,b:e.a}:e);});
 if(segments.length<3||segments.some(e=>!e))return null;
 if(segments.some((e,i)=>!same(e.b,segments[(i+1)%segments.length].a)))return null;
 return segments.map(e=>[...e.a]);
}

export {inside as pointInPolygon};
