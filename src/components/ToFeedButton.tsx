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
      className="inline-flex items-center text-sm font-medium text-primary  hover:bg-surface-dark transition-colors cursor-pointer
            bg-surface  hover:bg-surface-dark-hover border border-custom rounded-md px-4 py-2  gap-2  w-fit" >
      <ChevronLeft className="h-4 w-4 mr-1 text-primary" />
      {subredditPath === '/' ? 'Back home' : 'Back to community'}
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