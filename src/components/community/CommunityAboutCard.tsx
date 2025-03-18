'use client'

import { FC, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/Card'
import { format } from 'date-fns'
import { Pencil, CalendarDays, Users, BookOpen, Shield } from 'lucide-react'
import { Button } from '../ui/Button'
import { Textarea } from '../ui/textarea'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { Separator } from '../ui/Separator'


interface Rule {
  id: string
  title: string
  description: string
}

interface CommunityAboutCardProps {
  community: {
    id: string
    name: string
    createdAt: Date
    creatorId: string
  }
  memberCount: number
  description: string | null
  profileImage?: string | null
  isSubscribed: boolean
  isModerator: boolean
  onDescriptionUpdate?: (newDescription: string) => void
  rules?: Rule[]
}

const CommunityAboutCard: FC<CommunityAboutCardProps> = ({
  community,
  memberCount,
  description,
  isModerator,
  onDescriptionUpdate,
  rules = []
}) => {
  const [localDescription, setLocalDescription] = useState(description || '')
  const [isEditing, setIsEditing] = useState(false)
  const [descriptionText, setDescriptionText] = useState(description || '')
  const [isLoading, setIsLoading] = useState(false)
  const [expandedRules, setExpandedRules] = useState<string[]>([])
  
  const { toast } = useToast()

  const handleSaveDescription = async () => {
    if (!isModerator) return
    
    setIsLoading(true)
    try {
      const response = await axios.patch(`/api/subreddit/${community.name}`, {
        description: descriptionText
      })

      if (response.status === 200) {
        if (onDescriptionUpdate) {
          onDescriptionUpdate(descriptionText)
        } else {
          // If no callback is provided, update the local state
          setLocalDescription(descriptionText)
        }
        setIsEditing(false)
        toast({
          title: 'Description updated',
          description: 'Community description has been updated successfully.',
          variant: 'default',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update community description.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleRuleExpansion = (ruleId: string) => {
    setExpandedRules(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId) 
        : [...prev, ruleId]
    )
  }

  // Determine which description to display
  const displayDescription = onDescriptionUpdate ? description : localDescription

  return (
    <Card className="bg-surface border-custom shadow-md mb-4 rounded-lg overflow-hidden">
      <CardHeader className="bg-surface border-b border-custom pb-3">
        <h2 className="text-primary text-base font-medium flex items-center">
          About r/{community.name}
        </h2>
      </CardHeader>
      
      <CardContent className="pt-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#343536] scrollbar-track-transparent">
        {isEditing ? (
          <div className="space-y-2">
            <Textarea 
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
              placeholder="Add a description to your community..."
              className="resize-none h-24 bg-surface-dark-hover border-custom text-primary focus:ring-reddit focus:border-reddit"
            />
            <div className="flex gap-2 justify-end">
              <Button 
                variant="subtle" 
                size="sm"
                onClick={() => {
                  setIsEditing(false)
                  setDescriptionText(displayDescription || '')
                }}
                className="bg-surface-dark-hover text-primary hover:bg-surface-dark-hover"
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleSaveDescription}
                isLoading={isLoading}
                className="bg-reddit text-white hover:bg-reddit"
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {displayDescription ? (
              <p className="text-primary text-sm">{displayDescription}</p>
            ) : (
              <p className="text-muted text-sm italic">
                {isModerator 
                  ? 'Add a description to your community...' 
                  : 'No description available.'}
              </p>
            )}
            
            {isModerator && (
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="mt-2 text-muted hover:text-primary hover:bg-surface-dark-hover p-1 h-auto"
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">Edit</span>
              </Button>
            )}
          </div>
        )}

        <div className="mt-4 space-y-3">
          <div className="flex items-center text-muted text-sm">
            <CalendarDays className="h-4 w-4 mr-2" />
            <span>Created {format(new Date(community.createdAt), 'MMMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center text-muted text-sm">
            <Users className="h-4 w-4 mr-2" />
            <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
          </div>

          {isModerator && (
            <div className="flex items-center text-muted text-sm">
              <Shield className="h-4 w-4 mr-2" />
              <span>You are a moderator of this community</span>
            </div>
          )}
        </div>

        {/* Rules Section */}
        {rules.length > 0 && (
          <div className="mt-6">
            <Separator className="mb-3 bg-custom" />
            
            <div className="flex items-center text-primary mb-3">
              <BookOpen className="h-5 w-5 mr-2" />
              <h3 className="font-medium">Community Rules</h3>
            </div>
            
            <div className="space-y-2">
              {rules.map((rule, index) => (
                <div 
                  key={rule.id} 
                  className="border border-custom rounded-md overflow-hidden bg-surface"
                >
                  <button
                    onClick={() => toggleRuleExpansion(rule.id)}
                    className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-surface-dark-hover transition-colors"
                  >
                    <div className="flex items-center text-primary">
                      <span className="mr-2 text-sm font-medium">{index + 1}.</span>
                      <span className="text-sm font-medium">{rule.title}</span>
                    </div>
                  </button>
                  
                  {expandedRules.includes(rule.id) && (
                    <div className="px-3 py-2 border-t border-custom text-sm text-muted">
                      {rule.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-custom pt-3 pb-3">
        <Button 
          variant="outline" 
          size="sm"
          className="w-full bg-surface-dark-hover text-primary hover:bg-surface-dark-hover border-custom hover:border-reddit transition-colors duration-200"
          onClick={() => {
            window.location.href = `/r/${community.name}/submit`
          }}
        >
          Create Post
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CommunityAboutCard 