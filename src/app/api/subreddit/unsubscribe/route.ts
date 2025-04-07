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

    // check if user has already subscribed to subreddit
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    })

    if (!subscriptionExists) {
      return new Response("You're not subscribed to this subreddit", {
        status: 400,
      })
    }

    //check if user is the creator of subreddit
    const subreddit = await db.subreddit.findFirst({
        where:{
            id:subredditId,
            creatorId: session.user.id,
        }
    })

    if (subreddit){
        return new Response('you can unsubscribe from your subreddit',{status:400})
    }
    // delete user from subreddit
    await db.subscription.delete({
      where:{
        userId_subredditId:{
            subredditId,
            userId: session.user.id,
        }
      }
    })

    return new Response(subredditId)
  } catch (error) {
    (error)
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      'Could not unsubscribe to subreddit at this time. Please try later',
      { status: 500 }
    )
  }
}