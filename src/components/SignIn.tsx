import Link from 'next/link'
import { Icons } from "./Icons"
import UserAuthForm from './UserAuthForm'

const SignIn = () => {
    
return (
    <div className='container mx-auto flex w-full flex-col justify-center items-center space-y-2 '>
        <div className='flex flex-col space-y-2 text-center bg-surface py-6 gap-4 rounded-md '>
            <Icons.logo className='mx-auto h-8 w-8 text-reddit'/>
            <h1 className='text-2xl font-semibold tracking-tight text-primary'>Welcome back</h1>
            <p className='text-sm max-w-xs mx-auto text-muted'>
                By continuing, you are setting up a Breaddit account and agree to
                our User Agreement and Privacy Policy
            </p>

            {/* SignIn form */}
            <UserAuthForm/>
            
            <p className='px-8 text-center text-sm text-muted'>
                New to Breaddit?{' '}
                <Link
                href='/sign-up'
                className='text-link hover:text-link-hover text-sm underline underline-offset-4'>
                Sign Up
                </Link>
            </p>
        </div>
    </div>
)
}

export default SignIn