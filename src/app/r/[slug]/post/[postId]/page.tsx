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

interface SubRedditPostPageProps {
  params: {
    postId: string;
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

  if (!post && !cachedPost) return notFound();

  return (
    <div className="bg-[#030303]">
      <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
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

        <div className="sm:w-0 w-full flex-1 bg-[#1A1A1B] p-4 rounded-sm border border-[#343536]">
          <div className="flex flex-1 flex-row justify-between">
            <div className="flex flex-row items-center gap-2 md:gap-4">
              <UserAvatar
                user={{
                  name: post?.author.username || cachedPost?.authorUsername || null,
                  image: post?.author.image  || null,
                }}
                className="w-8 h-8"
              />
              <div className="flex flex-col">
                <p className="max-h-40 mt-1 truncate text-xs text-[#D7DADC]">
                  Posted by u/
                  {post?.author.username ?? cachedPost.authorUsername}
                </p>
                <p className="truncate text-xs text-[#818384]">
                  {formatTimeToNow(
                    new Date(post?.createdAt ?? cachedPost.createdAt)
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <h1 className="text-xl font-semibold py-2 leading-6 text-[#D7DADC]">
            {post?.title ?? cachedPost.title}
          </h1>

          <EditorOutput content={post?.content ?? cachedPost.content} />
          
          {session?.user && (session?.user.id === post?.author.id) ? (
            <div className="flex items-end justify-end gap-5">
              <DeletePostButton postId={post?.id} />
              {/* @ts-ignore */}
              <EditPostButton post={post}/>
            </div>
          ) : null}
          
          <Suspense
            fallback={
              <Loader2 className="h-5 w-5 animate-spin text-[#818384]" />
            }
          >
            {/* @ts-expect-error Server Component */}
            <CommentsSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

function PostVoteShell() {
  return (
    <div className="flex items-center flex-col pr-6 w-20">
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigUp className="h-5 w-5 text-[#818384]" />
      </div>

      <div className="text-center py-2 font-medium text-sm text-[#D7DADC]">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigDown className="h-5 w-5 text-[#818384]" />
      </div>
    </div>
  );
}

export default SubRedditPostPage;
