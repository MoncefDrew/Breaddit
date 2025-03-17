'use client'

import { useState, useEffect } from 'react'
import { Pencil, Check, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'

interface ProfileBioProps {
  bio?: string | null
  isOwnProfile?: boolean
  userId: string
  onBioUpdate?: (newBio: string) => void
}

const ProfileBio = ({ 
  bio = '', 
  isOwnProfile = false,
  userId,
  onBioUpdate
}: ProfileBioProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState(bio || '');
  const { toast } = useToast();
  
  // Update local state when prop changes
  useEffect(() => {
    setBioText(bio || '');
  }, [bio]);

 

  const updateBio = async () => {
    try {
      const response = await axios.put('/api/profile/update/bio', {
        userId,
        bio: bioText
      });

      if (response.status === 200) {
        setIsEditing(false);
        
        // Notify parent component
        if (onBioUpdate) {
          onBioUpdate(bioText);
        }
        
        if (isOwnProfile) {
          toast({
            title: 'Bio updated',
            description: 'Your bio has been updated successfully.',
          })
        }
      } else {
        throw new Error('Failed to update bio in database');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update bio. Please try again.',
        variant: 'destructive',
      })
    }
  };

  const cancelEdit = () => {
    setBioText(bio || '');
    setIsEditing(false);
  };

  return (
    <div className="p-4 border-b border-[#343536]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-[#D7DADC]">Bio</h3>
        {isOwnProfile && !isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-full hover:bg-[#272729]"
          >
            <Pencil className="h-4 w-4 text-white" />
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <div className="mt-2">
          <textarea
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            className="w-full h-24 p-3 text-sm text-[#D7DADC] bg-[#1A1A1B] border border-[#343536] rounded-md focus:outline-none focus:ring-1 focus:ring-[#D7DADC] resize-none"
            placeholder="Write something about yourself..."
          />
          <div className="flex justify-end mt-2 gap-2">
            <Button
              onClick={cancelEdit}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full bg-[#272729] hover:bg-[#343536]"
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
            <Button
              onClick={updateBio}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full bg-[#272729] hover:bg-[#343536]"
            >
              <Check className="h-4 w-4 text-green-300" />
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-[#D7DADC] whitespace-pre-wrap">
          {bioText || 'No bio yet.'}
        </p>
      )}
    </div>
  );
};

export default ProfileBio; 