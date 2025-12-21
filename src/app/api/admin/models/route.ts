/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import Model from '@/models/Model'
import { slugify } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
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
    
    const total = await Model.countDocuments()
    const models = await Model.find()
      .sort({ completionDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
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
    console.error('Error fetching admin models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
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
    
    // Process slides array
    if (data.slides && Array.isArray(data.slides)) {
      data.slides = data.slides.map((slide: any, index: number) => ({
        ...slide,
        order: slide.order || index,
      }))
    }
    
    // Process key metrics
    if (data.keyMetrics && typeof data.keyMetrics === 'object') {
      data.keyMetrics = new Map(Object.entries(data.keyMetrics))
    }
    
    const model = await Model.create(data)
    
    return NextResponse.json({ model })
  } catch (error: any) {
    console.error('Error creating model:', error)
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create model' },
      { status: 500 }
    )
  }
}