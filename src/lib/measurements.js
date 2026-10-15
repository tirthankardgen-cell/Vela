// Metres are the stored geometry unit. Formatting never changes that geometry.
export const decimal=(value,places=4)=>Number(value.toFixed(places));
export function feetAndInches(metres){
 const sign=metres<0?'−':'',total=Math.round(Math.abs(metres)/.0254*100)/100;
 const feet=Math.floor(total/12),inches=decimal(total-feet*12,2);
 return `${sign}${feet}′ ${inches}″`;
}
export const metric=m=>`${decimal(m)} m`;
export const centimetres=m=>decimal(m*100,4);
export function convertMeasurement(value,inches,from,to){
 const metres=from==='cm'?Number(value)/100:(Number(value)*12+Number(inches))*.0254;
 if(to==='cm')return [String(decimal(metres*100,8)),'0'];
 const total=decimal(metres/.0254,8),feet=Math.floor(total/12);
 return [String(feet),String(decimal(total-feet*12,8))];
}
