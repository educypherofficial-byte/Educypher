"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type LessonBlock =
  | { type: "text"; value: string }
  | { type: "code"; value: string; language?: string }
  | { type: "image"; value: string };

type SectionType = "headline" | "text" | "code" | "image";

type Section = {
  type: SectionType;
  value: string;
  language?: string;
};

type Category = {
  id: string;
  slug: string;
  title: string;
};

export default function AdminEditLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [published, setPublished] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    async function load() {
      // 🔹 fetch categories
      const catSnap = await getDocs(collection(db, "learn_categories"));
      setCategories(
        catSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Category, "id">),
        }))
      );

      // 🔹 fetch lesson
      const ref = doc(db, "learn_lessons", lessonId);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        router.replace("/admin/learn");
        return;
      }

      const data = snap.data();

      setTitle(data.title || "");
      setCategory(data.category || "");
      setHashtags((data.hashtags || []).join(", "));
      setPublished(!!data.published);

      const parsed: Section[] = (data.content || []).map((b: LessonBlock) => {
        if (b.type === "code") {
          return { type: "code", value: b.value, language: b.language };
        }
        if (b.type === "text" && b.value.startsWith("## ")) {
          return { type: "headline", value: b.value.replace("## ", "") };
        }
        return { type: b.type, value: b.value };
      });

      setSections(parsed);
      setLoading(false);
    }

    load();
  }, [lessonId, router]);

  function updateSection(index: number, value: string) {
    const copy = [...sections];
    copy[index].value = value;
    setSections(copy);
  }

  async function saveLesson() {
    setSaving(true);

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

    await updateDoc(doc(db, "learn_lessons", lessonId), {
      title,
      category, // ✅ slug only
      hashtags: hashtags
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean),
      published,
      content,
      updatedAt: serverTimestamp(),
    });

    setSaving(false);
    alert("Lesson updated");
  }

  async function deleteLesson() {
    if (!confirm("This will permanently delete the lesson. Continue?")) return;
    setDeleting(true);
    await deleteDoc(doc(db, "learn_lessons", lessonId));
    router.replace("/admin/learn");
  }

  if (loading) {
    return <div className="text-gray-400">Loading lesson…</div>;
  }

  return (
    <div className="max-w-4xl space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Lesson</h1>

        <button
          onClick={deleteLesson}
          disabled={deleting}
          className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30"
        >
          {deleting ? "Deleting…" : "Delete Lesson"}
        </button>
      </div>

      {/* META */}
      <div className="space-y-3">
        <input
          className="bg-neutral-900 border border-neutral-800 rounded-lg p-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* ✅ CATEGORY DROPDOWN */}
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
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
        />

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Published (visible on Learn)
        </label>
      </div>

      {/* SECTIONS */}
      <div className="space-y-6">
        {sections.map((s, i) => (
          <textarea
            key={i}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3"
            value={s.value}
            onChange={(e) => updateSection(i, e.target.value)}
          />
        ))}
      </div>

      <button
        onClick={saveLesson}
        disabled={saving}
        className="px-6 py-3 bg-emerald-500 text-black rounded-lg"
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>

    </div>
  );
}
