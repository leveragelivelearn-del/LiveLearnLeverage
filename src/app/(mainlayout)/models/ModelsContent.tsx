/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; 

import { useState } from "react";
import { ModelGrid } from "@/components/models/ModelGrid";
import { FilterBar } from "@/components/models/FilterBar";
import { Pagination } from "@/components/models/Pagination";

interface ModelsContentProps {
  initialModels: any[];
  industries: string[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function ModelsContent({ initialModels, industries, initialPagination }: ModelsContentProps) {
  const [filteredModels, setFilteredModels] = useState(initialModels);
  const [pagination, setPagination] = useState(initialPagination);
  
  // FIX: Loading must be FALSE initially because we have ISR data
  const [loading, setLoading] = useState(false);
  
  const [activeFilters, setActiveFilters] = useState({
    industry: "",
    dealType: "",
    search: "",
    minSize: 0,
    maxSize: 1000000000,
    sortBy: "newest"
  });

  const handleFilterChange = async (newFilters: any, page: number = 1) => {
    // Only set loading to true when fetching NEW data
    setLoading(true);
    
    try {
      const safeNewFilters = typeof newFilters === 'object' ? newFilters : {};
      const currentFilters = { ...activeFilters, ...safeNewFilters };
      
      setActiveFilters(currentFilters);

      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "12");
      
      if (currentFilters.industry && !["All", "All Industries", "all"].includes(currentFilters.industry)) {
        params.append("industry", currentFilters.industry);
      }
      
      if (currentFilters.dealType && !["All", "All Types", "all"].includes(currentFilters.dealType)) {
        params.append("dealType", currentFilters.dealType);
      }
      
      if (currentFilters.search) {
        params.append("search", currentFilters.search);
      }

      if (currentFilters.minSize !== undefined) params.append("minSize", currentFilters.minSize);
      if (currentFilters.maxSize !== undefined) params.append("maxSize", currentFilters.maxSize);
      if (currentFilters.sortBy) params.append("sortBy", currentFilters.sortBy);

      console.log("Fetching /api/models with:", params.toString());

      // Fetch fresh data based on filters
      const res = await fetch(`/api/models?${params.toString()}`, {
        cache: 'no-store'
      });
      
      if (!res.ok) throw new Error("Failed to fetch");
      
      const data = await res.json();
      const models = data.models || [];
      setFilteredModels(models); 
      
      // Always update pagination, using safe defaults if missing
      setPagination(data.pagination || {
        page: 1,
        limit: 12,
        total: models.length,
        pages: Math.ceil(models.length / 12),
      });
      
    } catch (error) {
      console.error("Error filtering models:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      handleFilterChange(activeFilters, newPage);
      // Scroll to top of grid
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Sidebar (Desktop) / Top Bar (Mobile) */}
      <aside className="w-full lg:w-[280px] shrink-0 sticky top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto no-scrollbar">
        <FilterBar
          onFilterChange={handleFilterChange}
          industries={industries}
        />
      </aside>

      {/* Models Grid */}
      <main className={`flex-1 min-w-0 transition-opacity duration-200 ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
        <ModelGrid initialModels={filteredModels} />
        
        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-12">
            <Pagination 
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </main>
    </div>
  );
}