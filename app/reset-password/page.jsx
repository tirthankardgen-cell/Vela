import AuthForm from '@/src/auth/AuthForm';
export const metadata={title:'Reset password',robots:{index:false,follow:false},alternates:{canonical:'/reset-password'}};
export default function Reset(){return <AuthForm mode="reset"/>;}
