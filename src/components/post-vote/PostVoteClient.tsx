'use client'

import { PostVoteRequest } from '@/lib/validators/vote'
import { usePrevious } from '@mantine/hooks'
import { VoteType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'

interface PostVoteClientProps {
  postId: string
  initialVotesAmt: number
  initialVote?: VoteType | null
  vertical?: boolean
  compact?: boolean
}

const PostVoteClient = ({
  postId,
  initialVotesAmt,
  initialVote,
  vertical = false,
  compact = false,
}: PostVoteClientProps) => {
  const { loginToast } = useCustomToast()
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const prevVote = usePrevious(currentVote)
  const [isVoting, setIsVoting] = useState(false)

  // ensure sync with server
  useEffect(() => {
    setCurrentVote(initialVote)
  }, [initialVote])

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      setIsVoting(true)
      const payload: PostVoteRequest = {
        voteType: type,
        postId: postId,
      }

      await axios.patch('/api/subreddit/post/vote', payload)
    },
    onError: (err, voteType) => {
      if (voteType === 'UP') setVotesAmt((prev) => prev - 1)
      else setVotesAmt((prev) => prev + 1)

      // reset current vote
      setCurrentVote(prevVote)
      setIsVoting(false)

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'Something went wrong.',
        description: 'Your vote was not registered. Please try again.',
        variant: 'destructive',
      })
    },
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        // User is voting the same way again, so remove their vote
        setCurrentVote(undefined)
        if (type === 'UP') setVotesAmt((prev) => prev - 1)
        else if (type === 'DOWN') setVotesAmt((prev) => prev + 1)
      } else {
        // User is voting in the opposite direction, so subtract 2
        setCurrentVote(type)
        if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
        else if (type === 'DOWN')
          setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
      }
    },
    onSuccess: () => {
      setIsVoting(false)
    },
  })

  // Different styles and layouts based on orientation and size
  const getButtonSize = () => compact ? 'xs' : 'sm'
  const getIconSize = () => compact ? 'h-4 w-4' : 'h-5 w-5'
  const getContainerClass = () => {
    if (vertical) {
      return 'flex flex-col items-center gap-1'
    }
    return 'flex items-center gap-2 px-1'
  }

  return (
    <div className={getContainerClass()}>
      {/* upvote */}
      <Button
        onClick={() => !isVoting && vote('UP')}
        size={getButtonSize()}
        variant='ghost'
        aria-label='upvote'
        disabled={isVoting}
        className={cn(
          'p-0 h-auto flex items-center justify-center rounded-full hover:bg-gray-100',
          vertical ? 'h-8 w-8' : 'h-8 w-8',
          compact ? 'h-6 w-6' : '',
          {
            'bg-orange-50': currentVote === 'UP',
          }
        )}>
        <ArrowBigUp
          className={cn(getIconSize(), 'text-gray-400 hover:text-gray-600', {
            'text-orange-500 fill-orange-500': currentVote === 'UP',
          })}
        />
      </Button>

      {/* score */}
      <p 
        className={cn(
          'font-medium text-xs flex items-center justify-center', 
          vertical ? 'text-center py-0.5' : '',
          compact ? 'text-xs' : 'text-xs',
          {
            'text-orange-500 font-normal': currentVote === 'UP',
            'text-indigo-500 font-normal': currentVote === 'DOWN',
            'text-gray-700': !currentVote,
          }
        )}>
        {votesAmt === 0 ? 'Vote' : Math.abs(votesAmt) > 999 
          ? `${(Math.abs(votesAmt) / 1000).toFixed(1)}k` 
          : votesAmt}
      </p>

      {/* downvote */}
      <Button
        onClick={() => !isVoting && vote('DOWN')}
        size={getButtonSize()}
        variant='ghost'
        aria-label='downvote'
        disabled={isVoting}
        className={cn(
          'p-0 h-auto flex items-center justify-center rounded-full hover:bg-gray-100',
          vertical ? 'h-8 w-8' : 'h-8 w-8',
          compact ? 'h-6 w-6' : '',
          {
            'bg-indigo-50': currentVote === 'DOWN',
          }
        )}>
        <ArrowBigDown
          className={cn(getIconSize(), 'text-gray-400 hover:text-gray-600', {
            'text-indigo-500 fill-indigo-500': currentVote === 'DOWN',
          })}
        />
      </Button>
    </div>
  )
}

export default PostVoteClient