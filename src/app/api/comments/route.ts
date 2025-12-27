/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import Comment from '@/models/Comment'
import User from '@/models/User' // Ensure User model is registered

// GET: Fetch comments for a specific post
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const postType = searchParams.get('postType')

    if (!postId || !postType) {
      return NextResponse.json(
        { error: 'postId and postType are required' },
        { status: 400 }
      )
    }

    await dbConnect()

    const comments = await Comment.find({
      postId,
      postType,
    })
      .populate('user', 'name image') // Populate user details (name and image)
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST: Create a new comment
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to comment.' },
        { status: 401 }
      )
    }

    const { content, postId, postType, parentId } = await request.json()

    if (!content || !postId || !postType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await dbConnect()

    const newComment = await Comment.create({
      name: session.user.name,
      email: session.user.email,
      user: session.user.id, // Link to user
      content,
      postId,
      postType,
      parentId: parentId || null,
      approved: true,
      isAdmin: session.user.role === 'admin'
    })

    // Fetch populated comment to return immediately
    const populatedComment = await Comment.findById(newComment._id).populate('user', 'name image').lean();

    return NextResponse.json(populatedComment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}

// DELETE: Remove a comment (Admin or Author only)
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get('id')

    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID required' }, { status: 400 })
    }

    await dbConnect()

    const comment = await Comment.findById(commentId)

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Allow if Admin OR if the user is the author of the comment
    const isAuthor = comment.user && comment.user.toString() === session.user.id
    const isAdmin = session.user.role === 'admin'

    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete the comment AND its replies (optional, but good practice)
    await Comment.deleteMany({
      $or: [
        { _id: commentId },
        { parentId: commentId }
      ]
    })

    return NextResponse.json({ message: 'Comment deleted' })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
