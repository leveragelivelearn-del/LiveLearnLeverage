"use client";

import React, { useRef } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ModelCard } from '@/components/models/ModelCard'; // UPDATED IMPORTS
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

    tl.from('.featured-header h2', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
      .from('.featured-header .divider', {
        width: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.4')
      .from('.featured-header p', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.4')
      .from('.featured-card-wrapper', {
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
        {/* Header Section */}
        <div className="featured-header text-center mb-16">
          <h2 className="text-foreground text-3xl md:text-4xl font-extrabold uppercase tracking-widest mb-4">
            Featured <span className='text-primary'>Deals</span>
          </h2>
          <div className="divider w-12 h-[3px] bg-primary mx-auto mb-8"></div>
          <p className="max-w-4xl mx-auto text-muted-foreground text-base md:text-lg leading-relaxed font-light">
            Discover our library of financial models and investment analysis. We offer comprehensive tools and templates designed to streamline your financial planning and decision-making processes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {models.map((model: any) => (
            <div key={model._id} className="featured-card-wrapper h-full">
              <ModelCard model={model} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedModelClient;
