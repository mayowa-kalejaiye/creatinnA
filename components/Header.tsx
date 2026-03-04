'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const prevScrollY = useRef(0);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);

    // Show navbar when scrolling up or near top; hide when scrolling down
    const direction = latest - prevScrollY.current;
    if (latest < 100) {
      setVisible(true);
    } else if (direction < -5) {
      setVisible(true);
    } else if (direction > 5) {
      setVisible(false);
    }
    prevScrollY.current = latest;
  });

  // Track viewport size so the header remains visible on small screens
  useEffect(() => {
    function checkMobile() {
      setIsMobile(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isMobile || visible || isMenuOpen ? 0 : '-100%' }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/70 backdrop-blur-2xl border-b border-white/[0.06] shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <span className="text-xl font-display font-bold text-white tracking-tight">
              Creat<span className="bg-gradient-to-r from-accent-gold to-amber-300 bg-clip-text text-transparent">INN</span>
            </span>
            <span className="block text-[8px] uppercase tracking-[0.35em] text-white/30 font-semibold -mt-0.5 text-right">
              Academy
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          {/* Nav links in a pill container */}
          <div className={`flex items-center gap-1 rounded-full px-1.5 py-1.5 transition-all duration-500 ${
            scrolled ? 'bg-white/[0.04] border border-white/[0.06]' : 'bg-white/[0.03] border border-white/[0.04]'
          }`}>
            {[
              { href: '/programs', label: 'Programs' },
              { href: '/alumni', label: 'Alumni' },
              { href: '/thinkinn', label: 'Thinkinn' },
              { href: '/about', label: 'About' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-[13px] font-medium text-white/55 hover:text-white rounded-full hover:bg-white/[0.06] transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="ml-4 flex items-center gap-3">
            <Link
              href="/login"
              className="text-[13px] font-medium text-white/40 hover:text-white/70 transition-colors duration-300 px-3 py-2"
            >
              Log in
            </Link>
            <Link
              href="/apply"
              className="group relative px-5 py-2.5 bg-white text-black text-[13px] font-bold rounded-full hover:bg-accent-gold transition-all duration-300 shadow-lg shadow-white/5"
            >
              <span className="flex items-center gap-1.5">
                Apply
                <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          className="inline-flex md:hidden relative w-10 h-10 items-center justify-center rounded-full bg-white/[0.08] border border-white/[0.12] text-white z-50 ring-1 ring-white/5"
          aria-label="Toggle menu"
        >
          <div className="w-4 h-3 flex flex-col justify-between">
            <span className={`block h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-[5.25px]' : ''}`} />
            <span className={`block h-[1.5px] bg-white rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-0' : ''}`} />
            <span className={`block h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-[5.25px]' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="md:hidden overflow-hidden bg-black/90 backdrop-blur-2xl border-t border-white/[0.04]"
      >
        <div className="px-6 py-6 flex flex-col gap-1">
          {[
            { href: '/programs', label: 'Programs', desc: 'Explore our offerings' },
            { href: '/alumni', label: 'Alumni Track', desc: 'Earn your status' },
            { href: '/thinkinn', label: 'The Thinkinn', desc: 'Thought leadership' },
            { href: '/about', label: 'About', desc: 'Our philosophy' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between py-3.5 px-4 rounded-xl hover:bg-white/[0.04] transition-colors group"
            >
              <div>
                <span className="block text-[15px] font-semibold text-white/80 group-hover:text-white transition-colors">{link.label}</span>
                <span className="block text-[11px] text-white/30">{link.desc}</span>
              </div>
              <svg className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-all group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}

          <div className="h-px bg-white/[0.06] my-3" />

          <div className="flex gap-3">
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex-1 text-center py-3 text-[13px] font-medium text-white/50 rounded-xl border border-white/[0.08] hover:bg-white/[0.04] transition-all"
            >
              Log in
            </Link>
            <Link
              href="/apply"
              onClick={() => setIsMenuOpen(false)}
              className="flex-1 text-center py-3 text-[13px] font-bold text-black bg-white rounded-xl hover:bg-accent-gold transition-all"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
