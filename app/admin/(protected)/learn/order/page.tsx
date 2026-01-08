"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Lesson {
  id: string;
  title: string;
  order: number;
}

export default function LessonOrderPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "learn_lessons"));

      const data: Lesson[] = snap.docs
        .map((d) => {
          const raw = d.data() as Partial<Lesson>;

          return {
            id: d.id,
            title: raw.title ?? "Untitled lesson",
            order: raw.order ?? 0,
          };
        })
        .sort((a, b) => a.order - b.order);

      setLessons(data);
      setLoading(false);
    };

    load();
  }, []);

  const move = (index: number, direction: "up" | "down") => {
    const copy = [...lessons];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= copy.length) return;

    [copy[index], copy[targetIndex]] = [
      copy[targetIndex],
      copy[index],
    ];

    setLessons(
      copy.map((l, i) => ({
        ...l,
        order: i,
      }))
    );
  };

  const saveOrder = async () => {
    setSaving(true);

    await Promise.all(
      lessons.map((l) =>
        updateDoc(doc(db, "learn_lessons", l.id), {
          order: l.order,
        })
      )
    );

    setSaving(false);
    alert("Lesson order saved");
  };

  if (loading) {
    return <div className="p-6">Loading lessons…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Lesson Order</h1>

      <ul className="space-y-3">
        {lessons.map((l, i) => (
          <li
            key={l.id}
            className="flex items-center justify-between border p-3 rounded"
          >
            <span>
              {l.order + 1}. {l.title}
            </span>

            <div className="space-x-2">
              <button
                onClick={() => move(i, "up")}
                disabled={i === 0}
                className="px-2 py-1 border rounded disabled:opacity-40"
              >
                ↑
              </button>

              <button
                onClick={() => move(i, "down")}
                disabled={i === lessons.length - 1}
                className="px-2 py-1 border rounded disabled:opacity-40"
              >
                ↓
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={saveOrder}
        disabled={saving}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {saving ? "Saving…" : "Save Order"}
      </button>
    </div>
  );
}
