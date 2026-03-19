"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MoreVertical, Edit, Trash, Settings, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface ModelAdminActionsProps {
  modelSlug: string
  modelId: string
  isAdmin: boolean
}

export function ModelAdminActions({ modelSlug, modelId, isAdmin }: ModelAdminActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isAdmin) return null

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this model?")) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/models/${modelSlug}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Model deleted successfully")
        router.push("/models")
        router.refresh()
      } else {
        try {
          const error = await response.json()
          toast.error(error.error || "Failed to delete model")
        } catch (e) {
          const textError = await response.text()
          toast.error(textError || "Failed to delete model")
        }
      }
    } catch (error) {
      toast.error("An error occurred while deleting the model")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="absolute top-0 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label="Open model actions" variant="ghost" size="icon" className="bg-transparent border-0 outline-none focus-visible:ring-0 text-white hover:bg-white/20">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href={`/admin/models/edit/${modelSlug}`} className="cursor-pointer flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit Model</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/models" className="cursor-pointer flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Manage Models</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/models/new" className="cursor-pointer flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              <span>Create New</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer">
            <Trash className="mr-2 h-4 w-4" />
            <span>{isDeleting ? "Deleting..." : "Delete Model"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
