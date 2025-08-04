"use client"

import React from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"


export function Footer() {

  return (
    <footer className="relative w-full bg-gradient-to-r border-black/5 dark:border-white/5 mt-[2rem] mb-0">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] bg-[length:20px_20px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)]"></div>
      </div>

      <div className="container relative z-10 px-4 py-8 mx-auto">
        <div className="flex flex-col justify-center items-center space-y-4">
          {/* Decorative line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent dark:via-gray-600"
          />

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex justify-center items-center space-x-2 text-center"
          >
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Created with
            </span>

            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-flex justify-center items-center"
            >
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            </motion.div>

            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
              by me
            </span>
            

                         {/* Scrollbar Logo */}
             <div className="hidden relative justify-center items-center ml-2 w-8 h-8 bg-gradient-to-br rounded-full border shadow-lg backdrop-blur-sm transition-all duration-300 cursor-pointer md:flex from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 border-white/20 hover:shadow-xl group">
              <div className="flex overflow-hidden relative justify-center items-center p-1 w-full h-full bg-black rounded-full">
                <video
                  src="/videos/m-logo.mp4"
                  width={24}
                  height={24}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-lg"
                />
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent transition-transform duration-1000 ease-out -translate-x-full via-white/20 group-hover:translate-x-full"></div>
              </div>

              {/* Hover Modal - Copyright Text */}
              <div className="absolute bottom-full left-1/2 z-50 mb-2 opacity-0 transition-all duration-300 transform -translate-x-1/2 pointer-events-none group-hover:opacity-100">
                <div className="px-3 py-2 rounded-lg border border-gray-600 shadow-xl backdrop-blur-md bg-black/90">
                  <p className="text-xs text-white whitespace-nowrap">© 2025 Copyright Nishant Mogahaa</p>
                </div>
                {/* Arrow pointing down */}
                <div className="absolute top-full left-1/2 w-0 h-0 border-t-4 border-r-4 border-l-4 border-transparent transform -translate-x-1/2 border-t-black/90"></div>
              </div>
            </div>
          </motion.div>









        </div>
      </div>
       
    </footer>
  )
}


