import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  try {
    const { name } = params

    if (!name) {
      return new Response('Subreddit name is required', { status: 400 })
    }

    // Fetch the subreddit
    const subreddit = await db.subreddit.findFirst({
      where: {
        name,
      },
    })

    if (!subreddit) {
      return new Response('Subreddit not found', { status: 404 })
    }

    // Fetch rules for this subreddit
    const rules = await db.rule.findMany({
      where: {
        subredditId: subreddit.id,
      },
      orderBy: {
        createdAt: 'asc', // Order by creation time
      },
    })

    return new Response(JSON.stringify(rules))
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { name: string } }
) {
  try {
    const { name } = params
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Validate the request body
    const body = await req.json()
    const { rules } = body

    // Check if the array is valid
    if (!Array.isArray(rules)) {
      return new Response('Invalid rules format', { status: 400 })
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

    // Check if the user is a moderator (creator of the subreddit)
    if (subreddit.creatorId !== session.user.id) {
      return new Response('You are not authorized to update rules', { status: 403 })
    }

    // Delete existing rules for this subreddit
    await db.rule.deleteMany({
      where: {
        subredditId: subreddit.id,
      },
    })

    // Create new rules
    const rulePromises = rules.map((rule: { title: string; description: string }) =>
      db.rule.create({
        data: {
          title: rule.title,
          description: rule.description || '',
          subredditId: subreddit.id,
        },
      })
    )

    await Promise.all(rulePromises)

    return new Response('Rules updated successfully')
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 })
  }
} 