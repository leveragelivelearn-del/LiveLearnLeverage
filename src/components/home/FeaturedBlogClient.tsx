'use client';

import React, { useRef } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BlogCard } from '@/components/blog/BlogCard';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedBlogClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blogs: any[];
}

const FeaturedBlogClient: React.FC<FeaturedBlogClientProps> = ({ blogs }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      }
    });

    tl.from('.blog-header h2', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
      .from('.blog-header .divider', {
        width: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.4')
      .from('.blog-header p', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.4')
      .from('.blog-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)'
      }, '-=0.4');

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="blog-header text-center mb-16">
          <h2 className="text-foreground text-3xl md:text-4xl font-extrabold uppercase tracking-widest mb-4">
            Latest <span className='text-primary'>Insights</span>
          </h2>
          <div className="divider w-12 h-[3px] bg-primary mx-auto mb-8"></div>
          <p className="max-w-4xl mx-auto text-muted-foreground text-base md:text-lg leading-relaxed font-light">
            Explore our latest thoughts on finance, M&A, and strategic growth. We provide in-depth analysis and expert perspectives to help you stay ahead in a dynamic market environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogs.map((blog: any) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              className="blog-card"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogClient;
