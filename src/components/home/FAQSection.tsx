/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const FAQSection = () => {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          // Fallback to empty array if no faqs found
          setFaqs(data.faqs || []);
        }
      } catch (error) {
        console.error('Failed to fetch FAQs', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Only render if we have FAQs
  if (!loading && faqs.length === 0) {
    return null; 
  }

  return (
    <section className="py-24 bg-[#0F0728] text-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Frequently Asked <br />
              Questions
            </h2>
            
            <p className="text-lg text-slate-300 max-w-md">
              Got more questions? Feel free to contact us for more information.
            </p>

            <div className="pt-4">
              <Button 
                asChild
                className="bg-white text-slate-900 hover:bg-slate-200 rounded-full pl-6 pr-1 py-6 h-auto text-lg font-medium transition-all group"
              >
                <Link href="/contact" className="flex items-center gap-4">
                  Contact us
                  <div className="w-10 h-10 bg-[#0F0728] rounded-full flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                    <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="space-y-4">
            {loading ? (
                // Simple skeleton loading state
                [1, 2, 3].map((_, i) => (
                    <div key={i} className="h-20 bg-[#241b5e] rounded-2xl animate-pulse"></div>
                ))
            ) : (
                faqs.map((faq, index) => (
                <div 
                    key={index}
                    className={`
                    rounded-2xl transition-all duration-300 overflow-hidden
                    ${openIndex === index ? 'bg-[#2D1B69]' : 'bg-[#241b5e] hover:bg-[#2D1B69]'}
                    `}
                >
                    <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-6 flex items-center justify-between text-left gap-4"
                    >
                    <span className="text-xl font-bold tracking-tight">
                        {faq.question}
                    </span>
                    <div className="flex-shrink-0">
                        {openIndex === index ? (
                        <Minus className="w-6 h-6 text-white" />
                        ) : (
                        <Plus className="w-6 h-6 text-white" />
                        )}
                    </div>
                    </button>
                    
                    <div 
                    className={`
                        transition-all duration-300 ease-in-out
                        ${openIndex === index ? 'max-h-96 opacity-100 pb-6 px-6' : 'max-h-0 opacity-0'}
                    `}
                    >
                    <p className="text-slate-300 leading-relaxed">
                        {faq.answer}
                    </p>
                    </div>
                </div>
                ))
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQSection;