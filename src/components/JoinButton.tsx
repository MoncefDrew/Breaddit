'use client'

import { Button } from '@/components/ui/Button'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Loader2, Bell, Check, LogOut } from 'lucide-react'

interface JoinButtonProps {
  subredditId: string
  size?: 'default' | 'sm'
}

const JoinButton = ({ subredditId, size = 'sm' }: JoinButtonProps) => {
  const { loginToast } = useCustomToast()
  const queryClient = useQueryClient()

  const { data, isLoading: isCheckingStatus } = useQuery({
    queryKey: ['subreddit-joined', subredditId],
    queryFn: async () => {
      const res = await axios.post('/api/subreddit/status', { subredditId })
      return res.data
    },
    enabled: !!subredditId,
    retry: false,
  })
  
  const isJoined = data?.isJoined
  const isCreator = data?.isCreator
  
  const { mutate: handleJoin, isLoading: isUpdating } = useMutation({
    mutationFn: async () => {
      if (isJoined) {
        if (isCreator) return // Do nothing if creator tries to unsubscribe
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

  const getButtonText = () => {
    if (isJoined) return 'Joined'
    return 'Join'
  }

  const getButtonIcon = () => {
    if (isJoined) return <Check className="h-3.5 w-3.5 mr-1" />
    return <Bell className="h-3.5 w-3.5 mr-1" />
  }

  if (isCheckingStatus) {
    return (
      <Button
        className="text-xs font-medium px-3 py-1 h-7 rounded-full bg-gray-100 text-gray-500"
        variant="ghost"
        size="sm"
        disabled
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      </Button>
    )
  }

  return (
    <div className="relative group">
      <Button
        onClick={() => handleJoin()}
        className={`text-xs font-medium px-3 py-1 h-7 rounded-full ${
          isJoined
            ? 'bg-gray-100 text-gray-800 border border-gray-300 group-hover:hidden'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
        variant={isJoined ? "outline" : "default"}
        size="sm"
        disabled={isUpdating || isCreator}
      >
        {isUpdating ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <>
            {getButtonIcon()}
            {getButtonText()}
          </>
        )}
      </Button>
      
      {isJoined && !isCreator && (
        <Button
          onClick={() => handleJoin()}
          className="hidden group-hover:flex text-xs font-medium px-3 py-1 h-7 rounded-full bg-gray-100 text-red-600 border border-gray-300"
          variant="outline"
          size="sm"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <>
              <LogOut className="h-3.5 w-3.5 mr-1" />
              Leave
            </>
          )}
        </Button>
      )}
    </div>
  )
}

export default JoinButton 