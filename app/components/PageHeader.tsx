"use client";

import { motion } from "framer-motion";

export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative space-y-4"
    >
      {/* subtle accent line */}
      <div className="absolute -left-4 top-2 h-10 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-cyan-400 opacity-70" />

      <h1
        className="
          text-4xl font-extrabold tracking-tight
          bg-gradient-to-r from-white via-white to-white/70
          bg-clip-text text-transparent
        "
      >
        {title}
      </h1>

      {subtitle && (
        <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* soft divider */}
      <div className="pt-4">
        <div className="h-px w-24 bg-gradient-to-r from-emerald-400/40 to-transparent" />
      </div>
    </motion.header>
  );
}
