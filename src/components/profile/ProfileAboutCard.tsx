'use client'

import { Button } from '../ui/Button'
import { Link as LinkIcon, Share, Camera, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useUploadThing } from '@/lib/uploadthing'
import axios from 'axios'
import Image from 'next/image'
import ProfileBio from './ProfileBio'

interface ProfileAboutCardProps {
  username: string
  karma?: number
  cakeDay?: string
  coverImage?: string | null
  bio?: string | null
  onFollow?: () => void
  isOwnProfile?: boolean
  userId: string
  onBioUpdate?: (newBio: string) => void
}

const ProfileAboutCard = ({ 
  username, 
  karma = 1, 
  cakeDay = 'August 25, 2023',
  coverImage,
  bio = '',
  onFollow,
  isOwnProfile = false,
  userId,
  onBioUpdate
}: ProfileAboutCardProps) => {
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [imageUrl, setImageUrl] = useState(coverImage || '');
  
  // Log the cover image URL for debugging
  console.log('Cover image URL:', coverImage);
  console.log('Current image URL state:', imageUrl);
  
  const { toast } = useToast();
  const { startUpload } = useUploadThing("coverImage");

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 16 * 1024 * 1024) {
      toast({
        title: 'Image too large',
        description: 'Please select an image smaller than 16MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      const uploadResult = await startUpload([file]);
      if (!uploadResult) {
        toast({
          title: 'Upload failed',
          description: 'Failed to upload cover image. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      const [res] = uploadResult;
      if (res) {
        // Update the database
        const response = await axios.put('/api/profile/update/cover', {
          userId,
          cover: res.url
        });

        if (response.status === 200) {
          setImageUrl(res.url);
        setIsEditingCover(false);
          
          if (isOwnProfile) {
            toast({
              title: 'Cover image updated',
              description: 'Your cover image has been updated successfully.',
            })
          }
        } else {
          throw new Error('Failed to update cover image in database');
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update cover image. Please try again.',
        variant: 'destructive',
      })
    }
  };

  const removeCoverImage = async () => {
    try {
      const response = await axios.put('/api/profile/update/cover', {
        userId,
        cover: null
      });

      if (response.status === 200) {
        setImageUrl('');
        setIsEditingCover(false);
        
        if (isOwnProfile) {
          toast({
            title: 'Cover image removed',
            description: 'Your cover image has been removed successfully.',
          })
        }
      } else {
        throw new Error('Failed to remove cover image from database');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove cover image. Please try again.',
        variant: 'destructive',
      })
    }
  };

  return (
    <div className="bg-[#1A1A1B] rounded-md overflow-hidden border border-[#343536] mb-4">
      {/* Cover image */}
      <div className="relative group h-32">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt="Cover image" 
            width={800}
            height={128}
            className="w-full h-full object-cover"
            style={{ objectFit: 'cover' }}
            priority
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-[#33363b] to-[#24292e]"></div>
        )}
        
        {/* Cover image edit buttons - Only shown if it's the user's own profile */}
        {isOwnProfile && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center">
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={() => setIsEditingCover(true)}
              variant="ghost"
              size="sm"
              className="bg-[#272729] text-[#D7DADC] hover:bg-[#343536] rounded-full h-8 w-8 p-0"
            >
              <Camera className="h-4 w-4" />
            </Button>
            
              {imageUrl && (
              <Button
                onClick={removeCoverImage}
                variant="ghost"
                size="sm"
                className="bg-[#272729] text-[#D7DADC] hover:bg-[#343536] rounded-full h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            </div>
          </div>
        )}
      </div>
      
      {/* Header with title */}
      <div className="px-4 py-3 border-b border-[#343536] flex items-center justify-between">
        <h2 className="text-[16px] font-medium text-[#D7DADC]">About u/{username}</h2>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            className="rounded-full h-8 w-8 p-0 bg-[#272729] text-[#D7DADC] hover:bg-[#343536]"
          >
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Bio section - Using the independent ProfileBio component */}
      <ProfileBio 
        bio={bio}
        isOwnProfile={isOwnProfile}
        userId={userId}
        onBioUpdate={onBioUpdate}
      />
      
      {/* Stats */}
      <div className="p-4 border-b border-[#343536]">
        <div className="flex items-center gap-2 py-2">
          <div className="text-[#818384] text-sm">Karma</div>
          <div className="text-[#D7DADC] text-sm font-medium ml-auto">{karma}</div>
        </div>
        <div className="flex items-center gap-2 py-2">
          <div className="text-[#818384] text-sm">Cake day</div>
          <div className="text-[#D7DADC] text-sm font-medium ml-auto">{cakeDay}</div>
        </div>
      </div>
      
      {/* Social Links */}
      <div className="p-4">
        <Button 
          variant="ghost" 
          className="w-full h-8 bg-[#272729] hover:bg-[#343536] text-[#D7DADC] text-sm rounded-full flex items-center justify-center gap-2"
        >
          <LinkIcon className="h-4 w-4" />
          Add social link
        </Button>
      </div>

      {/* Cover Image Upload Modal */}
      {isEditingCover && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1A1A1B] p-6 rounded-md max-w-md w-full mx-4 border border-[#343536] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-[#D7DADC]">Change cover image</h3>
              <Button
                onClick={() => setIsEditingCover(false)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-[#272729]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="w-full text-sm text-[#D7DADC] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#272729] file:text-[#D7DADC] hover:file:bg-[#343536]"
            />
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setIsEditingCover(false)}
                variant="ghost"
                className="bg-[#272729] text-[#D7DADC] hover:bg-[#343536] rounded-md"
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

export default ProfileAboutCard 