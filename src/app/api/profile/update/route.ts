import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { ProfileUpdateValidator } from '@/lib/validators/profile'
import { z } from 'zod'

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { profilePicture, coverImage, bio } = ProfileUpdateValidator.parse(body)

    // Update user profile
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: profilePicture,
        // You would need to add these fields to your User model in Prisma
        // coverImage: coverImage,
        // bio: bio,
      },
    })

    return new Response('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data', { status: 422 })
    }

    return new Response('Could not update profile, please try again later', { status: 500 })
  }
} 