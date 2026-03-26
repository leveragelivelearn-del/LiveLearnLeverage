'use client'

import { useState } from 'react'
import { Linkedin, Facebook, Twitter, Mail, Link as LinkIcon, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface InlineShareProps {
  url: string
  title: string
  className?: string
}

export function InlineShare({ url, title, className }: InlineShareProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="hidden sm:inline text-sm font-semibold text-white whitespace-nowrap">Share:</span>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10" asChild title="Share on LinkedIn">
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10" asChild title="Share on Facebook">
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
            <Facebook className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10" asChild title="Share on Twitter">
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
            <Twitter className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10" asChild title="Share via Email">
          <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Read more: ${url}`)}`}>
            <Mail className="h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/10"
          onClick={copyToClipboard}
          title={copied ? "Copied!" : "Copy Link"}
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
