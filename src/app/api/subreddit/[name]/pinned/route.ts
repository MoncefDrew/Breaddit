import { db } from "@/lib/db"

export async function GET(
    req: Request,
    { params }: { params: { name: string } }) {
    try {
        const posts = await db.post.findMany({
            where: {
                subreddit: {
                    name: params.name
                }
            },
            include:{
                votes: true,
                comments: true,
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        })
        return new Response(JSON.stringify(posts))
        
    } catch (error) {
        return new Response('Could not fetch highlights', { status: 500 })
    }
}