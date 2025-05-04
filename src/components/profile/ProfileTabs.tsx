'use client'

import { Button } from '../ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import UserPostFeed from './UserPostFeed'
import UserCommentFeed from './UserCommentFeed'
import { FileText, MessageSquare, Bookmark, Award } from 'lucide-react'

interface ProfileTabsProps {
  username: string
  initialPosts?: any[]
  initialComments?: any[]
}

const ProfileTabs = ({ username, initialPosts = [], initialComments = [] }: ProfileTabsProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Navigation Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <div className="border-b border-gray-200">
          <TabsList className="bg-transparent h-12 px-4 w-full flex">
            <TabsTrigger 
              value="posts" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-gray-500 rounded-none px-4 py-3 flex items-center gap-1.5"
            >
              <FileText className="h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger 
              value="comments" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-gray-500 rounded-none px-4 py-3 flex items-center gap-1.5"
            >
              <MessageSquare className="h-4 w-4" />
              Comments
            </TabsTrigger>
            <TabsTrigger 
              value="saved" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-gray-500 rounded-none px-4 py-3 flex items-center gap-1.5"
            >
              <Bookmark className="h-4 w-4" />
              Saved
            </TabsTrigger>
            <TabsTrigger 
              value="awards" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-gray-500 rounded-none px-4 py-3 flex items-center gap-1.5"
            >
              <Award className="h-4 w-4" />
              Awards
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
              <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No saved items yet</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                You can save posts and comments to view them later in this tab. Look for the bookmark icon.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="awards" className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No awards yet</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Awards received from other users will appear here. Post great content to earn awards!
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProfileTabs 