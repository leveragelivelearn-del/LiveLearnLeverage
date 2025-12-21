/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RichTextRenderer } from '@/components/blog/RichTextRenderer'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { BlogCard } from '@/components/blog/BlogCard'
import dbConnect from '@/lib/db'
import Blog from '@/models/Blog'
import User from '@/models/User'
import { formatDate } from '@/lib/utils'
import { 
  ArrowLeft, 
  CalendarDays, 
  Clock, 
  User as UserIcon, 
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface BlogDetailPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  await dbConnect()
  const blog = await Blog.findOne({ slug: params.slug })
    .populate('author', 'name')
    .lean()

  if (!blog) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: `${blog.seoTitle || blog.title} | LiveLearnLeverage`,
    description: blog.seoDescription || blog.excerpt,
    openGraph: {
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt,
      type: 'article',
      publishedTime: blog.publishedAt.toISOString(),
      authors: [blog.author.name],
      tags: blog.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt,
      images: blog.featuredImage ? [blog.featuredImage] : [],
    },
  }
}

async function getBlogPostAndRelated(slug: string) {
  await dbConnect()
  
  // Get the blog post with author info
  const blog = await Blog.findOne({ slug })
    .populate('author', 'name image bio')
    .lean()
  
  if (!blog || !blog.published) {
    return null
  }
  
  // Increment view count
  await Blog.updateOne({ _id: blog._id }, { $inc: { views: 1 } })
  
  // Get previous and next posts
  const [prevPost, nextPost] = await Promise.all([
    Blog.findOne({
      published: true,
      publishedAt: { $lt: blog.publishedAt }
    })
    .sort({ publishedAt: -1 })
    .select('title slug')
    .lean(),
    
    Blog.findOne({
      published: true,
      publishedAt: { $gt: blog.publishedAt }
    })
    .sort({ publishedAt: 1 })
    .select('title slug')
    .lean(),
  ])
  
  // Get related posts (same category or tags)
  const relatedPosts = await Blog.find({
    _id: { $ne: blog._id },
    published: true,
    $or: [
      { category: blog.category },
      { tags: { $in: blog.tags } }
    ]
  })
  .sort({ publishedAt: -1 })
  .limit(3)
  .populate('author', 'name image')
  .select('title slug excerpt featuredImage tags category publishedAt readTime views author')
  .lean()
  
  return {
    blog: JSON.parse(JSON.stringify(blog)),
    prevPost: JSON.parse(JSON.stringify(prevPost)),
    nextPost: JSON.parse(JSON.stringify(nextPost)),
    relatedPosts: JSON.parse(JSON.stringify(relatedPosts)),
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const data = await getBlogPostAndRelated(params.slug)
  
  if (!data) {
    notFound()
  }
  
  const { blog, prevPost, nextPost, relatedPosts } = data

  // Prepare structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.featuredImage ? [blog.featuredImage] : [],
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt,
    author: {
      '@type': 'Person',
      name: blog.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'LiveLearnLeverage',
      logo: {
        '@type': 'ImageObject',
        url: 'https://livelearnleverage.com/logo.png',
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://livelearnleverage.com/blog/${blog.slug}`,
    },
  }

  const shareUrl = `https://livelearnleverage.com/blog/${blog.slug}`

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            <span className="mx-2">/</span>
            {blog.category && (
              <>
                <Link 
                  href={`/blog?category=${encodeURIComponent(blog.category)}`}
                  className="hover:text-primary transition-colors"
                >
                  {blog.category}
                </Link>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="text-foreground line-clamp-1">{blog.title}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Button variant="ghost" size="sm" asChild className="mb-6">
                <Link href="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Link>
              </Button>
              
              <div className="space-y-6">
                {/* Category and Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  {blog.category && (
                    <Badge className="bg-primary">
                      {blog.category}
                    </Badge>
                  )}
                  {blog.tags.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  {blog.title}
                </h1>
                
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {blog.author.image && (
                      <Image
                        src={blog.author.image}
                        alt={blog.author.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-4 w-4" />
                      <span className="font-medium">{blog.author.name}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    <time dateTime={blog.publishedAt}>
                      {formatDate(blog.publishedAt)}
                    </time>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{blog.readTime} min read</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{(blog.views + 1).toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {blog.featuredImage && (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src={blog.featuredImage}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Article Content */}
              <div className="lg:w-2/3">
                <article className="prose prose-lg max-w-none">
                  <RichTextRenderer content={blog.content} />
                </article>
                
                {/* Tags */}
                {blog.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t">
                    <h3 className="text-lg font-semibold mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Share Buttons */}
                <div className="mt-12 pt-8 border-t">
                  <ShareButtons
                    url={shareUrl}
                    title={blog.title}
                    description={blog.excerpt}
                  />
                </div>
                
                {/* Author Bio */}
                <div className="mt-12 p-6 bg-secondary/30 rounded-xl">
                  <div className="flex items-start gap-4">
                    {blog.author.image && (
                      <Image
                        src={blog.author.image}
                        alt={blog.author.name}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        About {blog.author.name}
                      </h3>
                      <p className="text-muted-foreground">
                        {blog.author.bio || 'M&A professional with extensive experience in financial modeling and deal analysis.'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Navigation between posts */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prevPost && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <ChevronLeft className="h-4 w-4" />
                          Previous Article
                        </div>
                        <Link 
                          href={`/blog/${prevPost.slug}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {prevPost.title}
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                  
                  {nextPost && (
                    <Card className={!prevPost ? 'md:col-span-2' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                          Next Article
                          <ChevronRight className="h-4 w-4" />
                        </div>
                        <Link 
                          href={`/blog/${nextPost.slug}`}
                          className="font-medium hover:text-primary transition-colors block text-right"
                        >
                          {nextPost.title}
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
              
              {/* Sidebar with Table of Contents */}
              <div className="lg:w-1/3">
                <TableOfContents content={blog.content} />
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold">Related Articles</h2>
                  <p className="text-muted-foreground">
                    You might also be interested in
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((post: any) => (
                    <BlogCard key={post._id} blog={post} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Enjoyed this article?</h2>
                <p className="text-muted-foreground">
                  Subscribe to get notified about new posts and exclusive content.
                </p>
              </div>
              
              <form className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <Button type="submit" className="whitespace-nowrap">
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  No spam, unsubscribe at any time.
                </p>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

// Generate static paths for ISR
export async function generateStaticParams() {
  await dbConnect()
  const blogs = await Blog.find({ published: true }).select('slug').lean()
  
  return blogs.map((blog) => ({
    slug: blog.slug,
  }))
}