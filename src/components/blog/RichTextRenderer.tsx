'use client'

import { useEffect } from 'react'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { cn } from '@/lib/utils'

interface RichTextRendererProps {
  content: string
  className?: string
}

export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  useEffect(() => {
    // Highlight code blocks
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement)
    })
  }, [content])

  return (
    <div 
      className={cn(
        'prose prose-lg max-w-none dark:prose-invert',
        'prose-headings:scroll-mt-24', // For anchor links
        'prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4',
        'prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-3 prose-h2:mt-8 prose-h2:scroll-mt-24',
        'prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-2 prose-h3:mt-6',
        'prose-p:leading-relaxed prose-p:mb-4',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-secondary/30 prose-blockquote:py-1 prose-blockquote:rounded-r',
        'prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
        'prose-pre:bg-gray-900 prose-pre:rounded-lg prose-pre:p-4',
        'prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4',
        'prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4',
        'prose-li:mb-1',
        'prose-table:border prose-table:border-border prose-table:rounded-lg prose-table:w-full',
        'prose-thead:bg-secondary',
        'prose-th:border prose-th:border-border prose-th:p-3 prose-th:text-left',
        'prose-td:border prose-td:border-border prose-td:p-3',
        'prose-img:rounded-lg prose-img:shadow-lg prose-img:mx-auto',
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}