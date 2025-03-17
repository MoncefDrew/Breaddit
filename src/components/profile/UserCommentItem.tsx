'use client'

import { formatTimeToNow } from '@/lib/utils'
import { Comment, CommentVote, User } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'
import CommentVotes from '../CommentVotes'
import UserAvatar from '../UserAvatar'

type ExtendedComment = Comment & {
  votes: CommentVote[]
  author: User
  post: {
    id: string
    title: string
    subreddit: {
      name: string
    }
  }
}

interface UserCommentItemProps {
  comment: ExtendedComment
  votesAmt: number
  currentVote: CommentVote | undefined
}

const UserCommentItem: FC<UserCommentItemProps> = ({
  comment,
  votesAmt,
  currentVote,
}) => {
  return (
    <div className='bg-[#1A1A1B] shadow-sm border border-[#343536] p-4 rounded-md'>
      <div className='flex items-center gap-2 mb-2'>
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className='h-5 w-5'
        />
        <Link 
          href={`/r/${comment.post.subreddit.name}`}
          className='font-medium text-[#24A0ED] text-xs hover:text-[#3AABF0] hover:underline'
        >
          r/{comment.post.subreddit.name}
        </Link>
        <span className='text-xs text-[#818384]'>•</span>
        <span className='text-xs text-[#818384]'>
          {formatTimeToNow(new Date(comment.createdAt))}
        </span>
      </div>

      <div className='mb-2'>
        <Link 
          href={`/r/${comment.post.subreddit.name}/post/${comment.postId}`}
          className='text-sm font-medium text-[#D7DADC] hover:text-[#FF4500]'
        >
          On: {comment.post.title}
        </Link>
      </div>

      <p className='text-sm text-[#D7DADC] mb-3'>{comment.text}</p>

      <div className='flex gap-2 items-center'>
        <CommentVotes
          commentId={comment.id}
          votesAmt={votesAmt}
          currentVote={currentVote}
        />

        <Link
          href={`/r/${comment.post.subreddit.name}/post/${comment.postId}`}
          className='flex items-center gap-1 text-[#818384] hover:text-[#D7DADC]'
        >
          <MessageSquare className='h-4 w-4' />
          <span className='text-xs'>Reply</span>
        </Link>
      </div>
    </div>
  )
}

export default UserCommentItem 