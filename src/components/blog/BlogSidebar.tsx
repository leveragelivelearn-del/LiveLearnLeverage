'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Calendar } from 'lucide-react'

interface BlogSidebarProps {
  tags: string[]
  popularPosts: Array<{
    title: string
    slug: string
    views: number
    featuredImage: string
    publishedAt: string | Date
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
  tags,
  popularPosts,
  archiveMonths
}: BlogSidebarProps) {
  const formatMonth = (year: number, month: number) => {
    const date = new Date(year, month - 1)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const formatDate = (dateInput: string | Date) => {
    if (!dateInput) return ''
    const date = new Date(dateInput)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Popular Posts */}
      {popularPosts.length > 0 && (
        <Card className="border-none shadow-sm dark:bg-[#111111]">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Popular Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {popularPosts.map((post) => (
                <div key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex gap-4 group transition-colors"
                  >
                    {post.featuredImage && (
                      <div className="relative w-28 aspect-[1024/572] flex-shrink-0 overflow-hidden rounded-sm">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="line-clamp-2 mb-1 text-[14px] leading-tight group-hover:text-primary transition-colors">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span>•</span>
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