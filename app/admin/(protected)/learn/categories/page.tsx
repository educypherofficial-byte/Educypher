"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Category = {
  id: string;
  title: string;
  slug: string;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const q = query(
        collection(db, "learn_categories"),
        orderBy("order", "asc")
      );
      const snap = await getDocs(q);
      setCategories(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Category, "id">),
        }))
      );
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="text-gray-400">Loading…</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>

        <Link
          href="/admin/learn/categories/new"
          className="bg-emerald-500 px-4 py-2 rounded text-black"
        >
          + New Category
        </Link>
      </div>

      {categories.length === 0 && (
        <div className="text-gray-400">No categories yet.</div>
      )}

      <div className="space-y-3">
        {categories.map((c) => (
          <div
            key={c.id}
            className="border border-neutral-800 bg-neutral-900 rounded-lg p-3"
          >
            <div className="font-medium">{c.title}</div>
            <div className="text-xs text-gray-400">/{c.slug}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
