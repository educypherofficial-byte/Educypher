"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { getPracticeLabs } from "@/lib/practice";
import { Lock, Code2 } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function PracticePage() {
  const router = useRouter();

  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  // 🔐 Auth guard
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      } else {
        setAuthLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  // 📦 Load data only after auth
  useEffect(() => {
    if (!authLoading) {
      async function load() {
        const labs = await getPracticeLabs();
        setLabs(labs);
        setLoading(false);
      }
      load();
    }
  }, [authLoading]);

  // ⏳ Wait for auth
  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-400">
          Checking access…
        </div>
      </>
    );
  }

  // ⏳ Wait for data
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-400">
          Loading labs…
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Practice Coding | EduCypher</title>
        <meta
          name="description"
          content="Practice coding problems by topic and difficulty."
        />
      </Head>

      <Navbar />

      <main className="relative min-h-screen text-white overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-neutral-950" />
        <div className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-emerald-500/20 blur-[160px]" />
        <div className="absolute top-1/3 -right-32 h-[480px] w-[480px] rounded-full bg-cyan-400/20 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative max-w-5xl mx-auto px-6 py-14 space-y-10">
          <header className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Practice
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Hands-on coding labs to strengthen real problem-solving skills.
            </p>
          </header>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-5">
            <h2 className="font-semibold text-emerald-400 mb-1">
              🚧 Practice Labs Coming Soon
            </h2>
            <p className="text-sm text-gray-300">
              We’re building real, non-MCQ labs with code execution,
              hints, and progressive difficulty.
            </p>
          </div>

          <div className="space-y-4">
            {labs.map((lab) => (
              <div
                key={lab.id}
                className="group relative rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur px-5 py-4 opacity-70 cursor-not-allowed"
              >
                <div className="absolute right-4 top-4 text-gray-500">
                  <Lock size={16} />
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-neutral-800 flex items-center justify-center text-gray-400">
                    <Code2 size={18} />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-medium">{lab.title}</h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {lab.topic} • {lab.difficulty}
                    </p>

                    <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-gray-400">
                      Coming soon
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {labs.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg font-medium mb-2">
                  Practice labs are on the way 🚀
                </p>
                <p className="text-sm">
                  Start with{" "}
                  <Link href="/learn" className="text-emerald-400 hover:underline">
                    learning
                  </Link>{" "}
                  while we finish labs.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
