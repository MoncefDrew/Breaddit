'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Camera, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { useToast } from '@/hooks/use-toast'

interface CoverImageProps {
  coverImage: string | null
}

const CoverImage = ({ coverImage }: CoverImageProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [imageUrl, setImageUrl] = useState(coverImage || '')
  const { toast } = useToast()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 4 * 1024 * 1024) {
      toast({
        title: 'Image too large',
        description: 'Please select an image smaller than 4MB',
        variant: 'destructive',
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string)
        setIsEditing(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const removeCoverImage = () => {
    setImageUrl('')
    setIsEditing(false)
  }

  return (
    <div className="relative w-full h-48 md:h-64 bg-surface rounded-t-md overflow-hidden">
      {imageUrl ? (
        <Image 
          src={imageUrl} 
          alt="Cover image" 
          fill 
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-[#272729] to-[#1A1A1B]" />
      )}
      
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="ghost"
          size="sm"
          className="bg-surface-dark text-primary hover:bg-surface-dark-hover rounded-full h-9 w-9 p-0"
        >
          <Camera className="h-5 w-5" />
        </Button>
        
        {imageUrl && (
          <Button
            onClick={removeCoverImage}
            variant="ghost"
            size="sm"
            className="bg-surface-dark text-primary hover:bg-surface-dark-hover rounded-full h-9 w-9 p-0"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {isEditing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-surface p-6 rounded-md max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-primary mb-4">Change cover image</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-surface-dark file:text-primary hover:file:bg-surface-dark-hover"
            />
            <div className="flex justify-end mt-4 gap-2">
              <Button
                onClick={() => setIsEditing(false)}
                variant="ghost"
                className="bg-transparent text-primary hover:bg-surface-dark"
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

export default CoverImage 