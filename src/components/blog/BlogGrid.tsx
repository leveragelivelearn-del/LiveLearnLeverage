/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useMemo } from 'react'
import { BlogCard } from './BlogCard'
import { Button } from '@/components/ui/button'

interface BlogGridProps {
  initialBlogs: any[]
}

export function BlogGrid({ initialBlogs }: BlogGridProps) {
  const [blogs, setBlogs] = useState(initialBlogs)
  const [filters, setFilters] = useState({
    category: 'all',
    tag: 'all',
    search: '',
    sortBy: 'newest',
  })
  const [currentPage, setCurrentPage] = useState(1)
  
  const itemsPerPage = 9

  // Memoize filtered and sorted blogs
  const filteredBlogs = useMemo(() => {
    let result = [...blogs]
    
    // Apply category filter
    if (filters.category !== 'all') {
      result = result.filter(blog => blog.category === filters.category)
    }
    
    // Apply tag filter
    if (filters.tag !== 'all') {
      result = result.filter(blog => 
        blog.tags?.includes(filters.tag)
      )
    }
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(searchLower) ||
        blog.excerpt.toLowerCase().includes(searchLower) ||
        blog.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower)) ||
        blog.category?.toLowerCase().includes(searchLower)
      )
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
        break
      case 'popular':
        result.sort((a, b) => (b.views || 0) - (a.views || 0))
        break
      case 'read-time':
        result.sort((a, b) => (b.readTime || 0) - (a.readTime || 0))
        break
    }
    
    return result
  }, [blogs, filters])

  // Memoize current page blogs
  const currentBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredBlogs.slice(startIndex, endIndex)
  }, [filteredBlogs, currentPage, itemsPerPage])

  // Calculate total pages
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-8">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {Math.min(currentBlogs.length, itemsPerPage)} of {filteredBlogs.length} articles
        </p>
      </div>

      {/* Blog Grid */}
      {currentBlogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBlogs.map((blog, index) => (
              <BlogCard 
                key={blog._id} 
                blog={blog} 
                variant={index === 0 ? 'featured' : 'default'}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            No articles found matching your filters.
          </div>
          <Button
            variant="outline"
            onClick={() => setFilters({
              category: 'all',
              tag: 'all',
              search: '',
              sortBy: 'newest',
            })}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  )
}