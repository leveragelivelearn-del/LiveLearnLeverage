import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const IndustryExpertise = () => {
  return (
    <section className="py-20 bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-2/5">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Deep <span className="text-gradient">Sector Intelligence</span>
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Our models incorporate industry-specific KPIs, regulatory
              frameworks, and market dynamics across key verticals
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25">
              View All Industries
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="lg:w-3/5 grid grid-cols-2 gap-6">
            {[
              {
                name: "Technology",
                deals: 24,
                growth: "+18%",
                color: "bg-blue-500/20",
              },
              {
                name: "Healthcare",
                deals: 18,
                growth: "+22%",
                color: "bg-emerald-500/20",
              },
              {
                name: "Financial Services",
                deals: 15,
                growth: "+14%",
                color: "bg-purple-500/20",
              },
              {
                name: "Industrial",
                deals: 12,
                growth: "+9%",
                color: "bg-amber-500/20",
              },
              {
                name: "Consumer",
                deals: 10,
                growth: "+12%",
                color: "bg-pink-500/20",
              },
              {
                name: "Energy",
                deals: 8,
                growth: "+25%",
                color: "bg-orange-500/20",
              },
            ].map((industry, i) => (
              <div
                key={i}
                className={`glass p-6 rounded-xl ${industry.color} border border-white/10`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{industry.name}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10">
                    {industry.growth}
                  </span>
                </div>
                <p className="text-3xl font-bold mb-2">
                  {industry.deals} deals
                </p>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-white/40 to-white/60 rounded-full"
                    style={{ width: `${(industry.deals / 24) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustryExpertise;
