/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Search, Filter, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

interface FilterBarProps {
  onFilterChange: (filters: any) => void
  industries: string[]
}

export function FilterBar({ onFilterChange, industries }: FilterBarProps) {
  const [filters, setFilters] = useState({
    search: '',
    industry: 'all',
    dealType: 'all',
    minSize: 0,
    maxSize: 1000000000,
    sortBy: 'newest',
  })

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const resetFilters = () => {
    const resetFilters = {
      search: '',
      industry: 'all',
      dealType: 'all',
      minSize: 0,
      maxSize: 1000000000,
      sortBy: 'newest',
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const dealTypes = [
    'Merger',
    'Acquisition',
    'Leveraged Buyout',
    'Divestiture',
    'Joint Venture',
    'Strategic Alliance',
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'size-high', label: 'Largest Deals' },
    { value: 'size-low', label: 'Smallest Deals' },
  ]

  return (
    <div className="space-y-4">
      {/* Search and Mobile Filter Trigger */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search deals by title, description, or industry..."
            className="pl-9"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="sm:hidden"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleFilterChange('sortBy', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={resetFilters}
          >
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden sm:grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-card">
        <div className="space-y-2">
          <label className="text-sm font-medium">Industry</label>
          <Select
            value={filters.industry}
            onValueChange={(value) => handleFilterChange('industry', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Deal Type</label>
          <Select
            value={filters.dealType}
            onValueChange={(value) => handleFilterChange('dealType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {dealTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Deal Size: ${(filters.minSize / 1000000).toFixed(0)}M - ${(filters.maxSize / 1000000).toFixed(0)}M
          </label>
          <Slider
            min={0}
            max={1000000000}
            step={10000000}
            value={[filters.minSize, filters.maxSize]}
            onValueChange={([min, max]: [number, number]) => {
              handleFilterChange('minSize', min)
              handleFilterChange('maxSize', max)
            }}
            className="w-full"
          />
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={resetFilters}
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Mobile Filters Sheet */}
      <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Industry</label>
              <Select
                value={filters.industry}
                onValueChange={(value) => handleFilterChange('industry', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Deal Type</label>
              <Select
                value={filters.dealType}
                onValueChange={(value) => handleFilterChange('dealType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {dealTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">
                Deal Size: ${(filters.minSize / 1000000).toFixed(0)}M - ${(filters.maxSize / 1000000).toFixed(0)}M
              </label>
              <Slider
                min={0}
                max={1000000000}
                step={10000000}
                value={[filters.minSize, filters.maxSize]}
                onValueChange={([min, max]: [number, number]) => {
                  handleFilterChange('minSize', min)
                  handleFilterChange('maxSize', max)
                }}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Sort By</label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                className="flex-1"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                Apply Filters
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={resetFilters}
              >
                Reset
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}