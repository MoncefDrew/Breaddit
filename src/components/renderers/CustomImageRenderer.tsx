'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

function CustomImageRenderer({ data }: any) {
  const src = data.file.url
  const [shouldShowBlur, setShouldShowBlur] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkImageDimensions = () => {
      const imgElement = document.createElement('img')
      imgElement.src = src
      
      imgElement.onload = () => {
        const containerWidth = containerRef.current?.offsetWidth || 0
        setDimensions({
          width: imgElement.naturalWidth,
          height: imgElement.naturalHeight
        })
        setShouldShowBlur(imgElement.naturalWidth < containerWidth - 48)
      }
    }

    checkImageDimensions()
  }, [src])

  return (
    <div ref={containerRef} className='relative w-full min-h-[15rem] overflow-hidden rounded-2xl border border-slate-600  bg-post'>
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
          priority
        />
      </div>
    </div>
  )
}

export default CustomImageRenderer