"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/Badge";

import {
  BookOpen,
  Code2,
  Users,
  Rss,
  Trophy,
  Flame,
  ArrowRight,
  Target,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }

      setUser(u);

      const snap = await getDoc(doc(db, "users", u.uid));
      if (snap.exists()) {
        setStats(snap.data());
      }
    });

    return () => unsub();
  }, [router]);

  if (!user || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  const streak = stats.streak || 0;

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden text-white">
        {/* ===== BACKGROUND ===== */}
        <div className="absolute inset-0 -z-10 bg-neutral-950" />
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-[140px] animate-floatSlow" />
        <div className="absolute top-1/3 -right-32 h-[450px] w-[450px] rounded-full bg-cyan-400/20 blur-[140px] animate-floatSlow delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative px-6 py-10">
          <div className="max-w-7xl mx-auto space-y-12">

            {/* HEADER */}
            <section>
              <h1 className="text-3xl font-bold">
                Welcome back,{" "}
                <span className="text-emerald-400">
                  {user.displayName || "Developer"}
                </span>{" "}
                👋
              </h1>
              <p className="text-gray-400 text-sm">
                Let’s make progress today.
              </p>
            </section>

            {/* TODAY'S GOAL */}
            <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-cardPop">
              <div className="flex items-start gap-3">
                <Target className="text-emerald-400 mt-1" />
                <div>
                  <h2 className="font-semibold text-lg">
                    Today’s Goal
                  </h2>
                  <p className="text-sm text-gray-300">
                    Complete your first learning module to start your streak.
                  </p>
                </div>
              </div>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition"
              >
                Start Learning <ArrowRight size={16} />
              </Link>
            </section>

            {/* STATS */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard icon={<Trophy size={20} />} label="Points" value={stats.points || 0} sub="Earn by learning & helping" />
              <StatCard icon={<Flame size={20} />} label="Streak" value={`${streak} days`} sub="Daily activity" />
              <StatCard icon={<Code2 size={20} />} label="Labs Completed" value="0" sub="Coming soon" />
            </section>

            {/* STREAK VISUAL */}
            <section>
              <h2 className="text-lg font-semibold mb-3">🔥 Streak Progress</h2>
              <div className="flex gap-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-10 w-10 rounded-lg flex items-center justify-center text-sm font-semibold
                      ${i < streak
                        ? "bg-emerald-500 text-black"
                        : "bg-neutral-800 text-gray-500"}
                    `}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Build a 7-day streak to unlock your first badge.
              </p>
            </section>

            {/* CONTINUE */}
            <section className="rounded-xl border border-white/10 bg-neutral-900/70 p-5">
              <h3 className="font-semibold mb-1">📌 Continue Learning</h3>
              <p className="text-sm text-gray-400">
                You haven’t started yet. Begin with your first lesson.
              </p>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 mt-3 text-emerald-400 hover:text-emerald-300 transition text-sm"
              >
                Go to Learn <ArrowRight size={14} />
              </Link>
            </section>

            {/* BADGES */}
            {stats.badges?.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3">🏆 Badges Earned</h2>
                <div className="flex gap-2 flex-wrap">
                  {stats.badges.map((b: string) => (
                    <Badge key={b} type={b} />
                  ))}
                </div>
              </section>
            )}

            {/* ACTIONS */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <ActionCard href="/learn" icon={<BookOpen size={22} />} title="Learn" desc="Structured concepts" />
              <ActionCard href="/practice" icon={<Code2 size={22} />} title="Practice" desc="Hands-on labs" />
              <ActionCard href="/community" icon={<Users size={22} />} title="Communities" desc="Ask & help others" />
              <ActionCard href="/feed" icon={<Rss size={22} />} title="Feed" desc="Tips & updates" />
            </section>

            {/* EMPTY STATE */}
            <section className="text-center py-12 text-gray-400 text-sm">
              You’re just getting started 👋 <br />
              Your activity, progress, and achievements will appear here soon.
            </section>

          </div>
        </div>
      </main>
    </>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ icon, label, value, sub }: any) {
  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900/75 p-5 hover:-translate-y-1 transition">
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
      className="rounded-xl border border-white/10 bg-neutral-900/70 p-5 hover:-translate-y-2 hover:border-emerald-500/40 transition"
    >
      <div className="text-emerald-400 mb-3">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-xs text-gray-400 mt-1">{desc}</p>
    </Link>
  );
}
