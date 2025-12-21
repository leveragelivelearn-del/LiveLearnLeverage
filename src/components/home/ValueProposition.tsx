import { Cpu, ShieldCheck, TrendingUp } from 'lucide-react';
import React from 'react';

const ValueProposition = () => {
    return (
        <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Industrial-Grade <span className="text-gradient">Financial Engineering</span>
        </h2>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          Institutional-grade models used by investment banks, PE firms, and corporate development teams
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <TrendingUp className="w-12 h-12" />,
            title: "Real-World Deal Proven",
            description: "Models derived from actual M&A transactions with audited financials",
            stats: "50+ closed deals",
            color: "from-blue-500 to-cyan-500"
          },
          {
            icon: <ShieldCheck className="w-12 h-12" />,
            title: "Regulatory Compliant",
            description: "Built to SEC/FASB standards with full audit trails and version control",
            stats: "100% compliance",
            color: "from-emerald-500 to-teal-500"
          },
          {
            icon: <Cpu className="w-12 h-12" />,
            title: "Scalable Architecture",
            description: "Modular design that scales from early-stage startups to Fortune 500",
            stats: "10M+ cells modeled",
            color: "from-purple-500 to-pink-500"
          }
        ].map((item, i) => (
          <div key={i} className="glass p-8 rounded-2xl group hover:scale-[1.02] transition-all duration-300">
            <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${item.color} mb-6`}>
              <div className="text-white">{item.icon}</div>
            </div>
            <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
            <p className="text-slate-400 mb-4">{item.description}</p>
            <div className="text-sm font-bold text-slate-300">{item.stats}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
    );
};

export default ValueProposition;

