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
}

const PostVoteClient = ({
  postId,
  initialVotesAmt,
  initialVote,
}: PostVoteClientProps) => {
  const { loginToast } = useCustomToast()
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const prevVote = usePrevious(currentVote)

  // ensure sync with server
  useEffect(() => {
    setCurrentVote(initialVote)
  }, [initialVote])

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
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
  })

  return (
    <div className='flex items-center h-7 gap-2 px-1'>
      {/* upvote */}
      <Button
        onClick={() => vote('UP')}
        size='sm'
        variant='ghost'
        aria-label='upvote'
        className='focus:outline-none active:outline-none rounded-full hover:bg-slate-400 h-7'>
        <ArrowBigUp
          className={cn('h-6 w-6 font- text-[#b7c5da] hover:text-[#556883]', {
            'text-upvote fill-upvote': currentVote === 'UP',
          })}
          style={{ color: currentVote === 'UP' ? '#FF4500' : 'zinc-100' }}
        />
      </Button>

      {/* score */}
      <p className='text-center font-medium text-xs text-primary h-7 flex items-center'>
        {votesAmt}
      </p>

      {/* downvote */}
      <Button
        onClick={() => vote('DOWN')}
        size='sm'
        variant='ghost'
        aria-label='downvote'
        className='focus:outline-none active:outline-none rounded-full hover:bg-slate-400 h-7'>
        <ArrowBigDown
          className={cn('h-6 w-6 text-[#b7c5da] hover:text-[#556883]', {
            'text-downvote fill-downvote': currentVote === 'DOWN',
          })}
          style={{ color: currentVote === 'DOWN' ? '#997ce5' : 'zinc-100' }}
        />
      </Button>
    </div>
  )
}

export default PostVoteClient