"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Testimonial } from './types';

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Marcus Thorne',
    role: 'CEO, TechBridge Solutions',
    image: 'https://i.ibb.co.com/9HmBM6CH/lawyer-2.jpg',
    content: 'The expertise provided during our $120M acquisition was unparalleled. Their team didn\'t just facilitate the transaction; they ensured the strategic cultural alignment was perfect for our long-term scalability and market dominance.'
  },
  {
    id: 2,
    name: 'Elena Rodriguez',
    role: 'Founder, GreenHorizon Energy',
    image: 'https://i.ibb.co.com/7dHGRPKj/lawyer-5.jpg',
    content: 'Navigating the complexities of a cross-border merger was daunting until we partnered with this agency. Their financial modeling was meticulous, and their negotiation strategy protected our interests while securing a record-breaking exit valuation.'
  },
  {
    id: 3,
    name: 'David Chen',
    role: 'Managing Director, VenturePeak',
    image: 'https://i.ibb.co.com/67txMdTT/lawyer-7.jpg',
    content: 'Strategic M&A advisory at its finest. They understand the deep nuances of the manufacturing sector. Their ability to identify synergy opportunities that others missed allowed us to consolidate our market position ahead of schedule.'
  },
  {
    id: 4,
    name: 'Sarah Jenkins',
    role: 'CFO, Global Logistics Corp',
    image: 'https://i.ibb.co.com/PzjtJT3K/lawyer-9.jpg',
    content: 'Their due diligence process is the most rigorous I have encountered in twenty years of finance. They identified critical risk factors early, allowing us to restructure the deal terms and save over $15M in post-close liabilities.'
  },
  {
    id: 5,
    name: 'Jonathan Vance',
    role: 'Head of Strategy, Aris Pharma',
    image: 'https://i.ibb.co.com/DDnRCVN7/lawyer-10.jpg',
    content: 'We rely on their team for all our inorganic growth initiatives. Their deep bench of talent and commitment to discretion makes them the premier choice for middle-market M&A advisory in North America.'
  },
  {
    id: 6,
    name: 'Sophia Wu',
    role: 'Director, BlueChip Capital',
    image: 'https://i.ibb.co.com/0Rq1zXkM/lawyer-12.jpg',
    content: 'A true partnership in every sense. They delivered exceptional results on our latest carve-out, managing the intricate financial separation with surgical precision and clear communication at every milestone.'
  }
];

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Group testimonials in pairs for desktop view
  const totalSlides = Math.ceil(testimonials.length / 2);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isHovered]);

  return (
    <section className="bg-background overflow-hidden container mx-auto">
      <div className="text-center mb-16">

        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
          What our <span className='text-primary'>clients </span>say
        </h2>
        <div className="w-12 h-[3px] bg-primary mx-auto mb-8"></div>
        <p className="max-w-2xl mx-auto text-gray-500 text-lg leading-relaxed">
          Trusted by leading corporations and private equity firms globally to navigate
          the complexities of high-stakes mergers, acquisitions, and strategic advisory.
        </p>
      </div>

      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div key={slideIndex} className="min-w-full flex flex-col md:flex-row gap-8 px-4">
              {/* Card 1 in Slide */}
              <div className="flex-1 bg-white p-10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 relative group transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-5 mb-8">
                  <img
                    src={testimonials[slideIndex * 2].image}
                    alt={testimonials[slideIndex * 2].name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#FF4C60]/10"
                  />
                  <div>
                    <h4 className="text-foreground font-bold text-lg">{testimonials[slideIndex * 2].name}</h4>
                    <p className="text-muted-foreground font-medium">{testimonials[slideIndex * 2].role}</p>
                  </div>
                </div>
                <p className="text-accent-foreground leading-relaxed text-lg relative z-10 italic">
                  &quot;{testimonials[slideIndex * 2].content}&quot;
                </p>
                {/* Background Quote SVG */}
                <div className="absolute top-10 right-10 opacity-[0.5] pointer-events-none group-hover:opacity-[0.1] transition-opacity duration-300">
                  <svg width="100" height="80" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M40.2 0C25.2 0 13.8 4.5 6 13.5C2 18.1 0 24.3 0 32.1C0 49.3 11.2 64.1 33.6 76.5C31.4 82.3 26.6 86.9 19.2 90.3L22.2 100C39.6 94.6 51.6 85.1 58.2 71.5C62.4 63.3 64.5 54.1 64.5 43.8V0H40.2ZM104.7 0C89.7 0 78.3 4.5 70.5 13.5C66.5 18.1 64.5 24.3 64.5 32.1C64.5 49.3 75.7 64.1 98.1 76.5C95.9 82.3 91.1 86.9 83.7 90.3L86.7 100C104.1 94.6 116.1 85.1 122.7 71.5C126.9 63.3 129 54.1 129 43.8V0H104.7Z" fill="#FF4C60" fillOpacity="0.5" />
                  </svg>
                </div>
                {/* Animated Bottom Border */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-primary transition-all duration-500 group-hover:w-full rounded-b-xl"></div>
              </div>

              {/* Card 2 in Slide (Hidden on small mobile if you wanted, but here we show both on md+) */}
              {testimonials[slideIndex * 2 + 1] && (
                <div className="hidden md:block flex-1 bg-white p-10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 relative group transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center gap-5 mb-8">
                    <img
                      src={testimonials[slideIndex * 2 + 1].image}
                      alt={testimonials[slideIndex * 2 + 1].name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#FF4C60]/10"
                    />
                    <div>
                      <h4 className="text-foreground font-bold text-lg">{testimonials[slideIndex * 2 + 1].name}</h4>
                      <p className="text-gray-500 font-medium">{testimonials[slideIndex * 2 + 1].role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg relative z-10 italic">
                    &quot;{testimonials[slideIndex * 2 + 1].content}&quot;
                  </p>
                  <div className="absolute top-10 right-10 opacity-[0.5] pointer-events-none group-hover:opacity-[0.1] transition-opacity duration-300">
                    <svg width="100" height="80" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M40.2 0C25.2 0 13.8 4.5 6 13.5C2 18.1 0 24.3 0 32.1C0 49.3 11.2 64.1 33.6 76.5C31.4 82.3 26.6 86.9 19.2 90.3L22.2 100C39.6 94.6 51.6 85.1 58.2 71.5C62.4 63.3 64.5 54.1 64.5 43.8V0H40.2ZM104.7 0C89.7 0 78.3 4.5 70.5 13.5C66.5 18.1 64.5 24.3 64.5 32.1C64.5 49.3 75.7 64.1 98.1 76.5C95.9 82.3 91.1 86.9 83.7 90.3L86.7 100C104.1 94.6 116.1 85.1 122.7 71.5C126.9 63.3 129 54.1 129 43.8V0H104.7Z" fill="#FF4C60" fillOpacity="0.5" />
                    </svg>
                  </div>
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-primary transition-all duration-500 group-hover:w-full rounded-b-xl"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-3 mt-12">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index
              ? 'bg-primary w-8'
              : 'bg-gray-300 hover:bg-gray-400'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
