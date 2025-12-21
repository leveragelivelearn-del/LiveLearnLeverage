/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import Blog from '@/models/Blog'
import User from '@/models/User'
import { slugify } from '@/lib/utils'

interface AuthenticatedSession {
  user: {
    name: string;
    email: string;
    role: string;
    image?: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as AuthenticatedSession | null
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await dbConnect()
    
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    
    const query: any = {}
    if (status === 'published') query.published = true
    if (status === 'draft') query.published = false
    
    const total = await Blog.countDocuments(query)
    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'name')
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
    console.error('Error fetching admin blogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as AuthenticatedSession | null
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await dbConnect()
    
    const data = await request.json()
    
    // Generate slug if not provided
    if (!data.slug && data.title) {
      data.slug = slugify(data.title)
    }
    
    // Get author ID from session
    const author = await User.findOne({ email: session.user.email })
    if (author) {
      data.author = author._id
    }
    
    // Set publishedAt if publishing
    if (data.published && !data.publishedAt) {
      data.publishedAt = new Date()
    }
    
    const blog = await Blog.create(data)
    
    return NextResponse.json({ blog })
  } catch (error: any) {
    console.error('Error creating blog:', error)
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}