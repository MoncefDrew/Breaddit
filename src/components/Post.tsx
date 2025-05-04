"use client";

import { formatTimeToNow } from "@/lib/utils";
import type { Post, User, Vote } from "@prisma/client";
import { MessageCircle, Share, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { FC, useRef } from "react";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./post-vote/PostVoteClient";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/Button";
import JoinButton from "./JoinButton";

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
    <div className="hover:bg-gray-50 bg-white pt-2 rounded-lg md:px-4 px-4 transition-colors duration-200 border border-gray-200 shadow-sm mb-3">
      <div className="flex justify-between relative">
        <div className="w-0 flex-1">
          <div className="max-h-40 text-xs text-gray-500 flex items-center flex-wrap">
            {/* User avatar */}
            <UserAvatar
              user={{
                name: post?.author.name || null,
                image: post?.author.image || null,
              }}
              className="size-6 mr-2"
            />

            {/* subreddit name */}
            {subredditName ? (
              <>
                <a
                  className="font-medium text-blue-500 text-sm hover:text-blue-600 hover:underline"
                  href={`/r/${subredditName}`}
                >
                  r/{subredditName}
                </a>
                <span className="px-1 text-gray-500">•</span>
                <span className="hidden md:flex text-gray-500">Posted by</span>
                <a className="hover:underline text-gray-500 ml-1" href={`/u/${post.author.username}`}>
                  u/{post.author.username || post.author.name}
                </a>
              </>
            ) : null}
            <span className="px-1 text-gray-500">•</span>
            <span className="text-gray-500">{formatTimeToNow(new Date(post.createdAt))}</span>

            {/* Join and More buttons */}
            <div className="hidden md:flex items-center gap-2 absolute top-0 right-6">
              <JoinButton subredditId={post.subredditId} />
              <Button
                variant="ghost"
                className="h-8 w-8 hover:bg-gray-100 rounded-full p-0"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>

          <a
            href={`/r/${subredditName}/post/${post.id}`}
            className="block group"
          >
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              {post.title}
            </h1>
          </a>

          <div
            className="relative text-sm max-h-40 text-gray-700 w-full overflow-hidden"
            ref={pRef}
          >
            <EditorOutput content={post.content} />
          </div>
        </div>
      </div>

      <div className="flex flex-row text-sm  pt-3 pb-4 items-center gap-4">
        <div className="flex items-center bg-gray-100 hover:bg-gray-200 py-0.5 rounded-3xl">
          <PostVoteClient
            postId={post.id}
            initialVotesAmt={_votesAmt}
            initialVote={_currentVote?.type}
          />
        </div>

        <Link
          href={`/r/${subredditName}/post/${post.id}`}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-2 py-2 rounded-3xl"
        >
          <MessageCircle className="h-4 w-4 text-gray-600" />
          <span className="text-xs font-medium text-gray-700">{commentAmt}</span>
        </Link>

        <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-2 py-2 rounded-3xl">
          <Share className="h-4 w-4 text-gray-600" />
          <span className="text-xs font-medium text-gray-700">Share</span>
        </button>
      </div>
    </div>
  );
};

export default Post;
