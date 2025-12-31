import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import Link from 'next/link'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BlogCard } from '@/components/blog/BlogCard'
import { Bookmark } from 'lucide-react'

import ProfileOverview from '@/components/profile/ProfileOverview'
import { ProfileSidebar } from '@/components/profile/ProfileSidebar'
import { PasswordChangeForm } from '@/components/profile/PasswordChangeForm'

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
        <div className="min-h-screen bg-background py-24">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* Left Sidebar - Persistent */}
                    <div className="w-full md:w-1/3 lg:w-1/4 sticky top-24">
                        <ProfileSidebar user={user} />
                    </div>

                    {/* Right Content */}
                    <div className="w-full md:w-2/3 lg:w-3/4">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="w-full grid grid-cols-3 mb-8">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="bookmarks">Bookmarks ({user.bookmarks?.length || 0})</TabsTrigger>
                                <TabsTrigger value="settings">Settings</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview">
                                <ProfileOverview user={user} />
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
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

                            <TabsContent value="settings">
                                <PasswordChangeForm />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}
