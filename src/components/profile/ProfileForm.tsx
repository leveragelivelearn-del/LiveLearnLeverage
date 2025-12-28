'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Camera, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

interface ProfileFormProps {
    user: {
        _id: string
        name: string
        email: string
        image?: string
        bio?: string
        role: string
    }
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter()
    const { update } = useSession() // Needed to update session after profile change
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [formData, setFormData] = useState({
        name: user.name || '',
        bio: user.bio || '',
        image: user.image || '',
    })

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

            // Update the NextAuth session with new data
            await update({
                ...data.user,
                name: formData.name,
                image: formData.image
            })

            toast.success('Profile updated successfully')
            router.refresh()
        } catch (error: any) {
            console.error('Update error:', error)
            toast.error(error.message || 'Failed to update profile')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Sidebar - Profile Summary & Image Upload */}
            <div className="md:col-span-1 space-y-6">
                <Card>
                    <CardHeader className="text-center">
                        <div className="relative mx-auto w-32 h-32 mb-4 group cursor-pointer">
                            <div
                                className="w-full h-full rounded-full overflow-hidden border-4 border-primary/10 relative"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {formData.image ? (
                                    <Image
                                        src={formData.image}
                                        alt={formData.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                        <User className="h-12 w-12 text-primary" />
                                    </div>
                                )}

                                {/* Overlay on hover or when uploading */}
                                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    {isUploading ? (
                                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                                    ) : (
                                        <Camera className="h-8 w-8 text-white" />
                                    )}
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
                        <CardTitle className="text-xl">{formData.name || 'User'}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm text-center text-muted-foreground">
                            <p className="capitalize px-3 py-1 bg-secondary rounded-full inline-block">
                                {user.role} Account
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Content - Edit Form */}
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Settings</CardTitle>
                        <CardDescription>Update your profile information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
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

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        value={user.email}
                                        disabled
                                        className="pl-9 bg-muted/50"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Email cannot be changed. Please contact support for assistance.
                                </p>
                            </div>

                            <div className="pt-4 flex justify-end">
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
            </div>
        </div>
    )
}
