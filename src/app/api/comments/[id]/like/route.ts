import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Comment from '@/models/Comment'

// FIXED: Update function signature to handle params as a Promise
export async function POST(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    
    // FIXED: Await the params Promise to get the ID
    const { id } = await params
    
    const comment = await Comment.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    ).lean()
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error liking comment:', error)
    return NextResponse.json(
      { error: 'Failed to like comment' },
      { status: 500 }
    )
  }
}