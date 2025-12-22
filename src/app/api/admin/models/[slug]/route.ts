/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import Model from '@/models/Model'

// Next.js 15+ Params Interface
interface Params {
  params: Promise<{
    slug: string
  }>
}

// 1. DELETE - Deletes by ID (since your frontend sends the ID)
export async function DELETE(request: NextRequest, props: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await props.params
    await dbConnect()

    // Even though the folder is named [slug], the value passed here is an ID
    const deletedModel = await Model.findByIdAndDelete(params.slug)

    if (!deletedModel) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Model deleted successfully' })
  } catch (error) {
    console.error('Error deleting model:', error)
    return NextResponse.json({ error: 'Failed to delete model' }, { status: 500 })
  }
}

// 2. GET - Finds by Slug (Useful for the Edit Page)
export async function GET(request: NextRequest, props: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await props.params
    await dbConnect()

    const model = await Model.findOne({ slug: params.slug })

    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 })
    }

    return NextResponse.json({ model })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch model' }, { status: 500 })
  }
}

// 3. PUT - Updates by Slug (For the Edit Page)
export async function PUT(request: NextRequest, props: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await props.params
    await dbConnect()
    
    const data = await request.json()
    
    // Prevent modifying immutable fields
    delete data._id
    delete data.createdAt

    // Find by slug and update
    const updatedModel = await Model.findOneAndUpdate(
      { slug: params.slug },
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    if (!updatedModel) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 })
    }

    return NextResponse.json({ model: updatedModel })
  } catch (error: any) {
    console.error('Error updating model:', error)
    return NextResponse.json({ error: error.message || 'Failed to update model' }, { status: 500 })
  }
}