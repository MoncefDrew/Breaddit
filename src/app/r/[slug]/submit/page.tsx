import { Editor } from '@/components/Editor'
import { Button } from '@/components/ui/Button'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { PenLine } from 'lucide-react'
import ToFeedButton from '@/components/ToFeedButton'
import CommunityAboutCard from '@/components/community/CommunityAboutCard'
import { getAuthSession } from '@/lib/auth'

interface pageProps {
  params: {
    slug: string
  }
}

const page = async ({ params }: pageProps) => {
  const session = await getAuthSession()
  
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: params.slug,
      creatorId: { not: null }
    },
    include: {
      subscribers: true
    }
  })

  if (!subreddit) return notFound()

  const isSubscribed = !!session?.user && !!subreddit.subscribers.find(
    (sub) => sub.userId === session.user.id
  )
  
  const isModerator = session?.user?.id === subreddit.creatorId

  // Type assertion to handle the creatorId non-null constraint
  const typedCommunity = {
    id: subreddit.id,
    name: subreddit.name,
    createdAt: subreddit.createdAt,
    creatorId: subreddit.creatorId as string
  }

  return (
    <div className='max-w-7xl mx-auto bg-zinc-950 text-primary pb-10 px-4'>
      
      
      {/* Main content area with sidebar */}
      <div className='flex flex-col md:flex-row gap-6'>
        {/* Editor section - takes up most of the space */}
        {/* Top navigation with back button */}
        <div>

        <ToFeedButton  />
        </div>
        <div className='md:flex-1 order-2 md:order-1'>
          {/* heading */}
          <div className='w-full bg-surface rounded-md shadow-md border border-custom p-6 mb-4'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='bg-reddit rounded-full p-2 flex-shrink-0'>
                <PenLine className='h-5 w-5 text-white' />
              </div>
              <div>
                <h1 className='text-xl font-bold text-primary'>
                  Create a post
                </h1>
                <p className='text-sm text-muted mt-1'>
                  in <span className='text-link hover:underline cursor-pointer'>r/{params.slug}</span>
                </p>
              </div>
            </div>
            
            <div className='border-t border-custom pt-4 mt-2'>
              <p className='text-sm text-muted'>
                Share your thoughts, links, or images with the community
              </p>
            </div>
          </div>

          {/* form */}
          <div className='w-full bg-surface rounded-md shadow-md border border-custom p-6'>
            <Editor subredditId={subreddit.id} />

            <div className='w-full flex justify-end mt-6 pt-4 border-t border-custom'>
              <Button 
                type='submit' 
                className='px-6 py-2 bg-reddit hover:bg-reddit-hover text-white font-medium rounded-md transition-colors' 
                form='subreddit-post-form'
              >
                Post
              </Button>
            </div>
          </div>
        </div>
        
        {/* Sidebar - fixed width */}
        <div className='w-full md:w-80 order-1 md:order-2'>
          <div className='sticky top-20'>
            <CommunityAboutCard 
              community={typedCommunity} 
              memberCount={subreddit.subscribers.length}
              description={subreddit.description}
              isSubscribed={isSubscribed}
              isModerator={isModerator}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
