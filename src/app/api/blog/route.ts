/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Blog from '@/models/Blog'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const year = searchParams.get('year')
    const month = searchParams.get('month')
    const sortBy = searchParams.get('sortBy') || 'newest'
    
    // Build query
    const query: any = { published: true }
    
    if (category && category !== 'all') {
      query.category = category
    }
    
    if (tag && tag !== 'all') {
      query.tags = tag
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ]
    }
    
    if (year && month) {
      const yearNum = parseInt(year)
      const monthNum = parseInt(month)
      
      if (!isNaN(yearNum) && !isNaN(monthNum)) {
        const startDate = new Date(yearNum, monthNum - 1, 1)
        const endDate = new Date(yearNum, monthNum, 1)
        
        query.publishedAt = {
          $gte: startDate,
          $lt: endDate,
        }
      }
    }
    
    // Build sort
    let sort: any = {}
    switch (sortBy) {
      case 'newest':
        sort = { publishedAt: -1 }
        break
      case 'oldest':
        sort = { publishedAt: 1 }
        break
      case 'popular':
        sort = { views: -1 }
        break
      case 'read-time':
        sort = { readTime: -1 }
        break
      default:
        sort = { publishedAt: -1 }
    }
    
    // Get total count for pagination
    const total = await Blog.countDocuments(query)
    
    // Get paginated results
    const blogs = await Blog.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      // REMOVED: .select('-content') so content is now visible
      .populate('author', 'name image')
      .lean()
    
    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}