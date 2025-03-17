import { db } from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const { userId, bio } = await req.json();

    if (!userId) {
      return new Response("Missing userId", { status: 400 });
    }

    const user = await db.user.update({
      where: { id: userId },
      data: { bio },
    });

    return new Response('success', { status: 200 });
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
} 

export async function GET(req: Request) {
  try {
    const { userId } = await req.json();
    const user = await db.user.findUnique({
      where: { id: userId },
    });
    return new Response(user?.bio, { status: 200 });
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
}