import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { Icons } from './Icons'
import UserAccountNav from './UserAccountNav'
import SearchBar from './SearchBar'

const Navbar = async () => {
  const session = await getServerSession(authOptions)
  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-[#1A1A1B] border-b border-[#343536] z-10 py-2'>
      <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
        {/* logo */}
        <Link href='/' className='flex gap-2 items-center'>
          <Icons.logo className='h-8 w-8 sm:h-6 sm:w-6 text-[#FF4500]' />
          <p className='hidden text-gray-200 text-sm font-medium md:block'>Breadit</p>
        </Link>

        {/* search bar */}
        <SearchBar />

        {/* actions */}
        <div className="relative z-50 items-center justify-center">
          {session?.user ? (
            <UserAccountNav user={{
              name: session.user.name,
              image: session.user.image,
              email: session.user.email,
              id: session.user.id,
              username: session.user.username || ''
            }} />
          ) : (
            <Link 
              href='/sign-in' 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 bg-[#FF4500] text-white border border-transparent hover:bg-[#FF5414] active:border-white active:border-2 active:translate-y-0.5"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar