import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { z } from 'zod'

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const username = url.searchParams.get('username');
        const limit = url.searchParams.get('limit');
        const page = url.searchParams.get('page');
        
        if (!username) {
            return new Response(JSON.stringify({ error: 'Username is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        try {
            const { limit: parsedLimit, page: parsedPage } = z
                .object({
                    limit: z.string(),
                    page: z.string(),
                })
                .parse({
                    limit,
                    page,
                })

            // Find the user by username
            const user = await db.user.findUnique({
                where: { username }
            });
            
            if (!user) {
                return new Response(JSON.stringify({ error: 'User not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            
            // Get all posts by the user with pagination
            const posts = await db.post.findMany({
                where: { authorId: user.id },
                take: parseInt(parsedLimit),
                skip: (parseInt(parsedPage) - 1) * parseInt(parsedLimit),
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true,
                        }
                    },
                    subreddit: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    votes: true,
                    comments: true,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            
            return new Response(JSON.stringify(posts), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            return new Response('Invalid pagination parameters', { status: 400 })
        }
        
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}