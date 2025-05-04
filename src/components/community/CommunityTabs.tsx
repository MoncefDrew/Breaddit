'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import PostFeed from '../PostFeed'
import CommunityRules from './CommunityRules'
import MiniCreatePost from '../MiniCreatePost'
import { Session } from 'next-auth'
import { FileText, TrendingUp, Clock, Award } from 'lucide-react'

interface CommunityTabsProps {
  communityName: string
  initialPosts: any[]
  session: Session | null
}

const CommunityTabs = ({ communityName, initialPosts = [], session }: CommunityTabsProps) => {
  return (
    <Tabs defaultValue="posts" className="w-full ">
        <TabsList className="bg-transparent h-auto px-0 w-full flex justify-start space-x-1">
          <TabsTrigger 
            value="posts" 
            className="data-[state=active]:bg-transparent data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-gray-500 rounded-none px-4 py-2"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger 
            value="rules" 
            className="data-[state=active]:bg-transparent data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-gray-500 rounded-none px-4 py-2"
          >
            Rules
          </TabsTrigger>
        </TabsList>
      
      <TabsContent value="posts" className="pt-4 px-0">
        {session && (
          <div className="mb-4">
            <MiniCreatePost session={session} />
          </div>
        )}
        
        <div className="flex mb-4 space-x-2">
          <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-blue-500 rounded-full text-sm font-medium">
            <FileText className="h-4 w-4" />
            Hot
          </button>
          <button className="flex items-center gap-1 px-3 py-1 text-gray-500 hover:bg-gray-100 rounded-full text-sm font-medium">
            <TrendingUp className="h-4 w-4" />
            New
          </button>
          <button className="flex items-center gap-1 px-3 py-1 text-gray-500 hover:bg-gray-100 rounded-full text-sm font-medium">
            <Clock className="h-4 w-4" />
            Top
          </button>
          <button className="flex items-center gap-1 px-3 py-1 text-gray-500 hover:bg-gray-100 rounded-full text-sm font-medium">
            <Award className="h-4 w-4" />
            Rising
          </button>
        </div>
        
        <PostFeed initialPosts={initialPosts} subredditName={communityName} />
      </TabsContent>
      
      <TabsContent value="rules" className="pt-4 px-0">
        <CommunityRules communityName={communityName} />
      </TabsContent>
    </Tabs>
  )
}

export default CommunityTabs 