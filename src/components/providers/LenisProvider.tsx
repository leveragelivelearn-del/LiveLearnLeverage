'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode, useEffect } from 'react';

function LenisExposer() {
  const lenis = useLenis()
  useEffect(() => {
    if (lenis) {
      (window as any).__lenis = lenis
    }
  }, [lenis])
  return null
}

interface LenisProviderProps {
  children: ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing function
        lerp: 0.1,
        wheelMultiplier: 1,
        smoothWheel: true,
        // Remove smoothTouch - it's not a valid option
        // touchMultiplier: 2, // Also remove this if it causes issues
        syncTouch: false, // Use syncTouch instead
        touchMultiplier: 1,
        infinite: false,
      }}
    >
      <LenisExposer />
      {children}
    </ReactLenis>
  );
}