"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Search, Flame, Trophy, Play, CheckCircle2 } from "lucide-react";

import { getCategories, getLessons } from "@/lib/learn";
import { LearnCategory, Lesson } from "@/types/learn";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

/* ===================== */
/* TYPES */
/* ===================== */

type Stats = {
  xp: number;
  streak: number;
  lastActive: string;
  completed: Record<string, string[]>;
};

export default function LearnPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<LearnCategory[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [search, setSearch] = useState("");
  const [openPlaylist, setOpenPlaylist] = useState<string | null>(null);

  const [stats, setStats] = useState<Stats>({
    xp: 0,
    streak: 0,
    lastActive: "",
    completed: {},
  });

  const [resumeLesson, setResumeLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  /* ===================== */
  /* 🔐 AUTH + LOAD STATS  */
  /* ===================== */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
      } else {
        const snap = await getDoc(
          doc(db, "user_progress", user.uid, "lessons", "_summary_")
        );
        if (snap.exists()) setStats(snap.data() as Stats);
        setAuthLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  /* ===================== */
  /* 📚 LOAD CONTENT       */
  /* ===================== */
  useEffect(() => {
    if (!authLoading) {
      async function load() {
        const c = await getCategories();
        const l = await getLessons();

        setCategories(c);
        setLessons(l);

        const allCompleted = Object.values(stats.completed).flat();
        const next = l.find((x) => !allCompleted.includes(x.id));
        if (next) setResumeLesson(next);

        setLoading(false);
      }
      load();
    }
  }, [authLoading, stats]);

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-400">
          Loading…
        </div>
      </>
    );
  }

  /* ===================== */
  /* 🔒 LOCK LOGIC         */
  /* ===================== */

  const isCompleted = (lesson: Lesson) =>
    stats.completed?.[lesson.category]?.includes(lesson.id);

  const isLocked = (lesson: Lesson) => {
    if (lesson.order === 1) return false;

    const prev = lessons.find(
      (l) => l.category === lesson.category && l.order === lesson.order - 1
    );

    if (!prev) return false;
    return !isCompleted(prev);
  };

  const getProgress = (course: string) => {
    const completed = stats.completed[course] || [];
    const total = lessons.filter((l) => l.category === course).length;
    if (!total) return 0;
    return Math.round((completed.length / total) * 100);
  };

  const filteredLessons = lessons.filter((l) => {
    const inCourse = openPlaylist ? l.category === openPlaylist : true;
    const searchMatch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      (l.hashtags ?? []).some((h) =>
        h.toLowerCase().includes(search.toLowerCase())
      );
    return inCourse && searchMatch;
  });

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen text-white overflow-hidden">
        {/* BACKGROUND */}
        <div className="absolute inset-0 -z-10 bg-neutral-950" />
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] bg-emerald-500/20 blur-[160px] rounded-full" />
        <div className="absolute top-1/3 -right-40 h-[520px] w-[520px] bg-cyan-400/20 blur-[160px] rounded-full" />

        <div className="relative max-w-7xl mx-auto px-6 py-12">

          {/* STATS */}
          <div className="flex gap-4 mb-10">
            <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 px-4 py-2 rounded-xl">
              <Trophy className="text-yellow-400" size={16} /> {stats.xp} XP
            </div>
            <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 px-4 py-2 rounded-xl">
              <Flame className="text-orange-400" size={16} /> {stats.streak} day streak
            </div>

            {resumeLesson && openPlaylist === null && (
  <Link
    href={`/learn/${resumeLesson.id}`}
    className="ml-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl shadow-[0_0_40px_rgba(52,211,153,.4)]"
  >
    <Play size={16} /> Continue
  </Link>
)}

          </div>

          {/* SEARCH */}
          <div className="max-w-xl mb-12">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-900/80 border border-neutral-800 backdrop-blur focus:outline-none focus:border-emerald-500/40"
                placeholder="Search courses or lessons"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* PLAYLIST GRID */}
          {openPlaylist === null ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((c) => (
                <div
                  key={c.slug}
                  onClick={() => setOpenPlaylist(c.slug)}
                  className="group cursor-pointer p-6 bg-neutral-900/70 backdrop-blur border border-neutral-800 rounded-2xl hover:border-emerald-500/50 hover:shadow-[0_0_60px_rgba(52,211,153,.15)] transition"
                >
                  <h2 className="text-xl font-bold mb-1 group-hover:text-emerald-400">
                    {c.title}
                  </h2>
                  <p className="text-sm text-gray-400 mb-4">
                    {lessons.filter((l) => l.category === c.slug).length} lessons
                  </p>

                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${getProgress(c.slug)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 max-w-3xl">
              <button
                onClick={() => setOpenPlaylist(null)}
                className="text-sm text-gray-400 hover:text-white mb-4"
              >
                ← Back to playlists
              </button>

              {filteredLessons.map((l, i) => {
                const locked = isLocked(l);
                const completed = isCompleted(l);

                if (locked) {
                  return (
                    <div
                      key={l.id}
                      className="flex justify-between items-center px-6 py-4 rounded-xl border border-neutral-800 bg-neutral-900/40 text-gray-500"
                    >
                      {i + 1}. {l.title} 🔒
                    </div>
                  );
                }

                return (
                  <Link
                    key={l.id}
                    href={`/learn/${l.id}`}
                    className="flex justify-between items-center px-6 py-4 rounded-xl border border-neutral-800 bg-neutral-900/70 hover:border-emerald-500/50 transition"
                  >
                    <div>{i + 1}. {l.title}</div>

                    {completed && (
                      <div className="flex items-center gap-1 text-emerald-400 text-sm">
                        <CheckCircle2 size={16} /> Completed
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* RIGHT SIDE PANEL */}
      <PlaylistSidePanel
        openPlaylist={openPlaylist}
        lessons={lessons}
        stats={stats}
      />
    </>
  );
}

/* ===================== */
/* SIDE PANEL */
/* ===================== */

function PlaylistSidePanel({
  openPlaylist,
  lessons,
  stats,
}: {
  openPlaylist: string | null;
  lessons: Lesson[];
  stats: Stats;
}) {
  if (!openPlaylist) return null;

  const courseLessons = lessons.filter(l => l.category === openPlaylist);
  const completed = stats.completed?.[openPlaylist] || [];

  const percent = courseLessons.length
    ? Math.round((completed.length / courseLessons.length) * 100)
    : 0;

  const next = courseLessons.find(l => !completed.includes(l.id));

  return (
    <aside className="hidden xl:block fixed right-10 top-36 w-[340px] z-20">
      <div className="rounded-2xl bg-neutral-900/80 backdrop-blur border border-neutral-800 p-6 shadow-[0_0_80px_rgba(0,0,0,.8)] space-y-6">

        <div>
          <p className="text-xs text-gray-400">Current playlist</p>
          <h3 className="text-xl font-bold mt-1 capitalize">
            {openPlaylist.replace(/-/g, " ")}
          </h3>
        </div>

        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Progress</span>
            <span>{percent}%</span>
          </div>
          <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {completed.length} of {courseLessons.length} modules completed
          </p>
        </div>

        {next && (
          <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-4">
            <p className="text-xs text-gray-400">Next up</p>
            <p className="font-medium mt-1 leading-tight">
              {next.title}
            </p>

            <Link
              href={`/learn/${next.id}`}
              className="mt-4 block text-center bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-2 rounded-lg transition"
            >
              Continue →
            </Link>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">XP</span>
          <span className="text-yellow-400">{stats.xp}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Streak</span>
          <span className="text-orange-400">
            {stats.streak} day{stats.streak !== 1 && "s"} 🔥
          </span>
        </div>

      </div>
    </aside>
  );
}
