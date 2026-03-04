"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// --- Floating Image ---
const FLOAT_IMAGES = [
  { src: "/3U4A1815.jpg", className: "top-[8%] left-[5%] w-28 h-36 md:w-36 md:h-48 rotate-[-6deg]", delay: 0 },
  { src: "/3U4A1894.jpg", className: "top-[12%] right-[6%] w-24 h-32 md:w-32 md:h-44 rotate-[4deg]", delay: 0.15 },
  { src: "/IMG_3710.jpg", className: "bottom-[22%] left-[8%] w-24 h-32 md:w-28 md:h-40 rotate-[5deg]", delay: 0.3 },
  { src: "/IMG_5014.jpg", className: "bottom-[18%] right-[7%] w-28 h-36 md:w-32 md:h-44 rotate-[-3deg]", delay: 0.45 },
  { src: "/3U4A1905.jpg", className: "top-[40%] left-[2%] w-20 h-28 md:w-24 md:h-32 rotate-[-8deg] hidden md:block", delay: 0.6 },
  { src: "/IMG_0657.jpg", className: "top-[35%] right-[3%] w-20 h-28 md:w-24 md:h-32 rotate-[7deg] hidden md:block", delay: 0.75 },
];

function FloatingImage({ src, className, delay }: { src: string; className: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.5 + delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`absolute ${className} z-0 pointer-events-none`}
    >
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
        <img
          src={src}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
        {/* Subtle border glow */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
      </div>
    </motion.div>
  );
}

// --- Word Rotator ---
const ROTATING_WORDS = ["Skills", "Discipline", "Access", "Thinking", "Mastery"];

function WordRotator() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block relative h-[1.15em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={ROTATING_WORDS[currentIndex]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="block bg-gradient-to-r from-accent-gold via-amber-300 to-accent-gold bg-clip-text text-transparent"
        >
          {ROTATING_WORDS[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// --- Stats Bar ---
const STATS = [
  { value: "3", label: "Students per cohort" },
  { value: "₦100K+", label: "Investment starts at" },
  { value: "5 Mo.", label: "Alumni track duration" },
  { value: "Lagos", label: "Physical campus" },
];

// --- Main Hero Component ---
export default function IntroAnimation() {
  return (
    <section className="relative w-full h-screen bg-[#060606] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/3U4A1815.jpg"
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
        {/* Radial glow accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/[0.07] rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-accent-gold/[0.03] rounded-full blur-3xl" />
        {/* Subtle inset grid overlay with rounded edges */}
        <div aria-hidden className="absolute inset-6 md:inset-12 pointer-events-none z-5 rounded-3xl overflow-hidden">
          <div
            className="w-full h-full mix-blend-overlay"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "88px 88px, 88px 88px",
              opacity: 0.75,
            }}
          />
        </div>
      </div>

      {/* Floating images */}
      {FLOAT_IMAGES.map((img) => (
        <FloatingImage key={img.src} {...img} />
      ))}

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50">
              Now Accepting Applications
            </span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight mb-6 max-w-5xl"
        >
          Where Creative <WordRotator />{" "}
          <br className="hidden md:block" />
          <span className="text-white/90">Meets</span> Business Mastery
        </motion.h1>

        {/* Sub text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="text-base md:text-lg text-white/40 max-w-xl leading-relaxed mb-10"
        >
          CreatINN Academy is a selective institution for ambitious creators.
          <br className="hidden md:block" />
          Earn access. Build skills. Become alumni.{" "}
          <span className="text-accent-gold font-semibold">No hype. No shortcuts.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/apply"
            className="group relative px-8 py-4 bg-white text-black font-bold text-sm rounded-xl hover:bg-accent-gold transition-all duration-300 shadow-2xl shadow-white/10"
          >
            <span className="flex items-center gap-2">
              Apply Now
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </Link>
          <Link
            href="#programs"
            className="px-8 py-4 text-sm font-semibold text-white/50 hover:text-white rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.02] transition-all duration-300"
          >
            Explore Programs
          </Link>
        </motion.div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-white/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
