import ProfilePage from "@/components/profile/ProfilePage";
import { authOptions, getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";

interface PageProps {
  params: {
    user: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const username = params.user;
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  // Fetch user profile data
  const user = await db.user.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true,
      username: true,
      image: true, // This will be used as profilePicture
      cover: true,
      bio: true,
    },
  });

  if (!user) {
    redirect("/");
  }
  
  // Fetch initial posts for infinite scrolling
  const initialPosts = await db.post.findMany({
    where: { authorId: user.id },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
    include: {
      author: true,
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
  
  // Fetch initial comments for infinite scrolling
  const initialComments = await db.comment.findMany({
    where: { authorId: user.id },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
    include: {
      author: true,
      votes: true,
      post: {
        select: {
          id: true,
          title: true,
          subreddit: {
            select: {
              name: true
            }
          }
        }
      },
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  // Check if the current user is viewing their own profile
  const isOwnProfile = session.user.username === username;
  
  return (
    <ProfilePage
      user={{
        id: user.id,
        username: user.username || "",
        profilePicture: user.image,
        coverImage: user.cover,
        bio: user.bio,
      }}
      isOwnProfile={isOwnProfile}
      initialPosts={initialPosts}
      initialComments={initialComments}
    />
  );
};

export default Page;
