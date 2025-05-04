'use client'

import { Button } from '../ui/Button'
import { Link as LinkIcon, Share, Gift, Trophy, BookOpen, Clock, CalendarDays, Award, ThumbsUp, MessageSquare, ChevronDown, ChevronUp, Github, Twitter, Globe, Settings, Users } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import ProfileBio from './ProfileBio'

interface ProfileAboutCardProps {
  username: string
  karma?: number
  cakeDay?: string
  bio?: string | null
  onFollow?: () => void
  isOwnProfile?: boolean
  userId: string
  onBioUpdate?: (newBio: string) => void
  stats?: {
    posts?: number
    comments?: number
    awards?: number
  }
}

const ProfileAboutCard = ({ 
  username, 
  karma = 1, 
  cakeDay = 'August 25, 2023',
  bio = '',
  onFollow,
  isOwnProfile = false,
  userId,
  onBioUpdate,
  stats = {
    posts: 4,
    comments: 12,
    awards: 2
  }
}: ProfileAboutCardProps) => {
  const { toast } = useToast();
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [showAllSocialLinks, setShowAllSocialLinks] = useState(false);
  
  const achievements = [
    { name: "1-Year Club", icon: <Clock className="h-4 w-4 mr-2 text-blue-500" />, description: "Has been a member for at least 1 year" },
    { name: "Verified Email", icon: <Trophy className="h-4 w-4 mr-2 text-orange-500" />, description: "Has a verified email address" },
    { name: "Avid Reader", icon: <BookOpen className="h-4 w-4 mr-2 text-green-500" />, description: "Reads a lot of posts" },
    { name: "Helpful Award", icon: <Award className="h-4 w-4 mr-2 text-purple-500" />, description: "Received for particularly helpful contributions" },
    { name: "Top Commenter", icon: <MessageSquare className="h-4 w-4 mr-2 text-yellow-500" />, description: "One of the most active commenters" },
  ];
  
  const socialLinks = [
    { name: "GitHub", icon: <Github className="h-4 w-4 mr-2 text-gray-700" />, url: "https://github.com" },
    { name: "Twitter", icon: <Twitter className="h-4 w-4 mr-2 text-blue-400" />, url: "https://twitter.com" },
    { name: "Website", icon: <Globe className="h-4 w-4 mr-2 text-green-500" />, url: "https://example.com" },
  ];
  
  const displayedAchievements = showAllAchievements 
    ? achievements 
    : achievements.slice(0, 3);
  
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm mb-4 hover:shadow-md transition-shadow duration-300">
      {/* Header with title */}
      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-gray-900">About u/{username}</h2>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            className="rounded-full h-8 w-8 p-0 bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/u/${username}`);
              toast({
                title: 'Link copied',
                description: 'Profile link copied to clipboard',
                variant: 'default'
              });
            }}
          >
            <Share className="h-4 w-4" />
          </Button>
          
          {isOwnProfile && (
            <Link href="/settings/profile">
              <Button 
                variant="ghost" 
                className="rounded-full h-8 w-8 p-0 bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Bio section */}
      <ProfileBio 
        bio={bio}
        isOwnProfile={isOwnProfile}
        userId={userId}
        onBioUpdate={onBioUpdate}
      />
      
      {/* Stats */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap -m-2">
          {/* Main Stats */}
          <div className="p-2 w-1/2">
            <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors group">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <ThumbsUp className="h-3.5 w-3.5 mr-1.5 text-orange-500 group-hover:scale-110 transition-transform" />
                <span>Karma</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">{karma.toLocaleString()}</div>
            </div>
          </div>
          <div className="p-2 w-1/2">
            <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors group">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-blue-500 group-hover:scale-110 transition-transform" />
                <span>Cake day</span>
              </div>
              <div className="text-md font-semibold text-gray-900">{cakeDay}</div>
            </div>
          </div>
          
          {/* Activity Stats */}
          <div className="flex w-full mt-1 border-t border-gray-100 pt-3">
            {stats.posts !== undefined && (
              <div className="p-2 w-1/3">
                <div className="bg-gray-50 p-3 rounded-lg text-center hover:shadow-sm transition-all hover:bg-blue-50 cursor-pointer">
                  <div className="text-xl font-bold text-gray-900">{stats.posts}</div>
                  <div className="text-xs text-gray-500 flex items-center justify-center">
                    <LinkIcon className="h-3 w-3 mr-1 text-blue-500" />
                    Posts
                  </div>
                </div>
              </div>
            )}
            
            {stats.comments !== undefined && (
              <div className="p-2 w-1/3">
                <div className="bg-gray-50 p-3 rounded-lg text-center hover:shadow-sm transition-all hover:bg-green-50 cursor-pointer">
                  <div className="text-xl font-bold text-gray-900">{stats.comments}</div>
                  <div className="text-xs text-gray-500 flex items-center justify-center">
                    <MessageSquare className="h-3 w-3 mr-1 text-green-500" />
                    Comments
                  </div>
                </div>
              </div>
            )}
            
            {stats.awards !== undefined && (
              <div className="p-2 w-1/3">
                <div className="bg-gray-50 p-3 rounded-lg text-center hover:shadow-sm transition-all hover:bg-yellow-50 cursor-pointer">
                  <div className="text-xl font-bold text-gray-900">{stats.awards}</div>
                  <div className="text-xs text-gray-500 flex items-center justify-center">
                    <Award className="h-3 w-3 mr-1 text-yellow-500" />
                    Awards
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Achievements section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Achievements</h3>
          <button 
            onClick={() => setShowAllAchievements(!showAllAchievements)}
            className="flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            {showAllAchievements ? 
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                <span>Show less</span>
              </> : 
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                <span>Show all {achievements.length}</span>
              </>
            }
          </button>
        </div>
        
        <div className="space-y-2">
          {displayedAchievements.map((achievement, index) => (
            <div 
              key={index} 
              className="flex items-center p-2.5 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors group cursor-help"
              title={achievement.description}
            >
              <div className="group-hover:scale-110 transition-transform">
                {achievement.icon}
              </div>
              <span className="text-sm text-gray-800">{achievement.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Social Links section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Social Links</h3>
          {isOwnProfile && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 text-xs font-medium"
            >
              <LinkIcon className="h-3 w-3 mr-1.5" />
              Add link
            </Button>
          )}
        </div>
        
        {socialLinks.length > 0 ? (
          <div className="space-y-2">
            {socialLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-2.5 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                {link.icon}
                <span className="text-sm text-gray-800">{link.name}</span>
                <LinkIcon className="h-3 w-3 ml-auto text-gray-400" />
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No social links added yet</p>
            {isOwnProfile && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                <LinkIcon className="h-4 w-4 mr-1.5" />
                Add your first link
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Community section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Active in communities</h3>
        </div>
        
        <div className="space-y-2">
          <Link 
            href="/r/programming" 
            className="flex items-center p-2.5 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
          >
            <div className="h-6 w-6 rounded-full bg-blue-500 mr-2 flex items-center justify-center text-white text-xs font-bold">
              P
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">r/programming</div>
              <div className="text-xs text-gray-500 flex items-center">
                <Users className="h-3 w-3 mr-1" />
                5.3M members
              </div>
            </div>
          </Link>
          
          <Link 
            href="/r/webdev" 
            className="flex items-center p-2.5 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
          >
            <div className="h-6 w-6 rounded-full bg-green-500 mr-2 flex items-center justify-center text-white text-xs font-bold">
              W
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">r/webdev</div>
              <div className="text-xs text-gray-500 flex items-center">
                <Users className="h-3 w-3 mr-1" />
                768K members
              </div>
            </div>
          </Link>
          
          <Link 
            href="/r/reactjs" 
            className="flex items-center p-2.5 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
          >
            <div className="h-6 w-6 rounded-full bg-blue-400 mr-2 flex items-center justify-center text-white text-xs font-bold">
              R
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">r/reactjs</div>
              <div className="text-xs text-gray-500 flex items-center">
                <Users className="h-3 w-3 mr-1" />
                342K members
              </div>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Footer section */}
      <div className="p-4">
        {isOwnProfile ? (
          <div className="flex flex-col space-y-2">
            <Link href="/settings/profile">
              <Button 
                variant="outline" 
                className="w-full h-9 text-gray-700 border-gray-300 hover:bg-gray-50 text-sm rounded-md flex items-center justify-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Edit profile settings
              </Button>
            </Link>
            <Link href="/settings/social-links">
              <Button 
                variant="outline" 
                className="w-full h-9 text-gray-700 border-gray-300 hover:bg-gray-50 text-sm rounded-md flex items-center justify-center gap-2"
              >
                <LinkIcon className="h-4 w-4" />
                Manage social links
              </Button>
            </Link>
          </div>
        ) : (
          <Button 
            variant="outline"
            className="w-full h-9 text-gray-700 border-gray-300 hover:bg-gray-50 text-sm rounded-md flex items-center justify-center gap-2"
            onClick={() => {
              toast({
                title: 'Send gift',
                description: 'This feature will be available soon',
                variant: 'default'
              });
            }}
          >
            <Gift className="h-4 w-4 text-orange-500" />
            Send gift
          </Button>
        )}
      </div>
    </div>
  )
}

export default ProfileAboutCard 