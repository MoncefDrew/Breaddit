"use client";

import { formatTimeToNow } from "@/lib/utils";
import type { Post, User } from "@prisma/client";
import { FC, useRef } from "react";
import EditorOutput from "../EditorOutput";
import UserAvatar from "../UserAvatar";

interface PostProps {
  post: Post & {
    author: User;
  };
  subredditName: string;
}

const Post: FC<PostProps> = ({ post, subredditName }) => {
  const pRef = useRef<HTMLParagraphElement>(null);

  return (
    <div className="bg-surface shadow-sm mb-4 border-b border-custom">
      <div className="px-6 py-1 flex justify-between gap-4">
        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-muted flex items-center flex-wrap">
            <UserAvatar
              user={{
                name: post?.author.name || null,
                image: post?.author.image || null,
              }}
              className="size-9 mr-2 border-2 rounded-full border-zinc-500"
            />
            <div className="flex flex-col">
              {subredditName ? (
                <>
                  <a
                    className="font-medium text-link text-sm hover:text-link-hover hover:underline"
                    href={`/r/${subredditName}`}
                  >
                    r/{subredditName}
                  </a>
                </>
              ) : null}

              <span>Posted in {formatTimeToNow(new Date(post.createdAt))}</span>
            </div>
          </div>

          <a
            href={`/r/${subredditName}/post/${post.id}`}
            className="block group"
          >
            <h1 className="text-lg font-semibold py-2 leading-6 text-primary group-hover:text-white transition-colors duration-200">
              {post.title}
            </h1>
          </a>

          <div
            className="relative text-sm max-h-40 w-full overflow-clip text-primary"
            ref={pRef}
          >
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-[#1A1A1B] to-transparent"></div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
