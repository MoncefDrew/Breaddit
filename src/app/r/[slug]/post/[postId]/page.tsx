import CommentsSection from "@/components/CommentsSection";
import DeletePostButton from "@/components/DeletePostButton";
import EditorOutput from "@/components/EditorOutput";
import EditPostButton from "@/components/EditPostButton";
import PostVoteServer from "@/components/post-vote/PostVoteServer";
import { buttonVariants } from "@/components/ui/Button";
import UserAvatar from "@/components/UserAvatar";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { formatTimeToNow } from "@/lib/utils";
import { CachedPost } from "@/types/redis";
import { Post, User, Vote } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CommunityAboutCard from "@/components/community/CommunityAboutCard";
import ToFeedButton from "@/components/ToFeedButton";
import Link from "next/link";

interface SubRedditPostPageProps {
  params: {
    postId: string;
    slug: string;
  };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const SubRedditPostPage = async ({ params }: SubRedditPostPageProps) => {

  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`
  )) as CachedPost;

  let post: (Post & { votes: Vote[]; author: User }) | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }

  const session = await getAuthSession();
  const isLoggedIn = !!session?.user;

  const community = (await db.subreddit.findFirstOrThrow({
    where: {
      name: params.slug,
      creatorId: { not: null },
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      creatorId: true,
      description: true,
      subscribers: true,
    },
  })) as {
    id: string;
    name: string;
    createdAt: Date;
    creatorId: string;
    description: string | null;
    subscribers: { subredditId: string; userId: string }[];
  };

  if (!post && !cachedPost) return notFound();
  if (!community) return notFound();

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subreddit: {
            name: params.slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscribed = !!subscription;
  const isModerator = session?.user?.id === community.creatorId;

  return (
    <div className="bg-gray-50 ">
      <div className="h-full flex flex-col items-start justify-between max-w-7xl mx-auto">
        <div className="w-full mt-5 flex flex-col md:flex-row md:gap-3">
          {/* Back to feed */}
          <div className="mb-2 md:mb-0">
            <ToFeedButton />
          </div>

          {/* Post details */}
          <div className="w-full flex-1 bg-white p-5 md:p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex flex-1 flex-col sm:flex-row justify-between">
              <div className="flex flex-row items-center gap-3 md:gap-4">
                <UserAvatar
                  user={{
                    name:
                      post?.author.username ||
                      cachedPost?.authorUsername ||
                      null,
                    image: post?.author.image || null,
                  }}
                  className="w-10 h-10 border border-gray-200"
                />
                <div className="flex flex-col">
                  <p className="max-h-40 mt-1 truncate text-sm text-gray-800">
                    Posted by u/
                    <Link
                      href={`/u/${
                        post?.author.username ?? cachedPost.authorUsername
                      }`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {post?.author.username ?? cachedPost.authorUsername}
                    </Link>
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {formatTimeToNow(
                      new Date(post?.createdAt ?? cachedPost.createdAt)
                    )}
                  </p>
                </div>
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-bold py-4 leading-snug text-gray-900">
              {post?.title ?? cachedPost.title}
            </h1>

            <div className="max-w-full overflow-x-auto prose prose-sm md:prose-base prose-slate mt-2">
              <EditorOutput content={post?.content ?? cachedPost.content} />
            </div>

            {/* Vote buttons - visible only on small screens */}
            <div className="mt-6 mb-4 flex items-center justify-items-start">
              <Suspense fallback={<PostVoteShellHorizontal />}>
                {/* @ts-expect-error server component */}
                <PostVoteServer
                  postId={post?.id ?? cachedPost.id}
                  getData={async () => {
                    return await db.post.findUnique({
                      where: {
                        id: params.postId,
                      },
                      include: {
                        votes: true,
                      },
                    });
                  }}
                />
              </Suspense>
            </div>

            {session?.user && session?.user.id === post?.author.id ? (
              <div className="flex items-end justify-end gap-3 mt-6 border-t border-gray-100 pt-4">
                <DeletePostButton postId={post?.id} />
                {/* @ts-ignore */}
                <EditPostButton post={post} />
              </div>
            ) : null}

            <Suspense
              fallback={
                <div className="flex justify-center my-6">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                </div>
              }
            >
              {/* @ts-expect-error Server Component */}
              <CommentsSection postId={post?.id ?? cachedPost.id} />
            </Suspense>
          </div>

          {/* About Community Card */}
          <div className="hidden lg:block w-80 ">
            <div className="sticky ">
              <CommunityAboutCard
                community={community}
                memberCount={community.subscribers.length}
                isSubscribed={isSubscribed}
                isModerator={isModerator}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Horizontal vote shell for mobile view
function PostVoteShellHorizontal() {
  return (
    <div className="flex items-center justify-center gap-8 w-full bg-gray-50 rounded-full py-1">
      <div
        className={buttonVariants({
          variant: "ghost",
          className: "px-3 rounded-full",
        })}
      >
        <ArrowBigUp className="h-5 w-5 text-gray-500" />
      </div>

      <div className="text-center font-medium text-sm text-gray-700">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      <div
        className={buttonVariants({
          variant: "ghost",
          className: "px-3 rounded-full",
        })}
      >
        <ArrowBigDown className="h-5 w-5 text-gray-500" />
      </div>
    </div>
  );
}

// Original vertical vote shell for desktop view
function PostVoteShell() {
  return (
    <div className="flex items-center flex-col pr-6 w-14">
      <div
        className={buttonVariants({
          variant: "ghost",
          className: "rounded-full",
        })}
      >
        <ArrowBigUp className="h-5 w-5 text-gray-500" />
      </div>

      <div className="text-center py-2 font-medium text-sm text-gray-700">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      <div
        className={buttonVariants({
          variant: "ghost",
          className: "rounded-full",
        })}
      >
        <ArrowBigDown className="h-5 w-5 text-gray-500" />
      </div>
    </div>
  );
}

export default SubRedditPostPage;
