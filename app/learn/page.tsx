"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Search } from "lucide-react";

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
      <Navbar />

      {/* ===== MATCHED HOMEPAGE BACKGROUND ===== */}
      <main className="relative min-h-screen text-white overflow-hidden">

        {/* base */}
        <div className="absolute inset-0 -z-10 bg-neutral-950" />

        {/* ambient blobs */}
        <div className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-emerald-500/20 blur-[160px]" />
        <div className="absolute top-1/3 -right-32 h-[480px] w-[480px] rounded-full bg-cyan-400/20 blur-[160px]" />
        <div className="absolute bottom-0 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[180px]" />

        {/* subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* ===== CONTENT ===== */}
        <div className="relative max-w-7xl mx-auto px-6 py-12">

          {/* HEADER */}
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Learn
            </h1>
            <p className="text-gray-400 mt-2 max-w-2xl">
              Structured lessons focused on real developer fundamentals.
            </p>
          </header>

          {/* LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">

            {/* LEFT RAIL */}
            <aside className="space-y-6">

              {/* SEARCH */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  className="
                    w-full pl-9 pr-3 py-2.5 rounded-lg
                    bg-neutral-900/70 backdrop-blur
                    border border-neutral-800
                    text-sm text-white placeholder-gray-500
                    focus:outline-none focus:border-emerald-500/40
                  "
                  placeholder="Search lessons"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* CATEGORIES */}
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Categories
                </p>

                <CategoryItem
                  active={activeCat === "all"}
                  onClick={() => setActiveCat("all")}
                >
                  All lessons
                </CategoryItem>

                {categories.map((c) => (
                  <CategoryItem
                    key={c.slug}
                    active={activeCat === c.slug}
                    onClick={() => setActiveCat(c.slug)}
                  >
                    {c.title}
                  </CategoryItem>
                ))}
              </div>
            </aside>

            {/* CONTENT */}
            <section className="space-y-4">
              {filteredLessons.map((l, index) => (
                <Link
                  key={l.id}
                  href={`/learn/${l.id}`}
                  className="
                    group block rounded-xl
                    border border-neutral-800
                    bg-neutral-900/60 backdrop-blur
                    px-6 py-5
                    transition
                    hover:border-emerald-500/40
                    hover:bg-neutral-900/80
                  "
                >
                  <div className="flex items-start gap-4">

                    {/* STEP */}
                    <div
                      className="
                        flex h-9 w-9 items-center justify-center
                        rounded-full
                        border border-neutral-700
                        text-sm text-gray-400
                        group-hover:border-emerald-500/40
                        group-hover:text-emerald-400
                      "
                    >
                      {index + 1}
                    </div>

                    {/* TEXT */}
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">
                        {l.title}
                      </h3>

                      {(l.hashtags ?? []).length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-2">
                          {(l.hashtags ?? []).map((h) => (
                            <span
                              key={h}
                              className="text-xs text-gray-400 bg-neutral-800/80 px-2 py-0.5 rounded-full"
                            >
                              #{h}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}

              {filteredLessons.length === 0 && (
                <div className="text-gray-400 py-16 text-center">
                  No lessons found.
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

/* UI helper */
function CategoryItem({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-3 py-2 rounded-lg text-sm transition
        ${active
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
          : "text-gray-300 hover:bg-neutral-900/60 border border-transparent"}
      `}
    >
      {children}
    </button>
  );
}
