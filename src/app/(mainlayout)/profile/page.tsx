import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BlogCard } from '@/components/blog/BlogCard'
import { User as UserIcon, Mail, Shield, Calendar, Bookmark } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login?callbackUrl=/profile')
    }

    await dbConnect()

    // Fetch full user data including bookmarks
    const user = await User.findById(session.user.id)
        .populate({
            path: 'bookmarks',
            model: 'Blog',
            // Populate author of the bookmarked blogs for the card display
            populate: { path: 'author', select: 'name image' }
        })
        .lean() as any

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-background py-12 md:py-20">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Left Sidebar - Profile Summary */}
                    <div className="md:w-1/3">
                        <Card className="sticky top-24">
                            <CardHeader className="text-center">
                                <div className="mx-auto w-32 h-32 relative mb-4">
                                    {user.image ? (
                                        <Image
                                            src={user.image}
                                            alt={user.name}
                                            fill
                                            className="rounded-full object-cover border-4 border-primary/10"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center">
                                            <UserIcon className="h-12 w-12 text-primary" />
                                        </div>
                                    )}
                                </div>
                                <CardTitle className="text-2xl">{user.name}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 text-sm p-3 bg-secondary/20 rounded-lg">
                                    <Shield className="h-4 w-4 text-primary" />
                                    <div>
                                        <p className="font-medium">Role</p>
                                        <p className="text-muted-foreground capitalize">{user.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm p-3 bg-secondary/20 rounded-lg">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <div>
                                        <p className="font-medium">Joined</p>
                                        <p className="text-muted-foreground">{formatDate(user.createdAt)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Content - Tabs */}
                    <div className="md:w-2/3">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="w-full grid grid-cols-2 mb-8">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="bookmarks">Bookmarks ({user.bookmarks?.length || 0})</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Profile Details</CardTitle>
                                        <CardDescription>Manage your account settings and preferences.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Full Name</label>
                                                <div className="p-3 bg-secondary/20 rounded-md border">{user.name}</div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Email Address</label>
                                                <div className="p-3 bg-secondary/20 rounded-md border flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    {user.email}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Account Type</label>
                                                <div className="p-3 bg-secondary/20 rounded-md border capitalize">{user.role}</div>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t">
                                            <p className="text-sm text-muted-foreground">
                                                To update your profile information or password, please contact support or use the Google Account settings if you signed in via Google.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="bookmarks">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold flex items-center gap-2">
                                            <Bookmark className="h-5 w-5 text-primary" />
                                            Bookmarked Articles
                                        </h2>
                                    </div>

                                    {user.bookmarks && user.bookmarks.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {user.bookmarks.map((blog: any) => (
                                                <BlogCard key={blog._id} blog={{ ...blog, isBookmarked: true }} />
                                            ))}
                                        </div>
                                    ) : (
                                        <Card className="py-12 flex flex-col items-center justify-center text-center">
                                            <div className="p-4 bg-primary/10 rounded-full mb-4">
                                                <Bookmark className="h-8 w-8 text-primary" />
                                            </div>
                                            <CardTitle className="text-xl mb-2">No bookmarks yet</CardTitle>
                                            <CardDescription className="max-w-sm mb-6">
                                                It looks like you haven't saved any articles yet. Browse our blog to find interesting content to read later.
                                            </CardDescription>
                                            <Link
                                                href="/blog"
                                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                            >
                                                Browse Articles
                                            </Link>
                                        </Card>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}
