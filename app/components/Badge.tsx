"use client";

import { Trophy, Flame, Star } from "lucide-react";
import { motion } from "framer-motion";

export function Badge({ type }: { type: string }) {
  const map: any = {
    "first-lesson": {
      icon: <Star size={14} />,
      label: "First Lesson",
    },
    "streak-3": {
      icon: <Flame size={14} />,
      label: "3 Day Streak",
    },
    "streak-7": {
      icon: <Trophy size={14} />,
      label: "7 Day Streak",
    },
    helper: {
      icon: <Star size={14} />,
      label: "Community Helper",
    },
  };

  const badge = map[type];
  if (!badge) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="
        relative flex items-center gap-1.5
        px-2.5 py-1
        rounded-full
        bg-neutral-800/80 backdrop-blur
        border border-white/10
        text-xs font-medium text-emerald-400
        hover:-translate-y-0.5
        hover:shadow-[0_8px_24px_-12px_rgba(16,185,129,0.6)]
        transition-all duration-200
      "
    >
      {/* subtle glow ring */}
      <span
        className="
          pointer-events-none absolute inset-0
          rounded-full
          bg-emerald-400/10
          opacity-0
          group-hover:opacity-100
          transition
        "
      />

      <span className="flex items-center justify-center">
        {badge.icon}
      </span>

      <span>{badge.label}</span>
    </motion.div>
  );
}
