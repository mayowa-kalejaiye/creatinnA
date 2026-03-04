"use client";

import React from "react";
import Image from 'next/image';
import { motion } from "framer-motion";

interface VisualGridProps {
  images: { src: string; alt?: string; caption?: string }[];
}

export default function VisualGrid({ images }: VisualGridProps) {
  return (
    <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {images.map((img, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-lg overflow-hidden bg-gray-800/20"
        >
          <div className="relative w-full h-24">
            <Image src={img.src} alt={img.alt || `visual-${i}`} fill className="object-cover" />
          </div>
          {img.caption && (
            <div className="p-2 text-xs text-white/70">{img.caption}</div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
