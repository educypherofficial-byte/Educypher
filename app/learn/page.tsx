"use client";

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  order: number;
}

interface Lesson {
  id: string;
  title: string;
  categoryId: string;
  order: number;
}

export default function LearnPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const catSnap = await getDocs(
        query(
          collection(db, "learn_categories"),
          where("active", "==", true),
          orderBy("order", "asc")
        )
      );

      const lessonSnap = await getDocs(
        query(
          collection(db, "learn_lessons"),
          where("published", "==", true),
          orderBy("order", "asc")
        )
      );

      setCategories(
        catSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Category, "id">),
        }))
      );

      setLessons(
        lessonSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Lesson, "id">),
        }))
      );

      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold">Learn</h1>

      {categories.map((cat) => {
        const catLessons = lessons.filter(
          (l) => l.categoryId === cat.id
        );

        if (catLessons.length === 0) return null;

        return (
          <div key={cat.id}>
            <h2 className="text-2xl font-semibold mb-4">
              {cat.name}
            </h2>

            <ul className="space-y-3">
              {catLessons.map((l) => (
                <li
                  key={l.id}
                  className="border p-4 rounded hover:bg-gray-50"
                >
                  <Link href={`/learn/${l.id}`}>
                    {l.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
