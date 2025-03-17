import { z } from 'zod'

export const ProfileUpdateValidator = z.object({
  profilePicture: z.string().nullable(),
  coverImage: z.string().nullable(),
  bio: z.string().max(500).nullable(),
})

export type ProfileUpdateRequest = z.infer<typeof ProfileUpdateValidator> 