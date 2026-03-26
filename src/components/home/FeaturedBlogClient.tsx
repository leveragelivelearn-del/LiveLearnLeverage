'use client';

import React, { useState } from 'react';
import { BlogCard } from '@/components/blog/BlogCard';
import { cn } from '@/lib/utils';

interface FeaturedBlogClientProps {
  blogs: Array<{
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage?: string;
    publishedAt: string;
    readTime: number;
    author?: {
      name?: string;
      image?: string;
    };
    category?: string;
    tags: string[];
    views: number;
    isBookmarked?: boolean;
  }>;
}

const FeaturedBlogClient: React.FC<FeaturedBlogClientProps> = ({ blogs }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="bg-transparent overflow-hidden pb-16 ">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div
          className="blog-header text-center mb-16"
        >
          <h2 className="text-white text-3xl md:text-4xl font-extrabold uppercase tracking-widest mb-4">
            Blog <span className='text-primary'>Posts</span>
          </h2>
          <div className="divider w-12 h-[3px] bg-primary mx-auto mb-8"></div>
          <p className="max-w-4xl mx-auto text-muted-foreground text-base md:text-lg leading-relaxed font-light">
            Here are my thoughts on life, leverage, and learning.          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogs && blogs.length > 0 ? (
            blogs.map((blog, index) => (
              <div
                key={blog._id}
                className={cn(
                  "blog-card-wrapper h-full transition-all duration-300 ease-out",
                  hovered !== null && hovered !== index && "blur-[2px] scale-[0.98] opacity-50"
                )}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                <BlogCard
                  blog={blog}
                  className="h-full"
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No latest insights available at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogClient;
