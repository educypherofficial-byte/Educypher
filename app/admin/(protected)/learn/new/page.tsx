"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Category = {
  id: string;
  slug: string;
  title: string;
};

type SectionType = "headline" | "text" | "code" | "image";

type Section = {
  type: SectionType;
  value: string;
  language?: string;
};

export default function AdminNewLessonPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [jsonInput, setJsonInput] = useState("");

  useEffect(() => {
    async function loadCats() {
      const snap = await getDocs(collection(db, "learn_categories"));
      setCategories(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Category, "id">),
        }))
      );
    }
    loadCats();
  }, []);

  function addSection(type: SectionType) {
    setSections((prev) => [
      ...prev,
      type === "code"
        ? { type, value: "", language: "js" }
        : { type, value: "" },
    ]);
  }

  function updateSection(index: number, value: string) {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, value } : s))
    );
  }

  function removeSection(index: number) {
    setSections((prev) => prev.filter((_, i) => i !== index));
  }

  // 🔥 JSON IMPORT
  function importFromJSON() {
    try {
      const data = JSON.parse(jsonInput);

      if (!data.content || !Array.isArray(data.content)) {
        alert("Invalid lesson JSON");
        return;
      }

      setTitle(data.title || "");
      setCategory(data.category || "");
      setHashtags((data.hashtags || []).join(", "));

      setSections(
        data.content.map((s: any) => ({
          type: s.type,
          value: s.value,
          language: s.language || "js",
        }))
      );

      alert("Lesson imported successfully!");
    } catch {
      alert("Invalid JSON");
    }
  }

  async function saveLesson() {
    if (!title.trim() || !category) {
      setError("Title and category are required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const content = sections.map((s) => {
        if (s.type === "headline") {
          return { type: "text", value: `## ${s.value}` };
        }
        if (s.type === "code") {
          return {
            type: "code",
            value: s.value,
            language: s.language || "js",
          };
        }
        return { type: s.type, value: s.value };
      });

      await addDoc(collection(db, "learn_lessons"), {
        title,
        category,
        hashtags: hashtags
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean),
        order: Date.now(),
        published: false,
        content,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      router.replace("/admin/learn");
    } catch (e) {
      console.error(e);
      setError("Failed to save lesson");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative max-w-4xl space-y-6 pb-28">
      <h1 className="text-2xl font-bold">Create Lesson</h1>

      {error && <div className="text-red-400">{error}</div>}

      {/* 🔥 JSON IMPORT */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400">
          Paste Lesson JSON (optional)
        </label>
        <textarea
          rows={6}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Paste lesson JSON here..."
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 font-mono text-sm"
        />
        <button
          onClick={importFromJSON}
          className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg text-sm hover:bg-cyan-500/30"
        >
          Import from JSON
        </button>
      </div>

      <input
        className="bg-neutral-900 border border-neutral-800 rounded-lg p-3"
        placeholder="Lesson title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="flex justify-between items-center">
        <label className="text-sm text-gray-400">Category</label>
        <button
          type="button"
          onClick={() => router.push("/admin/learn/categories/new")}
          className="text-xs text-emerald-400 hover:underline"
        >
          + New Category
        </button>
      </div>

      <select
        className="bg-neutral-900 border border-neutral-800 rounded-lg p-3"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.title}
          </option>
        ))}
      </select>

      <input
        className="bg-neutral-900 border border-neutral-800 rounded-lg p-3"
        placeholder="hashtags (comma separated)"
        value={hashtags}
        onChange={(e) => setHashtags(e.target.value)}
      />

      {/* SECTIONS */}
      <div className="space-y-4">
        {sections.map((s, i) => (
          <div
            key={i}
            className="border border-neutral-800 rounded-xl p-4 space-y-3 bg-neutral-900/60"
          >
            <div className="flex justify-between text-xs text-gray-400">
              <span>{s.type.toUpperCase()}</span>
              <button
                onClick={() => removeSection(i)}
                className="text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>

            <textarea
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3"
              placeholder={
                s.type === "image"
                  ? "Image URL"
                  : s.type === "code"
                  ? "Code"
                  : "Content"
              }
              value={s.value}
              onChange={(e) => updateSection(i, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        onClick={saveLesson}
        disabled={saving}
        className="bg-emerald-500 px-6 py-3 rounded-xl text-black font-semibold"
      >
        {saving ? "Saving…" : "Save Lesson"}
      </button>

      {/* 🔥 STICKY ADD BAR */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-neutral-800 bg-neutral-900/80 backdrop-blur z-40">
        <div className="max-w-4xl mx-auto px-6 py-3 flex gap-2 flex-wrap">
          <button onClick={() => addSection("headline")} className="px-4 py-2 bg-neutral-800 rounded-lg">+ Headline</button>
          <button onClick={() => addSection("text")} className="px-4 py-2 bg-neutral-800 rounded-lg">+ Text</button>
          <button onClick={() => addSection("code")} className="px-4 py-2 bg-neutral-800 rounded-lg">+ Code</button>
          <button onClick={() => addSection("image")} className="px-4 py-2 bg-neutral-800 rounded-lg">+ Image</button>
        </div>
      </div>
    </div>
  );
}
