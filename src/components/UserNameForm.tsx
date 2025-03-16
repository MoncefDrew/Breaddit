'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { UsernameValidator } from '@/lib/validators/username'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, 'id' | 'username'>
}

type FormData = z.infer<typeof UsernameValidator>

export function UserNameForm({ user, className, ...props }: UserNameFormProps) {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user?.username || '',
    },
  })

  const { mutate: updateUsername, isLoading } = useMutation({
    mutationFn: async ({ name }: FormData) => {
      const payload: FormData = { name }

      const { data } = await axios.patch(`/api/username/`, payload)
      return data
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: 'Username already taken.',
            description: 'Please choose another username.',
            variant: 'destructive',
          })
        }
      }

      return toast({
        title: 'Something went wrong.',
        description: 'Your username was not updated. Please try again.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      toast({
        description: 'Your username has been updated.',
      })
      router.refresh()
    },
  })

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit((e) => updateUsername(e))}
      {...props}>
      <Card className="bg-[#1A1A1B] border border-[#343536] shadow-md w-full overflow-hidden">
        <div className="bg-[#272729] p-6 rounded-t-lg">
          <h3 className="font-semibold tracking-tight text-[#D7DADC] text-lg sm:text-xl">Your username</h3>
          <p className="text-[#818384] text-xs sm:text-sm mt-1.5">
            Please enter a display name you are comfortable with.
          </p>
        </div>
        <CardContent className="pt-6">
          <div className='relative grid gap-1'>
            <div className='absolute top-0 left-0 w-8 h-10 grid place-items-center'>
              <span className='text-sm text-[#818384]'>u/</span>
            </div>
            <Label className='sr-only' htmlFor='name'>
              Name
            </Label>
            <Input
              id='name'
              className='w-full sm:w-[400px] pl-6 bg-[#272729] border-[#343536] text-[#D7DADC] focus:ring-[#FF4500] focus:border-[#FF4500]'
              size={32}
              {...register('name')}
            />
            {errors?.name && (
              <p className='px-1 text-xs text-red-500'>{errors.name.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className=" flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button 
            isLoading={isLoading}
            className="bg-[#FF4500] hover:bg-[#FF5414] text-white w-full sm:w-auto"
          >
            Change name
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}