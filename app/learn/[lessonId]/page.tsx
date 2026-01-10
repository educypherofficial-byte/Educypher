"use client";

import { useEffect, useState, use, useRef } from "react";
import Navbar from "@/components/Navbar";
import { getLesson, getLessons } from "@/lib/learn";
import { Lesson } from "@/types/learn";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, increment } from "firebase/firestore";
import { createHighlighter } from "shiki";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [completed, setCompleted] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);

  /* Load lesson + all lessons */
  useEffect(() => {
    getLesson(lessonId).then((data) => {
      if (!data) return;

      const text = data.content.map((b: any) => b.value || "").join(" ");
      setReadingTime(getReadingTime(text));

      const questions = data.content.filter((b: any) => b.type === "question");
      setTotalQuestions(questions.length);

      setLesson({
        ...data,
        content: Array.isArray(data.content) ? data.content : [],
      });
    });

    getLessons().then(setAllLessons);
  }, [lessonId]);

  /* Scroll progress */
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

  /* Complete + go to next */
  async function markComplete() {
    if (!auth.currentUser || !lesson) return;

    if (totalQuestions > 0 && correctAnswers !== totalQuestions) {
      alert("Answer all questions correctly to complete this lesson.");
      return;
    }

    const uid = auth.currentUser.uid;

    await setDoc(
      doc(db, "user_progress", uid, "lessons", lesson.id),
      { completed: true, completedAt: serverTimestamp() },
      { merge: true }
    );

    await setDoc(doc(db, "users", uid), { points: increment(10) }, { merge: true });

    setCompleted(true);

    const courseLessons = allLessons
      .filter((l) => l.category === lesson.category)
      .sort((a, b) => a.order - b.order);

    const idx = courseLessons.findIndex((l) => l.id === lesson.id);
    const next = courseLessons[idx + 1];

    // ✅ FIXED: single redirect after celebration
    setTimeout(() => {
      if (next) {
        router.push(`/learn/${next.id}`);
      } else {
        router.push("/learn");
      }
    }, 1500);
  }

  if (!lesson) return null;

  const headings = lesson.content
    .filter((b: any) => b.type === "text" && b.value?.startsWith("## "))
    .map((b: any) => {
      const title = b.value.replace("## ", "");
      return { id: title.toLowerCase().replace(/\s+/g, "-"), title };
    });

  return (
    <>
      <Navbar />

      {/* 🎉 Congratulations overlay */}
      {completed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
          <div className="bg-neutral-900 border border-emerald-500 rounded-2xl px-12 py-10 text-center space-y-4">
            <h2 className="text-3xl font-black text-emerald-400">
              Lesson Completed 🎉
            </h2>
            <p className="text-gray-400">Great job! Loading next module…</p>
          </div>
        </div>
      )}

      <div
        className="fixed top-0 left-0 h-[3px] bg-emerald-400 z-50"
        style={{ width: `${progress}%` }}
      />

      {/* EVERYTHING BELOW IS YOUR ORIGINAL CODE — unchanged */}
      <main className="h-[calc(100vh-64px)] grid grid-cols-[280px_1fr_320px] bg-gradient-to-br from-neutral-950 via-neutral-900/40 to-neutral-950 text-white">
        {/* LEFT */}
        <aside className="border-r border-neutral-800 px-4 py-6 overflow-y-auto bg-neutral-950/80 backdrop-blur">
          <p className="text-xs text-gray-500 mb-4">IN THIS LESSON</p>
          {headings.map((h) => (
            <button
              key={h.id}
              onClick={() => document.getElementById(h.id)?.scrollIntoView()}
              className={`block w-full text-left pl-4 pr-3 py-2 mb-1 text-sm transition ${
                active === h.id
                  ? "text-emerald-400 border-l-2 border-emerald-400 bg-emerald-500/10"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              {h.title}
            </button>
          ))}
        </aside>

        {/* CENTER */}
        <section ref={contentRef} className="overflow-y-auto py-12 bg-neutral-900/20">
          <div className="max-w-5xl mx-auto bg-neutral-900/70 backdrop-blur-md ring-1 ring-white/5 rounded-2xl px-14 py-16 space-y-16">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black">{lesson.title}</h1>
              <p className="text-gray-400">⏱ {readingTime} min read</p>
            </div>

            {lesson.content.map((block: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <BlockRenderer
                  block={block}
                  onCorrect={() => setCorrectAnswers((c) => c + 1)}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* RIGHT */}
        <aside className="border-l border-neutral-800 p-6 bg-neutral-950/80 backdrop-blur hidden xl:block">
          <div className="sticky top-6 space-y-6">
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
              <p className="text-sm text-gray-400">Lesson progress</p>
              <p className="text-2xl font-bold text-emerald-400">
                {Math.round(progress)}%
              </p>
              {totalQuestions > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Questions: {correctAnswers}/{totalQuestions}
                </p>
              )}
            </div>

            <button
              onClick={markComplete}
              disabled={
                completed ||
                (totalQuestions > 0 && correctAnswers !== totalQuestions)
              }
              className={`w-full py-3 rounded-xl font-bold transition ${
                completed
                  ? "bg-neutral-800 text-gray-400"
                  : totalQuestions === 0 ||
                    correctAnswers === totalQuestions
                  ? "bg-emerald-500 text-black hover:bg-emerald-400"
                  : "bg-neutral-800 text-gray-500 cursor-not-allowed"
              }`}
            >
              {completed
                ? "Lesson Completed"
                : totalQuestions === 0 ||
                  correctAnswers === totalQuestions
                ? "Complete Lesson"
                : "Answer all questions"}
            </button>
          </div>
        </aside>
      </main>
    </>
  );
}

/* ------------------ BLOCK RENDERER ------------------ */

function BlockRenderer({ block, onCorrect }: any) {
  if (block.type === "question") {
    const q = block.question || block.value?.split("|")[0];
    const a = block.answer || block.value?.split("|")[1];
    return <QuestionBlock question={q} answer={a} onCorrect={onCorrect} />;
  }

  if (block.type === "text") {
    if (block.value.startsWith("## ")) {
      const id = block.value.replace("## ", "");
      return (
        <h2 id={id} data-section={id} className="text-3xl font-black pt-20 mb-6">
          {id}
        </h2>
      );
    }
    return <p className="text-gray-300 text-lg leading-[1.8]">{block.value}</p>;
  }

  if (block.type === "image") {
    return <img src={block.value} className="rounded-xl my-10 shadow-xl" />;
  }

  if (block.type === "code") {
    return <CodeBlock code={block.value} language={block.language} />;
  }

  return null;
}

/* ------------------ QUESTION BLOCK ------------------ */

function QuestionBlock({
  question,
  answer,
  onCorrect,
}: {
  question: string;
  answer: string;
  onCorrect: () => void;
}) {
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState(false);

  function normalize(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(
        /\b(a|an|the|is|are|was|were|to|of|in|on|for|and|that|this|it|as|by|with)\b/g,
        ""
      )
      .replace(/\s+/g, " ")
      .trim();
  }

  function isSemanticallyCorrect(user: string, correct: string) {
    const u = normalize(user);
    const c = normalize(correct);

    if (u.length < 3) return false;
    if (u === c) return true;
    if (c.includes(u) || u.includes(c)) return true;

    const uWords = u.split(" ");
    const cWords = c.split(" ");
    const common = uWords.filter((w) => cWords.includes(w));

    return common.length >= Math.ceil(cWords.length * 0.6);
  }

  const correct = isSemanticallyCorrect(input, answer);

  return (
    <div className="my-10 p-6 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
      <p className="text-emerald-400 font-semibold">{question}</p>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2"
        placeholder="Type your answer"
        disabled={done}
      />

      <button
        disabled={done}
        onClick={() => {
          setChecked(true);
          if (correct && !done) {
            onCorrect();
            setDone(true);
          }
        }}
        className="bg-emerald-500 text-black px-4 py-2 rounded-lg disabled:opacity-50"
      >
        Check
      </button>

      {checked && (
        <p className={correct ? "text-emerald-400" : "text-red-400"}>
          {correct ? "Correct 🎉" : "Almost — try again"}
        </p>
      )}
    </div>
  );
}

/* ------------------ CODE BLOCK ------------------ */

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    highlightCode(code, language).then(setHtml);
  }, [code, language]);

  return (
    <div
      className="my-10 rounded-xl overflow-hidden bg-[#0d1117]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
