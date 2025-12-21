import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Comment from '@/models/Comment'
import { rateLimit } from '@/lib/rate-limit'

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 100,
})

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const searchParams = request.nextUrl.searchParams
    const postId = searchParams.get('postId')
    const postType = searchParams.get('postType')
    
    if (!postId || !postType) {
      return NextResponse.json(
        { error: 'Missing postId or postType' },
        { status: 400 }
      )
    }
    
    const comments = await Comment.find({ 
      postId, 
      postType,
      approved: true 
    })
    .sort({ createdAt: -1 })
    .lean()
    
    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = request.ip ?? '127.0.0.1'
    const isRateLimited = await limiter.check(identifier, 3) // 3 comments per minute
    
    if (isRateLimited) {
      return NextResponse.json(
        { error: 'Too many comments. Please try again later.' },
        { status: 429 }
      )
    }

    await dbConnect()
    
    const data = await request.json()
    const { name, email, content, postId, postType } = data
    
    // Validation
    if (!name || !email || !content || !postId || !postType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }
    
    // Check for spam (simple keyword check)
    const spamKeywords = ['viagra', 'casino', 'loan', 'debt', 'buy now', 'click here']
    const contentLower = content.toLowerCase()
    const isSpam = spamKeywords.some(keyword => contentLower.includes(keyword))
    
    // Create comment
    const comment = await Comment.create({
      name,
      email,
      content,
      postId,
      postType,
      approved: !isSpam, // Auto-approve non-spam comments
      likes: 0,
      createdAt: new Date(),
    })
    
    // TODO: Send notification email to admin for approval
    // TODO: Send confirmation email to user
    
    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}