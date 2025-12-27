'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, TrendingUp, Calendar, Tag, Folder } from 'lucide-react'

interface BlogSidebarProps {
  categories: string[]
  tags: string[]
  popularPosts: Array<{
    title: string
    slug: string
    views: number
    featuredImage: string
  }>
  archiveMonths: Array<{
    _id: {
      year: number
      month: number
    }
    count: number
  }>
}

export function BlogSidebar({
  categories,
  tags,
  popularPosts,
  archiveMonths
}: BlogSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Searching for:', searchQuery)
  }

  const formatMonth = (year: number, month: number) => {
    const date = new Date(year, month - 1)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="space-y-6">


      {/* Popular Posts */}
      {popularPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Popular Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularPosts.map((post) => (
                <div key={post.slug} className="border-b last:border-0 pb-4 last:pb-0">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex gap-4 group hover:text-primary transition-colors"
                  >
                    {post.featuredImage && (
                      <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-2 mb-1 text-sm">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{post.views.toLocaleString()} views</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Folder className="h-4 w-4" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={`/blog?category=${encodeURIComponent(category)}`}>
                    {category}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}


      {/* Archive */}
      {archiveMonths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Archive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {archiveMonths.map((archive) => (
                <Button
                  key={`${archive._id.year}-${archive._id.month}`}
                  variant="ghost"
                  className="w-full justify-between"
                  asChild
                >
                  <Link
                    href={`/blog?year=${archive._id.year}&month=${archive._id.month}`}
                  >
                    <span>{formatMonth(archive._id.year, archive._id.month)}</span>
                    <Badge variant="outline">{archive.count}</Badge>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}