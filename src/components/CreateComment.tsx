'use client'

import { Button } from '@/components/ui/Button'
import { toast } from '@/hooks/use-toast'
import { CommentRequest } from '@/lib/validators/comment'

import { useCustomToast } from '@/hooks/use-custom-toast'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/textarea'

interface CreateCommentProps {
  postId: string
  replyToId?: string
}

const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId }) => {
  const [input, setInput] = useState<string>('')
  const router = useRouter()
  const { loginToast } = useCustomToast()

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = { postId, text, replyToId }

      const { data } = await axios.patch(
        `/api/subreddit/post/comment/`,
        payload
      )
      return data
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'Something went wrong.',
        description: "Comment wasn't created successfully. Please try again.",
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      router.refresh()
      setInput('')
    },
  })

  return (
    <div className='grid w-full gap-2 bg-white rounded-lg'>
      <Label htmlFor='comment' className='text-gray-700 font-medium text-sm'>Add a comment</Label>
      <div className='mt-1'>
        <Textarea
          id='comment'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder='What are your thoughts?'
          className='w-full bg-gray-50 border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-100 focus:ring-opacity-50 rounded-md resize-none py-2 px-3 transition duration-200'
        />

        <div className='mt-3 flex justify-end'>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => comment({ postId, text: input, replyToId })}
            variant="primary"
            size="default"
            className='text-white'>
            {replyToId ? 'Reply' : 'Comment'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateComment