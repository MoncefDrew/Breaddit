import { db } from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const { userId, image } = await req.json();

    if (!userId || !image) {
      return new Response( "Missing data" , { status: 400 });
    }

    const user = await db.user.update({
      where: { id: userId },
      data: { image },
    });

    return new Response( 'success',{status:200} );
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
}
