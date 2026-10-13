import RoomSetup from '@/src/onboarding/RoomSetup';
export const metadata={title:'Create your space',robots:{index:false,follow:false},alternates:{canonical:'/start'}};
export default async function Start({searchParams}){const params=await searchParams;return <RoomSetup guest={params.demo==='1'}/>;}
