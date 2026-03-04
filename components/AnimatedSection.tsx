"use client";

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type Props = HTMLMotionProps<'div'> & {
  children?: React.ReactNode;
};

export default function AnimatedSection({ children, ...rest }: Props) {
  return (
    <motion.div {...rest}>
      {children}
    </motion.div>
  );
}
