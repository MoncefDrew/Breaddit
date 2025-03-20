"use client";

import { formatTimeToNow } from "@/lib/utils";
import type { Post, User, Vote } from "@prisma/client";
import { MessageCircle, Share, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { FC, useRef, useState } from "react";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./post-vote/PostVoteClient";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/Button";
import { useCustomToast } from "@/hooks/use-custom-toast";
import axios from "axios";
import JoinButton from './JoinButton'

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
  const [isJoined, setIsJoined] = useState(false);
  const { loginToast } = useCustomToast();

  const handleJoin = async () => {
    try {
      await axios.post(`/api/subreddit/subscribe`, { subredditName });
      setIsJoined(true);
    } catch (error) {
      loginToast();
    }
  };

  return (
    <div className="hover:border-custom-hover border-b-[#232b36] border-b-2 transition-colors duration-200 mb-1">
      <div className="px-6 flex justify-between relative">
        <div className="w-0 flex-1">
          <div className="max-h-40 text-xs text-muted flex items-center flex-wrap">

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
                  className="font-medium text-link text-sm hover:text-link-hover hover:underline"
                  href={`/r/${subredditName}`}
                >
                  r/{subredditName}
                </a>
              </>
            ) : null}
            <span className="px-1">•</span>
            <span>{formatTimeToNow(new Date(post.createdAt))}</span>
          </div>

          {/* Join and More buttons */}
          <div className="flex items-center gap-2 absolute top-0 right-6">
            <JoinButton subredditName={subredditName} />
            <Button
              variant="ghost"
              className="h-8 w-8 hover:bg-zinc-800 rounded-full p-0"
            >
              <MoreHorizontal className="h-4 w-4 text-muted" />
            </Button>
          </div>

          <a
            href={`/r/${subredditName}/post/${post.id}`}
            className="block group"
          >
            <h1 className="text-lg font-semibold py-2 leading-6 text-primary group-hover:text-link-hover transition-colors duration-200">
              {post.title}
            </h1>
          </a>

          <div 
            className="relative text-sm max-h-40 w-full overflow-hidden" 
            ref={pRef}
          >
            <EditorOutput content={post.content} />
            {pRef.current && pRef.current.clientHeight >= 160 && (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-[#0D1117] via-[#0D1117]/70 to-transparent"></div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-row text-sm px-4 py-2 items-center gap-4 ">
        <div className="flex items-center hover:border-[#556883] border-2 border-[#232b36] bg-[#232b36] rounded-3xl">
          <PostVoteClient
            postId={post.id}
            initialVotesAmt={_votesAmt}
            initialVote={_currentVote?.type}
          />
        </div>

        <Link
          href={`/r/${subredditName}/post/${post.id}`}
          className="flex items-center gap-2  py-2 px-3 hover:border-[#556883] bg-[#232b36] border-2 border-[#232b36]  rounded-3xl"
        >
          <MessageCircle className="h-4 w-4 " />
          <span className="text-xs font-medium ">{commentAmt}</span>
        </Link>

        <button className="flex items-center gap-2  py-2 px-3 hover:border-[#556883] bg-[#232b36] border-2 border-[#232b36]  rounded-3xl">
          <Share className="h-4 w-4  " />
          <span className="text-xs font-medium ">Share</span>
        </button>
      </div>
    </div>
  );
};

export default Post;
