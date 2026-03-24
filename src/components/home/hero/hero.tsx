"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const Hero: React.FC = () => {
  const [aboutData, setAboutData] = React.useState<any>(null);
  const [settingsData, setSettingsData] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutRes, settingsRes] = await Promise.all([
          fetch('/api/about'),
          fetch('/api/settings')
        ]);
        
        const [aboutData, settingsData] = await Promise.all([
          aboutRes.json(),
          settingsRes.json()
        ]);
        
        setAboutData(aboutData);
        setSettingsData(settingsData);
      } catch (error) {
        console.error("Failed to fetch hero data", error);
      }
    };
    fetchData();
  }, []);

  // Variants for staggered text animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  // Bubble bounce animation for the image
  const bubbleBounce: Variants = {
    animate: {
      y: [0, -20, 0],
      scale: [1, 1.05, 1],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-transparent">
      <div className="container mx-auto px-6 md:px-12 relative z-10 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

          {/* Left Side: Content */}
          <motion.div
            className="flex-1 text-left order-2 lg:order-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Decorative Icon from Screenshot */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="w-10 h-10 bg-white/10 rotate-45 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <div className="w-6 h-6 bg-white/20 rotate-12" />
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-4 uppercase"
            >
              {aboutData?.name?.split(' ').map((part: string, i: number) => (
                <React.Fragment key={i}>
                  {part} {i === 0 && <br />}
                </React.Fragment>
              )) || <>GAMAELLE <br /> CHARLES</>}
            </motion.h1>

            {/* Continuous Typewriter Animation for Subtitle */}
            <motion.div variants={itemVariants} className="mb-10 min-h-[1.5em] flex items-center">
              <motion.p className="text-sm md:text-lg text-white/60 font-medium tracking-[0.2em] uppercase">
                {(aboutData?.tagline || "Portfolio of a Finance Student").split("").map((char: string, i: number) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      times: [0, 0.1, 0.8, 1],
                      delay: i * 0.05,
                      repeatDelay: 2
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                  }}
                  className="inline-block w-[2px] h-[1em] bg-white/60 ml-1 align-middle"
                />
              </motion.p>
            </motion.div>

            {/* Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-6"
            >

              <Link
                href={aboutData?.resumeUrl || "/assets/gamaelle-charles-resume.pdf"}
                target="_blank"
                className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-full border border-white/10 backdrop-blur-md transition-all duration-300 transform hover:scale-105 active:scale-95 font-bold tracking-widest text-xs"
              >
                DOWNLOAD CV
              </Link>
              <Link
                href={settingsData?.socialLinks?.linkedin || "https://linkedin.com/in/gamaelle-charles-liv3theg00dlif3"}
                target="_blank"
                className="group relative"
              >
                <span className="text-white font-bold tracking-widest text-sm border-b-2 border-white/30 group-hover:border-white transition-all duration-300 pb-1">
                  LINKEDIN
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side: Image with Bubble Bounce */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-end order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="relative w-56 h-56 md:w-72 md:h-72 lg:w-[380px] lg:h-[380px]"
              variants={bubbleBounce}
              animate="animate"
            >
              {/* Outer Glow/Orbit Ring */}
              <div className="absolute inset-[-15px] border border-white/5 rounded-full animate-pulse" />

              {/* Image Frame */}
              <div className="w-full h-full rounded-full overflow-hidden border-[8px] border-white/10 shadow-2xl relative">
                <Image
                  src={aboutData?.profileImage || "/assets/gamaelle-charles.png"}
                  alt={aboutData?.name || "Gamaelle Charles"}
                  fill
                  priority
                  className="object-cover scale-110"
                />
              </div>

              {/* Floating Decorative Elements */}
              <motion.div
                className="absolute top-0 right-0 w-12 h-12 bg-blue-500/20 backdrop-blur-xl rounded-full border border-white/10"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-10 left-[-20px] w-8 h-8 bg-teal-500/20 backdrop-blur-xl rounded-full border border-white/10"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              />
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Side Label (Optional, seen in some premium portfolios) */}
      <div className="absolute left-6 bottom-12 hidden md:block vertical-text">
        <span className="text-[10px] text-white/20 tracking-[1em] font-bold uppercase rotate-180" style={{ writingMode: 'vertical-rl' }}>
          SCROLL TO EXPLORE
        </span>
      </div>
    </section>
  );
};

export default Hero;
