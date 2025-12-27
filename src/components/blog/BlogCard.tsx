import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Clock, User } from 'lucide-react'
import { formatDate } from '@/lib/utils'

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
}

export function BlogCard({ blog, variant = 'default' }: BlogCardProps) {
  return (
    <Card className={`group overflow-hidden hover:shadow-lg transition-all duration-300 ${variant === 'featured' ? 'md:col-span-2' : ''}`}>
      {blog.featuredImage && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {blog.category && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-primary/90 text-primary-foreground">
                {blog.category}
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <CardTitle className={`line-clamp-2 ${variant === 'featured' ? 'text-xl' : 'text-lg'}`}>
            <Link
              href={`/blog/${blog.slug}`}
              className="hover:text-primary transition-colors"
            >
              {blog.title}
            </Link>
          </CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 text-sm">
              <User className="h-3 w-3" />
              {blog.author.name}
            </span>
            <span className="flex items-center gap-1 text-sm">
              <CalendarDays className="h-3 w-3" />
              {formatDate(blog.publishedAt)}
            </span>
            <span className="flex items-center gap-1 text-sm">
              <Clock className="h-3 w-3" />
              {blog.readTime} min read
            </span>
          </CardDescription>
        </div>
      </CardHeader>


      <CardFooter className="border-t pt-4">
        <div className="flex justify-between items-center w-full">

          <div className="flex gap-2">
            <BookmarkButton
              blogId={blog._id}
              initialIsBookmarked={blog.isBookmarked}
              showText={false}
            />
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/blog/${blog.slug}`}>
                Read More
              </Link>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}