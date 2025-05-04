"use client";

import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from "axios";
import { Loader2, FilePlus } from "lucide-react";
import { Button } from "../ui/Button";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config';
import { FC, useEffect, useRef } from 'react';
import Post from "./Post";
import Link from "next/link";

interface UserPostFeedProps {
  username: string;
  initialPosts: any[];
}

const UserPostFeed: FC<UserPostFeedProps> = ({ username, initialPosts }) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['infinite-user-posts', username],
    async ({ pageParam = 1 }) => {
      const query = `/api/profile/posts?username=${username}&limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}`;
      const { data } = await axios.get(query);
      return data;
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-12 px-4">
        <FilePlus className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          u/{username} hasn&apos;t posted yet
        </h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-4 text-center">
          When this user creates posts, they will appear here.
        </p>
        <Link href="/submit">
          <Button variant="primary" size="sm">
            Create Post
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {posts.map((post, index) => {
          if (index === posts.length - 1) {
            return (
              <div key={post.id} ref={ref} className="w-full">
                <Post
                  post={post}
                  subredditName={post.subreddit.name}
                />
              </div>
            );
          } else {
            return (
              <div key={post.id} className="w-full">
                <Post
                  post={post}
                  subredditName={post.subreddit.name}
                />
              </div>
            );
          }
        })}
      </div>

      {isFetchingNextPage && (
        <div className="flex justify-center p-4 w-full">
          <Loader2 className="h-6 w-6 text-gray-500 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default UserPostFeed;