import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { Icons } from './Icons'
import { buttonVariants } from './ui/Button'
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
        <div className="relative z-50">
          {session?.user ? (
            <UserAccountNav user={session.user} />
          ) : (
            <Link href='/sign-in' className={buttonVariants({
              className: "bg-[#FF4500] hover:bg-[#FF5414] text-white"
            })}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar