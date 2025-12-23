/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { ModelCard } from './ModelCard'

interface ModelGridProps {
  initialModels: any[]
}

export function ModelGrid({ initialModels }: ModelGridProps) {
  // We removed the internal state and useEffects because the parent component 
  // (ModelsContent) now handles all the fetching and filtering logic via the API.
  // This component's job is now purely to display the data it receives.

  return (
    <div className="space-y-8">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {initialModels.length} deals
        </p>
      </div>

      {initialModels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialModels.map((model) => (
            <ModelCard key={model._id} model={model} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            No deals found matching your filters.
          </div>
        </div>
      )}
    </div>
  )
}