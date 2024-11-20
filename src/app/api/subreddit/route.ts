import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";
import { request } from "http";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    // Creates a asession
    const session = await getAuthSession();

    // returns an error if the user is not logged in
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // reaching the body of the request using json function
    const body = await req.json();
    //using the SubredditValidator we received the name of the user
    //from the body using parse function
    const { name } = SubredditValidator.parse(body);

    //checking if the user's subbreddit already exists in the db
    const subredditExists = await db.subreddit.findFirst({
      where: {
        name,
      },
    });

    if (subredditExists) {
      return new Response("Subbreddit already exists", { status: 409 });
    }

    // creating a new subreddit and injecting it into the db
    const subreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    // injection of the subreddit creator into his subreddit subscriptions
    await db.subscription.create({
        data:{
            userId: session.user.id,
            subredditId: subreddit.id
        }
    })
  
} catch (error) {
    if(error instanceof z.ZodError){
        return new Response(error.message,{status:422})
    }

    return new Response('Could not create subreddit', {status:500})
  }
}
