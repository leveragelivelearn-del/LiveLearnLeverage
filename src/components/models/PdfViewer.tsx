"use client"

import dynamic from 'next/dynamic'

// Dynamically import the custom viewer to prevent SSR issues with canvas/pdfjs
const ProfessionalPdfViewer = dynamic(
  () => import('./CustomPdfViewer').then((mod) => mod.CustomPdfViewer),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full rounded-xl overflow-hidden border shadow-sm flex flex-col items-center justify-center min-h-[500px] bg-muted/10 gap-4 animate-pulse">
        <div className="h-4 w-48 bg-muted rounded-md" />
        <div className="h-[400px] w-full max-w-2xl bg-white/50 rounded-lg mx-4" />
      </div>
    )
  }
)

interface PdfViewerProps {
  url: string
}

export function PdfViewer({ url }: PdfViewerProps) {
  return (
    <div data-lenis-prevent className="w-full h-full relative">
      <ProfessionalPdfViewer url={url} />
    </div>
  )
}
