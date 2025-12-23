/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Model from '@/models/Model'

// 1. Force Dynamic to prevent caching "All" results
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    
    // Get raw params
    const industry = searchParams.get('industry')
    const dealType = searchParams.get('dealType')
    const search = searchParams.get('search')
    const minSize = parseFloat(searchParams.get('minSize') || '0')
    const maxSize = parseFloat(searchParams.get('maxSize') || '1000000000')
    const sortBy = searchParams.get('sortBy') || 'newest'
    
    console.log("API Filter Params Received:", { industry, dealType, search });

    // 2. Build Query - Logic matching Admin Page
    const query: any = {}
    
    // REMOVED: query.status = 'published' - Now showing all models
    
    // Industry Filter: Ignore 'all', 'All', 'All Industries', etc.
    if (industry && industry.trim() !== '' && 
        !['all', 'all industries', 'any'].includes(industry.toLowerCase())) {
      query.industry = industry;
    }
    
    // Deal Type Filter
    if (dealType && dealType.trim() !== '' &&
        !['all', 'all types', 'any'].includes(dealType.toLowerCase())) {
      query.dealType = dealType;
    }
    
    // Search Filter (Title OR Description OR Industry)
    if (search && search.trim() !== '') {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { industry: searchRegex },
        { dealType: searchRegex }
      ]
    }
    
    // Size Filter
    if (minSize > 0 || maxSize < 1000000000) {
      query.dealSize = { $gte: minSize, $lte: maxSize }
    }
    
    console.log("Mongo Query Object:", JSON.stringify(query, null, 2));

    // 3. Sorting
    let sort: any = {}
    switch (sortBy) {
      case 'newest': sort = { completionDate: -1 }; break
      case 'oldest': sort = { completionDate: 1 }; break
      case 'size-high': sort = { dealSize: -1 }; break
      case 'size-low': sort = { dealSize: 1 }; break
      default: sort = { completionDate: -1 }
    }
    
    // 4. Get all unique industries from ALL models (not just published)
    const industries = await Model.distinct('industry')
    
    // 5. Get total count and models
    const total = await Model.countDocuments(query)
    
    // Get ALL fields for all models (including draft)
    const models = await Model.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
    
    console.log("Models found:", models.length)
    console.log("Industries found:", industries.length)
    // Log model statuses for debugging
    if (models.length > 0) {
      console.log("Model statuses:", models.map(m => ({ title: m.title, status: m.status })))
    }
    
    return NextResponse.json({
      models,
      industries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching models API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}