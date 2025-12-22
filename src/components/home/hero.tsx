"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, BarChart3, BookOpen, TrendingUp, ShieldCheck, Globe } from "lucide-react";
// FIXED: Imported 'Variants' type
import { motion, Variants } from "framer-motion";

const HomeHeroSection = () => {
  // FIXED: Added ': Variants' type annotation to all variant objects
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0, y: 50 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.4,
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-secondary/5 to-background">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-30 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] -z-10 opacity-20" />

      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Text Content */}
          <motion.div 
            className="space-y-8 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-secondary text-sm font-medium text-primary mx-auto lg:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now Available: Q4 2025 Market Report
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                Live. Learn. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                  Leverage.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                Unlock institutional-grade M&A insights and financial models tailored for modern investment professionals.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-1" asChild>
                <Link href="/models">
                  Explore Portfolio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-secondary/50 transition-all duration-300" asChild>
                <Link href="/blog">
                  Read Insights
                  <BookOpen className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground pt-8 border-t border-border/50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>Verified Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>Global Reach</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Expert Analysis</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Visuals/Cards */}
          <motion.div 
            className="relative lg:h-[600px] flex items-center justify-center perspective-1000"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Main Floating Card */}
            <motion.div 
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10 w-full max-w-md bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl hover:shadow-primary/10 transition-shadow duration-500"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold">Performance</h3>
                  <p className="text-muted-foreground">Monthly Growth</p>
                </div>
                <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-sm border border-green-500/20">
                  +24.5% <TrendingUp className="ml-1 h-3 w-3" />
                </div>
              </div>
              
              {/* Animated Mock Chart */}
              <div className="h-48 flex items-end justify-between gap-3 mb-8 px-2">
                {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                  <motion.div 
                    key={i}
                    className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-md relative group"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1.2, delay: 0.5 + (i * 0.1), type: "spring" }}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                      {h}% Growth
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/30 p-4 rounded-2xl border border-border/50 hover:bg-secondary/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-3">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="font-bold text-xl">150+</div>
                  <div className="text-xs text-muted-foreground font-medium">Models Built</div>
                </div>
                <div className="bg-secondary/30 p-4 rounded-2xl border border-border/50 hover:bg-secondary/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="font-bold text-xl">50+</div>
                  <div className="text-xs text-muted-foreground font-medium">Articles Published</div>
                </div>
              </div>
            </motion.div>

            {/* Decorative Floating Blobs */}
            <motion.div 
              className="absolute top-10 right-10 -z-10 w-64 h-64 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full opacity-20 blur-3xl"
              animate={{ 
                y: [0, -20, 0], 
                scale: [1, 1.1, 1],
                rotate: [0, 10, 0]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <motion.div 
              className="absolute -bottom-10 -left-10 -z-10 w-72 h-72 bg-gradient-to-tr from-primary to-cyan-400 rounded-full opacity-20 blur-3xl"
              animate={{ 
                y: [0, 30, 0],
                scale: [1, 1.05, 1],
                rotate: [0, -10, 0]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1 
              }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HomeHeroSection;