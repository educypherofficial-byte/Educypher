"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

import { getCategories, getLessons } from "@/lib/learn";
import { LearnCategory, Lesson } from "@/types/learn";

export default function LearnPage() {
  const [categories, setCategories] = useState<LearnCategory[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setCategories(await getCategories());
      setLessons(await getLessons());
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-400">
          Loading lessons…
        </div>
      </>
    );
  }

  const filteredLessons = lessons.filter((l) => {
    const catMatch = activeCat === "all" || l.category === activeCat;
    const searchMatch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      (l.hashtags ?? []).some((h) =>
        h.toLowerCase().includes(search.toLowerCase())
      );
    return catMatch && searchMatch;
  });

  return (
    <>
      {/* 🔥 SAME NAV AS DASHBOARD */}
      <Navbar />

      <main className="min-h-screen bg-neutral-950 text-white px-6 py-10">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* HEADER */}
          <h1 className="text-3xl font-bold">Learn</h1>

          {/* SEARCH */}
          <input
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm text-white placeholder-gray-500"
            placeholder="Search lessons or #hashtags"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* CATEGORIES */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveCat("all")}
              className={`px-4 py-2 rounded-full text-sm transition ${
                activeCat === "all"
                  ? "bg-emerald-500 text-black"
                  : "bg-neutral-900 border border-neutral-800"
              }`}
            >
              All
            </button>

            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => setActiveCat(c.slug)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  activeCat === c.slug
                    ? "bg-emerald-500 text-black"
                    : "bg-neutral-900 border border-neutral-800"
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>

          {/* LESSON CARDS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLessons.map((l) => (
              <Link
                key={l.id}
                href={`/learn/${l.id}`}
                className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 hover:border-emerald-500/40 transition"
              >
                <h2 className="font-semibold mb-2">{l.title}</h2>

                {(l.hashtags ?? []).length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {(l.hashtags ?? []).map((h) => (
                      <span
                        key={h}
                        className="text-xs bg-neutral-800 px-2 py-1 rounded-full"
                      >
                        #{h}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}

            {filteredLessons.length === 0 && (
              <div className="text-gray-400 col-span-full">
                No lessons found.
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  );
}
