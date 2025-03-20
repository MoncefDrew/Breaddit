import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { SubredditSubscriptionValidator } from '@/lib/validators/subreddit'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { subredditId } = SubredditSubscriptionValidator.parse(body)

    // Check if user is already subscribed
    const subscription = await db.subscription.findFirst({
      where: {
        subreddit: {
          name: subredditId,
        },
        user: {
          id: session.user.id,
        },
      },
    })

    if (subscription) {
      return new Response("You're already subscribed to this subreddit", {
        status: 400,
      })
    }

    // Check if subreddit exists
    const subreddit = await db.subreddit.findFirst({
      where: {
        name: subredditId,
      },
    })

    if (!subreddit) {
      return new Response("This subreddit doesn't exist", { status: 404 })
    }

    // Create subscription
    await db.subscription.create({
      data: {
        subreddit: {
          connect: {
            name: subredditId,
          },
        },
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    })

    return new Response(subredditId)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 })
    }

    return new Response('Could not subscribe to subreddit', { status: 500 })
  }
}