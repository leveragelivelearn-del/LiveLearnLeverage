'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
    MoreHorizontal,
    Trash2,
    UserX,
    Shield,
    UserCog,
    Check
} from 'lucide-react'
import { toast } from 'sonner' // Assuming sonner is used for toasts, based on file types in ui folder

interface UserActionsProps {
    user: {
        _id: string
        name: string
        email: string
        role: string
    }
}

export default function UserActions({ user }: UserActionsProps) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleDeleteUser = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/admin/users/${user._id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to delete user')
            }

            toast.success('User deleted successfully')
            router.refresh()
            setShowDeleteDialog(false)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRoleChange = async (newRole: string) => {
        if (user.role === newRole) return

        setIsLoading(true)
        try {
            const response = await fetch(`/api/admin/users/${user._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to update user role')
            }

            toast.success(`User role updated to ${newRole}`)
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const { data: session } = useSession()
    const isCurrentUser = session?.user?.id === user._id

    return (
        <>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger disabled={isCurrentUser}>
                            <UserCog className="mr-2 h-4 w-4" />
                            Change Role
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            {[
                                { value: 'user', label: 'User' },
                                { value: 'editor', label: 'Editor' },
                                { value: 'admin', label: 'Admin' },
                            ].map((role) => (
                                <DropdownMenuItem
                                    key={role.value}
                                    onClick={() => handleRoleChange(role.value)}
                                    disabled={isLoading}
                                >
                                    {user.role === role.value && (
                                        <Check className="mr-2 h-4 w-4" />
                                    )}
                                    <span className={user.role === role.value ? '' : 'pl-6'}>
                                        {role.label}
                                    </span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => {
                            setIsOpen(false)
                            // Just a toast for now as Disable is not implemented in backend
                            toast.info('Disable user functionality not implemented yet')
                        }}
                        disabled={isCurrentUser}
                    >
                        <UserX className="mr-2 h-4 w-4" />
                        Disable User
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => {
                            setIsOpen(false)
                            setShowDeleteDialog(true)
                        }}
                        disabled={isCurrentUser}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the user
                            account for <span className="font-semibold">{user.name || user.email}</span> and remove their data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteUser}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Deleting...' : 'Delete User'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
