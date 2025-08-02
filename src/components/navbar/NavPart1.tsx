"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'

const NavPart1 = () => {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // useEffect to handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get the actual theme, with fallback to system preference
  // Default to 'dark' initially to show dark video until theme is properly detected
  const currentTheme = mounted ? (resolvedTheme || theme) : 'dark'

  return (
    <div className='flex gap-4 items-center'>
        <a href="#" className='flex gap-2 items-center'>
            {/* Light Theme Video - Hidden in Dark Mode */}
            <video 
                src="/videos/m-logolight1.mp4"
                width={42} 
                height={42}
                autoPlay 
                loop 
                muted 
                playsInline
                className={`rounded-lg ${currentTheme === 'dark' ? 'hidden' : 'block'}`}
            />
            
            {/* Dark Theme Video - Hidden in Light Mode */}
            <video 
                src="/videos/m-logodark1.mp4"
                width={42} 
                height={42}
                autoPlay 
                loop 
                muted 
                playsInline
                className={`rounded-lg ${currentTheme === 'dark' ? 'block' : 'hidden'}`}
            />
            
            {/* <h4 className='text-lg font-bold'>Nishant Mogahaa</h4>
            <p className='text-[10px] border-1 border-orange-600 rounded-full px-1.5 text-orange-600'>Welcome</p> */}
        </a>

    </div>
  )
}

export default NavPart1