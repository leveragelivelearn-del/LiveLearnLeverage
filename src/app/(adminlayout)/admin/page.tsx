/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  FileText, 
  Users, 
  Eye, 
  TrendingUp, 
  ArrowUpRight,
  Plus,
  Calendar,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import dbConnect from '@/lib/db'
import Blog from '@/models/Blog'
import Model from '@/models/Model'
import User from '@/models/User'

export const metadata: Metadata = {
  title: 'Admin Dashboard | LiveLearnLeverage',
}

async function getDashboardStats() {
  await dbConnect()
  
  const [
    totalPosts,
    totalModels,
    totalUsers,
    totalViews,
    recentPosts,
    recentModels,
  ] = await Promise.all([
    Blog.countDocuments({ published: true }),
    Model.countDocuments(),
    User.countDocuments(),
    Promise.resolve(0), // You can implement view tracking later
    Blog.find({ published: true })
      .sort({ publishedAt: -1 })
      .limit(5)
      .select('title slug publishedAt views')
      .lean(),
    Model.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title slug completionDate views')
      .lean(),
  ])

  return {
    stats: {
      posts: totalPosts,
      models: totalModels,
      users: totalUsers,
      views: totalViews,
    },
    recentPosts: JSON.parse(JSON.stringify(recentPosts)),
    recentModels: JSON.parse(JSON.stringify(recentModels)),
  }
}

export default async function AdminDashboard() {
  const { stats, recentPosts, recentModels } = await getDashboardStats()

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.posts,
      icon: FileText,
      description: 'Published articles',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Total Models',
      value: stats.models,
      icon: BarChart3,
      description: 'M&A models',
      change: '+5%',
      trend: 'up',
    },
    {
      title: 'Total Users',
      value: stats.users,
      icon: Users,
      description: 'Registered users',
      change: '+23%',
      trend: 'up',
    },
    {
      title: 'Total Views',
      value: stats.views.toLocaleString(),
      icon: Eye,
      description: 'All-time views',
      change: '+18%',
      trend: 'up',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your content.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <div className={`flex items-center text-xs ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Posts</CardTitle>
                <CardDescription>Latest published articles</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/blog">
                  View all
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post: any) => (
                <div key={post._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">
                      <Link 
                        href={`/admin/blog/edit/${post.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views?.toLocaleString() || 0} views
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/blog/${post.slug}`}>
                      View
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Models */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Models</CardTitle>
                <CardDescription>Latest M&A models</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/models">
                  View all
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentModels.map((model: any) => (
                <div key={model._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">
                      <Link 
                        href={`/admin/models/edit/${model.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {model.title}
                      </Link>
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(model.completionDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {model.views?.toLocaleString() || 0} views
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/models/${model.slug}`}>
                      View
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 justify-start" asChild>
              <Link href="/admin/blog/new">
                <FileText className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">New Blog Post</div>
                  <div className="text-xs text-muted-foreground">Write a new article</div>
                </div>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-auto py-4 justify-start" asChild>
              <Link href="/admin/models/new">
                <BarChart3 className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">New Model</div>
                  <div className="text-xs text-muted-foreground">Add M&A analysis</div>
                </div>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-auto py-4 justify-start" asChild>
              <Link href="/admin/media">
                <Eye className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Media Library</div>
                  <div className="text-xs text-muted-foreground">Manage images & files</div>
                </div>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-auto py-4 justify-start" asChild>
              <Link href="/admin/analytics">
                <TrendingUp className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Analytics</div>
                  <div className="text-xs text-muted-foreground">View insights</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}