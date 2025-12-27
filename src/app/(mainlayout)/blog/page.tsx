/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next'
import Image from 'next/image'
import { Suspense } from 'react'
import BlogContent from './BlogContent'
import { BlogSearch } from '@/components/blog/BlogSearch'
import { NewsletterForm } from '@/components/blog/NewsletterForm'
import { BookOpen } from 'lucide-react'
import dbConnect from '@/lib/db'
import Blog from '@/models/Blog'
import User from '@/models/User'

export const metadata: Metadata = {
  title: 'Finance & M&A Insights | Blog | LiveLearnLeverage',
  description: 'Read expert articles on finance, M&A trends, deal analysis, and investment strategies from industry professionals.',
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

async function getBlogData() {
  await dbConnect()

  // Get all published blog posts with author data
  const blogs = await Blog.find({ published: true })
    .sort({ publishedAt: -1 })
    .select('title slug excerpt featuredImage tags category publishedAt readTime views')
    .populate('author', 'name image')
    .lean()

  // Get user bookmarks if logged in
  const session = await getServerSession(authOptions)
  let userBookmarks: string[] = []

  if (session?.user?.id) {
    const user = await User.findById(session.user.id).select('bookmarks').lean()
    if (user && user.bookmarks) {
      userBookmarks = user.bookmarks.map((id: any) => id.toString())
    }
  }

  // Add isBookmarked status to blogs
  const blogsWithBookmarkStatus = blogs.map((blog: any) => ({
    ...blog,
    isBookmarked: userBookmarks.includes(blog._id.toString())
  }))

  // Get unique categories and tags
  const categories = await Blog.distinct('category', { published: true })
  const allTags = await Blog.distinct('tags', { published: true })

  // Get popular posts (most viewed in last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const popularPosts = await Blog.find({
    published: true,
    publishedAt: { $gte: thirtyDaysAgo }
  })
    .sort({ views: -1 })
    .limit(5)
    .select('title slug views featuredImage')
    .lean()

  // Get archive dates
  const archiveMonths = await Blog.aggregate([
    { $match: { published: true } },
    {
      $group: {
        _id: {
          year: { $year: '$publishedAt' },
          month: { $month: '$publishedAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } }
  ])

  return {
    blogs: JSON.parse(JSON.stringify(blogsWithBookmarkStatus)),
    categories: JSON.parse(JSON.stringify(categories.filter(Boolean))),
    tags: JSON.parse(JSON.stringify(allTags)),
    popularPosts: JSON.parse(JSON.stringify(popularPosts)),
    archiveMonths: JSON.parse(JSON.stringify(archiveMonths)),
  }
}

export default async function BlogPage() {
  const { blogs, categories, tags, popularPosts, archiveMonths } = await getBlogData()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/blogbanner.png"
            alt="Finance & M&A Insights Banner"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-3xl mx-auto text-center space-y-6">

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              Finance & M&A Insights
            </h1>
            <p className="text-xl text-gray-200">
              Expert analysis, industry trends, and strategic insights on mergers & acquisitions,
              financial modeling, and investment strategies.
            </p>

            <div className="pt-4">
              <Suspense fallback={<div className="h-12 bg-white/20 rounded-lg animate-pulse" />}>
                <BlogSearch />
              </Suspense>
            </div>
          </div>
        </div>
      </section>



      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Suspense fallback={<div className="h-96 bg-muted/20 animate-pulse rounded-lg" />}>
            <BlogContent
              initialBlogs={blogs}
              categories={categories}
              tags={tags}
              popularPosts={popularPosts}
              archiveMonths={archiveMonths}
            />
          </Suspense>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Stay Updated</h2>
              <p className="text-muted-foreground">
                Get the latest M&A insights and financial analysis delivered to your inbox.
              </p>
            </div>

            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  )
}