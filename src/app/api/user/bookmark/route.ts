/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import Blog from '@/models/Blog'

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { blogId } = await request.json()

        if (!blogId) {
            return NextResponse.json({ error: 'Blog ID required' }, { status: 400 })
        }

        await dbConnect()

        const user = await User.findById(session.user.id)
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const isBookmarked = user.bookmarks.includes(blogId)

        if (isBookmarked) {
            // Remove
            user.bookmarks = user.bookmarks.filter((id: any) => id.toString() !== blogId)
        } else {
            // Add
            user.bookmarks.push(blogId)
        }

        await user.save()

        return NextResponse.json({
            bookmarked: !isBookmarked,
            message: isBookmarked ? 'Bookmark removed' : 'Bookmark added'
        })

    } catch (error) {
        console.error('Error toggling bookmark:', error)
        return NextResponse.json(
            { error: 'Failed to toggle bookmark' },
            { status: 500 }
        )
    }
}
