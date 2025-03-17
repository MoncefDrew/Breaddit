"use client";

import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/Button";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import { FC, useEffect, useRef } from 'react'
import Post from "./Post";

interface UserPostFeedProps {
  username: string;
  initialPosts: any[];
}

const UserPostFeed: FC<UserPostFeedProps> = ({ username, initialPosts }) => {
  const lastPostRef = useRef<HTMLElement>(null)
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  })

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['infinite-user-posts', username],
    async ({ pageParam = 1 }) => {
      const query = `/api/profile/posts?username=${username}&limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}`
      const { data } = await axios.get(query)
      return data
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  )

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage()
    }
  }, [entry, fetchNextPage])

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-medium text-[#D7DADC] mb-2">
            u/{username} hasn&apos;t posted yet
          </h3>
          <Button variant="reddit" className="mt-2">
            Create Post
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 ">
      {posts.map((post, index) => {
        if (index === posts.length - 1) {
          return (
            <div key={post.id} ref={ref}>
              <Post
                post={post}
                subredditName={post.subreddit.name}
              />
            </div>
          )
        } else {
          return (
            <Post
              key={post.id}
              post={post}
              subredditName={post.subreddit.name}
            />
          )
        }
      })}

      {isFetchingNextPage && (
        <div className='flex justify-center'>
          <Loader2 className='w-6 h-6 text-zinc-500 animate-spin' />
        </div>
      )}
    </div>
  );
};

export default UserPostFeed;
