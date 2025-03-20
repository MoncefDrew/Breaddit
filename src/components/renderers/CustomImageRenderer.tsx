'use client'

import Image from 'next/image'
import { useState } from 'react'

function CustomImageRenderer({ data }: any) {
  const src = data.file.url
  const [shouldShowBlur, setShouldShowBlur] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const handleImageLoad = (e: any) => {
    const img = e.target
    const containerWidth = img.parentElement.offsetWidth
    const naturalWidth = img.naturalWidth
    
    setDimensions({
      width: naturalWidth,
      height: img.naturalHeight
    })
    
    setShouldShowBlur(naturalWidth < containerWidth)
  }

  return (
    <div className='relative w-full min-h-[15rem] overflow-hidden rounded-md bg-post'>
      {/* Main image */}
      <div className='relative w-full h-full flex items-center justify-center'>
        {shouldShowBlur && (
          <div className='absolute inset-0 blur-xl opacity-30'>
            <Image 
              alt='blur background' 
              className='object-cover'
              fill
              src={src}
              quality={1}
            />
          </div>
        )}
        
        <Image 
          alt='image'
          src={src}
          width={dimensions.width || 1000}
          height={dimensions.height || 800}
          className='object-contain max-h-[80vh]'
          onLoad={handleImageLoad}
          priority
        />
      </div>
    </div>
  )
}

export default CustomImageRenderer