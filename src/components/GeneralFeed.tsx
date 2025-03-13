import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import PostFeed from "./PostFeed"
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config"

const GeneralFeed = async () => {
    
    const session = getAuthSession()
    const posts = await db.post.findMany({
        
        orderBy:{
            createdAt:'desc'
        },

        include:{
            votes:true,
            comments:true,
            subreddit:true,
            author:true,
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
    })

    return <PostFeed initialPosts={posts}/>
}

export default GeneralFeed