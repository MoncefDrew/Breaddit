'use client'

import { useState } from 'react'
import CoverImage from './CoverImage'
import ProfilePicture from './ProfilePicture'
import BioSection from './BioSection'
import { Button } from '../ui/Button'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'

interface ProfilePageProps {
  user: {
    id: string
    username: string
    profilePicture?: string | null
    coverImage?: string | null
    bio?: string | null
  }
}

const ProfilePage = ({ user }: ProfilePageProps) => {
  const [profileData, setProfileData] = useState({
    profilePicture: user.profilePicture || null,
    coverImage: user.coverImage || null,
    bio: user.bio || null,
  })
  

 

  return (
    <div className="bg-[#030303] text-[#D7DADC]">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1A1A1B] rounded-md shadow-md overflow-hidden">
          {/* Cover Image */}
          <CoverImage 
            coverImage={profileData.coverImage} 
          />
          
          {/* Profile Info Section */}
          <div className="pt-14 px-6 pb-6">
            {/* Profile Picture */}
            <ProfilePicture 
              imageUrl={profileData.profilePicture} 
              username={user.username}
            />
            
            <div className="flex flex-col ml-36">
              <h1 className="text-2xl font-bold text-[#D7DADC]">
                {user.username}
              </h1>
              <p className="text-sm text-[#818384]">u/{user.username}</p>
            </div>
            
            {/* Bio Section */}
            <BioSection 
              bio={profileData.bio} 
            />
            
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage 