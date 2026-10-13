export const currencies=['USD','EUR','GBP','CAD','AUD','NZD','JPY','CHF','AED','SGD','INR'];
export function measurementToMetres(unit,whole,inches=0){
 const n=Number(whole),i=Number(inches);
 if(!Number.isFinite(n)||!Number.isFinite(i)||n<0||i<0||(unit==='ft-in'&&i>=12))throw new Error('Enter a valid measurement. Inches must be between 0 and 11.99.');
 const metres=unit==='ft-in'?(n*12+i)*.0254:unit==='cm'?n/100:n;
 if(metres<1.5||metres>20)throw new Error('Each side must be between 150 and 2,000 cm (about 5–65 ft).');
 return Math.round(metres*10000)/10000;
}
export function newRoom({name,width,depth,height,units,currency,reference}){
 if(![width,depth].every(n=>Number.isFinite(n)&&n>=1.5&&n<=20)||!Number.isFinite(height)||height<2.2||height>6)throw new Error('Check your room dimensions and ceiling height.');
 return {format:'roomnote-layout',version:1,units:'metres',project:{id:crypto.randomUUID(),name:String(name||'Untitled space').slice(0,100),client:'',designer:'',currency:currencies.includes(currency)?currency:'USD',budget:0,units:units==='ft-in'?'ft-in':'cm'},room:{name:String(name||'My room').slice(0,80),height,wallThickness:.12,vertices:[[0,0],[width,0],[width,depth],[0,depth]],zones:[],floorColor:'#f2f0e7',wallColor:'#faf9f2',...(reference?{reference:{data:reference,opacity:.45,visible:true}}:{})},items:[],notes:'',camera:null};
}
