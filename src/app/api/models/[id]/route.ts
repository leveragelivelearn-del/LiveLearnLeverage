import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Model from '@/models/Model'

interface Params {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await dbConnect()
    
    const model = await Model.findOne({ slug: params.id }).lean()
    
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