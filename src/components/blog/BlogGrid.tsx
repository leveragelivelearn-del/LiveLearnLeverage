/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useMemo } from 'react'
import { BlogCard } from './BlogCard'
import { Button } from '@/components/ui/button'

interface BlogGridProps {
  blogs: any[]
}

export function BlogGrid({ blogs }: BlogGridProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 9

  // Memoize current page blogs
  const currentBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return blogs.slice(startIndex, endIndex)
  }, [blogs, currentPage, itemsPerPage])

  // Calculate total pages
  const totalPages = Math.ceil(blogs.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reset page when blogs result changes (e.g. filter applied)
  useMemo(() => {
    setCurrentPage(1);
  }, [blogs]);

  return (
    <div className="space-y-8">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {Math.min(currentBlogs.length, itemsPerPage)} of {blogs.length} articles
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
        </div>
      )}
    </div>
  )
}