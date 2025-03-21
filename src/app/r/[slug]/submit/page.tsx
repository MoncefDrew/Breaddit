import { Editor } from '@/components/Editor'
import { Button } from '@/components/ui/Button'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { AlertCircle, FileText, ImageIcon, Link2, PenLine } from 'lucide-react'
import ToFeedButton from '@/components/ToFeedButton'
import CommunityAboutCard from '@/components/community/CommunityAboutCard'
import { getAuthSession } from '@/lib/auth'
import UserAvatar from '@/components/UserAvatar'
import CommunityRules from '@/components/community/CommunityRules'

interface pageProps {
  params: {
    slug: string
  }
}

const page = async ({ params }: pageProps) => {
  const session = await getAuthSession()

  if (!session?.user) {
    return notFound()
  }
  
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: params.slug,
      creatorId: { not: null }
    },
    include: {
      subscribers: true,
      posts: {
        take: 1,
        orderBy: {
          createdAt: 'desc'
        }
      },
      rules: true
    }
  })

  if (!subreddit) return notFound()

  const isSubscribed = !!subreddit.subscribers.find(
    (sub) => sub.userId === session.user.id
  )
  
  const isModerator = session.user.id === subreddit.creatorId

  // Type assertion to handle the creatorId non-null constraint
  const typedCommunity = {
    id: subreddit.id,
    name: subreddit.name,
    createdAt: subreddit.createdAt,
    creatorId: subreddit.creatorId as string
  }

  return (
    <div className='max-w-7xl mx-auto text-primary pb-10 px-4'>
      <div className='flex flex-col md:flex-row gap-6'>
      <div className='mb-4'>
            <ToFeedButton />
          </div>
        {/* Left column - Editor section */}
        <div className='flex-1 order-2 md:order-1'>
          {/* Navigation */}
          

          {/* Editor Container */}
          <div className='bg-surface border rounded-lg border-custom rounded-b-lg'>
            {/* User Info */}
            <div className='p-4 border-b border-custom flex items-center gap-2'>
              <UserAvatar
                user={{
                  name: session.user.name || null,
                  image: session.user.image || null,
                }}
                className='h-8 w-8'
              />
              <span className='text-sm text-muted'>
                Posting as <span className='text-primary font-medium'>{session.user.username}</span>
              </span>
            </div>

            {/* Draft Rules */}
            <div className='p-4 bg-surface-dark-hover border-b border-custom'>
              <div className='flex items-center gap-2 text-sm text-muted'>
                <AlertCircle className='h-4 w-4 text-reddit' />
                <span>Draft your post carefully to comply with community rules</span>
              </div>
            </div>

            {/* Editor */}
            <div className='p-4'>
              <Editor subredditId={subreddit.id} />
            </div>

            {/* Actions */}
            <div className='p-4 border-t border-custom flex justify-between items-center'>
              <div className='text-xs text-muted'>
                * Required fields
              </div>
              <Button
                type='submit'
                className='px-6 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white font-medium rounded-md transition-colors'
                form='subreddit-post-form'
              >
                Post
              </Button>
            </div>
          </div>
        </div>

        {/* Right column - Sidebar */}
        <div className='w-full md:w-80 order-1 md:order-2'>
          <div className='sticky top-20 space-y-4'>
            <CommunityAboutCard
              community={typedCommunity}
              memberCount={subreddit.subscribers.length}
              description={subreddit.description}
              isSubscribed={isSubscribed}
              isModerator={isModerator}
            />

            <CommunityRules
              communityName={params.slug}
              rules={subreddit.rules}
              isModerator={isModerator}
            />

           
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
