import Link from 'next/link'
import { Icons } from "./Icons"
import UserAuthForm from './UserAuthForm'

const SignUp = () => {
return (
    <div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
        <div className='flex flex-col space-y-2 text-center bg-surface p-6 gap-4 rounded-md '>
            <Icons.logo className='mx-auto h-8 w-8 text-reddit'/>
            <h1 className='text-2xl font-semibold tracking-tight text-primary'>Sign Up</h1>
            <p className='text-sm max-w-xs mx-auto text-muted'>
                By continuing, you are setting up a Breaddit account and agree to
                our User Agreement and Privacy Policy
            </p>

            {/* SignUp form */}
            <UserAuthForm/>
            
            <p className='px-8 text-center text-sm text-muted'>
                Already a Bredditor?{' '}
                <Link
                href='/sign-in'
                className='text-link hover:text-link-hover text-sm underline underline-offset-4'>
                Sign in
                </Link>
            </p>
        </div>
    </div>
)
}

export default SignUp