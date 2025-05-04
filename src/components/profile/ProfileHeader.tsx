'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Camera, Edit, Pencil, X, MapPin, Link as LinkIcon, Calendar } from 'lucide-react'
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
  fullName?: string
  location?: string
  website?: string
  joinDate?: string
}

const ProfileHeader = ({ 
  username, 
  profilePicture, 
  isOwnProfile = false,
  userId,
  fullName = "",
  location = "",
  website = "",
  joinDate = "January 2023"
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
    <div className="flex flex-col md:flex-row items-start gap-6 mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="relative group">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Profile picture"
            width={120}
            height={120}
            className="rounded-full object-cover w-28 h-28   "
            style={{ objectFit: 'cover' }}
            priority
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 border-4  flex items-center justify-center">
            <span className="text-3xl font-bold text-blue-500">{username.charAt(0).toUpperCase()}</span>
          </div>
        )}
        
        {isOwnProfile && (
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditingPfp(!isEditingPfp)}
                variant="ghost"
                size="sm"
                className="bg-white text-gray-700 hover:bg-gray-100 rounded-full h-9 w-9 p-0"
              >
                <Camera className="h-5 w-5" />
              </Button>
              
              {imageUrl && (
                <Button
                  onClick={removeProfilePicture}
                  variant="ghost"
                  size="sm"
                  className="bg-white text-red-500 hover:bg-red-50 rounded-full h-9 w-9 p-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{fullName || username}</h1>
            <p className="text-gray-500 text-sm">u/{username}</p>
            
            <div className="mt-3 flex flex-wrap gap-4">
              {location && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{location}</span>
                </div>
              )}
              
              {website && (
                <div className="flex items-center text-sm">
                  <LinkIcon className="h-4 w-4 mr-1 text-gray-400" />
                  <a href={website.startsWith('http') ? website : `https://${website}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-blue-500 hover:text-blue-700 hover:underline"
                  >
                    {website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                <span>Joined {joinDate}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-2">
            {isOwnProfile ? (
              <Link href="/settings">
                <Button variant="outline" size="sm" className="text-sm px-4 border-gray-300">
                  <Edit className="h-4 w-4 mr-1.5" />
                  Edit profile
                </Button>
              </Link>
            ) : (
              <Button variant="primary" size="sm" className="text-sm px-4">
                Follow
              </Button>
            )}
          </div>
        </div>
      </div>

      {isEditingPfp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 ">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Change profile picture</h3>
              <Button
                onClick={() => setIsEditingPfp(false)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setIsEditingPfp(false)}
                variant="ghost"
                className="bg-white text-gray-700 hover:bg-gray-100 rounded-md"
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