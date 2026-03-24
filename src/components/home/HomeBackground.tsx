"use client";

import React from "react";

const HomeBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#020617]">
      {/* Fixed Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Gradient Blobs */}
        <div className="absolute right-[-10%] top-[-10%] w-[70%] h-[80%] bg-blue-600/10 blur-[130px] rounded-full" />
        <div className="absolute left-[-5%] bottom-[-5%] w-[50%] h-[60%] bg-teal-600/10 blur-[110px] rounded-full" />
        <div className="absolute right-[15%] bottom-[10%] w-[40%] h-[50%] bg-indigo-600/10 blur-[100px] rounded-full" />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        {/* Subtle Noise/Grain (Optional but premium) */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default HomeBackground;
