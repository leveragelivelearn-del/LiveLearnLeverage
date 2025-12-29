
'use client';

import React, { useRef } from 'react';
import { SERVICES_DATA } from './constants';
import ServiceCard from './ServiceCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const OurServices: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      }
    });

    tl.from('.service-header h2', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
      .from('.service-header .divider', {
        width: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.4')
      .from('.service-header p', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.4')
      .from('.service-card-item', {
        y: 100,
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
        <div className="service-header text-center mb-16">
          <h2 className="text-foreground text-3xl md:text-4xl font-extrabold uppercase tracking-widest mb-4">
            Our <span className='text-primary'>Services</span>
          </h2>
          <div className="w-12 h-[3px] bg-primary mx-auto mb-8"></div>
          <p className="max-w-4xl mx-auto text-muted-foreground text-base md:text-lg leading-relaxed font-light">
            We provide comprehensive solutions across multiple sectors, combining industry expertise with innovative approaches to help our clients achieve sustainable success in an ever-evolving global market.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
          {SERVICES_DATA.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
