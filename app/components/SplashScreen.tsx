"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function SplashScreen() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0, filter: "blur(6px)" }}
      transition={{ delay: 1.6, duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      {/* ===== BACKGROUND (same as homepage) ===== */}
      <div className="absolute inset-0 bg-neutral-950" />

      {/* ambient blobs */}
      <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-emerald-500/20 blur-[140px] animate-floatSlow" />
      <div className="absolute bottom-0 -right-32 h-[360px] w-[360px] rounded-full bg-cyan-400/20 blur-[140px] animate-floatSlow delay-1000" />

      {/* subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* ===== CONTENT ===== */}
      <motion.div
        initial={
          reduceMotion
            ? { opacity: 1 }
            : { scale: 0.92, opacity: 0 }
        }
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative text-center"
      >
        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-4xl font-bold tracking-tight"
        >
          <span className="text-white">Edu</span>
          <span className="text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]">
            Cypher
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mt-2 text-sm text-gray-400 tracking-wide"
        >
          Learn. Practice. Build.
        </motion.p>

        {/* Loader */}
        <div className="mt-8 h-1 w-36 overflow-hidden rounded bg-white/10 mx-auto">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            className="h-full w-1/2 bg-gradient-to-r from-emerald-400 to-cyan-400"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
