import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { postId } = body;

    if (!postId) {
      return new Response("Post ID is required", { status: 400 });
    }

    const session = await getAuthSession(); // Get logged-in user

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Ensure post exists and belongs to the user
    const post = await db.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    if (post.authorId !== session.user.id) {
      return new Response("You are not authorized to delete this post", {
        status: 403,
      });
    }

    // Delete the post
    await db.post.delete({ where: { id: postId } });

    return new Response("Post deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
}
