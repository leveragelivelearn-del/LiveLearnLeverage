"use client";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRight, TrendingUp, Activity } from "lucide-react";
import { motion } from "framer-motion";

const industries = [
  {
    name: "Technology",
    deals: 24,
    growth: "+18%",
    chartColor: "var(--chart-1)",
  },
  {
    name: "Healthcare",
    deals: 18,
    growth: "+22%",
    chartColor: "var(--chart-2)",
  },
  {
    name: "Financial Services",
    deals: 15,
    growth: "+14%",
    chartColor: "var(--chart-3)",
  },
  {
    name: "Industrial",
    deals: 12,
    growth: "+9%",
    chartColor: "var(--chart-4)",
  },
  {
    name: "Consumer",
    deals: 10,
    growth: "+12%",
    chartColor: "var(--chart-5)",
  },
  {
    name: "Energy",
    deals: 8,
    growth: "+25%",
    chartColor: "var(--chart-1)",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 50 },
  },
};

const IndustryExpertise = () => {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="lg:w-2/5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                Deep <span className="text-primary">Sector Intelligence</span>
              </h2>
              <div className="h-1 w-20 bg-primary rounded-full mt-6 mb-6" />
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our models incorporate industry-specific KPIs, regulatory
                frameworks, and market dynamics across key verticals. We transform
                raw data into actionable lucrative opportunities.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Button size="lg" className="group text-base px-8 py-6">
                View All Industries
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>

          {/* Right Grid */}
          <motion.div
            className="lg:w-3/5 w-full grid grid-cols-1 md:grid-cols-2 gap-5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {industries.map((industry, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                className="group relative bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Hover Gradient Overlay */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                  style={{ backgroundColor: industry.chartColor }}
                />

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg bg-background border border-border"
                      style={{ color: industry.chartColor }}
                    >
                      <Activity className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">
                      {industry.name}
                    </h3>
                  </div>
                  <span className="flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {industry.growth}
                  </span>
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-3xl font-bold text-foreground tracking-tight">
                      {industry.deals}
                    </p>
                    <span className="text-xs text-muted-foreground mb-1">
                      Active Deals
                    </span>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: industry.chartColor }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(industry.deals / 24) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IndustryExpertise;