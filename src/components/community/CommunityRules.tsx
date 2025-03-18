'use client'

import { FC, useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { AlertCircle, Pencil, Plus, Save, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/textarea'
import { useSession } from 'next-auth/react'

interface Rule {
  id: string
  title: string
  description: string
}

interface CommunityRulesProps {
  communityName: string
}

const CommunityRules: FC<CommunityRulesProps> = ({ communityName }) => {
  const [rules, setRules] = useState<Rule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [newRule, setNewRule] = useState({ title: '', description: '' })
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()

  const fetchRules = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`/api/subreddit/${communityName}/rules`)
      setRules(response.data || [])
      setError(null)
    } catch (err) {
      setError('Failed to load community rules')
      setRules([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRules()
  }, [communityName])

  const handleAddRule = () => {
    if (!newRule.title.trim()) {
      toast({
        title: 'Rule title required',
        description: 'Please provide a title for the rule',
        variant: 'destructive',
      })
      return
    }

    setRules([...rules, { ...newRule, id: Date.now().toString() }])
    setNewRule({ title: '', description: '' })
  }

  const handleRemoveRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id))
  }

  const handleSaveRules = async () => {
    try {
      setIsSaving(true)
      const response = await axios.post(`/api/subreddit/${communityName}/rules`, { rules })
      
      if (response.status === 200) {
        setIsEditing(false)
        toast({
          title: 'Rules saved',
          description: 'Community rules have been updated successfully',
          variant: 'default',
        })
        await fetchRules()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save community rules',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Check if the current user is a moderator
  const checkIsModerator = () => {
    // This is a placeholder. In a real app, you would check if the user is a mod
    // You'll need to implement proper moderator checking logic based on your app's auth
    return true
  }

  const isModerator = checkIsModerator()

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-surface-dark-hover h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-surface-dark-hover rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-surface-dark-hover rounded col-span-2"></div>
                <div className="h-2 bg-surface-dark-hover rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-surface-dark-hover rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-primary">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <p>{error}</p>
      </div>
    )
  }

  if (rules.length === 0 && !isEditing) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted">No rules have been set for this community yet.</p>
        {isModerator && (
          <Button 
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-reddit hover:bg-reddit text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Rules
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!isEditing ? (
        <>
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <div key={rule.id} className="bg-surface border border-custom rounded-md p-4">
                <h3 className="text-primary font-medium text-sm">{index + 1}. {rule.title}</h3>
                {rule.description && (
                  <p className="text-muted text-sm mt-1">{rule.description}</p>
                )}
              </div>
            ))}
          </div>
          
          {isModerator && (
            <Button 
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-reddit hover:bg-reddit text-white"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Rules
            </Button>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <div key={rule.id} className="bg-surface-dark-hover border border-custom rounded-md p-4 relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveRule(rule.id)}
                  className="absolute top-2 right-2 p-1 h-auto w-auto text-muted hover:text-red-500 hover:bg-transparent"
                >
                  <X className="h-4 w-4" />
                </Button>
                <p className="text-primary text-xs mb-2">Rule {index + 1}</p>
                <Input
                  value={rule.title}
                  onChange={(e) => {
                    const updatedRules = [...rules]
                    updatedRules[index].title = e.target.value
                    setRules(updatedRules)
                  }}
                  placeholder="Rule title"
                  className="mb-2 bg-surface border-custom text-primary"
                />
                <Textarea
                  value={rule.description}
                  onChange={(e) => {
                    const updatedRules = [...rules]
                    updatedRules[index].description = e.target.value
                    setRules(updatedRules)
                  }}
                  placeholder="Rule description (optional)"
                  className="resize-none h-20 bg-surface border-custom text-primary"
                />
              </div>
            ))}
          </div>
          
          <div className="bg-surface-dark-hover border border-custom rounded-md p-4">
            <p className="text-primary text-xs mb-2">New Rule</p>
            <Input
              value={newRule.title}
              onChange={(e) => setNewRule({ ...newRule, title: e.target.value })}
              placeholder="Rule title"
              className="mb-2 bg-surface border-custom text-primary"
            />
            <Textarea
              value={newRule.description}
              onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
              placeholder="Rule description (optional)"
              className="resize-none h-20 bg-surface border-custom text-primary mb-2"
            />
            <Button
              onClick={handleAddRule}
              disabled={!newRule.title.trim()}
              className="bg-reddit hover:bg-reddit text-white w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="subtle"
              onClick={() => {
                setIsEditing(false)
                fetchRules() // Reload the original rules
              }}
              className="bg-surface-dark-hover text-primary hover:bg-surface-dark-hover"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveRules}
              isLoading={isSaving}
              className="bg-reddit hover:bg-reddit text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Rules
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommunityRules 