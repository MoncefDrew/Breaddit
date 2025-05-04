import Link from 'next/link'
import { Icons } from "./Icons"
import UserAuthForm from './UserAuthForm'

const SignIn = () => {
  return (
    <div className='container mx-auto flex w-full flex-col justify-center items-center'>
      <div className='flex flex-col space-y-5 text-center bg-white rounded-lg w-full max-w-md'>
        <Icons.logo className='mx-auto h-10 w-10 text-orange-500 mt-6'/>
        
        <div className="space-y-2">
          <h1 className='text-xl font-semibold tracking-tight text-gray-800'>Welcome back</h1>
          <p className='text-xs text-gray-500 max-w-sm mx-auto px-6'>
            By continuing, you are setting up a Breaddit account and agree to 
            our <Link href="#" className="text-gray-600 hover:underline">User Agreement</Link> and <Link href="#" className="text-gray-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>

        {/* SignIn form */}
        <UserAuthForm/>
        
        <div className="pb-6">
          <p className='text-center text-xs text-gray-500'>
            New to Breaddit?{' '}
            <Link
              href='/sign-up'
              className='text-orange-500 hover:text-orange-600 font-medium'
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn