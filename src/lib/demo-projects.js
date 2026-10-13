'use client';
export function demoProjectStore(uid){
 const key=`vela-preview-projects:${uid}`;
 function read(){const value=JSON.parse(localStorage.getItem(key)||'{}');if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Could not read your preview projects');return value;}
 return {
  isDemo:true,
  async save(layout){const projects=read(),id=layout.project.id;if(!/^[\w-]{1,80}$/.test(id))throw new Error('Invalid project');projects[id]={id,name:layout.project.name,layout:JSON.parse(JSON.stringify(layout)),updatedAt:new Date().toISOString()};localStorage.setItem(key,JSON.stringify(projects));},
  async list(){return Object.values(read()).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));},
  async get(id){const p=read()[id];if(!p)throw new Error('Project not found');return p.layout;},
  async remove(id){const projects=read();delete projects[id];localStorage.setItem(key,JSON.stringify(projects));},
 };
}
