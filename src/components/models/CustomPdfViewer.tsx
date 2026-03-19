'use client'

import { useState, useEffect, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

// Safely setup worker using CDN to avoid Next.js App Router bundler issues
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
}

interface CustomPdfViewerProps {
  url: string
}

export function CustomPdfViewer({ url }: CustomPdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Leave some padding for the scrollbar and border
        setContainerWidth(containerRef.current.clientWidth - 16)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    
    // Quick delay check to ensure layout is complete after render
    const to = setTimeout(handleResize, 150)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(to)
    }
  }, [])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  return (
    <div 
      className="flex flex-col items-center w-full rounded-xl overflow-hidden border shadow-sm bg-muted/10" 
      ref={containerRef}
    >
      <div className="w-full max-h-[70vh] md:max-h-[800px] overflow-y-auto overflow-x-hidden bg-muted/20 custom-scrollbar">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex justify-center items-center h-[400px] text-muted-foreground animate-pulse">
              Loading professional presentation...
            </div>
          }
          error={
            <div className="flex justify-center items-center h-[400px] text-destructive">
              Failed to load PDF presentation.
            </div>
          }
          className="flex flex-col items-center"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <div 
              key={`page_${index + 1}`} 
              className="mb-4 shadow-md border hover:border-primary/50 transition-colors bg-white overflow-hidden"
              // Render empty bounding box while loading
              style={{ minHeight: '100px', width: containerWidth > 0 ? containerWidth : '100%' }}
            >
              <Page
                pageNumber={index + 1}
                width={containerWidth > 0 ? containerWidth : undefined}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={
                  <div className="flex justify-center items-center h-full w-full text-muted-foreground/50 animate-pulse bg-white/50">
                    Loading page {index + 1}...
                  </div>
                }
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  )
}
