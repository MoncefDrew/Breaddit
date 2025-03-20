import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const subscription = await db.subscription.findFirst({
      where: {
        subreddit: {
          name: params.name,
        },
        user: {
          id: session.user.id,
        },
      },
    })

    return new Response(JSON.stringify({ isSubscribed: !!subscription }))
  } catch (error) {
    return new Response('Could not check subscription status', { status: 500 })
  }
} 