"use client";

import { useEffect, useState, use } from "react";
import Navbar from "@/components/Navbar";
import { getLesson } from "@/lib/learn";
import { Lesson, LessonBlock } from "@/types/learn";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { createHighlighter } from "shiki";

let highlighter: any = null;

async function highlightCode(code: string, lang = "ts") {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-dark"],
      langs: ["ts", "js", "tsx", "json", "python", "java", "cpp"],
    });
  }

  return highlighter.codeToHtml(code, {
    lang,
    theme: "github-dark",
  });
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = use(params);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getLesson(lessonId);

      if (data) {
        setLesson({
          ...data,
          content: Array.isArray(data.content) ? data.content : [],
        });
      }

      setLoading(false);
    }
    load();
  }, [lessonId]);

  async function markComplete() {
    if (!auth.currentUser || !lesson) return;

    const uid = auth.currentUser.uid;

    // 1️⃣ Save lesson progress
    await setDoc(
      doc(db, "user_progress", uid, "lessons", lesson.id),
      {
        completed: true,
        completedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // 2️⃣ Add points (+10) — SAFE even if user doc doesn't exist
    await setDoc(
      doc(db, "users", uid),
      {
        points: increment(10),
      },
      { merge: true }
    );

    setCompleted(true);
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-400">
          Loading lesson…
        </div>
      </>
    );
  }

  if (!lesson) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-400">
          Lesson not found
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-950 text-white px-6 py-10 max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">{lesson.title}</h1>

        {lesson.content.map((block: LessonBlock, i) => {
          if (block.type === "text") {
            if (block.value.startsWith("## ")) {
              return (
                <h2 key={i} className="text-xl font-semibold mt-8">
                  {block.value.replace("## ", "")}
                </h2>
              );
            }
            return <p key={i}>{block.value}</p>;
          }

          if (block.type === "code") {
            return (
              <CodeBlock
                key={i}
                code={block.value}
                language={block.language}
              />
            );
          }

          if (block.type === "image") {
            return (
              <img
                key={i}
                src={block.value}
                className="rounded-xl border border-neutral-800"
              />
            );
          }

          return null;
        })}

        <button
          onClick={markComplete}
          disabled={completed}
          className={`px-6 py-3 rounded-xl font-semibold ${
            completed
              ? "bg-neutral-800 text-gray-400"
              : "bg-emerald-500 text-black hover:bg-emerald-400"
          }`}
        >
          {completed ? "Lesson Completed ✅" : "Mark as Complete (+10 pts)"}
        </button>
      </main>
    </>
  );
}

function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    async function run() {
      const highlighted = await highlightCode(code, language);
      setHtml(highlighted);
    }
    run();
  }, [code, language]);

  return (
    <div
      className="rounded-xl overflow-hidden border border-neutral-800 text-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
