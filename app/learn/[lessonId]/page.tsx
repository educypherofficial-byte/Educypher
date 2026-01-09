"use client";

import { useEffect, useState, use, useRef } from "react";
import Navbar from "@/components/Navbar";
import { getLesson } from "@/lib/learn";
import { Lesson } from "@/types/learn";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, increment } from "firebase/firestore";
import { createHighlighter } from "shiki";
import { motion } from "framer-motion";

let highlighter: any = null;

async function highlightCode(code: string, lang = "ts") {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-dark"],
      langs: ["ts", "js", "tsx", "json", "python", "java", "cpp"],
    });
  }
  return highlighter.codeToHtml(code, { lang, theme: "github-dark" });
}

function getReadingTime(text: string) {
  const words = text.split(" ").length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = use(params);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [completed, setCompleted] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getLesson(lessonId).then((data) => {
      if (!data) return;
      const text = data.content.map((b: any) => b.value).join(" ");
      setReadingTime(getReadingTime(text));
      setLesson({
        ...data,
        content: Array.isArray(data.content) ? data.content : [],
      });
    });
  }, [lessonId]);

  useEffect(() => {
  function onScroll() {
    const el = contentRef.current;
    if (!el) return;

    const total = el.scrollHeight - el.clientHeight;
    const scrolled = el.scrollTop;
    setProgress(Math.min(100, (scrolled / total) * 100));

    const sections = el.querySelectorAll("h2[data-section]");
    let current: string | null = null;

    sections.forEach((s) => {
      const top = (s as HTMLElement).offsetTop - el.scrollTop;
      if (top < 200) current = s.getAttribute("data-section");
    });

    setActive(current);
  }

  const el = contentRef.current;
  if (!el) return;

  el.addEventListener("scroll", onScroll);
  return () => el.removeEventListener("scroll", onScroll);
  }, []);


  async function markComplete() {
    if (!auth.currentUser || !lesson) return;
    const uid = auth.currentUser.uid;

    await setDoc(
      doc(db, "user_progress", uid, "lessons", lesson.id),
      { completed: true, completedAt: serverTimestamp() },
      { merge: true }
    );

    await setDoc(doc(db, "users", uid), { points: increment(10) }, { merge: true });
    setCompleted(true);
  }

  if (!lesson) return null;

  const headings = lesson.content
    .filter((b) => b.type === "text" && b.value.startsWith("## "))
    .map((b) => b.value.replace("## ", ""));

  return (
    <>
      <Navbar />

      <div
        className="fixed top-0 left-0 h-[3px] bg-emerald-400 z-50"
        style={{ width: `${progress}%` }}
      />

      <main className="h-[calc(100vh-64px)] grid grid-cols-[280px_1fr_320px] bg-gradient-to-br from-neutral-950 via-neutral-900/40 to-neutral-950 text-white">

        {/* LEFT NAV */}
        <aside className="border-r border-neutral-800 px-4 py-6 overflow-y-auto bg-neutral-950/80 backdrop-blur">
          <p className="text-xs text-gray-500 mb-4">IN THIS LESSON</p>
          {headings.map((h) => (
            <button
              key={h}
              onClick={() => document.getElementById(h)?.scrollIntoView()}
              className={`block w-full text-left pl-4 pr-3 py-2 mb-1 text-sm transition ${
                active === h
                  ? "text-emerald-400 border-l-2 border-emerald-400 bg-emerald-500/10"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              {h}
            </button>
          ))}
        </aside>

        {/* CENTER */}
        <section ref={contentRef} className="overflow-y-auto py-12 bg-neutral-900/20">
          <div className="max-w-5xl ml-12 mr-12 bg-neutral-900/70 backdrop-blur-md ring-1 ring-white/5 rounded-2xl px-14 py-16 space-y-16 shadow-[0_40px_120px_-40px_rgba(0,0,0,.8)]">

            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black">{lesson.title}</h1>
              <p className="text-gray-400">⏱ {readingTime} min read</p>
            </div>

            {lesson.content.map((block, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <BlockRenderer block={block} />
              </motion.div>
            ))}

          </div>
        </section>

        {/* RIGHT PANEL */}
        <aside className="border-l border-neutral-800 p-6 bg-neutral-950/80 backdrop-blur hidden xl:block">
          <div className="sticky top-6 space-y-6">

            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
              <p className="text-sm text-gray-400">Lesson progress</p>
              <p className="text-2xl font-bold text-emerald-400">
                {Math.round(progress)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ⏱ {Math.max(1, Math.ceil((100 - progress) / 50))} min left
              </p>
            </div>

            <button
              onClick={markComplete}
              disabled={completed}
              className={`w-full py-3 rounded-xl font-bold transition ${
                completed
                  ? "bg-neutral-800 text-gray-400"
                  : "bg-emerald-500 text-black hover:bg-emerald-400"
              }`}
            >
              {completed ? "Lesson Completed" : "Complete Lesson"}
            </button>

          </div>
        </aside>

      </main>
    </>
  );
}

function BlockRenderer({ block }: any) {
  if (block.type === "text") {
    if (block.value.startsWith("## ")) {
      const id = block.value.replace("## ", "");
      return (
        <h2
          id={id}
          data-section={id}
          className="text-3xl font-black pt-20 mb-6 flex items-center gap-3"
        >
          <span className="h-2 w-2 bg-emerald-400 rounded-full" />
          {id}
        </h2>
      );
    }

    // detect prompt box
    if (block.value.trim().startsWith('"') && block.value.includes("diagram")) {
      return <PromptBox text={block.value} />;
    }

    return (
      <p className="text-gray-300 text-lg leading-[1.8]">
        {block.value}
      </p>
    );
  }

  if (block.type === "image") {
    return <img src={block.value} className="rounded-xl my-10 shadow-xl" />;
  }

  if (block.type === "code") {
    return <CodeBlock code={block.value} language={block.language} />;
  }

  return null;
}

function PromptBox({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const cleaned = text
    .split("\n")
    .map((l) => l.replace(/^"|"$/g, ""))
    .join("\n");

  function copy() {
    navigator.clipboard.writeText(cleaned);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="relative my-10 bg-[#0d1117] border border-neutral-700 rounded-xl p-6 font-mono text-sm text-blue-300 shadow-lg">
      <button
        onClick={copy}
        className="absolute top-3 right-3 px-3 py-1 rounded-md bg-neutral-800 text-xs text-gray-300 hover:bg-neutral-700 transition"
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      <pre className="whitespace-pre-wrap leading-relaxed">
        {cleaned}
      </pre>
    </div>
  );
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    highlightCode(code, language).then(setHtml);
  }, [code, language]);

  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="relative my-10 border border-neutral-700 rounded-xl overflow-hidden bg-[#0d1117] shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800 text-xs text-gray-400">
        <span>{language || "code"}</span>
        <button
          onClick={copy}
          className="px-3 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-gray-300 transition"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code */}
      <div
        className="overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

