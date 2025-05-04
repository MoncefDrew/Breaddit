"use client";

import { formatTimeToNow } from "@/lib/utils";
import type { Post, User } from "@prisma/client";
import { FC, useRef } from "react";
import EditorOutput from "../EditorOutput";
import UserAvatar from "../UserAvatar";
import { MessageSquare, ArrowUp, ArrowDown, Bookmark, Share2 } from "lucide-react";
import Link from "next/link";

interface PostProps {
  post: Post & {
    author: User;
    subreddit?: {
      name: string;
    }
  };
  subredditName: string;
}

const Post: FC<PostProps> = ({ post, subredditName }) => {
  const pRef = useRef<HTMLParagraphElement>(null);

  // For static implementation
  const commentCount = 5;
  const votes = 18;

  return (
    <div className="bg-white shadow-sm rounded-lg mb-4 border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden">
    <div className="px-3 py-3 md:px-5 md:py-4">
      {/* Post header - optimized for sm, original design for md+ */}
      <div className="flex flex-wrap md:flex-nowrap items-center text-xs md:text-sm text-gray-500 mb-2">
        <UserAvatar
          user={{
            name: post?.author.name || null,
            image: post?.author.image || null,
          }}
          className="h-5 w-5 md:h-6 md:w-6 rounded-full mr-1"
        />
        
        <div className="flex flex-wrap md:flex-nowrap items-center gap-1 w-full md:w-auto mt-1 md:mt-0">
          <Link
            href={`/r/${subredditName}`}
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            r/{subredditName}
          </Link>
          
          <span className="text-gray-400 hidden sm:inline">•</span>
          
          <span className="text-gray-400 hidden sm:inline">Posted by</span>
          
          <Link
            href={`/u/${post.author.username}`}
            className="hover:underline hover:text-gray-700"
          >
            <span className="sm:hidden">by </span>
            u/{post.author.username}
          </Link>
          
          <span className="text-gray-400">•</span>
          
          <span className="whitespace-nowrap">{formatTimeToNow(new Date(post.createdAt))}</span>
        </div>
      </div>
  
      {/* Post title - original size for md+ */}
      <Link
        href={`/r/${subredditName}/post/${post.id}`}
        className="block group"
      >
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-blue-600 mb-2 md:mb-3 leading-tight">
          {post.title}
        </h2>
      </Link>
  
      {/* Post content - maintain original for md+ */}
      <div
        className="relative text-xs md:text-sm max-h-36 md:max-h-40 w-full overflow-clip text-gray-800"
        ref={pRef}
      >
        <EditorOutput content={post.content} />
        
        {/* Gradient fade for long content */}
        <div className="absolute bottom-0 left-0 h-20 md:h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
      </div>
    </div>
    
    {/* Post actions - optimize for sm, original for md+ */}
    <div className="bg-gray-50 p-2 border-t border-gray-200 flex flex-wrap md:flex-nowrap items-center justify-between md:justify-start md:gap-4 text-xs md:text-sm text-gray-500">
      <div className="flex items-center rounded-full bg-white border border-gray-200 px-2 py-1">
        <button className="p-1 hover:text-orange-500" aria-label="Upvote">
          <ArrowUp className="h-4 w-4" />
        </button>
        <span className="px-2 font-medium text-gray-700">{votes}</span>
        <button className="p-1 hover:text-blue-500" aria-label="Downvote">
          <ArrowDown className="h-4 w-4" />
        </button>
      </div>
      
      <Link
        href={`/r/${subredditName}/post/${post.id}`}
        className="flex items-center gap-1 hover:text-gray-900"
      >
        <MessageSquare className="h-4 w-4" />
        <span>{commentCount}</span>
        <span className="hidden sm:inline"> Comments</span>
      </Link>
      
      <button className="flex items-center gap-1 hover:text-yellow-500" aria-label="Save post">
        <Bookmark className="h-4 w-4" />
        <span className="hidden sm:inline">Save</span>
      </button>
      
      <button className="flex items-center gap-1 hover:text-green-500" aria-label="Share post">
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Share</span>
      </button>
    </div>
  </div>
  );
};

export default Post;
