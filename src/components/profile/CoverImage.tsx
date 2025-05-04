'use client'

import { FC, useState } from 'react'
import { Camera, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Button } from '../ui/Button'
import { useToast } from '@/hooks/use-toast'

interface CoverImageProps {
  coverImage: string | null
  onImageChange: (newImage: string | null) => void
  isOwnProfile: boolean
  userId: string
}

const CoverImage: FC<CoverImageProps> = ({ 
  coverImage, 
  onImageChange, 
  isOwnProfile,
  userId
}) => {
  const router = useRouter()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  
  const defaultCoverImage = '/images/default-cover.jpg'
  const displayImage = coverImage || defaultCoverImage
  
  const uploadCoverImage = async (file: File) => {
    setIsUploading(true)
    
    try {
      // Convert file to base64 string
      const reader = new FileReader()
      
      reader.onloadend = async () => {
        const base64String = reader.result as string
        
        // Send to the existing API endpoint with the correct format
        await axios.put('/api/profile/update/cover', {
          userId,
          cover: base64String
        })
        
        // Update local state
        onImageChange(base64String)
        
        // Show success message
        toast({
          title: 'Cover image updated',
          description: 'Your profile cover has been updated successfully.',
          variant: 'default',
        })
        
        // Refresh server components to ensure persistence
        router.refresh()
      }
      
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading cover image:', error)
      
      toast({
        title: 'Upload failed',
        description: 'Something went wrong when updating your cover image.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }
  
  const removeCoverImage = async () => {
    setIsRemoving(true)
    
    try {
      // Call API to set cover image to null
      await axios.put('/api/profile/update/cover', {
        userId,
        cover: null
      })
      
      // Update local state
      onImageChange(null)
      
      // Show success message
      toast({
        title: 'Cover image removed',
        description: 'Your profile cover has been removed.',
        variant: 'default',
      })
      
      // Refresh server components to ensure persistence
      router.refresh()
    } catch (error) {
      console.error('Error removing cover image:', error)
      
      toast({
        title: 'Removal failed',
        description: 'Something went wrong when removing your cover image.',
        variant: 'destructive',
      })
    } finally {
      setIsRemoving(false)
    }
  }
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Cover image must be less than 5MB.',
          variant: 'destructive',
        })
        return
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file.',
          variant: 'destructive',
        })
        return
      }
      
      uploadCoverImage(file)
    }
  }
  
  return (
    <div className="relative w-full h-40 md:h-56 lg:h-72 overflow-hidden bg-gray-200">
      {/* Cover Image */}
      <div className="w-full h-full">
        <img 
          src={displayImage} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Edit Controls - Only show if it's the user's own profile */}
      {isOwnProfile && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <label 
            htmlFor="cover-upload" 
            className="bg-white hover:bg-gray-100 rounded-full p-2 cursor-pointer shadow-md transition-colors border border-gray-200 text-gray-700"
          >
            <Camera className="h-5 w-5" />
            <input 
              id="cover-upload" 
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
          
          {coverImage && (
            <Button
              onClick={removeCoverImage}
              variant="destructive"
              size="default"
              className="rounded-full p-2"
              disabled={isRemoving}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      )}
      
      {/* Loading indicator */}
      {isUploading && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-white font-medium">Uploading...</div>
        </div>
      )}
      
      {isRemoving && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-white font-medium">Removing...</div>
        </div>
      )}
    </div>
  )
}

export default CoverImage