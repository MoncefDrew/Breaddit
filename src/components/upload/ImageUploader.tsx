'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { UploadButton } from '@uploadthing/react'
import { Loader2 } from 'lucide-react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'

interface ImageUploaderProps {
  endpoint: keyof OurFileRouter
  onUploadComplete: (url: string) => void
  onUploadError?: (error: Error) => void
}

export default function ImageUploader({
  endpoint,
  onUploadComplete,
  onUploadError,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  return (
    <div className="w-full">
      {isUploading && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-[#FF4500]" />
        </div>
      )}
      
      <UploadButton<OurFileRouter, typeof endpoint>
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          setIsUploading(false)
          if (!res || !res[0]) {
            toast({
              title: 'Error',
              description: 'Something went wrong during upload',
              variant: 'destructive',
            })
            return
          }
          
          const url = res[0].url
          onUploadComplete(url)
          
          toast({
            title: 'Upload Complete',
            description: 'Your image has been uploaded successfully',
            variant: 'default',
          })
        }}
        onUploadError={(error: Error) => {
          setIsUploading(false)
          toast({
            title: 'Upload Error',
            description: error.message || 'Something went wrong',
            variant: 'destructive',
          })
          
          if (onUploadError) {
            onUploadError(error)
          }
        }}
        onUploadBegin={() => {
          setIsUploading(true)
        }}
        className="ut-button:bg-[#FF4500] ut-button:hover:bg-[#FF5414] ut-button:text-white ut-button:rounded-md ut-button:font-medium ut-button:shadow-sm"
      />
    </div>
  )
} 