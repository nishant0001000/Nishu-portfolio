"use client"

import React from "react"
import { motion } from "framer-motion"

interface AnimatedLineProps {
  className?: string
  duration?: number
  delay?: number
}

export function AnimatedLine({ 
  className = "", 
  duration = 3, 
  delay = 0 
}: AnimatedLineProps) {
  return (
    <div className={`overflow-hidden w-full h-px ${className}`}>
      <motion.div
        animate={{ 
          x: ["-100%", "100%"]
        }}
        transition={{ 
          duration,
          repeat: Infinity,
          ease: "linear",
          delay
        }}
        className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"
      />
    </div>
  )
} 