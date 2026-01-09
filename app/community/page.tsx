"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { ArrowRight } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function CommunityListPage() {
  const router = useRouter();

  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  // 🔐 Auth Guard
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

  // 📦 Load communities only after auth
  useEffect(() => {
    if (!authLoading) {
      async function load() {
        const snap = await getDocs(collection(db, "communities"));
        setCommunities(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        );
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-400">
          Loading communities…
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen text-white overflow-hidden">

        {/* ===== MATCHED BACKGROUND ===== */}
        <div className="absolute inset-0 -z-10 bg-neutral-950" />

        <div className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-emerald-500/20 blur-[160px]" />
        <div className="absolute top-1/3 -right-32 h-[480px] w-[480px] rounded-full bg-cyan-400/20 blur-[160px]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* ===== CONTENT ===== */}
        <div className="relative max-w-6xl mx-auto px-6 py-14 space-y-10">

          {/* HEADER */}
          <header className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Communities
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Topic-focused developer spaces for discussion, help, and learning.
            </p>
          </header>

          {/* COMMUNITY GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {communities.map((c) => (
              <Link
                key={c.id}
                href={`/community/${c.slug}`}
                className="
                  group relative
                  rounded-2xl border border-neutral-800
                  bg-neutral-900/60 backdrop-blur
                  p-6
                  transition
                  hover:border-emerald-500/40
                  hover:-translate-y-1
                "
              >
                <div className="absolute inset-0 rounded-2xl bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition" />

                <div className="relative space-y-3">
                  <h2 className="text-lg font-semibold">
                    {c.title}
                  </h2>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="flex items-center gap-1 text-sm text-emerald-400 pt-2">
                    View community
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}

            {communities.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500">
                No communities available yet.
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
