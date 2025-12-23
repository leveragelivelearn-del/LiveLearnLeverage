import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Model from '@/models/Model'

export async function GET(
  request: NextRequest,
  // The second argument is the context, where params is a Promise
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()
    
    // 1. Await the params Promise to extract the slug
    const { slug } = await params;
    
    // 2. Use the unwrapped 'slug' variable
    const model = await Model.findOne({ 
      slug: { $regex: new RegExp(`^${slug}$`, "i") } 
    }).lean()
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      )
    }
    
    // Increment view count
    await Model.updateOne({ _id: model._id }, { $inc: { views: 1 } })
    
    return NextResponse.json({ model })
  } catch (error) {
    console.error('Error fetching model:', error)
    return NextResponse.json(
      { error: 'Failed to fetch model' },
      { status: 500 }
    )
  }
}