import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Blog from '@/models/Blog'

// FIXED: Define the type correctly for Next.js 15 (params is a Promise)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()
    
    // FIXED: Await the params Promise to extract the slug
    const { slug } = await params
    
    // Use the unwrapped 'slug' variable
    const blog = await Blog.findOne({ slug })
      .populate('author', 'name image bio')
      .lean()
    
    if (!blog || !blog.published) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }
    
    // Increment view count
    await Blog.updateOne({ _id: blog._id }, { $inc: { views: 1 } })

    // Fetch Prev/Next only if publishedAt exists
    let prevPost: any = null
    let nextPost: any = null
    
    if (blog.publishedAt) {
      [prevPost, nextPost] = await Promise.all([
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
    }
  
    // Build related posts query carefully
    const orConditions: any[] = []
    if (blog.category) {
      orConditions.push({ category: blog.category })
    }
    if (blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0) {
      orConditions.push({ tags: { $in: blog.tags } })
    }

    let relatedPosts: any[] = []
    if (orConditions.length > 0) {
      relatedPosts = await Blog.find({
        _id: { $ne: blog._id },
        published: true,
        $or: orConditions
      })
        .sort({ publishedAt: -1 })
        .limit(3)
        .populate('author', 'name image')
        .select('title slug excerpt featuredImage tags category publishedAt readTime views author')
        .lean()
    }

    return NextResponse.json({ 
      blog,
      prevPost,
      nextPost,
      relatedPosts
    })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}