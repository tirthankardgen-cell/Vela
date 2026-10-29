// Door-local X runs along the wall; positive depth points toward wall face A.
export function doorPose(door,form){
 const side=(door.swing==='b'||(door.swing!=='a'&&door.flip))?-1:1,mirrorX=form!=='double'&&door.hinge==='right'?-1:1;
 const directions=form==='double'?[1,-1]:[mirrorX];
 return {side,mirrorX,leaves:directions.map(direction=>({hinge:-direction*.5,direction,width:form==='double'?.5:1,angle:-direction*side*Math.PI/2}))};
}
