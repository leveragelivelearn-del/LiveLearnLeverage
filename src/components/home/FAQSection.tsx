"use client";

import React, { useState } from 'react';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const FAQSection = () => {
  // Using the "general" data from your original code to populate the view
  const faqs = [
    {
      question: "How can your product help me?",
      answer: "Our models are designed to provide institutional-grade financial analysis tools for M&A professionals, investment bankers, and corporate development teams. They help streamline due diligence, valuation, and deal structuring processes.",
    },
    {
      question: "Can I downgrade my plan?",
      answer: "Yes, you can adjust your plan at any time. Downgrades will take effect at the end of your current billing cycle, ensuring you retain access to features you've already paid for.",
    },
    {
      question: "What if I have more than 20 team members?",
      answer: "For teams larger than 20, we offer Enterprise licensing which includes custom model development, dedicated support, and volume discounts. Contact our sales team for a custom quote.",
    },
    {
      question: "Does your tool integrate with other tools?",
      answer: "Yes, Enterprise licenses include API access for integration with Python, R, Tableau, and Power BI. We also provide seamless export options for Microsoft Excel and Google Sheets.",
    },
    {
        question: "Is there a money-back guarantee?",
        answer: "We offer a 30-day satisfaction guarantee for all premium models. If a model doesn't meet your needs, contact support for a full refund."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
            {faqs.map((faq, index) => (
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
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQSection;