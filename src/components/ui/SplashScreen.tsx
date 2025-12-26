'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Prevent scrolling while splash is visible
    if (isVisible) {
       document.body.style.overflow = 'hidden'
    } else {
       document.body.style.overflow = 'auto'
    }

    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2500) // 2.5 seconds duration

    return () => {
        clearTimeout(timer)
        document.body.style.overflow = 'auto'
    }
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050914]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="relative flex flex-col items-center justify-center">
            {/* Pulsing Circles */}
            <div className="relative flex items-center justify-center w-24 h-24">
              {/* First Circle - Darker Pink/Red */}
              <motion.div
                className="absolute w-12 h-12 rounded-full bg-[#be123c]" // rose-700
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 0
                }}
              />
              
              {/* Second Circle - Lighter - Staggered */}
              <motion.div
                className="absolute w-8 h-8 rounded-full bg-[#fb7185]" // rose-400
                animate={{ 
                  scale: [1, 1.8, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1 // Staggered delay (half of duration)
                }}
              />
            </div>

            {/* Text Reveal */}
            <motion.h1
              className="mt-8 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-red-600 tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Live Learn Leverage
            </motion.h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
