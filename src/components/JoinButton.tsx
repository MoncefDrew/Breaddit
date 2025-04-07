'use client'

import { Button } from '@/components/ui/Button'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'

interface JoinButtonProps {
  subredditId: string
  size?: 'default' | 'sm'
}

const JoinButton = ({ subredditId, size = 'sm' }: JoinButtonProps) => {
  const { loginToast } = useCustomToast()
  const queryClient = useQueryClient()

  const { data: isJoined, isLoading: isCheckingStatus } = useQuery({
    queryKey: ['subreddit-joined', subredditId],
    queryFn: async () => {
      try {
        // Try to subscribe - if it fails with 400, we're already subscribed
        await axios.post('/api/subreddit/subscribe', { subredditId })
        return false
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 400) {
            // If we get a 400, it means we're already subscribed
            return true
          }
          if (error.response?.status === 401) {
            return false
          }
        }
        throw error
      }
    },
    enabled: !!subredditId,
    retry: false, // Don't retry on failure since we're using errors for flow control
  })

  const { mutate: handleJoin, isLoading: isUpdating } = useMutation({
    mutationFn: async () => {
      if (isJoined) {
        await axios.post(`/api/subreddit/unsubscribe`, { subredditId })
      } else {
        await axios.post(`/api/subreddit/subscribe`, { subredditId })
      }
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['subreddit-joined', subredditId])
    },
  })

  const buttonClasses = size === 'default' 
    ? 'px-4  text-sm font-medium rounded-full'
    : 'text-xs font-medium px-4 py-0.5 h-6 rounded-full'

  if (isCheckingStatus) {
    return (
      <Button
        className={`${buttonClasses} bg-transparent`}
        variant="ghost"
        disabled
      >
        <Loader2 className={`${size === 'default' ? 'h-5 w-5' : 'h-4 w-4'} animate-spin`} />
      </Button>
    )
  }

  return (
    <Button
      onClick={() => handleJoin()}
      className={`${buttonClasses} ${
        isJoined
          ? 'text-muted hover:bg-zinc-800 border border-zinc-700'
          : 'bg-[#0969DA] hover:bg-[#1f6feb] text-white'
      }`}
      variant="ghost"
      disabled={isUpdating}
    >
      {isUpdating ? (
        <Loader2 className={`${size === 'default' ? 'h-5 w-5' : 'h-4 w-4'} animate-spin`} />
      ) : (
        isJoined ? 'Joined' : 'Join'
      )}
    </Button>
  )
}

export default JoinButton 