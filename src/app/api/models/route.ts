/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Model from '@/models/Model'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const industry = searchParams.get('industry')
    const dealType = searchParams.get('dealType')
    const search = searchParams.get('search')
    const minSize = parseFloat(searchParams.get('minSize') || '0')
    const maxSize = parseFloat(searchParams.get('maxSize') || '1000000000')
    const sortBy = searchParams.get('sortBy') || 'newest'
    
    // Build query
    const query: any = {}
    
    if (industry && industry !== 'all') {
      query.industry = industry
    }
    
    if (dealType && dealType !== 'all') {
      query.dealType = dealType
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
      ]
    }
    
    if (minSize > 0 || maxSize < 1000000000) {
      query.dealSize = { $gte: minSize, $lte: maxSize }
    }
    
    // Build sort
    let sort: any = {}
    switch (sortBy) {
      case 'newest':
        sort = { completionDate: -1 }
        break
      case 'oldest':
        sort = { completionDate: 1 }
        break
      case 'size-high':
        sort = { dealSize: -1 }
        break
      case 'size-low':
        sort = { dealSize: 1 }
        break
      default:
        sort = { completionDate: -1 }
    }
    
    // Get total count for pagination
    const total = await Model.countDocuments(query)
    
    // Get paginated results
    const models = await Model.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-rationale -keyMetrics -slides') // Exclude heavy fields
      .lean()
    
    return NextResponse.json({
      models,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}