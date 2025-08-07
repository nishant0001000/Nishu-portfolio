"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useAdmin } from '../ui/admin-context'

const NavPart1 = () => {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { incrementClickCount, clickCount } = useAdmin()

  // useEffect to handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get the actual theme, with fallback to system preference
  // Default to 'dark' initially to show dark video until theme is properly detected
  const currentTheme = mounted ? (resolvedTheme || theme) : 'dark'

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    incrementClickCount()
  }

  return (
    <div className='flex gap-4 items-center'>
        <a href="#" className='flex gap-2 items-center' onClick={handleLogoClick}>
            {/* Light Theme Video - Hidden in Dark Mode */}
            <video 
                src="https://res.cloudinary.com/dbtymafqf/video/upload/v1754257529/m-logolight1_y8u0bu.mp4"
                width={42} 
                height={42}
                autoPlay 
                loop 
                muted 
                playsInline
                className={`rounded-lg cursor-pointer transition-transform hover:scale-105 ${currentTheme === 'dark' ? 'hidden' : 'block'}`}
            />
            
            {/* Dark Theme Video - Hidden in Light Mode */}
            <video 
                src="https://res.cloudinary.com/dbtymafqf/video/upload/v1754257529/m-logodark1_pphxjz.mp4"
                width={42} 
                height={42}
                autoPlay 
                loop 
                muted 
                playsInline
                className={`rounded-lg cursor-pointer transition-transform hover:scale-105 ${currentTheme === 'dark' ? 'block' : 'hidden'}`}
            />
            
            {/* <h4 className='text-lg font-bold'>Nishant Mogahaa</h4>
            <p className='text-[10px] border-1 border-orange-600 rounded-full px-1.5 text-orange-600'>Welcome</p> */}
        </a>

    </div>
  )
}

export default NavPart1