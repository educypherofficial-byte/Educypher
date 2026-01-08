"use client";

import { useEffect, useState, use } from "react";
import Navbar from "@/components/Navbar";
import { getLesson } from "@/lib/learn";
import { Lesson, LessonBlock } from "@/types/learn";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
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
      } else {
        setLesson(null);
      }

      setLoading(false);
    }

    load();
  }, [lessonId]);

  async function markComplete() {
    if (!auth.currentUser || !lesson) return;

    await setDoc(
      doc(db, "user_progress", auth.currentUser.uid, "lessons", lesson.id),
      {
        completed: true,
        completedAt: serverTimestamp(),
      }
    );

    setCompleted(true);
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-gray-400">
          Loading lesson…
        </div>
      </>
    );
  }

  if (!lesson) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-gray-400">
          Lesson not found
        </div>
      </>
    );
  }

  const toc = lesson.content
    .filter(
      (b) => b.type === "text" && b.value.startsWith("## ")
    )
    .map((b) => {
      const title = b.value.replace("## ", "");
      return {
        title,
        id: title.toLowerCase().replace(/\s+/g, "-"),
      };
    });

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-neutral-950 text-white px-4 sm:px-6 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">

          {/* CONTENT */}
          <article className="col-span-12 lg:col-span-9 space-y-6">
            <h1 className="text-3xl font-bold">{lesson.title}</h1>

            {lesson.content.length === 0 && (
              <p className="text-gray-400">
                This lesson has no content yet.
              </p>
            )}

            {lesson.content.map((block: LessonBlock, i: number) => {
              if (block.type === "text") {
                const isHeading = block.value.startsWith("## ");
                const text = block.value.replace("## ", "");
                const id = text.toLowerCase().replace(/\s+/g, "-");

                return isHeading ? (
                  <h2
                    key={i}
                    id={id}
                    className="text-xl font-semibold mt-10"
                  >
                    {text}
                  </h2>
                ) : (
                  <p
                    key={i}
                    className="text-gray-200 leading-relaxed"
                  >
                    {block.value}
                  </p>
                );
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
                    alt=""
                    className="rounded-xl border border-neutral-800"
                  />
                );
              }

              return null;
            })}

            <button
              onClick={markComplete}
              disabled={completed}
              className={`mt-10 px-6 py-3 rounded-xl font-semibold ${
                completed
                  ? "bg-neutral-800 text-gray-400 cursor-not-allowed"
                  : "bg-emerald-500 text-black hover:bg-emerald-400"
              }`}
            >
              {completed ? "Lesson Completed ✅" : "Mark as Complete"}
            </button>
          </article>

          {/* TOC */}
          <aside className="hidden lg:block col-span-3 sticky top-24 h-fit">
            {toc.length > 0 && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <h3 className="text-sm font-semibold mb-3 text-gray-400">
                  On this page
                </h3>
                <ul className="space-y-2 text-sm">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a
                        href={`#${t.id}`}
                        className="text-gray-400 hover:text-emerald-400"
                      >
                        {t.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

        </div>
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
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    async function run() {
      const highlighted = await highlightCode(code, language);
      setHtml(highlighted);
    }
    run();
  }, [code, language]);

  return (
    <div
      className="rounded-xl overflow-hidden border border-neutral-800 text-xs sm:text-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
