"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { User, LogOut, Users, Rss } from "lucide-react";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar() {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-900/70 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="text-2xl font-bold">
          <span className="text-emerald-400">Edu</span>Cypher
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {user && (
            <Link href="/dashboard" className="hover:text-emerald-400">
              Dashboard
            </Link>
          )}

          <Link href="/learn" className="hover:text-emerald-400">
            Learn
          </Link>

          <Link href="/practice" className="hover:text-emerald-400">
            Practice
          </Link>

          <Link href="/community" className="hover:text-emerald-400 flex items-center gap-1">
            <Users size={14} /> Community
          </Link>

          {user && (
            <Link href="/feed" className="hover:text-emerald-400 flex items-center gap-1">
              <Rss size={14} /> Feed
            </Link>
          )}
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link
                href="/login"
                className="px-4 py-1.5 text-sm border border-neutral-700 rounded-lg hover:bg-neutral-800"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="px-4 py-1.5 text-sm bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* USER BADGE */}
              <div className="flex items-center gap-2 px-3 py-1.5 border border-neutral-700 rounded-lg">
                <User size={16} />
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
                className="p-2 border border-neutral-700 rounded-lg hover:bg-neutral-800"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
