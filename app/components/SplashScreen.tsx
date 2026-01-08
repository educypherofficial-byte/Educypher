"use client";

import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1.6, duration: 0.6 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white">
          Edu<span className="text-emerald-400">Cypher</span>
        </h1>

        <p className="mt-2 text-sm text-gray-400 tracking-wide">
          Learn. Practice. Build.
        </p>

        {/* Loader */}
        <div className="mt-6 h-1 w-32 overflow-hidden rounded bg-gray-800 mx-auto">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.4 }}
            className="h-full bg-emerald-400"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
