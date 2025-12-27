'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, BarChart3, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'

interface ModelCardProps {
  model: {
    _id: string
    title: string
    slug: string
    description: string
    dealSize: number
    currency: string
    industry: string
    dealType: string
    completionDate: string
    views: number
    featured?: boolean
    slides?: { imageUrl: string }[]
  }
}

export function ModelCard({ model }: ModelCardProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Get first 3 images only
  const slides = model.slides && model.slides.length > 0
    ? model.slides.slice(0, 3)
    : []

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent triggering the card link
    e.stopPropagation()
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <Card className="group flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50">

      {/* --- Image Carousel Section --- */}
      <div className="relative w-full h-48 bg-muted/30 overflow-hidden shrink-0">
        {slides.length > 0 ? (
          <>
            <Image
              src={slides[currentSlide].imageUrl}
              alt={`${model.title} slide ${currentSlide + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Gradient Overlay for Text Contrast if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Navigation Arrows (Only show if > 1 image) */}
            {slides.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {slides.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 w-1.5 rounded-full transition-all shadow-sm ${idx === currentSlide ? 'bg-white w-3' : 'bg-white/60'
                        }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          /* Fallback Placeholder */
          <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/20 text-muted-foreground">
            <ImageIcon className="h-10 w-10 opacity-20 mb-2" />
            <span className="text-xs font-medium opacity-40">No Preview Available</span>
          </div>
        )}

        {/* Featured Badge (Top Right) */}
        {model.featured && (
          <div className="absolute top-3 right-3 z-20">
            <Badge className="bg-primary hover:bg-primary/90 shadow-md">Featured</Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle className="line-clamp-1 text-lg leading-tight">
              <Link
                href={`/models/${model.slug}`}
                className="hover:text-primary transition-colors block"
              >
                {model.title}
              </Link>
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-[10px] px-2 h-5 font-normal">
                {model.industry}
              </Badge>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-medium text-muted-foreground">{model.dealType}</span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap bg-secondary/50 px-2 py-1 rounded-full">
            <Eye className="h-3 w-3" />
            <span>{model.views}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-5 leading-relaxed">
          {model.description}
        </p>

        <div className="grid grid-cols-2 gap-3 p-3 bg-secondary/10 rounded-lg border border-border/50">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Deal Size</span>
            <div className="text-sm font-bold text-foreground">
              {formatCurrency(model.dealSize, model.currency)}
            </div>
          </div>
          <div className="space-y-0.5 text-right">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Date</span>
            <div className="text-sm font-medium text-foreground">
              {formatDate(model.completionDate)}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-5 px-6">
        <Button className="w-full group/btn" asChild>
          <Link href={`/models/${model.slug}`}>
            <BarChart3 className="mr-2 h-4 w-4 transition-transform group-hover/btn:scale-110" />
            View Analysis
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}