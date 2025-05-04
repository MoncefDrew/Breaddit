import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { Icons } from './Icons'
import UserAccountNav from './UserAccountNav'
import SearchBar from './SearchBar'

const Navbar = async () => {
  const session = await getServerSession(authOptions)
  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-white border-b border-gray-200 z-10 py-2 shadow-sm'>
      <div className='container max-w-5xl h-full mx-auto flex items-center justify-between gap-2'>
        {/* logo */}
        <Link href='/' className='flex gap-2 items-center'>
          <Icons.logo className='h-8 w-8 sm:h-6 sm:w-6 text-orange-500' />
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
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 bg-orange-500 text-white border border-transparent hover:bg-orange-600 active:translate-y-0.5"
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