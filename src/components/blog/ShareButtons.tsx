'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Link as LinkIcon, 
  Mail, 
  Check
} from 'lucide-react'
import { toast } from 'sonner'

interface ShareButtonsProps {
  url: string
  title: string
  description: string
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareData = {
    url,
    title,
    description,
  }

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const shareByEmail = () => {
    window.open(
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\nRead more: ${url}`)}`,
      '_blank'
    )
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  const buttons = [
    {
      icon: Facebook,
      label: 'Share on Facebook',
      onClick: shareOnFacebook,
      color: 'hover:bg-blue-500 hover:text-white',
    },
    {
      icon: Twitter,
      label: 'Share on Twitter',
      onClick: shareOnTwitter,
      color: 'hover:bg-sky-500 hover:text-white',
    },
    {
      icon: Linkedin,
      label: 'Share on LinkedIn',
      onClick: shareOnLinkedIn,
      color: 'hover:bg-blue-700 hover:text-white',
    },
    {
      icon: Mail,
      label: 'Share via Email',
      onClick: shareByEmail,
      color: 'hover:bg-gray-500 hover:text-white',
    },
    {
      icon: copied ? Check : LinkIcon,
      label: copied ? 'Copied!' : 'Copy link',
      onClick: copyToClipboard,
      color: copied ? 'bg-green-500 text-white' : 'hover:bg-gray-500 hover:text-white',
    },
  ]

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Share this article</h4>
      <div className="flex flex-wrap gap-2">
        {buttons.map((button) => (
          <Button
            key={button.label}
            variant="outline"
            size="icon"
            className={button.color}
            onClick={button.onClick}
            aria-label={button.label}
            title={button.label}
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
    </div>
  )
}