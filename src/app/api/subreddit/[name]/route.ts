import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export async function PATCH(
  req: Request,
  { params }: { params: { name: string } }
) {
  try {
    const { name } = params
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Find the subreddit
    const subreddit = await db.subreddit.findFirst({
      where: {
        name,
      },
    })

    if (!subreddit) {
      return new Response('Subreddit not found', { status: 404 })
    }

    // Check if the user is the creator
    if (subreddit.creatorId !== session.user.id) {
      return new Response('You are not authorized to update this subreddit', { status: 403 })
    }

    // Parse the request body
    const body = await req.json()
    
    const DescriptionSchema = z.object({
      description: z.string().nullable().optional(),
    })

    const { description } = DescriptionSchema.parse(body)

    // Use the raw SQL query approach that works
    await db.$executeRaw`UPDATE Subreddit SET description = ${description} WHERE id = ${subreddit.id}`

    // Fetch the updated subreddit
    const updatedSubreddit = await db.subreddit.findUnique({
      where: {
        id: subreddit.id,
      },
    })

    return new Response(JSON.stringify(updatedSubreddit))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data', { status: 422 })
    }
    
    console.error('Subreddit update error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
} 