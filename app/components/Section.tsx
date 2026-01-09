"use client";

import { motion } from "framer-motion";

export default function Section({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="
        relative max-w-6xl mx-auto
        px-6 py-24 space-y-20
      "
    >
      {/* subtle top divider glow */}
      <div
        className="
          absolute top-0 left-1/2 -translate-x-1/2
          h-px w-32
          bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent
        "
      />

      {children}
    </motion.section>
  );
}
