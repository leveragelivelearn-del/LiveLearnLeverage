/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from '@/lib/db'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { InlineShare } from '@/components/blog/InlineShare'
import { BlogCard } from '@/components/blog/BlogCard'
import { BlogAdminActions } from '@/components/blog/BlogAdminActions'
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  User as UserIcon,
  Linkedin,
  Facebook,
  Twitter,
  Mail,
  Check
} from 'lucide-react'
import { generateHtml } from '@/lib/server-html'
import { BookmarkButton } from '@/components/blog/BookmarkButton'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import User from '@/models/User'
import Blog from '@/models/Blog'

// Correct type for Next.js 15+ dynamic params
interface BlogDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

import { getBaseUrl, formatDate } from '@/lib/utils'

async function getBlogPostAndRelated(slug: string) {
  try {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/api/blog/${slug}`, {
      cache: 'force-cache',
      next: { tags: [`blog-${slug}`, 'blogs'] }
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export async function generateMetadata(props: BlogDetailPageProps): Promise<Metadata> {
  const params = await props.params;
  const data = await getBlogPostAndRelated(params.slug)
  const blog = data?.blog

  if (!blog) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: `${blog.seoTitle || blog.title}`,
    description: blog.seoDescription || blog.excerpt,
    alternates: {
      canonical: `/blog/${blog.slug}`,
    },
    openGraph: {
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt,
      type: 'article',
      publishedTime: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : undefined,
      authors: [blog.author?.name || 'Admin'],
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

// Handled in getBlogPostAndRelated above

export default async function BlogDetailPage(props: BlogDetailPageProps) {
  const params = await props.params;
  const data = await getBlogPostAndRelated(params.slug)

  if (!data) {
    notFound()
  }

  const { blog, prevPost, nextPost, relatedPosts } = data



  // Check if bookmarked
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'editor'
  let isBookmarked = false

  try {
    if (session?.user?.id) {
      await dbConnect()
      const user = await User.findById(session.user.id).select('bookmarks').lean()
      if (user && user.bookmarks && blog?._id) {
        // user.bookmarks is an array of ObjectIds, we need to convert to string for comparison
        isBookmarked = user.bookmarks.some((id: any) => id.toString() === blog._id.toString())
      }
    }
  } catch (error) {
    console.error('Error checking bookmark status:', error)
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
      name: blog.author?.name || 'Admin',
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

      <div className="min-h-screen">
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


        {/* Main Content Layout */}
        <section className="pb-20 pt-12">
          {/* FIX: Increased max-w to 7xl to allow sidebar room */}
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col gap-12">

              {/* Article Content Column (Full width) */}
              <div className="w-full space-y-8">
                {/* Relocated Header and Meta Info */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" asChild className="pl-0 hover:pl-2 transition-all text-white hover:text-white/80 hover:bg-white/10">
                      <Link href="/blog">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Articles
                      </Link>
                    </Button>
                    <BlogAdminActions blogSlug={blog.slug} blogId={blog._id} isAdmin={isAdmin} />
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    {blog.title}
                  </h1>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap items-center gap-y-6 gap-x-8 text-sm text-gray-400 border-y border-white/10 py-6">
                    {/* Author - Always important */}
                    <div className="flex items-center gap-3">
                      {blog.author?.image ? (
                        <Image
                          src={blog.author.image}
                          alt={blog.author.name || 'Author'}
                          width={48}
                          height={48}
                          className="rounded-full border-2 border-primary/20"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                          <UserIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Written by</span>
                        <span className="font-semibold text-white text-base">
                          {blog.author?.name || 'Admin'}
                        </span>
                      </div>
                    </div>

                    <div className="hidden md:block w-px h-10 bg-white/10" />

                    {/* Desktop/Tablet side-by-side, Mobile might stack slightly or stay grid */}
                    <div className="flex gap-8 sm:gap-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Published</span>
                        <div className="flex items-center gap-2 text-white font-medium">
                          <CalendarDays className="h-4 w-4 text-primary" />
                          <span>{formatDate(blog.publishedAt)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Read Time</span>
                        <div className="flex items-center gap-2 text-white font-medium">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{blog.readTime} min read</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar (Share + Bookmark) */}
                    <div className="flex flex-wrap items-center gap-4 mt-2 sm:mt-0 md:ml-auto">
                      <InlineShare
                        url={shareUrl}
                        title={blog.title}
                      />

                      <div className="h-4 w-px bg-white/10 hidden sm:block" />

                      <BookmarkButton
                        blogId={blog._id.toString()}
                        initialIsBookmarked={isBookmarked}
                        className="rounded-full bg-white/5 border-white/10 text-white hover:bg-white/10 py-1.5 h-auto"
                      />
                    </div>
                  </div>
                </div>

                <article className="max-w-4xl mx-auto prose prose-invert lg:prose-lg bg-card p-8 rounded-2xl border border-white/10 shadow-sm prose-headings:scroll-mt-20 prose-img:rounded-2xl prose-headings:font-bold prose-a:text-primary text-foreground prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground">
                  <div
                    dangerouslySetInnerHTML={{ __html: generateHtml(blog.content) }}
                  />
                </article>



              </div>
            </div>
          </div>
        </section>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-background border-t">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Read More</h2>
                  <p className="text-muted-foreground">More insights from {blog.category}</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/blog">View All</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedPosts.map((post: any) => (
                  <BlogCard key={post._id} blog={post} />
                ))}
              </div>
            </div>
          </section>
        )}


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