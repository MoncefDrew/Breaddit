'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import { Button } from '../ui/Button'
import { useToast } from '@/hooks/use-toast'

interface ProfilePictureProps {
  imageUrl: string | null
  username: string
}

const ProfilePicture = ({ imageUrl, username }: ProfilePictureProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Image too large',
        description: 'Please select an image smaller than 2MB',
        variant: 'destructive',
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setIsEditing(false)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="relative">
      <div className="absolute -top-14 left-6 h-24 w-24 rounded-full border-4 border-[#1A1A1B] overflow-hidden bg-[#272729] shadow-md">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={`${username}'s profile picture`} 
            fill 
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#272729] text-[#D7DADC] text-3xl font-bold">
            {username.charAt(0).toUpperCase()}
          </div>
        )}
        
        <Button
          onClick={() => setIsEditing(true)}
          variant="ghost"
          className="absolute inset-0 bg-black/0 hover:bg-black/40 text-transparent hover:text-white flex items-center justify-center transition-all duration-200"
        >
          <Camera className="h-5 w-5" />
        </Button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1A1A1B] p-6 rounded-md max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-[#D7DADC] mb-4">Change profile picture</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-[#D7DADC] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#272729] file:text-[#D7DADC] hover:file:bg-[#343536]"
            />
            <div className="flex justify-end mt-4 gap-2">
              <Button
                onClick={() => setIsEditing(false)}
                variant="ghost"
                className="bg-transparent text-[#D7DADC] hover:bg-[#272729]"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePicture 