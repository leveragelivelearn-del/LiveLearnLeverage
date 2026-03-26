"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MoreVertical, Edit, Trash, Settings, Plus, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import Swal from 'sweetalert2'

interface BlogAdminActionsProps {
  blogSlug: string
  blogId: string
  isAdmin: boolean
}

export function BlogAdminActions({ blogSlug, blogId, isAdmin }: BlogAdminActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isAdmin) return null

  if (!mounted) {
    return (
      <div className="flex items-center">
        <Button disabled variant="ghost" size="icon" className="h-9 w-9 bg-transparent border-0 text-white/50">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      background: '#1f2937',
      color: '#fff'
    })

    if (result.isConfirmed) {
      setIsDeleting(true)
      try {
        const response = await fetch(`/api/admin/blog/${blogId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          toast.success("Blog post deleted successfully")
          router.push("/blog")
          router.refresh()
        } else {
          try {
            const error = await response.json()
            toast.error(error.error || "Failed to delete blog post")
          } catch (e) {
            const textError = await response.text()
            toast.error(textError || "Failed to delete blog post")
          }
        }
      } catch (error) {
        toast.error("An error occurred while deleting the blog post")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label="Open blog actions" variant="ghost" size="icon" className="h-9 w-9 bg-transparent border-0 outline-none focus-visible:ring-0 text-white hover:bg-white/20 transition-colors">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href={`/admin/blog/edit/${blogSlug}`} className="cursor-pointer flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit Article</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/blog" className="cursor-pointer flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Manage Blogs</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/blog/new" className="cursor-pointer flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              <span>Create New</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer">
            <Trash className="mr-2 h-4 w-4" />
            <span>{isDeleting ? "Deleting..." : "Delete Article"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
