/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { ModelCard } from './ModelCard'
import { cn } from '@/lib/utils'

interface ModelGridProps {
  initialModels: any[]
}

export function ModelGrid({ initialModels }: ModelGridProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="space-y-8">



      {initialModels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialModels.map((model, index) => (
            <div
              key={model._id}
              className={cn(
                "transition-all duration-300 ease-out",
                hovered !== null && hovered !== index && "blur-[2px] scale-[0.98] opacity-50"
              )}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <ModelCard model={model} />
            </div>
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