import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const session = await getAuthSession()

  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const { subredditId } = await req.json()

  if (!subredditId) return new NextResponse('Missing subreddit ID', { status: 400 })

  const subreddit = await db.subreddit.findUnique({
    where: { id: subredditId },
  })

  if (!subreddit) return new NextResponse('Subreddit not found', { status: 404 })

  const subscription = await db.subscription.findFirst({
    where: {
      subredditId,
      userId: session.user.id,
    },
  })

  const isCreator = subreddit.creatorId === session.user.id

  return NextResponse.json({
    isJoined: !!subscription,
    isCreator,
  })
}
