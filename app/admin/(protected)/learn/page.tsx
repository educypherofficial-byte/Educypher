"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

type AdminLesson = {
  id: string;
  title?: string;
  category?: string;
  published?: boolean;
  order?: number;
};

export default function AdminLearnPage() {
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const q = query(
        collection(db, "learn_lessons"),
        orderBy("order", "asc")
      );

      const snap = await getDocs(q);

      setLessons(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<AdminLesson, "id">),
        }))
      );

      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="text-gray-400">
        Loading lessons…
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Learn — Lessons</h1>

        <Link
          href="/admin/learn/new"
          className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-medium"
        >
          + New Lesson
        </Link>
      </div>

      {/* LIST */}
      {lessons.length === 0 && (
        <div className="text-gray-400">
          No lessons found.
        </div>
      )}

      <div className="space-y-3">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/admin/learn/${lesson.id}`}
            className="block rounded-xl border border-neutral-800 bg-neutral-900 p-4 hover:bg-neutral-800 transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">
                  {lesson.title || "Untitled Lesson"}
                </div>

                <div className="text-xs text-gray-400 mt-1">
                  Category: {lesson.category || "—"}
                </div>
              </div>

              <div
                className={`text-xs px-2 py-1 rounded ${
                  lesson.published
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {lesson.published ? "Published" : "Draft"}
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
