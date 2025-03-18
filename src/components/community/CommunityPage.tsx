'use client'

import { useState } from 'react'
import CommunityHeader from './CommunityHeader'
import CommunityTabs from '@/components/community/CommunityTabs'
import MiniCreatePost from '../MiniCreatePost'
import { Cake, InfoIcon, Users } from 'lucide-react'
import { format } from 'date-fns'
import SubscribeLeaveToggle from '../SubscribeLeaveToggle'
import CommunityAboutCard from './CommunityAboutCard'
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface Rule {
  id: string
  title: string
  description: string
}

interface CommunityPageProps {
  community: {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    creatorId: string
    coverImage?: string | null
    profileImage?: string | null
  }
  memberCount: number
  description?: string | null
  isSubscribed: boolean
  isModerator: boolean
  initialPosts: any[]
  session: any | null
  rules?: Rule[]
}

const CommunityPage = ({ 
  community, 
  memberCount,
  description,
  isSubscribed,
  isModerator,
  initialPosts = [],
  session,
  rules = []
}: CommunityPageProps) => {
  // We don't need to manage description state here anymore
  // since it's handled in the layout
  
  return (
    <div className="text-[#D7DADC] pb-3 mt-12">
      <CommunityHeader 
        name={community.name}
        memberCount={memberCount}
        isSubscribed={isSubscribed}
        isModerator={isModerator}
        coverImage={community.coverImage}
        profileImage={community.profileImage}
      />
      
      <div className="max-w-5xl mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content column */}
          <div className="md:col-span-2">
            {session && <MiniCreatePost session={session} />}
            <div className="mt-4">
              <CommunityTabs
                communityName={community.name}
                initialPosts={initialPosts}
              />
            </div>
          </div>
          
          {/* Sidebar column */}
          <div className="md:col-span-1">
            <CommunityAboutCard
              community={{
                id: community.id,
                name: community.name,
                createdAt: community.createdAt,
                creatorId: community.creatorId
              }}
              memberCount={memberCount}
              description={description || null}
              profileImage={community.profileImage}
              isSubscribed={isSubscribed}
              isModerator={isModerator}
              rules={rules}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityPage 