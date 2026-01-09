"use client";

import React from "react";
import { motion } from "framer-motion";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`
        relative rounded-2xl
        border border-neutral-800
        bg-neutral-900/60 backdrop-blur
        p-6
        transition-all duration-300
        hover:-translate-y-1
        hover:border-emerald-500/40
        hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]
        ${className}
      `}
    >
      {/* subtle top glow */}
      <div
        className="
          pointer-events-none absolute inset-x-0 top-0
          h-px
          bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent
        "
      />

      {children}
    </motion.div>
  );
}
