'use client'

import { ChevronLeft } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const ToFeedButton = () => {
  const pathname = usePathname()

  // if path is /r/mycom, turn into /
  // if path is /r/mycom/post/cligad6jf0003uhest4qqkeco, turn into /r/mycom

  const subredditPath = getSubredditPath(pathname)

  return (
    <Link 
      href={subredditPath} 
      className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 
            transition-colors cursor-pointer bg-white border border-gray-200 rounded-md 
            px-3 py-1.5 shadow-sm hover:bg-gray-50" >
      <ChevronLeft className="h-4 w-4 mr-1" />
      <span>Back</span>
    </Link>
  )
}

const getSubredditPath = (pathname: string) => {
  const splitPath = pathname.split('/')

  if (splitPath.length === 3) return '/'
  else if (splitPath.length > 3) return `/${splitPath[1]}/${splitPath[2]}`
  // default path, in case pathname does not match expected format
  else return '/'
}

export default ToFeedButton