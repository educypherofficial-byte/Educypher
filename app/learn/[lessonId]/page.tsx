"use client";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

interface Section {
  id: string;
  type: "heading" | "text" | "code";
  content: string;
  language?: string | null;
}

interface Lesson {
  id: string;
  title: string;
  sections: Section[];
  published: boolean;
}

export default function LessonPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(
        doc(db, "learn_lessons", params.lessonId)
      );

      if (snap.exists() && snap.data().published === true) {
        setLesson({
          id: snap.id,
          ...(snap.data() as Omit<Lesson, "id">),
        });
      }
    };

    load();
  }, [params.lessonId]);

  if (!lesson) return <div className="p-6">Lesson not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{lesson.title}</h1>

      {lesson.sections.map((s) => {
        if (s.type === "heading")
          return <h2 key={s.id} className="text-xl font-bold">{s.content}</h2>;

        if (s.type === "text")
          return <p key={s.id}>{s.content}</p>;

        if (s.type === "code")
          return (
            <pre key={s.id} className="bg-black text-green-400 p-4 rounded">
              <code>{s.content}</code>
            </pre>
          );

        return null;
      })}
    </div>
  );
}
