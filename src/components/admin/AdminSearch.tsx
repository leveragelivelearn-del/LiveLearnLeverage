'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X, Filter } from 'lucide-react'

interface AdminSearchProps {
  placeholder?: string
  defaultValue?: string
  onSearch?: (query: string) => void
  showFilters?: boolean
  onFilterClick?: () => void
}

export function AdminSearch({
  placeholder = 'Search...',
  defaultValue = '',
  onSearch,
  showFilters = true,
  onFilterClick,
}: AdminSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(() => {
    // Initialize from URL on first render only
    const searchQuery = searchParams.get('q')
    return searchQuery || defaultValue
  })
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Debounced search function
  const debouncedSearch = useCallback((searchQuery: string) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      if (onSearch) {
        onSearch(searchQuery)
      } else {
        // Update URL
        const params = new URLSearchParams(searchParams.toString())
        if (searchQuery) {
          params.set('q', searchQuery)
        } else {
          params.delete('q')
        }
        params.set('page', '1') // Reset to first page
        router.push(`?${params.toString()}`)
      }
    }, 500)
  }, [onSearch, router, searchParams])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleChange = (value: string) => {
    setQuery(value)
    debouncedSearch(value)
  }

  const handleClear = () => {
    setQuery('')
    debouncedSearch('')
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {showFilters && onFilterClick && (
        <Button variant="outline" onClick={onFilterClick}>
          <Filter className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}