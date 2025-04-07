import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import PostFeed from "./PostFeed"
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config"

const CustomFeed = async () => {
    const session = await getAuthSession()

    // Fetch user subscriptions
    const followedCommunities = session?.user
        ? await db.subscription.findMany({
              where: { userId: session.user.id },
              include: { subreddit: true },
          })
        : []

    let posts

    if (followedCommunities.length > 0) {
        // Fetch posts from subscribed communities
        posts = await db.post.findMany({
            where: {
                subreddit: {
                    id: {
                        in: followedCommunities.map(({ subreddit }) => subreddit.id),
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            include: {
                votes: true,
                comments: true,
                subreddit: true,
                author: true,
            },
            take: INFINITE_SCROLL_PAGINATION_RESULTS,
        })
    } else {
        // Fetch suggested posts (e.g., popular or recent)
        posts = await db.post.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                votes: true,
                comments: true,
                subreddit: true,
                author: true,
            },
            take: INFINITE_SCROLL_PAGINATION_RESULTS,
        })
    }

    return <PostFeed initialPosts={posts} />
}

export default CustomFeed
