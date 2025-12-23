import React from 'react';
import Image from 'next/image';

const WhoWeAre: React.FC = () => {
  return (
    <section className="bg-background overflow-hidden">
      <div className="px-4 container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary tracking-wider uppercase mb-4">
            Who We Are
          </h2>
          <div className="w-12 h-1 bg-blue-400 mx-auto mb-6"></div>
          <p className="max-w-4xl mx-auto text-muted-foreground text-lg leading-relaxed px-4">
            We are a strategic advisory firm dedicated to scaling businesses through 
            evidence-based planning and precision execution. Our methodology combines 
            deep industry insights with innovative problem-solving.
          </p>
        </div>

        {/* Content Grid */}
        <div className="relative flex flex-col lg:flex-row items-center justify-center">
          
          {/* Left: Info Card (Overlaps image slightly on desktop) */}
          <div className="w-full lg:w-3/5 z-10 lg:-mr-32">
            <div className="bg-white p-8 md:p-12 lg:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-50 rounded-sm">
              <h3 className="text-xl md:text-2xl font-bold text-foreground leading-tight mb-6 uppercase">
                Looking for a premier partner for <br className="hidden md:block" />
                strategic business planning?
              </h3>
              
              <div className="w-10 h-1 bg-blue-400 mb-8"></div>
              
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed font-normal">
                  Our consultancy provides high-impact growth strategies that transform 
                  operational challenges into scalable opportunities. We don&apos;t just draft 
                  plans; we build blueprints for sustainable market leadership and 
                  financial resilience.
                </p>

                <div className="pt-2">
                  <h4 className="text-accent-foreground font-semibold text-lg mb-3">
                    Excellence in Corporate Responsibility
                  </h4>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    Beyond profitability, we emphasize ethical governance and long-term 
                    value creation. We work with organizations that are as committed to 
                    positive impact as they are to performance.
                  </p>
                </div>

                {/* Statistics Row */}
                <div className="flex flex-wrap items-center gap-10 pt-8 border-t border-gray-100 mt-8">
                  <div className="flex flex-col">
                    <span className="text-4xl md:text-5xl font-bold text-primary mb-1">
                      24%
                    </span>
                    <span className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
                      Efficiency Optimization
                    </span>
                  </div>
                  
                  {/* Vertical Divider */}
                  <div className="hidden sm:block h-12 w-px bg-muted-foreground"></div>
                  
                  <div className="flex flex-col">
                    <span className="text-4xl md:text-5xl font-bold text-primary mb-1">
                      18%
                    </span>
                    <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                      Average Annual Growth
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Featured Image */}
          <div className="w-full lg:w-2/3 mt-12 lg:mt-0">
            <div className="relative aspect-4/3 lg:aspect-square overflow-hidden rounded-sm shadow-2xl">
              <Image 
                src="/assets/whowerree.png" 
                alt="Business Consultant Professional" 
                fill
                className="object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              {/* Decorative background element for mobile/tablet */}
              <div className="absolute inset-0 bg-blue-900/5 lg:hidden pointer-events-none"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;