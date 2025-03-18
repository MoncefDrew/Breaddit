import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle'
import ToFeedButton from '@/components/ToFeedButton'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { format } from 'date-fns'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Breadit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

const Layout = async ({
  children,
  params: { slug },
}: {
  children: ReactNode
  params: { slug: string }
}) => {

  // Just check if the subreddit exists - all other data is now handled in the page component
  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
  })

  if (!subreddit) return notFound()

  return (
    <div className='w-full max-w-full mx-auto h-full pt-6 sm:pt-10 px-0 sm:px-2 md:px-4'>
      <div>
        {children}
      </div>
    </div>
  )
}

export default Layout