/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import useSWR from 'swr'
import {
  Users,
  Eye,
  Download,
  Search,
  MousePointer
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

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')

  // 1. Fetch Overview Stats
  const { data: overviewData, isLoading: isLoadingOverview } = useSWR(
    `/api/analytics/overview?range=${timeRange}`,
    fetcher
  )

  // 2. Fetch Performance Charts
  const { data: performanceData, isLoading: isLoadingPerformance } = useSWR(
    `/api/analytics/performance?range=${timeRange}`,
    fetcher
  )

  // 3. Fetch Top Content & Search Queries
  const { data: contentData, isLoading: isLoadingContent } = useSWR(
    `/api/analytics/top-content?range=${timeRange}`,
    fetcher
  )

  const loading = isLoadingOverview || isLoadingPerformance || isLoadingContent

  // Fix: Check if data is valid and not an error response
  const stats = (overviewData && !overviewData.error) ? overviewData : {
    totalViews: 0,
    totalUsers: 0,
    totalEvents: 0,
    viewChange: 0,
    userChange: 0,
    eventChange: 0,
  }

  const pageViewsData = (performanceData && !performanceData.error) ? performanceData.pageViewsData || [] : []
  const trafficSources = (performanceData && !performanceData.error) ? performanceData.trafficSources || [] : []

  const topPages = (contentData && !contentData.error) ? contentData.topPages || [] : []
  const searchQueries = (contentData && !contentData.error) ? contentData.searchQueries || [] : []

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

        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Views
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.totalViews || 0).toLocaleString()}
            </div>
            <div className="flex items-center text-sm mt-2">
              <span className="text-muted-foreground">in selected period</span>
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
              {(stats.totalUsers || 0).toLocaleString()}
            </div>
            <div className="flex items-center text-sm mt-2">
              <span className="text-muted-foreground">active users</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Events
            </CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.totalEvents || 0).toLocaleString()}</div>
            <div className="flex items-center text-sm mt-2">
              <span className="text-muted-foreground">total interactions</span>
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
                    label={(props: any) =>
                      `${props.name}: ${((props.percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {trafficSources.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}`, 'Sessions']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Content & Search Queries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages (GA4)</CardTitle>
            <CardDescription>
              Most visited pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No page data available.</p>
              ) : (
                topPages.map((page: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-secondary rounded flex items-center justify-center">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <div className="max-w-[200px] md:max-w-xs truncate">
                        <p className="font-medium truncate" title={page.page}>{page.page}</p>
                        <p className="text-xs text-muted-foreground truncate" title={page.path}>
                          {page.path}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{(page.views || 0).toLocaleString()}</span>
                      <Eye className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Search Queries (GSC)</CardTitle>
            <CardDescription>
              What people search to find you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchQueries.length === 0 ? (
                <div className="text-center py-6">
                  <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    No search query data yet.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ensure GSC is verified and data is processed (takes 48h).
                  </p>
                </div>
              ) : (
                searchQueries.map((query: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-300">#{query.position?.toFixed(0) || '-'}</span>
                      </div>
                      <p className="font-medium truncate text-sm" title={query.query}>{query.query}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                      <span className="flex items-center gap-1" title="Clics">
                        <MousePointer className="h-3 w-3" />
                        {query.clicks}
                      </span>
                      <span className="flex items-center gap-1" title="Impressions">
                        <Eye className="h-3 w-3" />
                        {query.impressions}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}