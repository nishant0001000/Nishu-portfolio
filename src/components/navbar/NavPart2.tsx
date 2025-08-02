"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ThemeToggleButton from "../ui/theme-toggle-button";
import { Button } from "@/components/ui/button";

interface NavPart2Props {
  onSearchToggle?: (isExpanded: boolean) => void;
}

const NavPart2 = ({ onSearchToggle }: NavPart2Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality here
    console.log("Searching for:", searchQuery);
    setIsSearchExpanded(false);
    setSearchQuery("");
    onSearchToggle?.(false);
  };

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
    onSearchToggle?.(true);
  };

  const handleSearchBlur = () => {
    // Small delay to allow for form submission
    setTimeout(() => {
      setIsSearchExpanded(false);
      setSearchQuery("");
      onSearchToggle?.(false);
    }, 200);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false);
        setSearchQuery("");
        onSearchToggle?.(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onSearchToggle]);

  return (
    <div className="flex gap-2 items-center sm:gap-4">
      {/* Desktop View - Show all elements */}
      <div className="hidden gap-2 items-center sm:flex sm:gap-4">
        {/* Expandable Search */}
        <div ref={searchRef} className="relative">
          <div className={`transition-all duration-800 ease-in-out ${isSearchExpanded ? 'w-64' : 'w-9'}`}>
            {isSearchExpanded ? (
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={handleSearchBlur}
                  placeholder="Search Projects..."
                  autoFocus
                  className="inline-flex relative justify-start items-center px-4 py-2 pr-12 w-full h-9 text-sm font-normal whitespace-nowrap rounded-full border ring-gray-400 shadow-none transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group bg-backgound text-muted-foreground focus:text-black dark:focus:text-white placeholder:text-muted-foreground focus:backdrop-blur-md focus:border-black dark:focus:border-white focus:shadow-lg focus:shadow-orange-500/20 focus:ring-2 focus:ring-orange-500/20"
                />
                <button
                  type="submit"
                  className="absolute right-[0.3rem] top-[0.4rem] h-5 w-5 flex items-center justify-center rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 lucide lucide-search">
                    <path d="m21 21-4.34-4.34"/>
                    <circle cx="11" cy="11" r="8"/>
                  </svg>
                </button>
              </form>
            ) : (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r rounded-full blur-lg transition-all duration-500 from-blue-500/20 via-purple-500/20 to-pink-500/20 group-hover:blur-xl"></div>
                <Button
                  onClick={handleSearchClick}
                  variant="ghost"
                  size="icon"
                  className="relative z-10 w-9 h-9 rounded-full border backdrop-blur-sm bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 border-black/20 dark:border-white/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300">
                    <path d="m21 21-4.34-4.34"/>
                    <circle cx="11" cy="11" r="8"/>
                  </svg>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Speech Icon */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r rounded-full blur-lg transition-all duration-500 from-blue-500/20 via-purple-500/20 to-pink-500/20 group-hover:blur-xl"></div>
          <Button
            variant="ghost"
            size="icon"
            className="relative z-10 w-9 h-9 rounded-full border backdrop-blur-sm bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 border-black/20 dark:border-white/20"
          >
            <Image src="/images/speak-dark.gif" alt="mic" width={30} height={30} className="dark:hidden" />
            <Image src="/images/speak-light.gif" alt="mic" width={30} height={30} className="hidden dark:block" />
          </Button>
        </div>

        {/* Social Links */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r rounded-full blur-lg transition-all duration-500 from-blue-500/20 via-purple-500/20 to-pink-500/20 group-hover:blur-xl"></div>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative z-10 w-9 h-9 rounded-full border backdrop-blur-sm bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 border-black/20 dark:border-white/20"
          >
            <a href="https://github.com/nishant0001000" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 438.549 438.549" className="transition-all duration-300 size-4">
                <path fill="currentColor" d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"></path>
              </svg>
            </a>
          </Button>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r rounded-full blur-lg transition-all duration-500 from-blue-500/20 via-purple-500/20 to-pink-500/20 group-hover:blur-xl"></div>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative z-10 w-9 h-9 rounded-full border backdrop-blur-sm bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 border-black/20 dark:border-white/20"
          >
            <a href="https://instagram.com/nishant_mogahaa" target="_blank" rel="noopener noreferrer">
              <svg className="transition-all duration-300 size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </Button>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r rounded-full blur-lg transition-all duration-500 from-blue-500/20 via-purple-500/20 to-pink-500/20 group-hover:blur-xl"></div>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative z-10 w-9 h-9 rounded-full border backdrop-blur-sm bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 border-black/20 dark:border-white/20"
          >
            <a href="https://twitter.com/nishant_mogahaa" target="_blank" rel="noopener noreferrer">
              <svg className="transition-all duration-300 fill-current size-3" height="23" viewBox="0 0 1200 1227" width="23" xmlns="http://www.w3.org/2000/svg">
                <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"></path>
              </svg>
            </a>
          </Button>
        </div>
        
        {/* Theme Toggle Buttons Container */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r rounded-lg blur-lg transition-all duration-500 from-blue-500/20 via-purple-500/20 to-pink-500/20 group-hover:blur-xl"></div>
          <div className="relative flex items-center gap-2 px-3 py-0.5 rounded-lg bg-black/5 dark:bg-white/5 backdrop-blur-sm border border-black/20 dark:border-white/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent transition-transform duration-1000 -translate-x-full via-black/10 dark:via-white/10 group-hover:translate-x-full"></div>
            {/* Theme Toggle Button */}
            <div className="relative z-10">
              <ThemeToggleButton />
            </div>
            
            {/* 3rd Theme Toggle Button with GIF */}
            <div className="relative z-10">
              <ThemeToggleButton 
                variant="gif"
                url="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3JwcXdzcHd5MW92NWprZXVpcTBtNXM5cG9obWh0N3I4NzFpaDE3byZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/WgsVx6C4N8tjy/giphy.gif"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View - Hamburger Menu */}
      <div className="relative sm:hidden">
        {/* Hamburger Menu Button */}
        <button
          onClick={toggleMenu}
          className="flex relative z-50 flex-col justify-center items-center w-8 h-8 cursor-pointer"
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ease-in-out mt-1 ${
              isMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ease-in-out mt-1 ${
              isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        <div
          className={`absolute right-0 top-10 w-64 bg-white/90 dark:bg-black/90 backdrop-blur-md border border-black/20 dark:border-white/20 rounded-lg shadow-xl transition-all duration-300 ease-in-out transform z-50 ${
            isMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="p-4 space-y-4">
            {/* Search Section */}
            <div className="space-y-3">
              <h3 className="pb-2 text-sm font-medium border-b text-black/80 dark:text-white/80 border-black/10 dark:border-white/10">
                Search
              </h3>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Projects..."
                  className="px-3 py-2 w-full text-black rounded-lg border bg-black/10 dark:bg-white/10 border-black/20 dark:border-white/20 dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 focus:outline-none focus:border-black/40 dark:focus:border-white/40"
        />
        <button
                  type="submit"
                  className="flex absolute top-2 right-2 justify-center items-center w-5 h-5 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"
        >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21 21-4.34-4.34"/>
            <circle cx="11" cy="11" r="8"/>
          </svg>
        </button>
      </form>
            </div>

            {/* Theme Toggle Section */}
            <div className="space-y-3">
              <h3 className="pb-2 text-sm font-medium border-b text-black/80 dark:text-white/80 border-black/10 dark:border-white/10">
                Theme Settings
              </h3>
              <div className="flex flex-row gap-2">
                <ThemeToggleButton />
                <ThemeToggleButton 
                  variant="gif"
                  url="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3JwcXdzcHd5MW92NWprZXVpcTBtNXM5cG9obWh0N3I4NzFpaDE3byZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/WgsVx6C4N8tjy/giphy.gif"
                />
              </div>
            </div>

            {/* Speech Section */}
            <div className="space-y-3">
              <h3 className="pb-2 text-sm font-medium border-b text-black/80 dark:text-white/80 border-black/10 dark:border-white/10">
                Voice
              </h3>
              <div className="flex gap-3 items-center p-2 rounded-lg transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-colors text-black/80 dark:text-white/80 group-hover:text-black dark:group-hover:text-white">
                  <path d="M15.2 20v-4.1l-1.9.2a2.3 2.3 0 0 1-2.164-2.1V8.3A5.37 5.37 0 0 1 22 8.25c0 2.8-.656 3.054-1 4.55a5.77 5.77 0 0 0-.029 2.758L22 20"/>
                  <path d="M4.2 17.8a7.5 7.5 0 0 1-.003-10.603" className="group-hover:animate-pulse group-hover:animate-bounce"/>
                  <path d="M7 15a3.5 3.5 0 0 1 .025-4.975" className="group-hover:animate-pulse group-hover:animate-bounce" style={{animationDelay: '0.1s'}}/>
                </svg>
                <span className="transition-colors text-black/80 dark:text-white/80 group-hover:text-black dark:group-hover:text-white">Voice Search</span>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="space-y-3">
              <h3 className="pb-2 text-sm font-medium border-b text-black/80 dark:text-white/80 border-black/10 dark:border-white/10">
                Social Links
              </h3>
              <div className="flex flex-col gap-3">
                <a 
                  href="https://github.com/nishant0001000" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex gap-3 items-center p-2 rounded-lg transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10 group"
                >
                  <svg viewBox="0 0 438.549 438.549" className="transition-colors size-5 text-black/80 dark:text-white/80 group-hover:text-black dark:group-hover:text-white">
                    <path fill="currentColor" d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"></path>
                  </svg>
                  <span className="transition-colors text-black/80 dark:text-white/80 group-hover:text-black dark:group-hover:text-white">GitHub</span>
                </a>
                
                <a 
                  href="https://instagram.com/nishant_mogahaa" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex gap-3 items-center p-2 rounded-lg transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10 group"
                >
                  <svg className="transition-colors size-5 text-black/80 dark:text-white/80 group-hover:text-black dark:group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
           <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
         </svg>
                  <span className="transition-colors text-black/80 dark:text-white/80 group-hover:text-black dark:group-hover:text-white">Instagram</span>
                </a>
                
                <a 
                  href="https://twitter.com/nishant_mogahaa" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex gap-3 items-center p-2 rounded-lg transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10 group"
                >
                  <svg className="transition-colors size-5 text-black/80 dark:text-white/80 group-hover:text-black dark:group-hover:text-white" height="23" viewBox="0 0 1200 1227" width="23" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"></path>
                  </svg>
                  <span className="transition-colors text-black/80 dark:text-white/80 group-hover:text-black dark:group-hover:text-white">Twitter</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Backdrop to close menu when clicking outside */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default NavPart2;
