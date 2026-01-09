"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
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
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadLessons() {
    try {
      const q = query(
        collection(db, "learn_lessons"),
        orderBy("order", "asc")
      );

      const snap = await getDocs(q);

      const data: AdminLesson[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<AdminLesson, "id">),
      }));

      data.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
      setLessons(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLessons();
  }, []);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleAll() {
    if (selected.length === lessons.length) {
      setSelected([]);
    } else {
      setSelected(lessons.map((l) => l.id));
    }
  }

  async function bulkPublish(value: boolean) {
    for (const id of selected) {
      await updateDoc(doc(db, "learn_lessons", id), { published: value });
    }
    setSelected([]);
    loadLessons();
  }

  async function bulkDelete() {
    if (!confirm("Delete selected lessons?")) return;
    for (const id of selected) {
      await deleteDoc(doc(db, "learn_lessons", id));
    }
    setSelected([]);
    loadLessons();
  }

  if (loading) return <div className="text-gray-400">Loading…</div>;
  if (error) return <div className="text-red-400">{error}</div>;

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

      {/* BULK BAR */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 p-3 rounded-xl">
          <span className="text-sm text-gray-400">
            {selected.length} selected
          </span>

          <button
            onClick={() => bulkPublish(true)}
            className="px-3 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded"
          >
            Publish
          </button>

          <button
            onClick={() => bulkPublish(false)}
            className="px-3 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded"
          >
            Unpublish
          </button>

          <button
            onClick={bulkDelete}
            className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded"
          >
            Delete
          </button>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <input
            type="checkbox"
            checked={selected.length === lessons.length}
            onChange={toggleAll}
          />
          Select all
        </div>

        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4"
          >
            <input
              type="checkbox"
              checked={selected.includes(lesson.id)}
              onChange={() => toggle(lesson.id)}
            />

            <Link
              href={`/admin/learn/${lesson.id}`}
              className="flex-1 hover:underline"
            >
              <div className="font-semibold">
                {lesson.title || "Untitled Lesson"}
              </div>
              <div className="text-xs text-gray-400">
                {lesson.category || "—"}
              </div>
            </Link>

            <span
              className={`text-xs px-2 py-1 rounded ${
                lesson.published
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {lesson.published ? "Published" : "Draft"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
