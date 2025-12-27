'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { TextLoop } from '../../../components/motion-primitives/text-loop'

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
          <div className="relative flex flex-col items-center justify-center gap-6">
            {/* Logo Image */}
            <motion.div 
               className="relative w-24 h-24"
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 0.5 }}
            >
               <Image 
                 src="/assets/3.png" 
                 alt="Logo" 
                 fill 
                 className="object-contain" 
                 priority
               />
            </motion.div>

            {/* Text Loop Animation */}
            <TextLoop className='text-4xl md:text-5xl font-extrabold text-white tracking-tight'>
                 <span>Live</span>
                 <span className="text-[#e23645]">Learn</span>
                 <span>Leverage</span>
            </TextLoop>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
