/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { BlogCard } from '@/components/blog/BlogCard'
import dbConnect from '@/lib/db'
import Blog from '@/models/Blog'
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
import ReadOnlyEditor from '@/components/tiptap-templates/simple/read-only-editor'
import { CommentSection } from '@/components/blog/CommentSection'
import { BookmarkButton } from '@/components/blog/BookmarkButton'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import User from '@/models/User'

// Correct type for Next.js 15+ dynamic params
interface BlogDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata(props: BlogDetailPageProps): Promise<Metadata> {
  const params = await props.params;
  await dbConnect()

  // FIX: Added <any> to lean() to tell TypeScript the author field is populated
  const blog = await Blog.findOne({ slug: params.slug })
    .populate('author', 'name')
    .lean<any>()

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
      publishedTime: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : undefined,
      authors: [blog.author.name], // This line caused the error, now fixed by <any>
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

  // FIX: Added <any> to lean() here as well for consistency
  const blog = await Blog.findOne({ slug })
    .populate('author', 'name image bio')
    .lean<any>()

  if (!blog || !blog.published) {
    return null
  }

  await Blog.updateOne({ _id: blog._id }, { $inc: { views: 1 } })

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
    .lean<any>() // Also treating related posts as any to handle populated author safely

  return {
    blog: JSON.parse(JSON.stringify(blog)),
    prevPost: JSON.parse(JSON.stringify(prevPost)),
    nextPost: JSON.parse(JSON.stringify(nextPost)),
    relatedPosts: JSON.parse(JSON.stringify(relatedPosts)),
  }
}

export default async function BlogDetailPage(props: BlogDetailPageProps) {
  const params = await props.params;
  const data = await getBlogPostAndRelated(params.slug)

  if (!data) {
    notFound()
  }

  const { blog, prevPost, nextPost, relatedPosts } = data



  // Check if bookmarked
  const session = await getServerSession(authOptions)
  let isBookmarked = false
  if (session?.user?.id) {
    await dbConnect()
    const user = await User.findById(session.user.id).select('bookmarks').lean()
    if (user && user.bookmarks) {
      // user.bookmarks is an array of ObjectIds, we need to convert to string for comparison
      isBookmarked = user.bookmarks.some((id: any) => id.toString() === blog._id.toString())
    }
  }

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
        url: 'https://www.livelearnleverage.org/logo.png',
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.livelearnleverage.org/blog/${blog.slug}`,
    },
  }

  const shareUrl = `https://www.livelearnleverage.org/blog/${blog.slug}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-background">
        {/* Breadcrumb Area */}
        <div className="border-b bg-secondary/10">
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
              <span className="text-foreground line-clamp-1 max-w-[200px] sm:max-w-md">
                {blog.title}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Banner Section */}
        <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center overflow-hidden py-16">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            {blog.featuredImage ? (
              <Image
                src="/assets/blogbanner.png"
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-muted" />
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-white">
            <Button variant="ghost" size="sm" asChild className="mb-2 pl-0 hover:pl-2 transition-all text-white hover:text-white/80 hover:bg-white/10">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Articles
              </Link>
            </Button>

            <div className="max-w-4xl mx-auto text-center space-y-2">

              {/* Title */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                {blog.title}
              </h1>

              {/* Meta Info Grid */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-200 py-4">
                <div className="flex items-center gap-2">
                  {blog.author.image ? (
                    <Image
                      src={blog.author.image}
                      alt={blog.author.name}
                      width={40}
                      height={40}
                      className="rounded-full border border-white/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-medium text-gray-300">Written by</span>
                    <span className="font-medium text-white">{blog.author.name}</span>
                  </div>
                </div>

                <div className="w-px h-8 bg-white/20 hidden sm:block" />

                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{formatDate(blog.publishedAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{blog.readTime} min read</span>
                </div>

                <div className="w-px h-8 bg-white/20 hidden sm:block" />

                <div className="text-white">
                  <BookmarkButton
                    blogId={blog._id.toString()}
                    initialIsBookmarked={isBookmarked}
                    className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Layout */}
        <section className="pb-20 pt-12">
          {/* FIX: Increased max-w to 7xl to allow sidebar room */}
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-12">

              {/* Article Content Column (2/3 width) */}
              <div className="lg:w-3/4">
                <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-img:rounded-xl">
                  <ReadOnlyEditor content={blog.content} />
                </article>

                {/* Bottom Tags */}
                {blog.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                      Related Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="px-3 py-1">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mobile Share Buttons (Visible only on small screens) */}
                <div className="lg:hidden mt-8">
                  <ShareButtons
                    url={shareUrl}
                    title={blog.title}
                    description={blog.excerpt}
                  />
                </div>


                {/* Comment Section */}
                <div className="mt-12 pt-8 border-t">
                  <CommentSection postId={blog._id.toString()} postType="blog" />
                </div>

                {/* Post Navigation */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prevPost ? (
                    <Link href={`/blog/${prevPost.slug}`} className="group block">
                      <Card className="h-full hover:border-primary/50 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 group-hover:text-primary">
                            <ChevronLeft className="h-4 w-4" />
                            Previous Article
                          </div>
                          <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                            {prevPost.title}
                          </h4>
                        </CardContent>
                      </Card>
                    </Link>
                  ) : <div />}

                  {nextPost && (
                    <Link href={`/blog/${nextPost.slug}`} className="group block">
                      <Card className="h-full hover:border-primary/50 transition-colors">
                        <CardContent className="p-6 text-right">
                          <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-3 group-hover:text-primary">
                            Next Article
                            <ChevronRight className="h-4 w-4" />
                          </div>
                          <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                            {nextPost.title}
                          </h4>
                        </CardContent>
                      </Card>
                    </Link>
                  )}
                </div>

              </div>

              {/* Sidebar Column (1/3 width) - Sticky */}
              <aside className="lg:w-1/4 space-y-8">
                {/* Sticky Wrapper */}
                <div className="sticky top-24 space-y-8">
                  {/* Table of Contents */}


                  {/* Desktop Share Buttons */}
                  <div className="hidden lg:block">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                      Share this article
                    </h3>
                    <ShareButtons
                      url={shareUrl}
                      title={blog.title}
                      description={blog.excerpt}
                    />
                  </div>

                  {/* Simple CTA/Ad placeholder */}
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6">
                      <h4 className="font-bold mb-2">Need Financial Models?</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Download professional M&A and valuation templates.
                      </p>
                      <Button className="w-full" size="sm" asChild>
                        <Link href="/models">Browse Models</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </aside>

            </div>
          </div>
        </section>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-secondary/20 border-t">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Related Articles</h2>
                  <p className="text-muted-foreground">More insights from {blog.category}</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/blog">View All</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((post: any) => (
                  <BlogCard key={post._id} blog={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-2">
                <CalendarDays className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold">Subscribe to our newsletter</h2>
              <p className="text-muted-foreground text-lg">
                Get the latest financial insights, M&A trends, and modeling tips delivered directly to your inbox.
              </p>

              <form className="max-w-md mx-auto flex gap-2 pt-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  required
                />
                <Button type="submit">Subscribe</Button>
              </form>
              <p className="text-xs text-muted-foreground pt-2">
                We respect your privacy. Unsubscribe at any time.
              </p>
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