'use client'

import { useState } from 'react'
import ProfileHeader from './ProfileHeader'
import ProfileAboutCard from './ProfileAboutCard'
import ModeratorCard from './ModeratorCard'
import ProfileTabs from './ProfileTabs'

interface ProfilePageProps {
  user: {
    id: string
    username: string
    profilePicture?: string | null
    coverImage?: string | null
    bio?: string | null
  }
  isOwnProfile?: boolean
  initialPosts?: any[]
  initialComments?: any[]
}

const ProfilePage = ({ 
  user, 
  isOwnProfile = false, 
  initialPosts = [], 
  initialComments = [] 
}: ProfilePageProps) => {
  const [profileData, setProfileData] = useState({
    profilePicture: user.profilePicture || null,
    coverImage: user.coverImage || null,
    bio: user.bio || null,
  })
  
  const handleBioUpdate = (newBio: string) => {
    setProfileData(prev => ({
      ...prev,
      bio: newBio
    }));
  };
  
  return (
    <div className="text-[#D7DADC] pt-4 pb-8">
      <ProfileHeader 
        username={user.username}
        profilePicture={profileData.profilePicture}
        isOwnProfile={isOwnProfile}
        userId={user.id}
      />
      
      <div className="flex gap-4 flex-col md:flex-row">
        <div className="flex-1 order-2 md:order-1 max-w-[750px]">
          <ProfileTabs 
            username={user.username} 
            initialPosts={initialPosts}
            initialComments={initialComments} 
          />
        </div>
        
        <div className="w-full md:w-80 flex-shrink-0 order-1 md:order-2">
          <ProfileAboutCard 
            username={user.username}
            coverImage={profileData.coverImage}
            bio={profileData.bio}
            isOwnProfile={isOwnProfile}
            userId={user.id}
            onBioUpdate={handleBioUpdate}
          />
          
          <ModeratorCard username={user.username} />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage 