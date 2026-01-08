"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar"; // ✅ ADD THIS

import {
  BookOpen,
  Code2,
  Users,
  Rss,
  Trophy,
  Flame,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/login");
      } else {
        setUser(u);
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <>
      {/* ✅ NAVBAR */}
      <Navbar />

      <main className="min-h-screen bg-neutral-950 text-white px-6 py-10">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* HEADER */}
          <section className="space-y-1">
            <h1 className="text-3xl font-bold">
              Welcome back,{" "}
              <span className="text-emerald-400">
                {user.displayName || "Developer"}
              </span>{" "}
              👋
            </h1>
            <p className="text-gray-400 text-sm">
              Let’s continue building real skills today.
            </p>
          </section>

          {/* STATS */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard icon={<Trophy size={20} />} label="Points" value="0" sub="Earn by learning & posting" />
            <StatCard icon={<Flame size={20} />} label="Streak" value="0 days" sub="Practice daily" />
            <StatCard icon={<Code2 size={20} />} label="Labs Completed" value="0" sub="Hands-on practice" />
          </section>

          {/* ACTIONS */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <ActionCard href="/learn" icon={<BookOpen size={22} />} title="Learn" desc="Structured concepts with code" />
            <ActionCard href="/practice" icon={<Code2 size={22} />} title="Practice" desc="Real labs & challenges" />
            <ActionCard href="/community" icon={<Users size={22} />} title="Communities" desc="Language & topic-wise groups" />
            <ActionCard href="/feed" icon={<Rss size={22} />} title="Developer Feed" desc="Memes, tips & knowledge" />
          </section>

        </div>
      </main>
    </>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ icon, label, value, sub }: any) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <div className="flex items-center gap-2 text-emerald-400">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold mt-2">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{sub}</div>
    </div>
  );
}

function ActionCard({ href, icon, title, desc }: any) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 hover:border-emerald-500/40 transition"
    >
      <div className="text-emerald-400 mb-3">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-xs text-gray-400 mt-1">{desc}</p>
    </Link>
  );
}
