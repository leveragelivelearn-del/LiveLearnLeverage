/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Users, 
  Eye, 
  TrendingUp, 
  TrendingDown,
  Download,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [loading, setLoading] = useState(true)

  // Mock data - in real app, fetch from API
  const stats = {
    totalViews: 12456,
    totalUsers: 2345,
    totalPosts: 89,
    totalModels: 34,
    viewChange: 12.5,
    userChange: 8.3,
    postChange: -2.1,
    modelChange: 5.7,
  }

  const pageViewsData = [
    { date: 'Jan 1', views: 400 },
    { date: 'Jan 8', views: 300 },
    { date: 'Jan 15', views: 700 },
    { date: 'Jan 22', views: 500 },
    { date: 'Jan 29', views: 800 },
    { date: 'Feb 5', views: 600 },
    { date: 'Feb 12', views: 900 },
  ]

  const trafficSources = [
    { name: 'Direct', value: 35, color: '#0088FE' },
    { name: 'Search', value: 25, color: '#00C49F' },
    { name: 'Social', value: 20, color: '#FFBB28' },
    { name: 'Referral', value: 15, color: '#FF8042' },
    { name: 'Email', value: 5, color: '#8884D8' },
  ]

  const topPages = [
    { page: 'Home', views: 1245, change: 12 },
    { page: 'Models Overview', views: 987, change: 8 },
    { page: 'Blog - M&A Trends', views: 876, change: 15 },
    { page: 'About', views: 654, change: -2 },
    { page: 'Contact', views: 543, change: 5 },
  ]

  const popularModels = [
    { model: 'Tech Merger 2024', views: 456, downloads: 89 },
    { model: 'Healthcare Acquisition', views: 389, downloads: 67 },
    { model: 'Fintech Investment', views: 321, downloads: 54 },
    { model: 'Energy Deal Analysis', views: 298, downloads: 43 },
    { model: 'Retail M&A', views: 265, downloads: 38 },
  ]

  const userEngagement = [
    { metric: 'Avg. Session Duration', value: '4m 32s', change: 8 },
    { metric: 'Pages per Session', value: '3.2', change: 12 },
    { metric: 'Bounce Rate', value: '42%', change: -5 },
    { metric: 'Returning Visitors', value: '38%', change: 15 },
  ]

  useEffect(() => {
    // In real app, fetch analytics data based on timeRange
    setTimeout(() => setLoading(false), 1000)
  }, [timeRange])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-10 w-48 bg-secondary rounded animate-pulse" />
          <div className="h-10 w-32 bg-secondary rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-secondary rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Track your website performance and user engagement
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Views
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalViews.toLocaleString()}
            </div>
            <div className="flex items-center text-sm mt-2">
              {stats.viewChange > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={stats.viewChange > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(stats.viewChange)}%
              </span>
              <span className="text-muted-foreground ml-2">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="flex items-center text-sm mt-2">
              {stats.userChange > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={stats.userChange > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(stats.userChange)}%
              </span>
              <span className="text-muted-foreground ml-2">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Posts
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <div className="flex items-center text-sm mt-2">
              {stats.postChange > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={stats.postChange > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(stats.postChange)}%
              </span>
              <span className="text-muted-foreground ml-2">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Models
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalModels}</div>
            <div className="flex items-center text-sm mt-2">
              {stats.modelChange > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={stats.modelChange > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(stats.modelChange)}%
              </span>
              <span className="text-muted-foreground ml-2">from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Page Views</CardTitle>
            <CardDescription>
              Total page views over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pageViewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>
              Where your visitors come from
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    // FIXED: Use 'any' type to bypass strict Recharts typing issues
                    label={(props: any) => 
                      `${props.name}: ${((props.percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  {/* FIXED: Use 'any' type for value to handle number | string | undefined */}
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Traffic']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>
              Most visited pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-secondary rounded flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{page.page}</p>
                      <p className="text-sm text-muted-foreground">
                        {page.views.toLocaleString()} views
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={page.change > 0 ? 'text-green-500' : 'text-red-500'}>
                      {page.change > 0 ? '+' : ''}{page.change}%
                    </span>
                    {page.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Models */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Models</CardTitle>
            <CardDescription>
              Most viewed and downloaded M&A models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularModels.map((model) => (
                <div key={model.model} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{model.model}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {model.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {model.downloads} downloads
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Engagement */}
      <Card>
        <CardHeader>
          <CardTitle>User Engagement</CardTitle>
          <CardDescription>
            Key engagement metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {userEngagement.map((metric) => (
              <div key={metric.metric} className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">{metric.metric}</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center">
                    {metric.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={metric.change > 0 ? 'text-green-500' : 'text-red-500'}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>Export Analytics</CardTitle>
          <CardDescription>
            Download detailed analytics reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4">
              <div className="text-left">
                <div className="font-medium">CSV Export</div>
                <div className="text-sm text-muted-foreground">
                  Raw data for spreadsheets
                </div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto py-4">
              <div className="text-left">
                <div className="font-medium">PDF Report</div>
                <div className="text-sm text-muted-foreground">
                  Formatted report with charts
                </div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto py-4">
              <div className="text-left">
                <div className="font-medium">Custom Report</div>
                <div className="text-sm text-muted-foreground">
                  Create custom analytics report
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}