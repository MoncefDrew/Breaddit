'use client'

import { Shield } from 'lucide-react'
import Link from 'next/link'

interface ModeratorCardProps {
  username: string
  communities?: Array<{id: string, name: string, members: number}>
}

const ModeratorCard = ({ 
  username,
  communities = []
}: ModeratorCardProps) => {
  // For the static implementation, we'll add some example communities
  const staticCommunities = communities.length > 0 ? communities : [
    { id: '1', name: 'programming', members: 5342890 },
    { id: '2', name: 'webdev', members: 768432 }
  ];
  
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm mb-4">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center">
        <Shield className="h-4 w-4 mr-2 text-blue-500" />
        <h2 className="text-[16px] font-medium text-gray-900">Moderator of these communities</h2>
      </div>
      
      {staticCommunities.length > 0 ? (
        <div className="p-4 space-y-3">
          {staticCommunities.map(community => (
            <div key={community.id} className="flex items-center justify-between">
              <Link href={`/r/${community.name}`} className="text-blue-500 hover:text-blue-700 hover:underline text-sm">
                r/{community.name}
              </Link>
              <span className="text-xs text-gray-500">{community.members.toLocaleString()} members</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 flex items-center justify-center">
          <p className="text-sm text-gray-500">Not a moderator of any communities</p>
        </div>
      )}
    </div>
  )
}

export default ModeratorCard 