export async function readFloorPlan(file){
 if(!file||file.size>10*1024*1024)throw new Error('Choose a floor plan smaller than 10 MB.');
 let source;
 if(file.type==='application/pdf'){
  const pdfjs=await import('pdfjs-dist/build/pdf.mjs');pdfjs.GlobalWorkerOptions.workerSrc='/pdf.worker.min.mjs';
  const task=pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false});
  try{const pdf=await task.promise,page=await pdf.getPage(1),base=page.getViewport({scale:1}),viewport=page.getViewport({scale:Math.min(1800/base.width,1800/base.height,2)}),canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;source=canvas.toDataURL('image/jpeg',.88);}finally{await task.destroy();}
 }else{
  if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw new Error('Use a PNG, JPG, WebP, or PDF file.');
  const url=URL.createObjectURL(file);
  try{const img=new Image();img.src=url;await img.decode();if(img.naturalWidth*img.naturalHeight>50000000)throw new Error('This image is too large. Export a smaller floor plan.');const scale=Math.min(1,1800/Math.max(img.naturalWidth,img.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.round(img.naturalWidth*scale);canvas.height=Math.round(img.naturalHeight*scale);const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);source=canvas.toDataURL('image/jpeg',.88);}finally{URL.revokeObjectURL(url);}
 }
 if(source.length>2500000)throw new Error('The processed plan is too detailed. Try a smaller image.');
 return source;
}
