'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

// Routes that use fixed-position UI (sidebars, panels) — smooth scroll breaks them
const SKIP_SMOOTH = ['/admin', '/dashboard', '/course/', '/login', '/signup', '/payments'];

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const smootherRef = useRef<ScrollSmoother | null>(null);
  const pathname = usePathname();
  const skip = SKIP_SMOOTH.some((p) => pathname?.startsWith(p));

  useEffect(() => {
    if (skip) return;

    smootherRef.current = ScrollSmoother.create({
      smooth: 2,
      effects: true,
      smoothTouch: 0.1,
    });

    return () => {
      if (smootherRef.current) {
        smootherRef.current.kill();
      }
    };
  }, [skip]);

  if (skip) {
    return <>{children}</>;
  }

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        {children}
      </div>
    </div>
  );
}
