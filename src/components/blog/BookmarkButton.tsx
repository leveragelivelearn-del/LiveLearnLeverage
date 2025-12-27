"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bookmark } from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface BookmarkButtonProps {
    blogId: string
    initialIsBookmarked?: boolean
    showText?: boolean
    className?: string
}

export function BookmarkButton({ blogId, initialIsBookmarked = false, showText = true, className }: BookmarkButtonProps) {
    const { status } = useSession()
    const router = useRouter()
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)
    const [isLoading, setIsLoading] = useState(false)

    const toggleBookmark = async (e: React.MouseEvent) => {
        // Prevent event propagation if inside a clickable card
        e.preventDefault()
        e.stopPropagation()

        if (status !== "authenticated") {
            toast.error("Please login to bookmark articles")
            router.push("/login")
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch("/api/user/bookmark", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ blogId })
            })

            if (res.ok) {
                const data = await res.json()
                setIsBookmarked(data.bookmarked)
                toast.success(data.message)
            } else {
                toast.error("Failed to update bookmark")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            size={showText ? "sm" : "icon"}
            onClick={toggleBookmark}
            disabled={isLoading}
            className={`${isBookmarked ? "text-primary border-primary/50 bg-primary/5" : ""} ${className || ""}`}
        >
            <Bookmark className={`${showText ? "mr-2" : ""} h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            {showText && (isBookmarked ? "Saved" : "Save")}
        </Button>
    )
}
