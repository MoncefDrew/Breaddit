import CommunityPage from '@/components/community/CommunityPage'
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Prisma } from '@prisma/client'

interface PageProps {
  params: {
    slug: string
  }
}

const Page = async ({ params }: PageProps) => {
  const { slug } = params
  const session = await getAuthSession()

  // Define the include options with proper type
  const include = {
    posts: {
      include: {
        author: true,
        votes: true,
        comments: true,
        subreddit: true,
      },
      orderBy: {
        createdAt: 'desc' as const,
      },
      take: INFINITE_SCROLL_PAGINATION_RESULTS,
    },
    rules: true,
  }

  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include,
  })

  if (!subreddit) return notFound()

  // Get subscription status
  let isSubscribed = false
  if (session) {
    const subscription = await db.subscription.findFirst({
      where: {
        subredditId: subreddit.id,
        userId: session.user.id,
      },
    })
    isSubscribed = !!subscription
  }

  // Get member count
  const memberCount = await db.subscription.count({
    where: {
      subredditId: subreddit.id,
    },
  })

  // Check if user is a moderator
  let isModerator = false
  if (session) {
    isModerator = subreddit.creatorId === session.user.id
  }

  // Default description (in case the model doesn't have a description field yet)
  // This allows the app to work even before the database migration
  const description = (subreddit as any).description || null

  return (
    <div className='container mx-auto max-w-7xl '>
      <CommunityPage
        community={{
          id: subreddit.id,
          name: subreddit.name,
          createdAt: subreddit.createdAt,
          updatedAt: subreddit.updatedAt,
          creatorId: subreddit.creatorId || '',
          coverImage: subreddit.cover || null,
          profileImage: subreddit.image || null,
        }}
        memberCount={memberCount}
        description={description}
        isSubscribed={isSubscribed}
        isModerator={isModerator}
        initialPosts={subreddit.posts}
        session={session}
        rules={subreddit.rules}
      />
    </div>
  )
}

export default Page