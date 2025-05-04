'use client'

import { Button } from '../ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import UserPostFeed from './UserPostFeed'
import UserCommentFeed from './UserCommentFeed'

interface ProfileTabsProps {
  username: string
  initialPosts?: any[]
  initialComments?: any[]
}

const ProfileTabs = ({ username, initialPosts = [], initialComments = [] }: ProfileTabsProps) => {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden border border-[#e2e8f0]">
      {/* Navigation Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <div className="border-b border-[#e2e8f0]">
          <TabsList className="bg-transparent h-12 px-4">
            
            <TabsTrigger 
              value="posts" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-[#1e293b] data-[state=active]:border-b-2 data-[state=active]:border-[#ff4500] text-[#64748b] rounded-none px-3"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger 
              value="comments" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-[#1e293b] data-[state=active]:border-b-2 data-[state=active]:border-[#ff4500] text-[#64748b] rounded-none px-3"
            >
              Comments
            </TabsTrigger>
            <TabsTrigger 
              value="saved" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-[#1e293b] data-[state=active]:border-b-2 data-[state=active]:border-[#ff4500] text-[#64748b] rounded-none px-3"
            >
              Saved
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="posts" className="p-4">
          <UserPostFeed username={username} initialPosts={initialPosts} />
        </TabsContent>
        
        <TabsContent value="comments" className="p-4">
          <UserCommentFeed username={username} initialComments={initialComments} />
        </TabsContent>
        
        <TabsContent value="saved" className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-[#1e293b] mb-2">u/{username} hasn&apos;t saved anything yet</h3>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProfileTabs 