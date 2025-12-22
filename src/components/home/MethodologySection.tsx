'use client';

import { AlertTriangle, Calculator, FileCheck, Puzzle, Search, ArrowRight, Sparkles, Zap } from 'lucide-react';
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ElectricBorder from '../ElectricBorder';

const MethodologySection = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  const steps = [
    {
      number: "01",
      title: "Deal Sourcing & Screening",
      description: "Proprietary algorithms identify 500+ targets weekly using 200+ financial metrics",
      icon: <Search className="w-6 h-6" />,
      gradient: "from-primary/10 to-primary/20 dark:from-primary/5 dark:to-primary/15",
      color: "text-primary"
    },
    {
      number: "02",
      title: "Initial Valuation Framework",
      description: "DCF, LBO, and Comparable Company Analysis with Monte Carlo sensitivity",
      icon: <Calculator className="w-6 h-6" />,
      gradient: "from-chart-1/10 to-chart-2/10 dark:from-chart-1/5 dark:to-chart-2/15",
      color: "text-chart-1 dark:text-chart-2"
    },
    {
      number: "03",
      title: "Synergy & Integration Modeling",
      description: "Cost, revenue, and operational synergies with integration roadmap",
      icon: <Puzzle className="w-6 h-6" />,
      gradient: "from-chart-3/10 to-chart-4/10 dark:from-chart-3/5 dark:to-chart-4/15",
      color: "text-chart-3 dark:text-chart-4"
    },
    {
      number: "04",
      title: "Risk & Scenario Analysis",
      description: "Stress testing across 50+ macroeconomic variables and black swan events",
      icon: <AlertTriangle className="w-6 h-6" />,
      gradient: "from-amber-500/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-500/15",
      color: "text-amber-600 dark:text-amber-500"
    },
    {
      number: "05",
      title: "Deal Structuring & Execution",
      description: "Equity/debt mix, earnouts, escrow arrangements, and closing mechanics",
      icon: <FileCheck className="w-6 h-6" />,
      gradient: "from-emerald-500/10 to-green-500/10 dark:from-emerald-500/5 dark:to-green-500/15",
      color: "text-emerald-600 dark:text-emerald-500"
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl dark:bg-primary/10" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl dark:bg-secondary/10" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-[0.02] bg-[radial-gradient(circle_at_center,_var(--primary)_1px,_transparent_1px)] bg-[size:4rem_4rem]" />
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span className="tracking-wide">Proven Framework</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8">
            <span className="block mb-2">Institutional-Grade</span>
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-primary via-chart-3 to-chart-5 bg-clip-text text-transparent">
                Modeling Methodology
              </span>
              <Zap className="absolute -right-12 -top-4 w-12 h-12 text-primary/30 animate-pulse" />
              <span className="absolute -bottom-2 left-0 w-full h-3 bg-primary/10 -z-10 rounded-full" />
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A five-step proprietary framework derived from top-tier investment banking practices, 
            refined through years of real-world M&A execution
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Main Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-border via-primary/30 to-border hidden lg:block" />
          
          {/* Progress Dots */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full hidden lg:flex flex-col justify-between py-24">
            {steps.map((_, i) => (
              <div key={i} className="relative">
                <div className="w-4 h-4 rounded-full bg-background border-4 border-primary shadow-lg shadow-primary/20 dark:shadow-primary/40" />
                <div className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary/10 animate-ping" />
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="space-y-20 lg:space-y-0">
            {steps.map((step, index) => {
              const delay = (index + 1) * 100;
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={index}
                  className={`relative lg:flex items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                  data-aos="fade-up"
                  data-aos-delay={delay}
                >
                  {/* Step Card */}
                  {/* Corrected: The structural div comes FIRST, ElectricBorder wraps the inner card */}
                  <div className={`lg:w-5/12 ${isEven ? 'lg:pr-12' : 'lg:pl-12'}`}>
                    <ElectricBorder
                      color="#7df9ff"
                      speed={1}
                      chaos={0.5}
                      thickness={2}
                      style={{ borderRadius: 16 }}
                    >
                      <div 
                        className={`group relative overflow-hidden rounded-2xl  p-8 shadow-lg shadow-black/5 dark:shadow-white/5 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20 hover:-translate-y-1 hover:border-primary/30 ${step.gradient}`}
                      >
                        {/* Animated Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 dark:via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        
                        {/* Step Number Badge */}
                        <div className="absolute -top-3 -left-3">
                          <div className="relative">
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.gradient} border border-border backdrop-blur-sm flex items-center justify-center shadow-lg`}>
                              <span className={`text-lg font-bold ${step.color}`}>{step.number}</span>
                            </div>
                            <div className="absolute inset-0 rounded-xl border-2 border-primary/20 animate-pulse" />
                          </div>
                        </div>
                        
                        {/* Icon */}
                        <div className="mb-6 flex justify-end">
                          <div className={`p-4 rounded-xl bg-gradient-to-br ${step.gradient} border border-border shadow-inner ${step.color}`}>
                            {step.icon}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="relative space-y-4">
                          <h3 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors duration-300">
                            {step.title}
                            <ArrowRight className="w-5 h-5 ml-2 inline opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-2 transition-all duration-300" />
                          </h3>
                          <p className="text-muted-foreground leading-relaxed text-lg">
                            {step.description}
                          </p>
                        </div>
                        
                        {/* Bottom Border Animation */}
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-transparent group-hover:w-full transition-all duration-500" />
                      </div>
                    </ElectricBorder>
                  </div>
                  
                  {/* Center Connector (Desktop) */}
                  <div className="hidden lg:flex w-2/12 justify-center relative z-10">
                    <div 
                      className={`w-20 h-20 rounded-full border-4 border-background shadow-2xl shadow-black/20 dark:shadow-primary/20 flex items-center justify-center ${step.color} bg-gradient-to-br from-background to-card backdrop-blur-sm`}
                    >
                      <div className="p-4 rounded-full bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-white/10 backdrop-blur-sm border border-white/20">
                        {step.icon}
                      </div>
                    </div>
                  </div>
                  
                  {/* Empty Spacer */}
                  <div className="lg:w-5/12" />
                </div>
              );
            })}
          </div>

          {/* Mobile Progress Bar */}
          <div className="mt-16 lg:hidden">
            <div className="flex justify-between items-center px-4">
              {steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${step.color} bg-current`} />
                  {i < steps.length - 1 && (
                    <div className={`w-12 h-0.5 bg-gradient-to-r ${step.color} to-transparent opacity-50`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div 
          className="mt-24 text-center" 
          data-aos="fade-up" 
          data-aos-delay="600"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-8 p-8 rounded-3xl bg-gradient-to-r from-card to-card/80 border-2 border-primary/10 backdrop-blur-sm shadow-2xl shadow-primary/5 dark:shadow-primary/10">
            <div className="text-left space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileCheck className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-2xl font-bold">Ready to Apply These Methods?</h4>
              </div>
              <p className="text-muted-foreground text-lg">
                Explore our financial models built using this exact methodology
              </p>
            </div>
            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-chart-4 text-primary-foreground font-semibold text-lg hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95 border border-primary/20">
              Explore Models
              <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
          
      
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-40 right-10 w-24 h-24 bg-primary/5 rounded-full animate-float dark:bg-primary/10" />
      <div className="absolute bottom-40 left-10 w-32 h-32 bg-secondary/5 rounded-full animate-float-delayed dark:bg-secondary/10" />
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default MethodologySection;