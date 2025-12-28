/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Shield,
  UserCheck,
  Mail,
  Calendar,
} from 'lucide-react'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import { formatDate } from '@/lib/utils'
import UserActions from '@/components/admin/UserActions'

export const metadata: Metadata = {
  title: 'User Management | Admin | LiveLearnLeverage',
}

async function getUsers() {
  await dbConnect()

  const users = await User.find()
    .sort({ createdAt: -1 })
    .select('-password') // Don't return passwords
    .lean()

  return JSON.parse(JSON.stringify(users))
}

export default async function UserManagementPage() {
  const users = await getUsers()

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-500">Admin</Badge>
      case 'editor':
        return <Badge className="bg-blue-500">Editor</Badge>
      default:
        return <Badge variant="outline">User</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold">
            {users.length}
          </div>
          <div className="text-sm text-muted-foreground">
            Total Users
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold">
            {users.filter((u: any) => u.role === 'admin').length}
          </div>
          <div className="text-sm text-muted-foreground">
            Administrators
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold">
            {users.filter((u: any) => u.role === 'editor').length}
          </div>
          <div className="text-sm text-muted-foreground">
            Editors
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold">
            {users.filter((u: any) => !u.role || u.role === 'user').length}
          </div>
          <div className="text-sm text-muted-foreground">
            Regular Users
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Shield className="mr-2 h-4 w-4" />
          Filter by Role
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-medium">{user.name || 'Unnamed User'}</p>
                      <p className="text-xs text-muted-foreground">
                        User ID: {user._id.toString().slice(-8)}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getRoleBadge(user.role)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {formatDate(user.createdAt)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <UserCheck className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <UserActions user={user} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {users.length} of {users.length} users
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}