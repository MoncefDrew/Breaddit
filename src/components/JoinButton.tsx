'use client'

import { Button } from '@/components/ui/Button'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

interface JoinButtonProps {
  subredditName: string
}

const JoinButton = ({ subredditName }: JoinButtonProps) => {
  const { loginToast } = useCustomToast()
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const { data: isJoined, isLoading: isCheckingStatus } = useQuery({
    queryKey: ['subreddit-joined', subredditName],
    queryFn: async () => {
      if (!session?.user) return false
      const { data } = await axios.get(`/api/subreddit/${subredditName}/check-sub`)
      return data.isSubscribed
    },
    enabled: !!session?.user,
  })

  const { mutate: handleJoin, isLoading: isUpdating } = useMutation({
    mutationFn: async () => {
      if (!session?.user) {
        return loginToast()
      }

      if (isJoined) {
        await axios.post(`/api/subreddit/unsubscribe`, { subredditName })
      } else {
        await axios.post(`/api/subreddit/subscribe`, { subredditName })
      }
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['subreddit-joined', subredditName])
    },
  })

  if (!session?.user) {
    return null
  }

  
  if (isCheckingStatus) {
    return (
      <Button
        className="text-xs font-medium px-4 py-0.5 h-6 rounded-full bg-transparent"
        variant="ghost"
        disabled
      >
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

 

  return (
    <Button
      onClick={() => handleJoin()}
      className={`text-xs font-medium px-4 py-0.5 h-6 rounded-full ${
        isJoined
          ? 'text-muted hover:bg-zinc-800 border border-zinc-700'
          : 'bg-[#D7DADC] hover:bg-[#C8CBCD] text-[#1A1A1B]'
      }`}
      variant="ghost"
      disabled={isUpdating}
    >
      {isUpdating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        isJoined ? 'Joined' : 'Join'
      )}
    </Button>
  )

 

}

export default JoinButton 