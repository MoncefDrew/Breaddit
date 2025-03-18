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
    <div className='md:flex-col flex-row flex md:gap-0 gap-4 pr-2 md:w-20 pb-4 md:pb-0 items-center'>
      {/* upvote */}
      <Button
        onClick={() => vote('UP')}
        size='sm'
        variant='ghost'
        aria-label='upvote'
        className='hover:bg-surface-dark-hover'>
        <ArrowBigUp
          className={cn('h-5 w-5 text-muted', {
            'text-upvote fill-upvote': currentVote === 'UP',
          })}
        />
      </Button>

      {/* score */}
      <p className='text-center px-2 md:px-0 md:py-2 font-medium text-sm text-primary'>
        {votesAmt}
      </p>

      {/* downvote */}
      <Button
        onClick={() => vote('DOWN')}
        size='sm'
        variant='ghost'
        aria-label='downvote'
        className='hover:bg-surface-dark-hover'>
        <ArrowBigDown
          className={cn('h-5 w-5 text-muted', {
            'text-downvote fill-downvote': currentVote === 'DOWN',
          })}
        />
      </Button>
    </div>
  )
}

export default PostVoteClient