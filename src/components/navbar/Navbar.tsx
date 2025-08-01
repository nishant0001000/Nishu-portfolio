"use client"

import React, { useState } from 'react'
import NavPart1 from './NavPart1'
import NavPart2 from './NavPart2'
import { CustomColorDemo } from './Navmiddle'

const Navbar = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearchToggle = (expanded: boolean) => {
    setIsSearchExpanded(expanded);
  };

  return (
    <>
      {/* Main navbar */}
      <div className='relative flex justify-between items-center py-3 px-3 sm:px-6 lg:px-8 xl:px-12 2xl:px-16'>
        
        {/* Left side - Logo */}
        <div className="flex-shrink-0">
          <NavPart1 />
        </div>
        
        {/* Center - Navmiddle (only on desktop) */}
        <div className={`hidden sm:flex absolute transition-all duration-500 ease-in-out ${
          isSearchExpanded 
            ? 'left-1/3 transform -translate-x-1/2' 
            : 'left-1/2 transform -translate-x-1/2'
        }`}>
          <CustomColorDemo />
        </div>
        
        {/* Right side - Search, Social, Theme */}
        <div className="flex-shrink-0">
          <NavPart2 onSearchToggle={handleSearchToggle} />
        </div>
      </div>
      
      {/* Mobile Navmiddle - fixed bottom navigation with liquid glass */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="flex justify-center py-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative p-1">
                <CustomColorDemo />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar