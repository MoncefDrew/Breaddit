'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import PostFeed from '../PostFeed'
import CommunityRules from './CommunityRules'
import MiniCreatePost from '../MiniCreatePost'
import { Session } from 'next-auth'

interface CommunityTabsProps {
  communityName: string
  initialPosts: any[]
  session: Session | null
}

const CommunityTabs = ({ communityName, initialPosts = [],session }: CommunityTabsProps) => {
  return (
    <div className=" overflow-hidden ">
      <Tabs defaultValue="posts" className="w-full">
        <div className="border-b border-custom">
          <TabsList className="bg-transparent h-12 px-4">
            <TabsTrigger 
              value="posts" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-reddit text-muted rounded-none px-3"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger 
              value="rules" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-reddit text-muted rounded-none px-3"
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