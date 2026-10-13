import AuthForm from '@/src/auth/AuthForm';
export const metadata={title:'Create an account',robots:{index:false,follow:false},alternates:{canonical:'/signup'}};
export default function Signup(){return <AuthForm mode="signup"/>;}
