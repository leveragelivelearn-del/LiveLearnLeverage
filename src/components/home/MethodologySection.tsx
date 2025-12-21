import { AlertTriangle, Calculator, FileCheck, Puzzle, Search } from 'lucide-react';
import React from 'react';

const MethodologySection = () => {
    const steps = [
    {
      number: "01",
      title: "Deal Sourcing & Screening",
      description: "Proprietary algorithms identify 500+ targets weekly using 200+ financial metrics",
      icon: <Search className="w-6 h-6" />
    },
    {
      number: "02",
      title: "Initial Valuation Framework",
      description: "DCF, LBO, and Comparable Company Analysis with Monte Carlo sensitivity",
      icon: <Calculator className="w-6 h-6" />
    },
    {
      number: "03",
      title: "Synergy & Integration Modeling",
      description: "Cost, revenue, and operational synergies with integration roadmap",
      icon: <Puzzle className="w-6 h-6" />
    },
    {
      number: "04",
      title: "Risk & Scenario Analysis",
      description: "Stress testing across 50+ macroeconomic variables and black swan events",
      icon: <AlertTriangle className="w-6 h-6" />
    },
    {
      number: "05",
      title: "Deal Structuring & Execution",
      description: "Equity/debt mix, earnouts, escrow arrangements, and closing mechanics",
      icon: <FileCheck className="w-6 h-6" />
    }
  ];
    return (
        <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Institutional <span className="text-gradient">Modeling Methodology</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Five-step proprietary framework derived from bulge bracket investment banking practices
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline connector */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-500/50 to-purple-500/50 hidden md:block" />
          
          <div className="space-y-12">
            {steps.map((step, i) => (
              <div 
                key={i}
                className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className="md:w-5/12">
                  <div className={`glass p-8 rounded-2xl hover:shadow-xl transition-all duration-300 ${i % 2 === 0 ? 'md:text-right' : ''}`}>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-slate-400">{step.description}</p>
                  </div>
                </div>
                
                <div className="hidden md:flex w-2/12 justify-center">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center">
                    <div className="text-white">{step.icon}</div>
                  </div>
                </div>
                
                <div className="md:w-5/12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    );
};

export default MethodologySection;