/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next'
import { BlogGrid } from '@/components/blog/BlogGrid'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { NewsletterForm } from '@/components/blog/NewsletterForm'
import { Button } from '@/components/ui/button'
import { Search, TrendingUp, BookOpen, Calendar } from 'lucide-react'
import dbConnect from '@/lib/db'
import Blog from '@/models/Blog'
import User from '@/models/User'

export const metadata: Metadata = {
  title: 'Finance & M&A Insights | Blog | LiveLearnLeverage',
  description: 'Read expert articles on finance, M&A trends, deal analysis, and investment strategies from industry professionals.',
}

async function getBlogData() {
  await dbConnect()
  
  // Get all published blog posts with author data
  const blogs = await Blog.find({ published: true })
    .sort({ publishedAt: -1 })
    .select('title slug excerpt featuredImage tags category publishedAt readTime views')
    .populate('author', 'name image')
    .lean()
  
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
  .select('title slug views')
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
    blogs: JSON.parse(JSON.stringify(blogs)),
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
      <section className="relative py-12 md:py-20 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm font-medium">Insights & Analysis</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold">
              Finance & M&A Insights
            </h1>
            <p className="text-xl text-muted-foreground">
              Expert analysis, industry trends, and strategic insights on mergers & acquisitions, 
              financial modeling, and investment strategies.
            </p>
            
            <div className="pt-4">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search articles..."
                  className="w-full pl-11 pr-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {blogs.length}
              </div>
              <div className="text-sm text-muted-foreground">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {categories.length}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {blogs.reduce((sum: number, blog: any) => sum + (blog.readTime || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Minutes of Reading</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {blogs.reduce((sum: number, blog: any) => sum + (blog.views || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Blog Posts */}
            <div className="lg:w-2/3">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Latest Articles</h2>
                    <p className="text-muted-foreground">
                      Fresh insights and analysis
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Most Popular
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Archive
                    </Button>
                  </div>
                </div>
                
                <BlogGrid initialBlogs={blogs} />
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3">
              <BlogSidebar 
                categories={categories}
                tags={tags}
                popularPosts={popularPosts}
                archiveMonths={archiveMonths}
              />
            </div>
          </div>
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