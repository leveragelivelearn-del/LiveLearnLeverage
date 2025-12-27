/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import Settings from '@/models/settings'

// GET: Fetch settings (Public or Protected depending on needs)
export async function GET() {
  try {
    await dbConnect()

    // Find the first (and only) settings document, or create default
    let settings = await Settings.findOne().lean()

    if (!settings) {
      settings = await Settings.create({})
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// POST: Update settings (Admin only)
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
    // Update the single settings document, or create if it doesn't exist
    // upsert: true creates it if it doesn't exist
    const settings = await Settings.findOneAndUpdate(
      {},
      { ...data, updatedAt: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    return NextResponse.json({
      message: 'Settings saved successfully',
      settings
    })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}