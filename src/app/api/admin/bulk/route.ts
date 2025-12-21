import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import Blog from '@/models/Blog'
import Model from '@/models/Model'

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
    const { action, ids, modelType } = data
    
    if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    let ModelClass
    switch (modelType) {
      case 'blog':
        ModelClass = Blog
        break
      case 'model':
        ModelClass = Model
        break
      default:
        return NextResponse.json(
          { error: 'Invalid model type' },
          { status: 400 }
        )
    }

    let result
    switch (action) {
      case 'delete':
        result = await ModelClass.deleteMany({ _id: { $in: ids } })
        break
      case 'publish':
        result = await ModelClass.updateMany(
          { _id: { $in: ids } },
          { 
            status: 'published',
            publishedAt: new Date(),
            published: true
          }
        )
        break
      case 'archive':
        result = await ModelClass.updateMany(
          { _id: { $in: ids } },
          { status: 'archived' }
        )
        break
      case 'draft':
        result = await ModelClass.updateMany(
          { _id: { $in: ids } },
          { status: 'draft' }
        )
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ${action}ed ${result.modifiedCount || result.deletedCount} items`,
      count: result.modifiedCount || result.deletedCount,
    })
  } catch (error) {
    console.error('Bulk operation error:', error)
    return NextResponse.json(
      { error: 'Failed to perform bulk operation' },
      { status: 500 }
    )
  }
}