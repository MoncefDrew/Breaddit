import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    
    const { subredditId } = z.object({ subredditId: z.string() }).parse(body)

    

    if (!subredditId) {
      return new Response('Subreddit not found', { status: 404 })
    }

    // check if user has already subscribed to subreddit
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId: subredditId,
        userId: session.user.id,
      },
    })

    if (subscriptionExists) {
      return new Response("You've already subscribed to this subreddit", {
        status: 400,
      })
    }

    // create subreddit and associate it with the user
    await db.subscription.create({
      data: {
        subredditId: subredditId,
        userId: session.user.id,
      },
    })

    return new Response('subreddit created',{status:201})
  } catch (error) {
    (error)
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      'Could not subscribe to subreddit at this time. Please try later',
      { status: 500 }
    )
  }
}