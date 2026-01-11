'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
    >
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-display font-bold gradient-text">
          CreatINN
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/programs" className="text-white/80 hover:text-white transition-colors">
            Programs
          </Link>
          <Link href="/alumni" className="text-white/80 hover:text-white transition-colors">
            Alumni Track
          </Link>
          <Link href="/thinkinn" className="text-white/80 hover:text-white transition-colors">
            The Thinkinn
          </Link>
          <Link href="/about" className="text-white/80 hover:text-white transition-colors">
            About
          </Link>
          <Link 
            href="/apply"
            className="px-6 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-accent-gold transition-all duration-300"
          >
            Apply
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-white"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass border-t border-white/10"
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            <Link href="/programs" className="text-white/80 hover:text-white py-2">
              Programs
            </Link>
            <Link href="/alumni" className="text-white/80 hover:text-white py-2">
              Alumni Track
            </Link>
            <Link href="/thinkinn" className="text-white/80 hover:text-white py-2">
              The Thinkinn
            </Link>
            <Link href="/about" className="text-white/80 hover:text-white py-2">
              About
            </Link>
            <Link 
              href="/apply"
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg text-center"
            >
              Apply
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
