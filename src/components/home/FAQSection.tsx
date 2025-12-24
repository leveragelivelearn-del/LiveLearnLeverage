"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronRight, Plus, Minus } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

const FAQSection = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Open first by default

  const defaultFaqs: FAQ[] = [
    { 
      question: "How do I find my Windows product key?", 
      answer: "Your product key can be found on a label or card inside the box that Windows came in. If you bought Windows online, your product key will be in the confirmation email you received after your purchase." 
    },
    { 
      question: "I've downloaded an ISO file, now what?", 
      answer: "After downloading the ISO file, you can create a bootable USB drive or DVD to install Windows. We recommend using the official Media Creation Tool for the safest and most reliable results." 
    },
    { 
      question: "Is the media bootable for clean installs?", 
      answer: "Yes, all media created through our standard process is fully bootable. This allows you to perform clean installations, partitions, or repair existing operating system files easily." 
    },
    { 
      question: "Can I use the key on multiple devices?", 
      answer: "A standard retail product key is typically licensed for a single device. If you need to move it to a new PC, you may need to deactivate it on the old one first." 
    }
  ];

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setFaqs(defaultFaqs);
      } catch (error) {
        console.error('Failed to fetch FAQs', error);
        setFaqs(defaultFaqs);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const stats = [
    { number: "1,200+", label: "Projects Completed" },
    { number: "50+", label: "Industry Awards" },
    { number: "800+", label: "Global Clients" },
  ];

  if (!loading && faqs.length === 0) return null;

  return (
    <section className="relative w-full bg-background overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
      
      <div className="flex flex-col lg:flex-row min-h-[700px] relative">
        
        {/* Left Content Area: FAQs */}
        <div className="w-full lg:w-[65%] px-6 py-16 md:py-24 lg:pl-20 xl:pl-32 lg:pr-24 z-10">
          <div className="max-w-3xl">
            <header className="mb-12">
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">
                Support Center
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1]">
                Common <span className="text-blue-600">Questions</span> & <br className="hidden md:block" />
                Expert Answers
              </h2>
            </header>

            <div className="space-y-4">
              {loading ? (
                [1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="h-20 w-full bg-slate-100 animate-pulse rounded-2xl"></div>
                ))
              ) : (
                faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className={`group border rounded-2xl transition-all duration-300 ${
                      openIndex === index 
                      ? 'border-blue-200 bg-white shadow-xl shadow-blue-500/5' 
                      : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200'
                    }`}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-5 md:py-6 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          openIndex === index ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 shadow-sm'
                        }`}>
                          {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                        </div>
                        <span className={`text-lg font-bold tracking-tight transition-colors duration-300 ${
                          openIndex === index ? 'text-blue-600' : 'text-slate-800'
                        }`}>
                          {faq.question}
                        </span>
                      </div>
                      <ChevronRight 
                        className={`hidden sm:block w-5 h-5 text-slate-300 transition-transform duration-300 ${
                          openIndex === index ? 'rotate-90 text-blue-600' : 'group-hover:translate-x-1'
                        }`} 
                      />
                    </button>
                    
                    <div 
                      className={`
                        overflow-hidden transition-all duration-500 ease-in-out
                        ${openIndex === index ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}
                      `}
                    >
                      <div className="px-6 pb-6 pt-0 ml-14">
                        <p className="text-slate-500 leading-relaxed text-base md:text-lg">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Visual Section & Overlapping Images */}
        <div className="relative w-full lg:w-[35%] min-h-[500px] lg:min-h-full flex flex-col">
          
          {/* Main Blue Block with Stats */}
          <div className="w-full h-full bg-blue-600 relative overflow-hidden flex flex-col justify-center p-10 md:p-16 lg:p-20 text-white z-0">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400 to-transparent"></div>
              <svg className="absolute bottom-0 right-0 w-full h-1/2 text-blue-500 opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor"></path>
              </svg>
            </div>

            <div className="relative z-10 space-y-12 lg:ml-12 xl:ml-20">
              {stats.map((stat, idx) => (
                <div key={idx} className="group cursor-default">
                  <div className="text-5xl md:text-6xl font-black tracking-tighter transition-transform group-hover:scale-105 origin-left duration-300">
                    {stat.number}
                  </div>
                  <div className="text-blue-100 font-medium text-lg opacity-80 mt-1 uppercase tracking-widest text-xs">
                    {stat.label}
                  </div>
                  <div className="w-12 h-1 bg-white/20 mt-4 rounded-full transition-all group-hover:w-24 group-hover:bg-white duration-300"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Overlapping Featured Image (Desktop Only) */}
          <div className="hidden lg:block absolute left-[-160px] top-1/2 -translate-y-1/2 z-30 group">
            <div className="relative w-[320px] h-[480px]">
              {/* Image Frame with Shadow & Border */}
              <div className="absolute inset-0 bg-white p-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-1 overflow-hidden">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image 
                    src="/assets/whowerree.png" 
                    alt="Professional Environment"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                </div>
                
                {/* Floating Experience Badge */}
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl flex flex-col items-center justify-center w-28 h-28 border-4 border-blue-600 animate-bounce-slow z-10">
                  <span className="text-3xl font-black text-blue-600">5+</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase text-center leading-none">Years of Excellence</span>
                </div>
              </div>

              {/* Decorative dotted pattern behind image */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-[radial-gradient(#3b82f6_2px,transparent_2px)] [background-size:16px_16px] opacity-20 -z-10"></div>
            </div>
          </div>

          {/* Secondary Overlapping Image (Interacts with Stats) */}
          <div className="hidden xl:block absolute -right-20 top-20 z-20 w-40 h-40 rounded-3xl border-8 border-white shadow-2xl overflow-hidden rotate-12 transition-all hover:rotate-0 hover:scale-110 duration-500">
             <div className="relative w-full h-full">
               <Image 
                 src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&auto=format&fit=crop" 
                 alt="Team working"
                 fill
                 className="object-cover"
                 sizes="160px"
               />
             </div>
          </div>
        </div>
      </div>

      {/* Mobile-Friendly Image Section (Visible on md and below) */}
      <div className="lg:hidden w-full px-6 pb-16">
        <div className="relative max-w-2xl mx-auto h-[400px]">
           <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
             <Image 
               src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1000&auto=format&fit=crop" 
               alt="Professional Business"
               fill
               className="object-cover"
               sizes="(max-width: 768px) 100vw, 700px"
             />
           </div>
           <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white px-10 py-6 rounded-2xl shadow-xl border border-slate-100 flex gap-12 text-center whitespace-nowrap z-10">
             <div>
               <div className="text-2xl font-black text-blue-600">24/7</div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Support</div>
             </div>
             <div className="w-px h-full bg-slate-100"></div>
             <div>
               <div className="text-2xl font-black text-blue-600">100%</div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Secure</div>
             </div>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
      `}} />
    </section>
  );
};

export default FAQSection;