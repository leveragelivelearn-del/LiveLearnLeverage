/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import Blog from '@/models/Blog'

// Interface for Next.js 15+ Params
interface Params {
  params: Promise<{
    slug: string
  }>
}

// 1. DELETE - Deletes by ID (Frontend usually sends ID for delete actions)
export async function DELETE(request: NextRequest, props: Params) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check Auth
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await props.params
    await dbConnect()

    // We assume the 'slug' param in the URL is actually an ID when deleting
    const deletedBlog = await Blog.findByIdAndDelete(params.slug)

    if (!deletedBlog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Blog post deleted successfully' })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}

// 2. GET - Finds by Slug (For the Edit Page to load data)
export async function GET(request: NextRequest, props: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await props.params
    await dbConnect()

    const blog = await Blog.findOne({ slug: params.slug })

    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    return NextResponse.json({ blog })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
  }
}

// 3. PUT - Updates by Slug
export async function PUT(request: NextRequest, props: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await props.params
    await dbConnect()
    
    const data = await request.json()
    
    // Prevent modifying system fields
    delete data._id
    delete data.createdAt
    delete data.author // Usually we don't change author on edit, but you can remove this line if you want to allow it

    const updatedBlog = await Blog.findOneAndUpdate(
      { slug: params.slug },
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    if (!updatedBlog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    return NextResponse.json({ blog: updatedBlog })
  } catch (error: any) {
    console.error('Error updating blog post:', error)
    // Check for duplicate key error (e.g. if changing slug to one that exists)
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}