'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import PostFeed from '../PostFeed'
import CommunityRules from './CommunityRules'

interface CommunityTabsProps {
  communityName: string
  initialPosts: any[]
}

const CommunityTabs = ({ communityName, initialPosts = [] }: CommunityTabsProps) => {
  return (
    <div className="bg-[#1A1A1B] rounded-md shadow-md overflow-hidden border border-[#343536]">
      <Tabs defaultValue="posts" className="w-full">
        <div className="border-b border-[#343536]">
          <TabsList className="bg-transparent h-12 px-4">
            <TabsTrigger 
              value="posts" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-[#D7DADC] data-[state=active]:border-b-2 data-[state=active]:border-[#FF4500] text-[#818384] rounded-none px-3"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger 
              value="rules" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-[#D7DADC] data-[state=active]:border-b-2 data-[state=active]:border-[#FF4500] text-[#818384] rounded-none px-3"
            >
              Rules
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="posts" className="p-4">
          <PostFeed initialPosts={initialPosts} subredditName={communityName} />
        </TabsContent>
        
        <TabsContent value="rules" className="p-4">
          <CommunityRules communityName={communityName} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CommunityTabs 