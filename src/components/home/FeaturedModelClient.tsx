'use client';

import React, { useRef } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedModelClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  models: any[];
}

const FeaturedModelClient: React.FC<FeaturedModelClientProps> = ({ models }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      }
    });

    tl.from('.featured-header-text', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    })
    .from('.featured-view-all', {
      x: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.featured-card', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'back.out(1.7)'
    }, '-=0.4');

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-background overflow-hidden">
      <div className='container mx-auto px-4'>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="featured-header-text text-3xl font-bold">Featured Deals</h2>
            <p className="featured-header-text text-muted-foreground">
              Recent M&A models and analysis
            </p>
          </div>
          <div className="featured-view-all">
            <Button variant="ghost" asChild>
              <Link href="/models">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model: any) => (
            <Card
              key={model._id}
              className="featured-card overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="line-clamp-1">{model.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                    {model.industry}
                  </span>
                  <span>•</span>
                  <span>{model.dealType}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2 mb-4">
                  {model.description}
                </p>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">
                    ${(model.dealSize / 1000000).toFixed(0)}M
                  </span>
                  <span>
                    {new Date(model.completionDate).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  asChild
                >
                  <Link href={`/models/${model.slug}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedModelClient;
