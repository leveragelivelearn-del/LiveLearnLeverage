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

    // Initialize count to 0
    let count = 0

    switch (action) {
      case 'delete':
        const deleteResult = await ModelClass.deleteMany({ _id: { $in: ids } })
        count = deleteResult.deletedCount || 0
        break
      case 'publish':
        const publishResult = await ModelClass.updateMany(
          { _id: { $in: ids } },
          { 
            status: 'published',
            publishedAt: new Date(),
            published: true
          }
        )
        count = publishResult.modifiedCount
        break
      case 'archive':
        const archiveResult = await ModelClass.updateMany(
          { _id: { $in: ids } },
          { status: 'archived' }
        )
        count = archiveResult.modifiedCount
        break
      case 'draft':
        const draftResult = await ModelClass.updateMany(
          { _id: { $in: ids } },
          { status: 'draft' }
        )
        count = draftResult.modifiedCount
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ${action}ed ${count} items`,
      count: count,
    })
  } catch (error) {
    console.error('Bulk operation error:', error)
    return NextResponse.json(
      { error: 'Failed to perform bulk operation' },
      { status: 500 }
    )
  }
}