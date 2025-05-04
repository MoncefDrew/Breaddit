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
  const [charCount, setCharCount] = useState(bioText.length);
  const MAX_CHARS = 300;
  const { toast } = useToast();
  
  // Update local state when prop changes
  useEffect(() => {
    setBioText(bio || '');
    setCharCount((bio || '').length);
  }, [bio]);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setBioText(text);
      setCharCount(text.length);
    }
  };

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
            variant: 'default'
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
    setCharCount((bio || '').length);
    setIsEditing(false);
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">Bio</h3>
        {isOwnProfile && !isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <div className="mt-2">
          <div className="relative">
            <textarea
              value={bioText}
              onChange={handleBioChange}
              className="w-full h-28 p-3 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Write something about yourself..."
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-1.5 py-0.5 rounded-full border border-gray-200">
              {charCount}/{MAX_CHARS}
            </div>
          </div>
          <div className="flex justify-end mt-3 gap-2">
            <Button
              onClick={cancelEdit}
              variant="outline"
              size="sm"
              className="h-8 px-3 py-1 rounded-md text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <X className="h-3.5 w-3.5 mr-1.5" />
              Cancel
            </Button>
            <Button
              onClick={updateBio}
              variant="primary"
              size="sm"
              className="h-8 px-3 py-1 rounded-md text-sm"
            >
              <Check className="h-3.5 w-3.5 mr-1.5" />
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-md">
          {bioText ? (
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {bioText}
            </p>
          ) : (
            <p className="text-sm text-gray-500 italic">
              {isOwnProfile 
                ? "Add a bio to tell the community about yourself." 
                : "This user hasn't written a bio yet."}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileBio; 