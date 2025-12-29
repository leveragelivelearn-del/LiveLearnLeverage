/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // --- Configuration ---
  const size = 44; // Button width/height
  const strokeWidth = 3; // Thickness of the ring
  const center = size / 2; // Center point (22)
  const radius = (size / 2) - strokeWidth - 2; // Radius adjusted for stroke & padding
  const circumference = 2 * Math.PI * radius;

  // Calculate offset based on scroll progress (prevent NaN)
  const offset = isNaN(scrollProgress) || !isFinite(scrollProgress)
    ? circumference
    : circumference - (scrollProgress / 100) * circumference;
  // ---------------------

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      // Prevent division by zero or negative values
      const progress = totalHeight > 0
        ? Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100))
        : 0;
      setScrollProgress(progress);

      // Show button when scrolled 20% down
      setIsVisible(window.scrollY > window.innerHeight * 0.2);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined' && (window as any).lenis) {
      (window as any).lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-2 right-0.5 md:bottom-6 md:right-6 z-50', // Adjusted right-0.5 to align center with ChatBot (which is right-2 w-8)
        'scale-75 md:scale-100', // Smallest comfortable size on mobile
        'flex items-center justify-center',
        'rounded-full bg-primary text-primary-foreground', // Solid background
        'shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30',
        'transition-all duration-300 ease-out',
        'hover:scale-110 active:scale-95',
        'group',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10 pointer-events-none'
      )}
      aria-label="Scroll to top"
      // Apply the dynamic size here
      style={{ width: size, height: size }}
    >
      {/* Progress ring SVG */}
      <svg
        className="absolute inset-0 transform -rotate-90 pointer-events-none"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background Circle (Track) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="opacity-20" // Subtle track
        />

        {/* Progress Circle (Indicator) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-200 ease-linear"
        />
      </svg>

      {/* Arrow icon */}
      <ArrowUp className="h-5 w-5 relative z-10" />

      {/* Tooltip */}
      <div className="absolute bottom-full mb-3 right-0 bg-popover text-popover-foreground text-xs py-1.5 px-3 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
        {Math.round(scrollProgress)}%
      </div>
    </button>
  );
}