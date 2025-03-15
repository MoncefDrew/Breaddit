import z from 'zod'

//PostValidator is likely a Zod schema defining the rules for validating the form fields 
//(e.g., required fields, data types, string length, etc.).
export const PostValidator= z.object({
    title:z
    .string()
    .min(3, {message:'Title must be longer than 3 characters'})
    .max(128, {message: 'Title must be at least 128 characters'}),
    subredditId : z.string(),
    content:z.any(),
})

//in the edit post validator we don't need the subreddit id since the post is already existing
export const EditPostValidator = z.object({
    title:z
    .string()
    .min(3, {message:'Title must be longer than 3 characters'})
    .max(128, {message: 'Title must be at least 128 characters'}),
    content:z.any(),

})

export type PostCreationRequest = z.infer<typeof PostValidator>