'use client';

import { Cpu, ShieldCheck, TrendingUp, Rocket, Target, Zap, ChevronRight, BarChart3, Users, Award, CheckCircle, Sparkles } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const ValueProposition = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [animatedCounts, setAnimatedCounts] = useState({
    deals: 0,
    compliance: 0,
    cells: 0,
    clients: 0
  });

  const values = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Real-World Deal Proven",
      description: "Models derived from actual M&A transactions with audited financials",
      stats: "50+",
      statLabel: "closed deals",
      color: "from-blue-500 to-cyan-500",
      gradient: "from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10",
      delay: 0.1,
      features: ["Audited financials", "Real transaction data", "Post-deal validation"]
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Regulatory Compliant",
      description: "Built to SEC/FASB standards with full audit trails and version control",
      stats: "100%",
      statLabel: "compliance rate",
      color: "from-emerald-500 to-teal-500",
      gradient: "from-emerald-500/20 to-teal-500/20 dark:from-emerald-500/10 dark:to-teal-500/10",
      delay: 0.2,
      features: ["SEC/FASB standards", "Full audit trails", "Version control"]
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Scalable Architecture",
      description: "Modular design that scales from early-stage startups to Fortune 500",
      stats: "10M+",
      statLabel: "cells modeled",
      color: "from-purple-500 to-pink-500",
      gradient: "from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10",
      delay: 0.3,
      features: ["Modular design", "Enterprise scaling", "Custom workflows"]
    }
  ];

  const stats = [
    { icon: <Users />, value: "200+", label: "Enterprise Clients", suffix: "", duration: 2 },
    { icon: <Award />, value: "99", label: "Satisfaction Rate", suffix: "%", duration: 2 },
    { icon: <BarChart3 />, value: "1.2K", label: "Deals Analyzed", suffix: "+", duration: 2 },
    { icon: <Zap />, value: "24", label: "Hour Support", suffix: "/7", duration: 2 }
  ];

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimatedCounts({
          deals: 50,
          compliance: 100,
          cells: 10,
          clients: 200
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const statVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section className="relative py-24 overflow-hidden" ref={containerRef}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            initial={{ 
              x: Math.random() * 100 + 'vw',
              y: Math.random() * 100 + 'vh',
              opacity: 0
            }}
            animate={{ 
              y: [null, '-20px', '0px'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 mb-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium tracking-wide">Enterprise-Grade</span>
            <Rocket className="w-5 h-5 text-primary ml-2" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8">
            <span className="block mb-3">Industrial-Grade</span>
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-primary via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Financial Engineering
              </span>
              <Target className="absolute -right-12 -top-4 w-12 h-12 text-primary/30 animate-pulse" />
              <motion.div
                className="absolute -bottom-3 left-0 h-1 bg-gradient-to-r from-primary to-transparent"
                initial={{ width: 0 }}
                animate={isInView ? { width: "100%" } : { width: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Institutional-grade models trusted by investment banks, private equity firms, 
            and corporate development teams worldwide
          </motion.p>
        </motion.div>

        {/* Main Value Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-3 gap-8 mb-20"
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              custom={index}
              className="group relative"
            >
              {/* Card Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500`} />
              
              <div className="relative h-full bg-card border-2 border-border rounded-3xl p-8 shadow-lg shadow-black/5 dark:shadow-white/5 overflow-hidden">
                {/* Animated Border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 1, ease: "linear" }}
                />
                
                {/* Icon */}
                <motion.div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${value.color} mb-8 shadow-lg`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-white">{value.icon}</div>
                </motion.div>

                {/* Title */}
                <motion.h3
                  className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  {value.title}
                  <ChevronRight className="w-5 h-5 ml-2 inline opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-2 transition-all" />
                </motion.h3>

                {/* Description */}
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  {value.description}
                </p>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {value.features.map((feature, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: value.delay + i * 0.1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Stats Counter */}
                <div className="pt-6 border-t border-border">
                  <div className="flex items-end justify-between">
                    <div>
                      <motion.div
                        className="text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80"
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 200,
                          delay: value.delay 
                        }}
                      >
                        {value.stats}
                      </motion.div>
                      <div className="text-sm text-muted-foreground mt-2">{value.statLabel}</div>
                    </div>
                    <motion.div
                      className="p-3 rounded-xl bg-gradient-to-br from-background to-border"
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Zap className="w-6 h-6 text-primary" />
                    </motion.div>
                  </div>
                </div>

                {/* Floating Element */}
                <motion.div
                  className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-gradient-to-r from-card/50 to-card/30 border border-border rounded-3xl p-8 lg:p-12 mb-16"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={statVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-b from-background/50 to-background/20 backdrop-blur-sm border border-border"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
                }}
              >
                <motion.div
                  className="inline-flex p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-primary">{stat.icon}</div>
                </motion.div>
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                  <span className="text-2xl">{stat.suffix}</span>
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center"
        >
          <div className="inline-flex flex-col lg:flex-row items-center gap-8 p-8 lg:p-10 rounded-3xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-2 border-primary/20 backdrop-blur-sm shadow-2xl shadow-primary/10">
            <div className="text-left space-y-3">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-blue-500">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold">Ready for Enterprise-Grade Models?</h3>
                  <p className="text-muted-foreground text-lg">Join 200+ financial institutions</p>
                </div>
              </div>
            </div>
            <motion.button
              className="relative px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-primary-foreground font-semibold text-lg group overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Button Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative flex items-center gap-2">
                Get Started
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </motion.button>
          </div>

          {/* Trust Badges */}
          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-6 opacity-70"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {["Investment Banks", "PE Firms", "Fortune 500", "Hedge Funds"].map((badge, i) => (
              <div
                key={i}
                className="px-4 py-2 rounded-full border border-border bg-card/50 text-sm"
              >
                {badge}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-1/3 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-10 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full"
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -180, -360]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </section>
  );
};

export default ValueProposition;