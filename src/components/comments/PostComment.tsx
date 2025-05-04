'use client'

import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import { formatTimeToNow } from '@/lib/utils'
import { CommentRequest } from '@/lib/validators/comment'
import { Comment, CommentVote, User } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { MessageSquare, MoreHorizontal, ChevronDown, Flag, Award, Share, ArrowUpFromLine } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useRef, useState } from 'react'
import CommentVotes from '../CommentVotes'
import UserAvatar from '../UserAvatar'
import { Button } from '../ui/Button'
import { Label } from '../ui/Label'
import { Textarea } from '../ui/textarea'
import { toast } from '../../hooks/use-toast'
import { useSession } from 'next-auth/react'

type ExtendedComment = Comment & {
  votes: CommentVote[]
  author: User
}

interface PostCommentProps {
  comment: ExtendedComment
  votesAmt: number
  currentVote: CommentVote | undefined
  postId: string
  children?: React.ReactNode
  depth?: number
}

const PostComment: FC<PostCommentProps> = ({
  comment,
  votesAmt,
  currentVote,
  postId,
  children,
  depth = 0,
}) => {
  const { data: session } = useSession()
  const [isReplying, setIsReplying] = useState<boolean>(false)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const commentRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState<string>(`@${comment.author.username} `)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const router = useRouter()
  
  useOnClickOutside(commentRef, () => {
    setIsReplying(false)
  })

  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      setIsSubmitting(true)
      const payload: CommentRequest = { postId, text, replyToId }

      const { data } = await axios.patch(
        `/api/subreddit/post/comment/`,
        payload
      )
      return data
    },

    onError: () => {
      setIsSubmitting(false)
      return toast({
        title: 'Something went wrong.',
        description: "Comment wasn't created successfully. Please try again.",
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      setIsSubmitting(false)
      router.refresh()
      setIsReplying(false)
      setInput(`@${comment.author.username} `)
    },
  })

  const getThreadColor = () => {
    const colors = [
      'bg-gray-300',
      'bg-blue-200',
      'bg-amber-200',
      'bg-emerald-200',
      'bg-violet-200',
      'bg-rose-200',
      'bg-cyan-200',
    ]
    return colors[depth % colors.length]
  }

  return (
    <div ref={commentRef} className='flex flex-col'>
      <div className={`relative flex ${isCollapsed ? 'mb-2' : ''}`}>
        <div className="relative mr-2">
          {depth > 0 && (
            <div 
              className={`absolute w-[2px] -top-4 h-full ${getThreadColor()} hover:w-[3px] transition-all duration-100 cursor-pointer`}
              onClick={() => setIsCollapsed(!isCollapsed)}
            />
          )}
        </div>
        
        <div className='flex-1'>
          <div className='flex items-start group'>
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className='absolute -left-5 top-1 h-5 w-5 flex items-center justify-center mr-1 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-opacity'
              aria-label={isCollapsed ? 'Expand comment' : 'Collapse comment'}
            >
              <ChevronDown className={`h-3.5 w-3.5 text-gray-500 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
            </button>
            
            <UserAvatar
              user={{
                name: comment.author.name || null,
                image: comment.author.image || null,
              }}
              className='h-6 w-6 mr-2'
            />
            <div className='flex flex-wrap items-center gap-x-2 text-xs'>
              <p className='font-medium text-gray-900 hover:underline'>
                u/{comment.author.username}
              </p>
              <div className='flex items-center'>
                <span className='text-gray-500 mx-1'>•</span>
                <span className='text-gray-500'>
                  {formatTimeToNow(new Date(comment.createdAt))}
                </span>
              </div>
              {isCollapsed && (
                <span className='text-gray-500 ml-1 italic line-clamp-1'>
                  {comment.text.substring(0, 40)}{comment.text.length > 40 ? '...' : ''}
                </span>
              )}
            </div>
          </div>

          {!isCollapsed && (
            <div className='mt-1'>
              <p className='text-sm text-gray-800 whitespace-pre-line'>{comment.text}</p>

              <div className='flex flex-wrap gap-1 items-center mt-2'>
                <CommentVotes
                  commentId={comment.id}
                  votesAmt={votesAmt}
                  currentVote={currentVote}
                />

                <Button
                  onClick={() => {
                    if (!session) return router.push('/sign-in')
                    setIsReplying(true)
                  }}
                  variant='ghost'
                  size='xs'
                  className='text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md'>
                  <MessageSquare className='h-3.5 w-3.5 mr-1.5' />
                  Reply
                </Button>

                <Button
                  variant='ghost'
                  size='xs'
                  className='text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md'>
                  <Award className='h-3.5 w-3.5 mr-1.5' />
                  Award
                </Button>

                <Button
                  variant='ghost'
                  size='xs'
                  className='text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md'>
                  <Share className='h-3.5 w-3.5 mr-1.5' />
                  Share
                </Button>
                
                <Button
                  variant='ghost'
                  size='xs'
                  className='text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md'>
                  <Flag className='h-3.5 w-3.5 mr-1.5' />
                  Report
                </Button>

                <Button
                  variant='ghost'
                  size='xs'
                  className='text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md'>
                  <MoreHorizontal className='h-3.5 w-3.5' />
                </Button>
                
                {depth > 0 && (
                  <Button
                    variant='ghost'
                    size='xs'
                    onClick={() => {
                      const parentElement = commentRef.current?.parentElement?.parentElement;
                      if (parentElement) {
                        parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className='text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md ml-auto'>
                    <ArrowUpFromLine className='h-3.5 w-3.5 mr-1.5' />
                    <span className="sr-only md:not-sr-only">Parent</span>
                  </Button>
                )}
              </div>

              {isReplying && (
                <div className='grid w-full gap-1.5 mt-3'>
                  <div>
                    <Textarea
                      onFocus={(e) =>
                        e.currentTarget.setSelectionRange(
                          e.currentTarget.value.length,
                          e.currentTarget.value.length
                        )
                      }
                      autoFocus
                      id='comment'
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      rows={3}
                      placeholder='What are your thoughts?'
                      className='bg-gray-50 border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-100 focus:ring-opacity-50 rounded-md resize-none py-2 px-3 text-sm'
                    />

                    <div className='mt-2 flex justify-end gap-2'>
                      <Button
                        tabIndex={-1}
                        variant='subtle'
                        onClick={() => setIsReplying(false)}
                        className='bg-gray-100 text-gray-700 hover:bg-gray-200'>
                        Cancel
                      </Button>
                      <Button
                        isLoading={isLoading || isSubmitting}
                        onClick={() => {
                          if (!input) return
                          postComment({
                            postId,
                            text: input,
                            replyToId: comment.replyToId ?? comment.id,
                          })
                        }}
                        variant='primary'
                        size='default'>
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {!isCollapsed && children && (
        <div className='ml-6 mt-2'>
          {children}
        </div>
      )}
    </div>
  )
}

export default PostComment