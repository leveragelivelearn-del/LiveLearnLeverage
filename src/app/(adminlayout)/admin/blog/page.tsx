/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AdminSearch } from '@/components/admin/AdminSearch'
import { BulkActions } from '@/components/admin/BulkActions'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Calendar,
  Clock, 
  Filter,
  Loader2
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import Swal from 'sweetalert2'

async function getBlogPosts() {
  try {
    const response = await fetch('/api/admin/blog', {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts')
    }
    
    const data = await response.json()
    return data.blogs || []
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  // Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const data = await getBlogPosts()
      setPosts(data)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      toast.error('Failed to load blog posts')
    } finally {
      setIsLoading(false)
    }
  }

  // Client-Side Filtering Logic
  const filteredPosts = posts.filter(post => {
    // Search Filter
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())

    // Status Filter
    const matchesStatus = statusFilter === 'all' 
      ? true 
      : statusFilter === 'published' 
        ? post.published === true 
        : statusFilter === 'draft' 
          ? post.published === false 
          : post.status === statusFilter 

    // Category Filter
    const matchesCategory = categoryFilter === 'all' 
      ? true 
      : post.category === categoryFilter

    // Date Filter
    let matchesDate = true
    if (dateFilter !== 'all') {
      const postDate = new Date(post.publishedAt || post.createdAt)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - postDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (dateFilter === 'week') matchesDate = diffDays <= 7
      if (dateFilter === 'month') matchesDate = diffDays <= 30
      if (dateFilter === 'year') matchesDate = diffDays <= 365
    }

    return matchesSearch && matchesStatus && matchesCategory && matchesDate
  })

  // Bulk delete function
  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) return
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${selectedPosts.length} posts. This cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete them!'
    })

    if (!result.isConfirmed) return

    setIsProcessing(true)
    try {
      const response = await fetch('/api/admin/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          ids: selectedPosts,
          modelType: 'blog',
        }),
      })

      if (response.ok) {
        Swal.fire('Deleted!', 'Your posts have been deleted.', 'success')
        setSelectedPosts([])
        fetchPosts() 
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete posts')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete posts')
    } finally {
      setIsProcessing(false)
    }
  }

  // Bulk publish function
  const handleBulkPublish = async () => {
    if (selectedPosts.length === 0) return
    
    setIsProcessing(true)
    try {
      const response = await fetch('/api/admin/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'publish',
          ids: selectedPosts,
          modelType: 'blog',
        }),
      })

      if (response.ok) {
        toast.success(`Published ${selectedPosts.length} post(s)`)
        setSelectedPosts([])
        fetchPosts() 
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to publish posts')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to publish posts')
    } finally {
      setIsProcessing(false)
    }
  }

  // Bulk archive function
  const handleBulkArchive = async () => {
    if (selectedPosts.length === 0) return
    
    setIsProcessing(true)
    try {
      const response = await fetch('/api/admin/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'archive',
          ids: selectedPosts,
          modelType: 'blog',
        }),
      })

      if (response.ok) {
        toast.success(`Archived ${selectedPosts.length} post(s)`)
        setSelectedPosts([])
        fetchPosts() 
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to archive posts')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to archive posts')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle individual delete with SweetAlert
  const handleDelete = async (postId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/admin/blog/${postId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          Swal.fire({
            title: "Deleted!",
            text: "Your post has been deleted.",
            icon: "success"
          });
          fetchPosts() // Refresh the list
        } else {
          throw new Error('Failed to delete post')
        }
      } catch (error) {
        toast.error('Failed to delete post')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and articles
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BulkActions
            selectedItems={selectedPosts}
            totalItems={filteredPosts.length}
            onSelectAll={() => setSelectedPosts(filteredPosts.map(p => p._id))}
            onClearSelection={() => setSelectedPosts([])}
            onBulkDelete={handleBulkDelete}
            // FIXED: Pass function references directly to solve type errors
            onBulkPublish={handleBulkPublish}
            onBulkArchive={handleBulkArchive}
          />
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <AdminSearch 
            placeholder="Search posts..."
            onSearch={(query) => setSearchQuery(query)}
            onFilterClick={() => setShowFilters(!showFilters)}
            // FIXED: Hide the internal filter button to avoid duplicates
            showFilters={false} 
          />
          <Button 
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-accent" : ""}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
        
        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-md"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-md"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="M&A">M&A</option>
                    <option value="Financial Modeling">Financial Modeling</option>
                    <option value="Valuation">Valuation</option>
                    <option value="Investment Banking">Investment Banking</option>
                    <option value="Private Equity">Private Equity</option>
                    <option value="Corporate Finance">Corporate Finance</option>
                    <option value="Market Trends">Market Trends</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-md"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedPosts(filteredPosts.map(p => p._id))
                    } else {
                      setSelectedPosts([])
                    }
                  }}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Views</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No blog posts found matching your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((post: any) => (
                <TableRow key={post._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPosts.includes(post._id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedPosts([...selectedPosts, post._id])
                        } else {
                          setSelectedPosts(selectedPosts.filter(id => id !== post._id))
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div>
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="font-medium hover:text-primary transition-colors"
                          target="_blank"
                        >
                          {post.title}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime || 5} min
                          </span>
                          {post.tags?.slice(0, 2).map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.author?.name || 'Admin'}</TableCell>
                  <TableCell>
                    {post.category || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {post.publishedAt ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.publishedAt)}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.views?.toLocaleString() || 0}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/blog/edit/${post.slug}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(post._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredPosts.length} of {posts.length} posts
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}