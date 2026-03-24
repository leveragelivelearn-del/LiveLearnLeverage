'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

interface ImageCarouselProps {
  images: Array<{
    imageUrl: string
    caption?: string
  }>
  className?: string
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 800 : -800,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 800 : -800,
    opacity: 0,
    scale: 0.95
  })
}

export function ImageCarousel({ images, className = '' }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  const goToNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }, [images.length])

  const goToPrevious = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  // Auto-slide effect stops on hover or when dialog is open
  useEffect(() => {
    if (isHovered || isDialogOpen) return;

    const interval = setInterval(goToNext, 4000)
    return () => clearInterval(interval)
  }, [isHovered, isDialogOpen, goToNext])

  // Center active thumbnail without jumping the page
  useEffect(() => {
    const container = thumbnailContainerRef.current
    const thumbnail = thumbnailRefs.current[currentIndex]
    
    if (container && thumbnail) {
      const scrollLeft = 
        thumbnail.offsetLeft - 
        container.offsetWidth / 2 + 
        thumbnail.offsetWidth / 2

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      })
    }
  }, [currentIndex])

  const onDragEnd = (event: any, info: any) => {
    const threshold = 50
    const velocity = info.velocity.x
    const offset = info.offset.x

    if (offset < -threshold || velocity < -500) {
      goToNext()
    } else if (offset > threshold || velocity > 500) {
      goToPrevious()
    }
  }

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-secondary">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={onDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <Image
              src={images[currentIndex].imageUrl}
              alt={images[currentIndex].caption || 'Deal slide'}
              fill
              className="object-contain pointer-events-none"
            />
          </motion.div>
        </AnimatePresence>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div 
              className="absolute inset-0 z-10 cursor-pointer" 
              aria-label="Open fullscreen" 
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsDialogOpen(true);
                }
              }}
            />
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <div className="relative h-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10 bg-black/50 text-white hover:bg-black/70"
                onClick={() => setIsDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="relative h-[80vh] w-full">
                <Image
                  src={images[currentIndex].imageUrl}
                  alt={images[currentIndex].caption || 'Deal slide'}
                  fill
                  className="object-contain"
                />
              </div>
              
              {images[currentIndex].caption && (
                <div className="p-4 bg-background border-t">
                  <p className="text-sm text-muted-foreground">
                    {images[currentIndex].caption}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Navigation Buttons - Moved inside container for better centering */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity duration-300 z-20 h-8 w-8 rounded-full"
          onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity duration-300 z-20 h-8 w-8 rounded-full"
          onClick={(e) => { e.stopPropagation(); goToNext(); }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>



      {/* Thumbnails */}
      {images.length > 1 && (
        <div 
          ref={thumbnailContainerRef}
          className="mt-4 flex gap-2 overflow-x-auto py-2 scrollbar-hide"
        >
          {images.map((image, index) => (
            <button
              key={index}
              ref={el => { thumbnailRefs.current[index] = el }}
              onClick={() => goToSlide(index)}
              className={`relative flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all ${
                index === currentIndex 
                  ? 'border-primary' 
                  : 'border-transparent hover:border-primary/50'
              }`}
            >
              <Image
                src={image.imageUrl}
                alt={image.caption || `Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}