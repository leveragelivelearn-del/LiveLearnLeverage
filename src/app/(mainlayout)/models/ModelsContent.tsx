/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; 

import { useState } from "react";
import { ModelGrid } from "@/components/models/ModelGrid";
import { FilterBar } from "@/components/models/FilterBar";

interface ModelsContentProps {
  initialModels: any[];
  industries: string[];
}

export default function ModelsContent({ initialModels, industries }: ModelsContentProps) {
  const [filteredModels, setFilteredModels] = useState(initialModels);
  
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

  const handleFilterChange = async (newFilters: any) => {
    // Only set loading to true when fetching NEW data
    setLoading(true);
    
    try {
      const safeNewFilters = typeof newFilters === 'object' ? newFilters : {};
      const currentFilters = { ...activeFilters, ...safeNewFilters };
      
      setActiveFilters(currentFilters);

      const params = new URLSearchParams();
      
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
      
      setFilteredModels(data.models || []); 
      
    } catch (error) {
      console.error("Error filtering models:", error);
    } finally {
      setLoading(false);
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
      </main>
    </div>
  );
}