'use client'

import { useState } from 'react'
import { Button } from '../ui/Button'
import { Pencil } from 'lucide-react'

interface BioSectionProps {
  bio: string | null
}

const BioSection = ({ bio }: BioSectionProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [bioText, setBioText] = useState(bio || '')

  const handleSave = () => {
    setIsEditing(false)
  }

  return (
    <div className="bg-[#1A1A1B] border border-[#343536] rounded-md p-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[#D7DADC] font-medium">About</h3>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="ghost"
          size="sm"
          className="text-[#818384] hover:text-[#D7DADC] hover:bg-[#272729] h-8 px-2"
        >
          <Pencil className="h-4 w-4 mr-1" />
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      {isEditing ? (
        <div className="mt-2">
          <textarea
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            className="w-full bg-[#272729] border border-[#343536] rounded-md p-3 text-[#D7DADC] placeholder:text-[#818384] focus:outline-none focus:ring-1 focus:ring-[#FF4500] min-h-[120px] resize-none"
            placeholder="Tell the community about yourself..."
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-[#818384]">
              {bioText.length}/500 characters
            </span>
            <Button
              onClick={handleSave}
              variant="reddit"
              size="sm"
              className="h-8"
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-2 text-[#D7DADC]">
          {bio ? (
            <p className="whitespace-pre-wrap">{bio}</p>
          ) : (
            <p className="text-[#818384] italic">Add a bio to tell the community about yourself...</p>
          )}
        </div>
      )}
    </div>
  )
}

export default BioSection 