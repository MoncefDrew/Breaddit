import { Editor } from '@/components/Editor'
import { Button } from '@/components/ui/Button'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { PenLine } from 'lucide-react'

interface pageProps {
  params: {
    slug: string
  }
}

const page = async ({ params }: pageProps) => {
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: params.slug,
    },
  })

  if (!subreddit) return notFound()

  return (
    <div className='flex flex-col items-start gap-6 max-w-4xl mx-auto bg-background text-primary pb-10'>
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
            className='px-6 py-2 bg-reddit hover:bg-reddit text-white font-medium rounded-lg transition-colors' 
            form='subreddit-post-form'
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  )
}

export default page
