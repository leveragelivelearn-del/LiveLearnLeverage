import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import User from '@/models/User'

export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions)

        // Check if user is authenticated and is an admin
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = params

        // Prevent changing your own role
        if (session.user.id === id) {
            return NextResponse.json(
                { error: 'Cannot change your own role' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { role } = body

        if (!role || !['admin', 'editor', 'user'].includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role provided' },
                { status: 400 }
            )
        }

        await dbConnect()

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select('-password')

        if (!updatedUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ user: updatedUser })
    } catch (error) {
        console.error('Error updating user role:', error)
        return NextResponse.json(
            { error: 'Failed to update user role' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions)

        // Check if user is authenticated and is an admin
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = params

        // Prevent deleting your own account (optional but good practice)
        if (session.user.id === id) {
            return NextResponse.json(
                { error: 'Cannot delete your own account' },
                { status: 400 }
            )
        }

        await dbConnect()

        const deletedUser = await User.findByIdAndDelete(id)

        if (!deletedUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ message: 'User deleted successfully' })
    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        )
    }
}
