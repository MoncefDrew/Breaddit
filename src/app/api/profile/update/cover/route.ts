import { db } from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const { userId, cover } = await req.json();

    if (!userId) {
      return new Response("Missing userId", { status: 400 });
    }

    // Allow cover to be null for removal
    const user = await db.user.update({
      where: { id: userId },
      data: { cover },
    });

    return new Response('success', { status: 200 });
  } catch (error) {
    console.error("Cover update error:", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
