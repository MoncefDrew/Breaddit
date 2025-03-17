import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle'
import ToFeedButton from '@/components/ToFeedButton'
import { buttonVariants } from '@/components/ui/Button'
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
  const session = await getAuthSession()

  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  })

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subreddit: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      })

  const isSubscribed = !!subscription

  if (!subreddit) return notFound()

  const memberCount = await db.subscription.count({
    where: {
      subreddit: {
        name: slug,
      },
    },
  })

  return (
    <div className='sm:container max-w-7xl mx-auto h-full pt-12 bg-[#030303]'>
      <div>
        <ToFeedButton />

        <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
          <ul className='flex flex-col col-span-2 space-y-6'>{children}</ul>

          {/* info sidebar */}
          <div className='overflow-hidden h-fit rounded-lg border border-[#343536] order-first md:order-last bg-[#1A1A1B] shadow-md'>
            <div className='px-6 py-4 bg-[#272729]'>
              <p className='font-semibold py-3 text-[#D7DADC]'>About r/{subreddit.name}</p>
            </div>
            <dl className='divide-y divide-[#343536] px-6 py-4 text-sm leading-6'>
              <div className='flex justify-between gap-x-4 py-3'>
                <dt className='text-[#818384]'>Created</dt>
                <dd className='text-[#D7DADC]'>
                  <time dateTime={subreddit.createdAt.toDateString()}>
                    {format(subreddit.createdAt, 'MMMM d, yyyy')}
                  </time>
                </dd>
              </div>
              <div className='flex justify-between gap-x-4 py-3'>
                <dt className='text-[#818384]'>Members</dt>
                <dd className='flex items-start gap-x-2'>
                  <div className='text-[#D7DADC]'>{memberCount}</div>
                </dd>
              </div>
              {subreddit.creatorId === session?.user?.id ? (
                <div className='flex justify-between gap-x-4 py-3'>
                  <dt className='text-[#818384]'>You created this community</dt>
                </div>
              ) : null}

              {subreddit.creatorId !== session?.user?.id ? (
                <SubscribeLeaveToggle
                  isSubscribed={isSubscribed}
                  subredditId={subreddit.id}
                  subredditName={subreddit.name}
                />
              ) : null}

              {session?.user? <Link
                href={`r/${slug}/submit`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-transparent active:border-white active:border-2 active:translate-y-0.5 h-10 py-2 px-4 w-full mt-3 mb-6 bg-[#2D2D2D] text-[#D7DADC] hover:bg-[#3D3D3D]"
                >
                Create Post
              </Link> : null}
              
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout