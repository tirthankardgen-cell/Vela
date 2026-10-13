import ClientStudio from '@/src/components/ClientStudio';
export const metadata={title:'Design studio',robots:{index:false,follow:false},alternates:{canonical:'/studio'}};
export default async function Studio({searchParams}){const params=await searchParams;return <ClientStudio guest={params.demo==='1'} newSpace={params.new==='1'} projectId={typeof params.project==='string'?params.project:null}/>;}
