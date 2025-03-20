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

  const community = (await db.subreddit.findFirstOrThrow({
    where: { 
      name: params.slug,
      creatorId: { not: null }
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      creatorId: true,
      description: true,
      subscribers: true
    }
  })) as { id: string; name: string; createdAt: Date; creatorId: string; description: string | null; subscribers: { subredditId: string; userId: string; }[] };

  if (!post && !cachedPost) return notFound();
  if (!community) return notFound();

  const subscription = !session?.user ? undefined : await db.subscription.findFirst({
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
    <div className="bg-surface m-2 md:m-5">
      <div className="h-full flex flex-col items-start justify-between">
        
        <div className="w-full flex flex-col md:flex-row md:gap-3">
          <div className="mb-2 md:mb-0">
            <ToFeedButton/>
          </div>

          {/* Vote buttons - visible only on medium+ screens */}
          <div className="hidden md:block">
            <Suspense fallback={<PostVoteShell />}>
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

          <div className="w-full flex-1 bg-surface p-3 md:p-4 rounded-sm border border-custom">
            <div className="flex flex-1 flex-col sm:flex-row justify-between">
              <div className="flex flex-row items-center gap-2 md:gap-4">
                <UserAvatar
                  user={{
                    name: post?.author.username || cachedPost?.authorUsername || null,
                    image: post?.author.image || null,
                  }}
                  className="w-8 h-8"
                />
                <div className="flex flex-col">
                  <p className="max-h-40 mt-1 truncate text-xs text-primary">
                    Posted by u/
                    {post?.author.username ?? cachedPost.authorUsername}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {formatTimeToNow(
                      new Date(post?.createdAt ?? cachedPost.createdAt)
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            <h1 className="text-lg md:text-xl font-semibold py-2 leading-6 text-primary">
              {post?.title ?? cachedPost.title}
            </h1>

            <div className="max-w-full overflow-x-auto">
              <EditorOutput content={post?.content ?? cachedPost.content} />
            </div>
            
            {/* Vote buttons - visible only on small screens */}
            <div className="md:hidden mt-4 mb-4 flex items-center justify-center">
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
            
            {session?.user && (session?.user.id === post?.author.id) ? (
              <div className="flex items-end justify-end gap-3 mt-3">
                <DeletePostButton postId={post?.id} />
                {/* @ts-ignore */}
                <EditPostButton post={post}/>
              </div>
            ) : null}
            
            <Suspense
              fallback={
                <div className="flex justify-center my-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted" />
                </div>
              }
            >
              {/* @ts-expect-error Server Component */}
              <CommentsSection postId={post?.id ?? cachedPost.id} />
            </Suspense>
          </div>

          {/* About Community Card */}
          <div className="hidden lg:block w-[300px] ml-6">
            <div className="sticky top-20">
              <CommunityAboutCard
                community={community}
                memberCount={community.subscribers.length}
                description={community.description}
                isSubscribed={isSubscribed}
                isModerator={isModerator}
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
    <div className="flex items-center justify-center gap-8 w-full">
      <div className={buttonVariants({ variant: "ghost", className: "px-3" })}>
        <ArrowBigUp className="h-5 w-5 text-muted" />
      </div>

      <div className="text-center font-medium text-sm text-primary">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      <div className={buttonVariants({ variant: "ghost", className: "px-3" })}>
        <ArrowBigDown className="h-5 w-5 text-muted" />
      </div>
    </div>
  );
}

// Original vertical vote shell for desktop view
function PostVoteShell() {
  return (
    <div className="flex items-center flex-col pr-6 w-20">
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigUp className="h-5 w-5 text-muted" />
      </div>

      <div className="text-center py-2 font-medium text-sm text-primary">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigDown className="h-5 w-5 text-muted" />
      </div>
    </div>
  );
}

export default SubRedditPostPage;
