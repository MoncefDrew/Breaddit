'use client'

import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from "axios"
import { Loader2, MessageSquare } from "lucide-react"
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import { FC, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import UserCommentItem from './UserCommentItem'
import Link from 'next/link'

interface CommentVote {
  type: 'UP' | 'DOWN'
  userId: string
}

interface UserCommentFeedProps {
  username: string
  initialComments: any[]
}

const UserCommentFeed: FC<UserCommentFeedProps> = ({ username, initialComments = [] }) => {
  const lastCommentRef = useRef<HTMLElement>(null)
  const { ref, entry } = useIntersection({
    root: lastCommentRef.current,
    threshold: 1,
  })
  const { data: session } = useSession()

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['infinite-user-comments', username],
    async ({ pageParam = 1 }) => {
      const query = `/api/profile/comments?username=${username}&limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}`
      const { data } = await axios.get(query)
      return data
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1
      },
      initialData: { pages: [initialComments], pageParams: [1] },
    }
  )

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage()
    }
  }, [entry, fetchNextPage])

  const comments = data?.pages.flatMap((page) => page) ?? initialComments

  if (comments.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            u/{username} hasn&apos;t commented yet
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            When this user comments on posts, their comments will appear here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment, index) => {
        const votesAmt = comment.votes.reduce((acc: number, vote: CommentVote) => {
          if (vote.type === 'UP') return acc + 1
          if (vote.type === 'DOWN') return acc - 1
          return acc
        }, 0)

        const currentVote = comment.votes.find(
          (vote: CommentVote) => vote.userId === session?.user.id
        )

        if (index === comments.length - 1) {
          return (
            <div key={comment.id} ref={ref}>
              <UserCommentItem
                comment={comment}
                votesAmt={votesAmt}
                currentVote={currentVote}
              />
            </div>
          )
        } else {
          return (
            <UserCommentItem
              key={comment.id}
              comment={comment}
              votesAmt={votesAmt}
              currentVote={currentVote}
            />
          )
        }
      })}

      {isFetchingNextPage && (
        <div className='flex justify-center p-4'>
          <Loader2 className='w-6 h-6 text-gray-500 animate-spin' />
        </div>
      )}
    </div>
  )
}

export default UserCommentFeed 