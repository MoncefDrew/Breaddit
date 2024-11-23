import z from "zod"

// the z object can fetch selectable attributes or lines from 
// other objects 
export const SubredditValidator = z.object({
    name: z.string().min(3).max(21),
})

export const SubredditSubscriptionValidator= z.object({
    subredditId : z.string()
})

export type CreateSubredditPayload = z.infer<typeof SubredditValidator>
export type SubscribeToSubredditPayload = z.infer<typeof SubredditSubscriptionValidator>