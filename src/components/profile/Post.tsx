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
      <div className="px-5 py-4">
        <div className="flex items-center gap-3 mb-2 text-sm text-gray-500">
          <UserAvatar
            user={{
              name: post?.author.name || null,
              image: post?.author.image || null,
            }}
            className="h-6 w-6 rounded-full"
          />
          
          <Link
            href={`/r/${subredditName}`}
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            r/{subredditName}
          </Link>
          
          <span className="text-gray-400">•</span>
          
          <span>Posted by</span>
          
          <Link
            href={`/u/${post.author.username}`}
            className="hover:underline hover:text-gray-700"
          >
            u/{post.author.username}
          </Link>
          
          <span className="text-gray-400">•</span>
          
          <span>{formatTimeToNow(new Date(post.createdAt))}</span>
        </div>

        <Link
          href={`/r/${subredditName}/post/${post.id}`}
          className="block group"
        >
          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 mb-3 leading-tight">
            {post.title}
          </h2>
        </Link>

        <div
          className="relative text-sm max-h-40 w-full overflow-clip text-gray-800"
          ref={pRef}
        >
          <EditorOutput content={post.content} />
          
          {/* Gradient fade for long content */}
          <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
        </div>
      </div>
      
      {/* Post actions */}
      <div className="bg-gray-50 p-2 border-t border-gray-200 flex items-center gap-4 text-gray-500 text-sm">
        <div className="flex items-center rounded-full bg-white border border-gray-200 px-2 py-1">
          <button className="p-1 hover:text-orange-500">
            <ArrowUp className="h-4 w-4" />
          </button>
          <span className="px-2 font-medium text-gray-700">{votes}</span>
          <button className="p-1 hover:text-blue-500">
            <ArrowDown className="h-4 w-4" />
          </button>
        </div>
        
        <Link
          href={`/r/${subredditName}/post/${post.id}`}
          className="flex items-center gap-1 hover:text-gray-900"
        >
          <MessageSquare className="h-4 w-4" />
          <span>{commentCount} Comments</span>
        </Link>
        
        <button className="flex items-center gap-1 hover:text-yellow-500">
          <Bookmark className="h-4 w-4" />
          <span>Save</span>
        </button>
        
        <button className="flex items-center gap-1 hover:text-green-500">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default Post;
