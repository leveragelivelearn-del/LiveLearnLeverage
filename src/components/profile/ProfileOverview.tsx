'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Camera, Loader2, Save, Edit2, X } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

interface ProfileOverviewProps {
    user: {
        _id: string
        name: string
        email: string
        image?: string
        bio?: string
        role: string
    }
}

export default function ProfileOverview({ user }: ProfileOverviewProps) {
    const router = useRouter()
    const { update } = useSession()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const [formData, setFormData] = useState({
        name: user.name || '',
        bio: user.bio || '',
        image: user.image || '',
    })

    // Reset form data when cancelling edit
    const handleCancel = () => {
        setFormData({
            name: user.name || '',
            bio: user.bio || '',
            image: user.image || '',
        })
        setIsEditing(false)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setIsUploading(true)
            const uploadData = new FormData()
            uploadData.append('image', file)

            const response = await fetch('/api/user/upload', {
                method: 'POST',
                body: uploadData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed')
            }

            setFormData(prev => ({ ...prev, image: data.url }))
            toast.success('Image uploaded successfully')
        } catch (error: any) {
            console.error('Upload error:', error)
            toast.error(error.message || 'Failed to upload image')
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update profile')
            }

            await update({
                ...data.user,
                name: formData.name,
                image: formData.image
            })

            toast.success('Profile updated successfully')
            setIsEditing(false)
            router.refresh()
        } catch (error: any) {
            console.error('Update error:', error)
            toast.error(error.message || 'Failed to update profile')
        } finally {
            setIsLoading(false)
        }
    }

    if (isEditing) {
        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Edit Profile</CardTitle>
                            <CardDescription>Update your personal information</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleCancel}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Image Upload in Edit Mode */}
                        <div className="flex items-center gap-6">
                            <div className="relative group cursor-pointer inline-block" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/10 relative">
                                    {formData.image ? (
                                        <Image src={formData.image} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                            <User className="h-8 w-8 text-primary" />
                                        </div>
                                    )}
                                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                        {isUploading ? <Loader2 className="h-6 w-6 text-white animate-spin" /> : <Camera className="h-6 w-6 text-white" />}
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUploading || isLoading}
                                />
                            </div>
                            <div>
                                <p className="font-medium text-sm">Profile Picture</p>
                                <p className="text-xs text-muted-foreground mt-1">Click image to upload new.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter your full name"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell us a little about yourself"
                                className="min-h-[120px]"
                                disabled={isLoading}
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {formData.bio.length}/500 characters
                            </p>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading || isUploading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        )
    }

    // Read-Only View
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Profile Details</CardTitle>
                        <CardDescription>Manage your account settings</CardDescription>
                    </div>
                    <Button onClick={() => setIsEditing(true)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-6">
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">About</h3>
                        <div className="p-4 bg-secondary/10 rounded-lg borde text-sm leading-relaxed">
                            {user.bio || "No bio added yet."}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                            <p className="text-base font-medium">{user.name}</p>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-sm font-medium text-muted-foreground">Email Address</h3>
                            <p className="text-base font-medium flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                {user.email}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
