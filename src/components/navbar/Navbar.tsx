"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NavPart1 from './NavPart1'
import NavPart2 from './NavPart2'
import { CustomColorDemo } from './Navmiddle'

const Navbar = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Quotes array
  const quotes = [
    "Click for nav",
    "Explore more",
    "Discover features",
    "Open menu",
    "Navigation here",
    "Tap to expand"
  ];

  // Rotate quotes every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  const handleSearchToggle = (expanded: boolean) => {
    setIsSearchExpanded(expanded);
  };

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  return (
    <div className="sticky top-0 z-50 bg-transparent navbar-transparent">
      {/* Main navbar */}
      <div className='flex relative justify-between items-center px-3 py-3 bg-transparent sm:px-6 lg:px-8 xl:px-12 2xl:px-16'>
        
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
      
      {/* Mobile Navigation - Circle with Logo */}
      <div className="fixed bottom-6 right-7 z-50 sm:hidden">
        <motion.button
          onClick={toggleMobileNav}
          whileTap={{ scale: 0.9 }}
          animate={{
            scale: isMobileNavOpen ? 1.1 : 1,
            rotate: isMobileNavOpen ? 360 : 0
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          className="flex relative justify-center items-center pt-2 w-12 h-12 bg-black rounded-full backdrop-blur-md dark:bg-white"
        >
          {/* Logo */}
          <div className="w-8 h-8">
            <video 
              src="https://res.cloudinary.com/nishantcloud/video/upload/v1754257530/m-logo_k7cbrm.mp4"
              width={32} 
              height={32}
              autoPlay 
              loop 
              muted 
              playsInline
              className="rounded-full dark:hidden"
            />
            <video 
              src="https://res.cloudinary.com/nishantcloud/video/upload/v1754257529/m-logolight1_y8u0bu.mp4"
              width={32} 
              height={32}
              autoPlay 
              loop 
              muted 
              playsInline
              className="hidden rounded-full dark:block"
            />
          </div>
        </motion.button>

        {/* Rotating Quote Text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute -top-12 left-1/2 whitespace-nowrap transform -translate-x-1/2"
          >
            <span className="px-2 py-1 text-xs font-medium text-white bg-gray-600 rounded-full backdrop-blur-sm dark:text-black dark:bg-white">
              {quotes[currentQuoteIndex]}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Nav Middle Panel */}
        <AnimatePresence>
          {isMobileNavOpen && (
            <motion.div
              initial={{ 
                scale: 0,
                opacity: 0,
                y: 50,
                borderRadius: "50%"
              }}
              animate={{ 
                scale: 1,
                opacity: 1,
                y: 0,
                borderRadius: "16px"
              }}
              exit={{ 
                scale: 0,
                opacity: 0,
                y: 50,
                borderRadius: "50%"
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                mass: 0.8
              }}
              className="fixed bottom-4 left-1/2 z-40 transform -translate-x-1/2"
            >
              <motion.div 
                className="relative"
                initial={{ 
                  scale: 0.3
                }}
                animate={{ 
                  scale: 1
                }}
                exit={{ 
                  scale: 0.3
                }}
                transition={{ 
                  delay: 0.2, 
                  type: "spring", 
                  stiffness: 150,
                  damping: 12
                }}
              >
                <div className="absolute inset-0"></div>
                <div className="relative p-3">
                  <CustomColorDemo />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Navbar