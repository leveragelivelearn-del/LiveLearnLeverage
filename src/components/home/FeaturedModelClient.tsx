"use client";

import React from 'react';
import { ModelCard } from '@/components/models/ModelCard';

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

  return (
    <section className="bg-background overflow-hidden">
      <div className='container mx-auto px-4'>
        {/* Header Section */}
        <div
          className="featured-header text-center mb-16"
        >
          <h2 className="text-foreground text-3xl md:text-4xl font-extrabold uppercase tracking-widest mb-4">
            Featured <span className='text-primary'>Deals</span>
          </h2>
          <div className="divider w-12 h-[3px] bg-primary mx-auto mb-8"></div>
          <p className="max-w-4xl mx-auto text-muted-foreground text-base md:text-lg leading-relaxed font-light">
            Discover our library of financial models and investment analysis. We offer comprehensive tools and templates designed to streamline your financial planning and decision-making processes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {models.map((model, index) => (
            <div
              key={model._id}
              className="featured-card-wrapper h-full"
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
