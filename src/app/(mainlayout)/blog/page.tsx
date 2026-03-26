/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next'
import Image from 'next/image'
import { Suspense } from 'react'
import BlogContent from './BlogContent'
import { getBaseUrl } from '@/lib/utils'
import { BackgroundLines } from '@/components/ui/background-lines'

export const metadata: Metadata = {
  title: 'Finance & M&A Insights',
  description: 'Read expert articles on finance, M&A trends, deal analysis, and investment strategies from industry professionals.',
}

async function getBlogData(page: number = 1, limit: number = 12) {
  try {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/api/blog?page=${page}&limit=${limit}&includeMeta=true`, {
      cache: 'force-cache',
      next: { tags: ['blogs'] }
    })

    if (!response.ok) throw new Error('Failed to fetch blog data')

    const data = await response.json()
    return {
      blogs: data.blogs || [],
      categories: data.categories || [],
      tags: data.tags || [],
      popularPosts: data.popularPosts || [],
      archiveMonths: data.archiveMonths || [],
      pagination: data.pagination || { page, limit, total: 0, pages: 1 }
    }
  } catch (error) {
    console.error('Error in getBlogData:', error)
    return {
      blogs: [],
      categories: [],
      tags: [],
      popularPosts: [],
      archiveMonths: [],
      pagination: { page, limit, total: 0, pages: 1 }
    }
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const pageStr = typeof params.page === 'string' ? params.page : '1';
  const page = Math.max(1, parseInt(pageStr) || 1);
  const limit = 12;

  const { blogs, categories, tags, popularPosts, archiveMonths, pagination } = await getBlogData(page, limit)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <BackgroundLines className="relative pb-12 pt-20 md:pb-20 md:pt-40 overflow-hidden flex flex-col items-center justify-center">
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-5xl mx-auto text-center space-y-6">

            <h1 className="text-2xl md:text-6xl font-bold tracking-tight text-white">
              Finance & M&A Insights
            </h1>
            <p className="text-sm md:text-lg text-gray-200">
              Expert analysis, industry trends, and strategic insights on mergers & acquisitions,
              financial modeling, and investment strategies.
            </p>


          </div>
        </div>
      </BackgroundLines>

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
              initialPagination={pagination}
            />
          </Suspense>
        </div>
      </section>

    </div>
  )
}