"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { User, LogOut, Users, Rss } from "lucide-react";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";

export default function Navbar() {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="
        sticky top-0 z-40
        border-b border-white/10
        bg-neutral-900/70 backdrop-blur-xl
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight hover:opacity-90 transition"
        >
          <span className="text-emerald-400">Edu</span>
          <span className="text-white">Cypher</span>
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {user && <NavLink href="/dashboard">Dashboard</NavLink>}
          <NavLink href="/learn">Learn</NavLink>
          <NavLink href="/practice">Practice</NavLink>

          <NavLink href="/community" icon={<Users size={14} />}>
            Community
          </NavLink>

          {user && (
            <NavLink href="/feed" icon={<Rss size={14} />}>
              Feed
            </NavLink>
          )}
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link
                href="/login"
                className="
                  px-4 py-1.5 text-sm
                  border border-white/10 rounded-lg
                  hover:bg-white/5 transition
                "
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="
                  px-4 py-1.5 text-sm
                  bg-emerald-500 text-black font-semibold
                  rounded-lg hover:bg-emerald-400
                  transition
                "
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* USER BADGE */}
              <div
                className="
                  flex items-center gap-2 px-3 py-1.5
                  border border-white/10 rounded-lg
                  bg-white/5
                "
              >
                <User size={16} className="text-emerald-400" />
                <span className="text-sm">
                  {user.displayName || user.email?.split("@")[0]}
                </span>
              </div>

              {/* LOGOUT */}
              <button
                onClick={async () => {
                  await signOut(auth);
                  window.location.href = "/";
                }}
                className="
                  p-2 border border-white/10 rounded-lg
                  hover:bg-white/5 transition
                "
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}

/* ---------------- UI-ONLY SUB COMPONENT ---------------- */

function NavLink({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="
        relative flex items-center gap-1
        text-gray-300 hover:text-white
        transition
      "
    >
      {icon}
      <span>{children}</span>

      {/* hover underline */}
      <span
        className="
          absolute -bottom-1 left-0
          h-px w-0
          bg-gradient-to-r from-emerald-400 to-cyan-400
          transition-all duration-300
          group-hover:w-full
        "
      />
    </Link>
  );
}
