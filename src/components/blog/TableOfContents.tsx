'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BookOpen } from 'lucide-react'

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const hasMounted = useRef(false)
  const headingExtractionTimeout = useRef<NodeJS.Timeout | null>(null)

  // Effect 1: Extract headings with cleanup and batching
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const extractHeadings = () => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(content, 'text/html')
      const headingElements = Array.from(doc.querySelectorAll('h2, h3'))
      
      const extractedHeadings = headingElements
        .map((heading) => {
          const id = heading.id || heading.textContent
            ?.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '') || ''
          
          return {
            id,
            text: heading.textContent || '',
            level: parseInt(heading.tagName.charAt(1)),
          }
        })
        .filter(h => h.id && h.text.trim() !== '')
      
      // Only update if headings have actually changed
      setHeadings(prev => {
        if (JSON.stringify(prev) === JSON.stringify(extractedHeadings)) {
          return prev
        }
        return extractedHeadings
      })
    }

    // Use requestAnimationFrame to schedule the state update
    const scheduleExtraction = () => {
      if (headingExtractionTimeout.current) {
        clearTimeout(headingExtractionTimeout.current)
      }
      
      headingExtractionTimeout.current = setTimeout(() => {
        extractHeadings()
      }, 100) // Small delay to prevent cascading updates
    }

    scheduleExtraction()

    // Cleanup function
    return () => {
      if (headingExtractionTimeout.current) {
        clearTimeout(headingExtractionTimeout.current)
        headingExtractionTimeout.current = null
      }
    }
  }, [content])

  // Effect 2: Intersection Observer for active heading
  useEffect(() => {
    if (headings.length === 0 || typeof window === 'undefined') return
    
    let observer: IntersectionObserver | null = null
    
    // Use requestAnimationFrame to delay observer setup
    const timeoutId = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Use functional update to avoid state update loops
              setActiveId(prevId => entry.target.id !== prevId ? entry.target.id : prevId)
            }
          })
        },
        { 
          root: null,
          rootMargin: '0% 0% -80% 0%',
          threshold: 0.1
        }
      )

      headings.forEach((heading) => {
        const element = document.getElementById(heading.id)
        if (element) {
          observer?.observe(element)
        }
      })
    }, 0) // Next tick

    return () => {
      clearTimeout(timeoutId)
      if (observer) {
        headings.forEach((heading) => {
          const element = document.getElementById(heading.id)
          if (element) {
            observer?.unobserve(element)
          }
        })
      }
    }
  }, [headings])

  // Early return for empty content or no headings
  if (headings.length === 0) {
    return null
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // Temporarily remove observer to prevent state updates during scroll
      setActiveId(id)
      
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="sticky top-24">
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-4 w-4" />
          <h3 className="font-semibold">Table of Contents</h3>
        </div>
        
        <ScrollArea className="h-[calc(100vh-300px)]">
          <nav className="space-y-2">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={cn(
                  'block w-full text-left text-sm transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1',
                  heading.level === 3 && 'pl-6',
                  heading.level === 4 && 'pl-8',
                  activeId === heading.id 
                    ? 'text-primary font-medium bg-primary/10' 
                    : 'text-muted-foreground'
                )}
                aria-current={activeId === heading.id ? 'location' : undefined}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  )
}