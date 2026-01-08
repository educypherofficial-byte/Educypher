"use client";

import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SectionEditor from "../SectionEditor";
import { LessonSection } from "@/types/admin";
import { cleanFirestoreData } from "@/lib/cleanFirestore";

export default function NewLessonPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState<LessonSection[]>([]);
  const [published, setPublished] = useState(false);

  const save = async () => {
    if (!title || sections.length === 0) return;

    await addDoc(
  collection(db, "learn_lessons"),
  cleanFirestoreData({
    title,
    published: published ?? false,
     order: 0,
    sections: sections.map((s) =>
      cleanFirestoreData({
        id: s.id,
        type: s.type,
        content: s.content,
        // 🔥 Firestore-safe
        language: s.type === "code" ? s.language ?? "javascript" : null,
      })
    ),
    createdAt: Date.now(),
  })
);

    router.push("/admin/learn");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">New Lesson</h1>

      <input
        className="admin-input w-full mb-6"
        placeholder="Lesson title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <SectionEditor sections={sections} setSections={setSections} />

      <div className="flex items-center gap-4 mt-6">
        <label>
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />{" "}
          Published
        </label>

        <button onClick={save} className="admin-btn">
          Save Lesson
        </button>
      </div>
    </div>
  );
}
