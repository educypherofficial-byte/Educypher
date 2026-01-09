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

/* ---------------- TYPES ---------------- */

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

/* ---------------- JSON HELPERS ---------------- */

function lessonToJson(
  title: string,
  category: string,
  hashtags: string[],
  sections: Section[]
) {
  return {
    title,
    category,
    hashtags,
    sections: sections.map((s) => ({
      type: s.type,
      value: s.value,
      language: s.language,
    })),
  };
}

function jsonToSections(json: any): Section[] {
  return (json.sections || []).map((s: any) => ({
    type: s.type,
    value: s.value,
    language: s.language,
  }));
}

/* ---------------- PAGE ---------------- */

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
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [published, setPublished] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);

  // JSON mode
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const catSnap = await getDocs(collection(db, "learn_categories"));
        setCategories(
          catSnap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<Category, "id">),
          }))
        );

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

        const parsed: Section[] = (data.content || []).map((b: any) => {
          if (b.type === "code") {
            return { type: "code", value: b.value, language: b.language };
          }
          if (b.type === "text" && b.value?.startsWith("## ")) {
            return { type: "headline", value: b.value.replace("## ", "") };
          }
          return { type: b.type, value: b.value };
        });

        setSections(parsed);

        // generate JSON
        const json = lessonToJson(
          data.title,
          data.category,
          data.hashtags || [],
          parsed
        );
        setJsonText(JSON.stringify(json, null, 2));
      } catch (e) {
        console.error(e);
        setError("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [lessonId, router]);

  function updateSection(index: number, value: string) {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, value } : s))
    );
  }

  async function saveLesson() {
    try {
      setSaving(true);

      let finalTitle = title;
      let finalCategory = category;
      let finalHashtags = hashtags
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean);
      let finalSections = sections;

      // If JSON mode — parse it
      if (jsonMode) {
        const parsed = JSON.parse(jsonText);
        finalTitle = parsed.title;
        finalCategory = parsed.category;
        finalHashtags = parsed.hashtags || [];
        finalSections = jsonToSections(parsed);
        setSections(finalSections);
        setTitle(finalTitle);
        setCategory(finalCategory);
        setHashtags(finalHashtags.join(", "));
      }

      const content = finalSections.map((s) => {
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
        title: finalTitle,
        category: finalCategory,
        hashtags: finalHashtags,
        published,
        content,
        sourceJson: JSON.parse(jsonText),
        updatedAt: serverTimestamp(),
      });

      alert("Lesson updated");
    } catch (e) {
      alert("Invalid JSON");
    } finally {
      setSaving(false);
    }
  }

  async function deleteLesson() {
    if (!confirm("This will permanently delete the lesson. Continue?")) return;
    setDeleting(true);
    await deleteDoc(doc(db, "learn_lessons", lessonId));
    router.replace("/admin/learn");
  }

  if (loading) return <div className="text-gray-400">Loading lesson…</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="max-w-4xl space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Lesson</h1>

        <div className="flex gap-3">
          <button
            onClick={() => setJsonMode(!jsonMode)}
            className="px-4 py-2 rounded border border-neutral-700 text-sm"
          >
            {jsonMode ? "Visual Mode" : "JSON Mode"}
          </button>

          <button
            onClick={deleteLesson}
            className="px-4 py-2 rounded bg-red-500/20 text-red-400 border border-red-500/30"
          >
            Delete
          </button>
        </div>
      </div>

      {!jsonMode ? (
        <>
          <input
            className="bg-neutral-900 border border-neutral-800 rounded-lg p-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="bg-neutral-900 border border-neutral-800 rounded-lg p-3"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
          />

          <div className="space-y-3">
            {sections.map((s, i) => (
              <textarea
                key={i}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3"
                value={s.value}
                onChange={(e) => updateSection(i, e.target.value)}
              />
            ))}
          </div>
        </>
      ) : (
        <textarea
          className="w-full h-[500px] bg-black text-green-400 font-mono p-4 rounded"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
        />
      )}

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
