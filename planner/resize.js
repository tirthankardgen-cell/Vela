// Work in the item's rotated local axes, keeping the opposite edge/corner fixed.
export function resizeItem(original,handle,delta,{snap=v=>v,maxWidth=10,opening=false}={}){
 const a=original.rotation*Math.PI/180,c=Math.cos(a),s=Math.sin(a);
 const dx=delta.x*c+delta.y*s,dy=-delta.x*s+delta.y*c;
 const sx=handle.includes('e')?1:handle.includes('w')?-1:0;
 const sy=opening?0:handle.includes('s')?1:handle.includes('n')?-1:0;
 const w=sx?Math.max(.05,Math.min(maxWidth,snap(original.w+sx*dx))):original.w;
 const d=sy?Math.max(.05,Math.min(10,snap(original.d+sy*dy))):original.d;
 const x=sx*(w-original.w)/2,y=sy*(d-original.d)/2;
 return {w,d,x:original.x+x*c-y*s,y:original.y+x*s+y*c,...(opening?{offset:original.offset+x}:{})};
}
