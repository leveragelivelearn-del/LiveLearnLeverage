/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      
      // Show button when scrolled 20% down
      setIsVisible(window.scrollY > window.innerHeight * 0.2);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    // Use Lenis if available
    if (typeof window !== 'undefined' && (window as any).lenis) {
      (window as any).lenis.scrollTo(0, { duration: 1.5 });
    } else {
      // Fallback to native smooth scroll
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-8 right-8 z-50',
        'flex items-center justify-center',
        'rounded-full bg-gradient-to-br from-primary to-primary/90',
        'shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30',
        'transition-all duration-300 ease-out',
        'hover:scale-110 active:scale-95',
        'focus:outline-none focus:ring-3 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
        'backdrop-blur-sm border border-primary/20',
        'group',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10 pointer-events-none'
      )}
      aria-label="Scroll to top"
      style={{ width: '56px', height: '56px' }}
    >
      {/* Progress ring */}
      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-primary/30"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary-foreground transition-all duration-300"
          strokeLinecap="round"
        />
      </svg>
      
      {/* Arrow icon */}
      <ArrowUp className="h-6 w-6 text-primary-foreground relative z-10 group-hover:translate-y-[-2px] transition-transform" />
      
      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 right-0 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Scroll to top ({Math.round(scrollProgress)}%)
      </div>
    </button>
  );
}