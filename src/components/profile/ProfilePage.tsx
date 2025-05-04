'use client'

import { useState } from 'react'
import ProfileHeader from './ProfileHeader'
import ProfileAboutCard from './ProfileAboutCard'
import ModeratorCard from './ModeratorCard'
import ProfileTabs from './ProfileTabs'
import CoverImage from './CoverImage'

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
  
  const handleCoverUpdate = (newCover: string | null) => {
    setProfileData(prev => ({
      ...prev,
      coverImage: newCover
    }));
  };
  
  return (
    <div className="text-gray-900 max-w-6xl  mx-auto">
      {/* Cover Image */}
      <div className="rounded-lg overflow-hidden mb-4 shadow-sm">
        <CoverImage 
          coverImage={profileData.coverImage}
          onImageChange={handleCoverUpdate}
          isOwnProfile={isOwnProfile}
          userId={user.id}
        />
      </div>
      
      {/* Profile Header */}
      <ProfileHeader 
        username={user.username}
        profilePicture={profileData.profilePicture}
        isOwnProfile={isOwnProfile}
        userId={user.id}
        fullName={`${user.username}'s Profile`}
        location="San Francisco, CA"
        website="breaddit.com"
        joinDate="January 2023"
      />
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Column */}
        <div className="flex-1 order-2 lg:order-1">
          <ProfileTabs 
            username={user.username} 
            initialPosts={initialPosts}
            initialComments={initialComments} 
          />
        </div>
        
        {/* Sidebar Column */}
        <div className="lg:w-80 w-full flex-shrink-0 order-1 lg:order-2">
          <ProfileAboutCard 
            username={user.username}
            bio={profileData.bio}
            isOwnProfile={isOwnProfile}
            userId={user.id}
            onBioUpdate={handleBioUpdate}
            karma={1234}
            cakeDay="January 15, 2023"
            stats={{
              posts: initialPosts.length,
              comments: initialComments.length,
              awards: 3
            }}
          />
          
          <ModeratorCard 
            username={user.username}
            communities={isOwnProfile ? [
              { id: '1', name: 'programming', members: 5342890 },
              { id: '2', name: 'webdev', members: 768432 }
            ] : []}
          />
          
          {/* Additional static components for future implementation */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Trophy Case</h3>
            <p className="text-sm text-gray-500 text-center py-4">No trophies yet</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage 