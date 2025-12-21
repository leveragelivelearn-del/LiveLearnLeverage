/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { ModelCard } from './ModelCard'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface ModelGridProps {
  initialModels: any[]
}

export function ModelGrid({ initialModels }: ModelGridProps) {
  const [models] = useState(initialModels)
  const [filteredModels, setFilteredModels] = useState(initialModels)
  const [filters, setFilters] = useState({
    search: '',
    industry: 'all',
    dealType: 'all',
    minSize: 0,
    maxSize: 1000000000,
    sortBy: 'newest',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)
  
  const itemsPerPage = 9

  // Apply filters whenever filters change
  useEffect(() => {
    // Don't show loading on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      // Use setTimeout to avoid synchronous state update
      const timer = setTimeout(() => {
        setIsLoading(true)
      }, 0)
      
      return () => clearTimeout(timer)
    }
    
    // Debounce filter application
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current)
    }
    
    filterTimeoutRef.current = setTimeout(() => {
      let result = [...models]
      
      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        result = result.filter(model => 
          model.title.toLowerCase().includes(searchLower) ||
          (model.description && model.description.toLowerCase().includes(searchLower)) ||
          (model.industry && model.industry.toLowerCase().includes(searchLower))
        )
      }
      
      // Apply industry filter
      if (filters.industry !== 'all') {
        result = result.filter(model => 
          model.industry === filters.industry
        )
      }
      
      // Apply deal type filter
      if (filters.dealType !== 'all') {
        result = result.filter(model => 
          model.dealType === filters.dealType
        )
      }
      
      // Apply deal size filter
      result = result.filter(model => 
        model.dealSize >= filters.minSize && 
        model.dealSize <= filters.maxSize
      )
      
      // Apply sorting
      switch (filters.sortBy) {
        case 'newest':
          result.sort((a, b) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime())
          break
        case 'oldest':
          result.sort((a, b) => new Date(a.completionDate).getTime() - new Date(b.completionDate).getTime())
          break
        case 'size-high':
          result.sort((a, b) => b.dealSize - a.dealSize)
          break
        case 'size-low':
          result.sort((a, b) => a.dealSize - b.dealSize)
          break
      }
      
      setFilteredModels(result)
      setCurrentPage(1)
      
      // Use setTimeout to avoid synchronous state update
      setTimeout(() => {
        setIsLoading(false)
      }, 0)
    }, 100) // Debounce delay
    
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current)
      }
    }
  }, [filters, models])

  // Use useMemo for pagination calculations instead of recalculating on every render
  const { totalPages, startIndex, endIndex, currentModels } = useMemo(() => {
    const totalPages = Math.ceil(filteredModels.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentModels = filteredModels.slice(startIndex, endIndex)
    
    return { totalPages, startIndex, endIndex, currentModels }
  }, [filteredModels, currentPage, itemsPerPage])

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      industry: 'all',
      dealType: 'all',
      minSize: 0,
      maxSize: 1000000000,
      sortBy: 'newest',
    })
  }

  return (
    <div className="space-y-8">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {Math.min(currentModels.length, itemsPerPage)} of {filteredModels.length} deals
        </p>
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Models Grid */}
          {currentModels.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentModels.map((model) => (
                  <ModelCard key={model._id} model={model} />
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
                No deals found matching your filters.
              </div>
              <Button
                variant="outline"
                onClick={clearFilters}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}