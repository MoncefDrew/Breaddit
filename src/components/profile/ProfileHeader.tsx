'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Camera, Edit, Pencil, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { useToast } from '@/hooks/use-toast'
import { useUploadThing } from '@/lib/uploadthing'
import axios from 'axios'
import Link from 'next/link'

interface ProfileHeaderProps {
  username: string
  profilePicture?: string | null
  isOwnProfile?: boolean
  userId: string
}

const ProfileHeader = ({ 
  username, 
  profilePicture, 
  isOwnProfile = false,
  userId
}: ProfileHeaderProps) => {
  const [isEditingPfp, setIsEditingPfp] = useState(false);
  const [imageUrl, setImageUrl] = useState(profilePicture || '');
  const { toast } = useToast();
  const { startUpload } = useUploadThing("profileImage");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      toast({
        title: 'Image too large',
        description: 'Please select an image smaller than 4MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      const uploadResult = await startUpload([file]);
      if (!uploadResult) {
        toast({
          title: 'Upload failed',
          description: 'Failed to upload profile picture. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      const [res] = uploadResult;
      if (res) {
        // Update the database
        const response = await axios.put('/api/profile/update/image', {
          userId,
          image: res.url
        });

        if (response.status === 200) {
          setImageUrl(res.url);
          setIsEditingPfp(false);
          
          if (isOwnProfile) {
            toast({
              title: 'Profile picture updated',
              description: 'Your profile picture has been updated successfully.',
            })
          }
        } else {
          throw new Error('Failed to update profile picture in database');
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile picture. Please try again.',
        variant: 'destructive',
      })
    }
  };

  const removeProfilePicture = async () => {
    try {
      const response = await axios.put('/api/profile/update/image', {
        userId,
        image: null
      });

      if (response.status === 200) {
        setImageUrl('');
        setIsEditingPfp(false);
        
        if (isOwnProfile) {
          toast({
            title: 'Profile picture removed',
            description: 'Your profile picture has been removed successfully.',
          })
        }
      } else {
        throw new Error('Failed to remove profile picture from database');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove profile picture. Please try again.',
        variant: 'destructive',
      })
    }
  };

  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="relative group">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Profile picture"
            width={80}
            height={80}
            className="rounded-full object-cover w-20 h-20"
            style={{ objectFit: 'cover' }}
            priority
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-[#272729]" />
        )}
        
        {isOwnProfile && (
          <div className="absolute top-0 left-0 w-full h-full rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditingPfp(!isEditingPfp)}
                variant="ghost"
                size="sm"
                className="bg-[#272729] text-[#D7DADC] hover:bg-[#343536] rounded-full h-8 w-8 p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
              
              {imageUrl && (
                <Button
                  onClick={removeProfilePicture}
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

      <div>
        <h1 className="text-2xl font-bold">{username}</h1>
        <div className='flex gap-2 flex-row items-center'>
          <p className="text-[#818384]">u/{username}</p>
          {isOwnProfile && (
            <Link href="/settings" >
                <Pencil className="h-4 w-4 " />
            </Link>
          )}
            
        </div>
        
      </div>

      {isEditingPfp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1A1A1B] p-6 rounded-md max-w-md w-full mx-4 border border-[#343536] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-[#D7DADC]">Change profile picture</h3>
              <Button
                onClick={() => setIsEditingPfp(false)}
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
              onChange={handleImageChange}
              className="w-full text-sm text-[#D7DADC] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#272729] file:text-[#D7DADC] hover:file:bg-[#343536]"
            />
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setIsEditingPfp(false)}
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

export default ProfileHeader 