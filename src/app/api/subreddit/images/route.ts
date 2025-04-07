import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Image type validation schema
const ImageUpdateSchema = z.object({
  subredditName: z.string(),
  imageType: z.enum(['cover', 'profile']),
  imageUrl: z.string().url(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to update community images.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { subredditName, imageType, imageUrl } = ImageUpdateSchema.parse(body)

    // Check if subreddit exists
    const subreddit = await db.subreddit.findFirst({
      where: {
        name: subredditName,
      },
    })

    if (!subreddit) {
      return NextResponse.json(
        { error: 'Community not found.' },
        { status: 404 }
      )
    }

    // Check if user is moderator (creator) of the subreddit
    if (subreddit.creatorId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to update this community.' },
        { status: 403 }
      )
    }

    // Update the appropriate image field
    const updateData = imageType === 'cover' 
      ? { cover: imageUrl } 
      : { image: imageUrl }

    // Update the subreddit
    const updatedSubreddit = await db.subreddit.update({
      where: {
        id: subreddit.id,
      },
      data: updateData,
    })

    return NextResponse.json(
      { message: 'Image updated successfully', subreddit: updatedSubreddit },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 422 }
      )
    }
    
    console.error('Error updating community image:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
} 