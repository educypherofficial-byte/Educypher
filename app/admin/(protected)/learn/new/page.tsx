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

  useEffect(() => {
    async function loadCats() {
      const snap = await getDocs(collection(db, "learn_categories"));
      setCategories(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category))
      );
    }
    loadCats();
  }, []);

  function addSection(type: SectionType) {
    setSections([
      ...sections,
      type === "code"
        ? { type, value: "", language: "js" }
        : { type, value: "" },
    ]);
  }

  async function saveLesson() {
    if (!title || !category) {
      alert("Title and category required");
      return;
    }

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

    setSaving(true);

    await addDoc(collection(db, "learn_lessons"), {
      title,
      category, // ✅ slug only
      hashtags: hashtags.split(",").map((h) => h.trim()).filter(Boolean),
      order: 0,
      published: false,
      content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    router.replace("/admin/learn");
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold">Create Lesson</h1>

      <input
        className="input"
        placeholder="Lesson title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        className="input"
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
        className="input"
        placeholder="hashtags (comma separated)"
        value={hashtags}
        onChange={(e) => setHashtags(e.target.value)}
      />

      <div className="flex gap-2">
        <button onClick={() => addSection("headline")}>+ Headline</button>
        <button onClick={() => addSection("text")}>+ Text</button>
        <button onClick={() => addSection("code")}>+ Code</button>
        <button onClick={() => addSection("image")}>+ Image</button>
      </div>

      <button
        onClick={saveLesson}
        disabled={saving}
        className="bg-emerald-500 px-6 py-3 rounded text-black"
      >
        {saving ? "Saving…" : "Save Lesson"}
      </button>
    </div>
  );
}
