'use client';

import React, { useRef } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

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

    tl.from('.blog-header-text', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    })
    .from('.blog-view-all', {
      x: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.6')
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="blog-header-text text-3xl font-bold">Latest Insights</h2>
            <p className="blog-header-text text-muted-foreground">
              Thoughts on finance and M&A
            </p>
          </div>
          <div className="blog-view-all">
            <Button variant="ghost" asChild>
              <Link href="/blog">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog: any) => (
            <Card
              key={blog._id}
              className="blog-card overflow-hidden hover:shadow-lg transition-shadow"
            >
              {blog.featuredImage && (
                <div className="relative h-48 w-full">
                  <Image
                    src={blog.featuredImage}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <span>{blog.readTime} min read</span>
                  <span>
                    {new Date(blog.publishedAt).toLocaleDateString()}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                  {blog.excerpt}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/blog/${blog.slug}`}>
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogClient;
