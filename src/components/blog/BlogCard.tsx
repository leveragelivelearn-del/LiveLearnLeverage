import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { BookmarkButton } from './BookmarkButton'

interface BlogCardProps {
  blog: {
    _id: string
    title: string
    slug: string
    excerpt: string
    featuredImage?: string
    author: {
      name: string
      image?: string
    }
    tags: string[]
    category?: string
    publishedAt: string
    readTime: number
    views: number
    isBookmarked?: boolean
  }
  variant?: 'default' | 'featured'
  className?: string
}

export function BlogCard({ blog, variant = 'default', className }: BlogCardProps) {
  return (
    <Card className={`group overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full !p-0 !gap-0 rounded-sm ${variant === 'featured' ? 'md:col-span-2' : ''} ${className || ''}`}>
      {blog.featuredImage && (
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {blog.category && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                {blog.category}
              </Badge>
            </div>
          )}

          <div className="absolute bottom-3 right-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <BookmarkButton
              blogId={blog._id}
              initialIsBookmarked={blog.isBookmarked}
              showText={false}
              className="bg-background/80 hover:bg-background backdrop-blur-sm text-foreground rounded-full h-9 w-9 p-0 flex items-center justify-center shadow-lg"
            />
          </div>
        </div>
      )}

      <CardHeader className="space-y-2 p-6 pb-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={blog.author.image} alt={blog.author.name} />
            <AvatarFallback>{blog.author.name.substring(0, 2).toUpperCase() || 'AN'}</AvatarFallback>          </Avatar>
          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {blog.author.name}
          </span>
        </div>


        <CardTitle className={`line-clamp-2 leading-tight group-hover:text-primary transition-colors ${variant === 'featured' ? 'text-2xl' : 'text-xl'}`}>
          <Link href={`/blog/${blog.slug}`} title={blog.title}>
            {blog.title}
          </Link>
        </CardTitle>


      </CardHeader>



      <CardFooter className="border-t p-6 bg-muted/5">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">

            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {formatDate(blog.publishedAt)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {blog.readTime} min read
            </span>
          </div>

        </div>
      </CardFooter>
    </Card>
  )
}