"use client";

import React, { useState } from 'react';
import { ModelCard } from '@/components/models/ModelCard';
import { cn } from '@/lib/utils';

interface FeaturedModelClientProps {
  models: Array<{
    _id: string;
    title: string;
    description: string;
    slug: string;
    industry: string;
    dealSize: number;
    dealType: string;
    completionDate: string;
    currency: string;
    views: number;
    slides: { imageUrl: string }[];
    featured: boolean;
  }>;
}

const FeaturedModelClient: React.FC<FeaturedModelClientProps> = ({ models }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="bg-transparent overflow-hidden">
      <div className='container mx-auto px-4'>
        {/* Header Section */}
        <div
          className="featured-header text-center mb-16"
        >
          <h2 className="text-white text-3xl md:text-4xl font-extrabold uppercase tracking-widest mb-4">
            Case <span className='text-primary'>Studies</span>
          </h2>
          <div className="divider w-12 h-[3px] bg-primary mx-auto mb-8"></div>
          <p className="max-w-4xl mx-auto text-muted-foreground text-base md:text-lg leading-relaxed font-light">
            Here are the case studies and analyses that I have done in the past.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {models.map((model, index) => (
            <div
              key={model._id}
              className={cn(
                "featured-card-wrapper h-full transition-all duration-300 ease-out",
                hovered !== null && hovered !== index && "blur-[2px] scale-[0.98] opacity-50"
              )}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <ModelCard model={model} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedModelClient;
