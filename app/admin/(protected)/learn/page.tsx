"use client";

import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LearnAdmin() {
  const [lessons, setLessons] = useState<any[]>([]);

  const load = async () => {
    const snap = await getDocs(collection(db, "learn_lessons"));
    setLessons(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const toggle = async (id: string, published: boolean) => {
    await updateDoc(doc(db, "learn_lessons", id), { published: !published });
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Lessons</h1>
        <Link href="/admin/learn/new" className="admin-btn">
          New Lesson
        </Link>
      </div>

      {lessons.map((l) => (
        <div key={l.id} className="admin-row p-4 mb-3 rounded flex justify-between">
          <Link
            href={`/admin/learn/${l.id}`}
            className="font-medium hover:underline"
          >
            {l.title}
          </Link>

          <div className="flex gap-4 items-center">
            <span className={l.published ? "status-published" : "status-draft"}>
              {l.published ? "Published" : "Draft"}
            </span>

            <button
              onClick={() => toggle(l.id, l.published)}
              className="text-sm underline"
            >
              {l.published ? "Unpublish" : "Publish"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
