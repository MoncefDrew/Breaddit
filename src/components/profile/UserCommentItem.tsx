'use client'

import { formatTimeToNow } from '@/lib/utils'
import { Comment, CommentVote, User } from '@prisma/client'
import { MessageSquare, ArrowUp, ArrowDown, Reply, Award, Flag, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'
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
    <div className='bg-white shadow-sm border border-gray-200 p-4 rounded-lg mb-3 hover:border-gray-300 transition-colors'>
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
          className='font-medium text-blue-600 text-xs hover:text-blue-800 hover:underline'
        >
          r/{comment.post.subreddit.name}
        </Link>
        <span className='text-xs text-gray-400'>•</span>
        <span className='text-xs text-gray-500'>
          {formatTimeToNow(new Date(comment.createdAt))}
        </span>
      </div>

      <div className='mb-3'>
        <Link 
          href={`/r/${comment.post.subreddit.name}/post/${comment.postId}`}
          className='text-sm font-medium text-gray-900 hover:text-blue-600'
        >
          On: {comment.post.title}
        </Link>
      </div>

      <p className='text-sm text-gray-700 mb-3 whitespace-pre-line'>{comment.text}</p>

      <div className='flex gap-4 items-center'>
        <div className="flex items-center rounded-full bg-gray-50 border border-gray-200 px-2 py-1">
          <button className={`p-1 ${currentVote?.type === 'UP' ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`}>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <span className={`px-2 text-xs font-medium ${
            currentVote?.type === 'UP' 
              ? 'text-orange-500' 
              : currentVote?.type === 'DOWN'
                ? 'text-blue-500'
                : 'text-gray-700'
          }`}>
            {votesAmt}
          </span>
          <button className={`p-1 ${currentVote?.type === 'DOWN' ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}>
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>

        <Link
          href={`/r/${comment.post.subreddit.name}/post/${comment.postId}?highlight=${comment.id}`}
          className='flex items-center gap-1 text-gray-500 hover:text-gray-900 text-xs'
        >
          <Reply className='h-3.5 w-3.5' />
          <span>Reply</span>
        </Link>
        
        <button className='flex items-center gap-1 text-gray-500 hover:text-yellow-500 text-xs'>
          <Award className='h-3.5 w-3.5' />
          <span>Award</span>
        </button>
        
        <button className='flex items-center gap-1 text-gray-500 hover:text-red-500 text-xs'>
          <Flag className='h-3.5 w-3.5' />
          <span>Report</span>
        </button>
        
        <button className='flex items-center gap-1 text-gray-500 hover:text-gray-900 text-xs'>
          <MoreHorizontal className='h-3.5 w-3.5' />
        </button>
        
        <Link
          href={`/r/${comment.post.subreddit.name}/post/${comment.postId}`}
          className='flex items-center gap-1 text-gray-500 hover:text-gray-900 text-xs ml-auto'
        >
          <MessageSquare className='h-3.5 w-3.5' />
          <span>View Thread</span>
        </Link>
      </div>
    </div>
  )
}

export default UserCommentItem 