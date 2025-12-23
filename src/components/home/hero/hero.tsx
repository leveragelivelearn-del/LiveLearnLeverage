"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules"; // Removed Navigation

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import Link from "next/link";
// Removed navigation css import

interface SlideData {
  id: number;
  image: string;
  label: string;
  title: string;
  description: string;
  primaryBtn: string;
  secondaryBtn: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1920",
    label: "TOWARDS A BRIGHT FUTURE",
    title: "Perfect Insurance When it Matters",
    description:
      "Beniam quis nostrud exercitation sed lamco laboris nis aliquip repraderit luptate velit excepteur ocaan ipsum.",
    primaryBtn: "HOW WE HELP",
    secondaryBtn: "FIND AN AGENT",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1920",
    label: "EXPERT STRATEGY",
    title: "Maximize Your Market Leverage",
    description:
      "Specialized financial insights and M&A advisory for investment professionals worldwide.",
    primaryBtn: "OUR PORTFOLIO",
    secondaryBtn: "GET IN TOUCH",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1920",
    label: "GLOBAL NETWORK",
    title: "Strategic Partnerships for Growth",
    description:
      "Connecting institutional investors with high-yield opportunities across emerging markets.",
    primaryBtn: "EXPLORE MODELS",
    secondaryBtn: "READ INSIGHTS",
  },
];

const Hero: React.FC = () => {
  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + custom * 0.2,
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <section className="relative w-full h-[90vh] md:h-screen overflow-hidden bg-black">
      {/* Updated Styles: Removed button styles, kept pagination */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.5;
          width: 10px;
          height: 10px;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: #e23645 !important;
          opacity: 1;
          transform: scale(1.2);
        }
      `}</style>

      <Swiper
        modules={[Autoplay, Pagination, EffectFade]} // Removed Navigation
        effect="fade"
        speed={1500} // Slower transition for smoother auto-slide feel
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        loop={true}
        allowTouchMove={false} // Optional: prevents user from swiping manually if you strictly want auto only
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {({ isActive }) => (
              <div className="relative w-full h-full flex items-center">
                {/* Background Image with Zoom Effect */}
                <div className="absolute inset-0 z-0">
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={isActive ? { scale: 1.15 } : { scale: 1 }}
                    transition={{ duration: 10, ease: "linear" }}
                    className="w-full h-full"
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50" />
                </div>

                {/* Content Container */}
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                  <div className="max-w-4xl">
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <div className="space-y-6">
                          {/* Label with Line */}
                          <motion.div
                            custom={0}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex items-center gap-4"
                          >
                            <div className="h-[2px] w-12 bg-white" />
                            <span className="text-white font-bold tracking-[0.2em] text-sm md:text-base">
                              {slide.label}
                            </span>
                          </motion.div>

                          {/* Heading */}
                          <motion.h1
                            custom={1}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] text-white"
                          >
                            {slide.title}
                          </motion.h1>

                          {/* Description */}
                          <motion.p
                            custom={2}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-lg md:text-xl text-white/80 max-w-2xl font-light leading-relaxed"
                          >
                            {slide.description}
                          </motion.p>

                          {/* Buttons */}
                          <motion.div
                            custom={3}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-wrap gap-4  pt-6"
                          >
                            <Link href="/models">
                              <button className="bg-[#e23645] hover:bg-[#c92d3a] cursor-pointer text-white px-8 py-4 rounded-md font-bold text-sm tracking-wider transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg">
                                EXPLORE MODELS
                              </button>
                            </Link>
                            <Link href="/blog">
                              <button className="bg-transparent border-2 border-white hover:bg-white hover:text-black cursor-pointer text-white px-8 py-4 rounded-md font-bold text-sm tracking-wider transition-all duration-300 transform hover:scale-105 active:scale-95">
                                READ INSIGHTS
                              </button>
                            </Link>
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
        {/* Navigation buttons div removed */}
      </Swiper>
    </section>
  );
};

export default Hero;
