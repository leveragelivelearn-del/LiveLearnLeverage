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
    
    return NextResponse.json({ blog })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}