import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { currentPassword, newPassword } = await req.json()

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { message: 'Current and new password are required' },
                { status: 400 }
            )
        }

        await dbConnect()

        // Fetch user with password
        const user = await User.findById(session.user.id).select('+password')

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password)

        if (!isMatch) {
            return NextResponse.json(
                { message: 'Incorrect current password' },
                { status: 400 }
            )
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Update password
        user.password = hashedPassword
        await user.save()

        return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 })
    } catch (error) {
        console.error('Password change error:', error)
        return NextResponse.json(
            { message: 'Something went wrong' },
            { status: 500 }
        )
    }
}
