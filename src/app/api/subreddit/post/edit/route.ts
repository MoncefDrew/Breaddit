import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { postId, title, content } = body;

    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const post = await db.post.findUnique({ where: { id: postId } });
    if (!post) return new Response("Post not found", { status: 404 });

    if (post.authorId !== session.user.id) {
      return new Response("You are not allowed to edit this post", { status: 403 });
    }

    await db.post.update({
      where: { id: postId },
      data: { title, content },
    });

    return new Response("OK");
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
}
