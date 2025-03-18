"use client";

import { formatTimeToNow } from "@/lib/utils";
import type { Post, User, Vote } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { FC, useRef } from "react";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./post-vote/PostVoteClient";
import UserAvatar from "./UserAvatar";

type PartialVote = Pick<Vote, "type">;

interface PostProps {
  post: Post & {
    author: User;
    votes: Vote[];
  };
  votesAmt: number;
  subredditName: string;
  currentVote?: PartialVote;
  commentAmt: number;
}

const Post: FC<PostProps> = ({
  post,
  votesAmt: _votesAmt,
  currentVote: _currentVote,
  subredditName,
  commentAmt,
}) => {
  const pRef = useRef<HTMLParagraphElement>(null);

  return (
    <div className="rounded-md bg-surface shadow border border-custom hover:border-custom transition-colors duration-200 mb-4">
      <div className="px-6 py-4 flex justify-between gap-4">
        <PostVoteClient
          postId={post.id}
          initialVotesAmt={_votesAmt}
          initialVote={_currentVote?.type}
        />

        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-muted flex items-center flex-wrap">
            <UserAvatar
              user={{
                name: post?.author.name || null,
                image: post?.author.image || null,
              }}
              className="size-9 mr-2 border-2 rounded-full border-zinc-500"
            />
            
            {subredditName ? (
              <>
                <a
                  className="font-medium text-link text-sm hover:text-link-hover hover:underline"
                  href={`/r/${subredditName}`}
                >
                  r/{subredditName}
                </a>
                <span className="px-1">•</span>
              </>
            ) : null}
            <span>Posted by </span>
            <Link href={`/u/${post.author.username}`} className="text-sm hover:text-primary hover:underline ml-1">
              u/{post.author.username}
            </Link>
            <span className="px-1">•</span>
            <span>{formatTimeToNow(new Date(post.createdAt))}</span>
          </div>
          
          <a href={`/r/${subredditName}/post/${post.id}`} className="block group">
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
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-surface to-transparent"></div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-surface-dark-hover z-20 text-sm px-4 py-3 sm:px-6 rounded-b-md">
        <Link
          href={`/r/${subredditName}/post/${post.id}`}
          className="w-fit flex items-center gap-2 text-muted hover:text-primary transition-colors duration-200 py-1 px-2 rounded-full hover:bg-surface-dark-hover"
        >
          <MessageSquare className="h-4 w-4" /> {commentAmt} {commentAmt === 1 ? 'comment' : 'comments'}
        </Link>
      </div>
    </div>
  );
};

export default Post;