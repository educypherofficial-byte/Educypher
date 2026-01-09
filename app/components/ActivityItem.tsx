"use client";

import { CheckCircle, BookOpen, MessageSquare } from "lucide-react";
import { Activity } from "@/types/activity";
import { motion } from "framer-motion";

export default function ActivityItem({ activity }: { activity: Activity }) {
  const icon =
    activity.type === "practice" ? (
      <CheckCircle className="text-emerald-400" />
    ) : activity.type === "learn" ? (
      <BookOpen className="text-blue-400" />
    ) : (
      <MessageSquare className="text-purple-400" />
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        group relative flex items-start gap-4
        rounded-2xl
        border border-neutral-800
        bg-neutral-900/60 backdrop-blur
        p-4
        transition-all duration-300
        hover:-translate-y-1
        hover:border-emerald-500/30
        hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]
      "
    >
      {/* icon container */}
      <div
        className="
          flex h-10 w-10 shrink-0 items-center justify-center
          rounded-xl
          bg-white/5
          transition-transform duration-300
          group-hover:scale-110
        "
      >
        {icon}
      </div>

      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-snug">
          {activity.title}
        </p>

        <p className="text-xs text-gray-500">
          {activity.user} • {activity.createdAt}
        </p>
      </div>

      {/* subtle right-edge accent */}
      <span
        className="
          pointer-events-none absolute right-0 top-1/2 -translate-y-1/2
          h-10 w-px
          bg-gradient-to-b from-transparent via-white/20 to-transparent
          opacity-0 group-hover:opacity-100
          transition
        "
      />
    </motion.div>
  );
}
