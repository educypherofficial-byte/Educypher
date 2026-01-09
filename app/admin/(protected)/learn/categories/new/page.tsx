"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminNewCategoryPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function saveCategory() {
    if (!title.trim()) {
      setError("Category title is required");
      return;
    }

    const finalSlug = slug || generateSlug(title);

    setSaving(true);
    setError(null);

    try {
      const q = query(
        collection(db, "learn_categories"),
        where("slug", "==", finalSlug)
      );
      const exists = await getDocs(q);

      if (!exists.empty) {
        setError("Slug already exists");
        setSaving(false);
        return;
      }

      await addDoc(collection(db, "learn_categories"), {
        title,
        slug: finalSlug,
        description,
        order: Date.now(),
        createdAt: serverTimestamp(),
      });

      router.back();
    } catch (e) {
      console.error(e);
      setError("Failed to create category");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Create Category</h1>

      {error && <div className="text-red-400">{error}</div>}

      <input
        className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 w-full"
        placeholder="Category title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setSlug(generateSlug(e.target.value));
        }}
      />

      <input
        className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 w-full"
        placeholder="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />

      <textarea
        className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 w-full"
        placeholder="Short description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={saveCategory}
        disabled={saving}
        className="bg-emerald-500 px-6 py-3 rounded text-black"
      >
        {saving ? "Saving…" : "Create Category"}
      </button>
    </div>
  );
}
