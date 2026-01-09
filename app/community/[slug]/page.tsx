"use client";

import { useEffect, useState, use } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function CommunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [community, setCommunity] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("question");
  const [tags, setTags] = useState("");
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    async function load() {
      const snap = await getDocs(
        query(collection(db, "communities"), where("slug", "==", slug))
      );
      if (snap.empty) return;

      const docSnap = snap.docs[0];
      const comm = { id: docSnap.id, ...docSnap.data() };
      setCommunity(comm);

      const postSnap = await getDocs(
        collection(db, "communities", comm.id, "posts")
      );

      setPosts(postSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }

    load();
  }, [slug]);

  async function createPost() {
    if (!user || !community || !title) return;

    const ref = await addDoc(
      collection(db, "communities", community.id, "posts"),
      {
        title,
        content,
        postType,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        code: code || null,
        errorMessage: postType === "error" ? errorMessage : null,
        solved: false,
        authorId: user.uid,
        communityId: community.id,
        createdAt: serverTimestamp(),
      }
    );

    await updateDoc(ref, { postId: ref.id });

    setTitle("");
    setContent("");
    setCode("");
    setTags("");
    setErrorMessage("");
    setShowForm(false);

    const snap = await getDocs(
      collection(db, "communities", community.id, "posts")
    );
    setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  if (!community) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-400">
          Community not found
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen text-white overflow-hidden">

        {/* ===== MATCHED BACKGROUND ===== */}
        <div className="absolute inset-0 -z-10 bg-neutral-950" />
        <div className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-emerald-500/20 blur-[160px]" />
        <div className="absolute top-1/3 -right-32 h-[480px] w-[480px] rounded-full bg-cyan-400/20 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* ===== CONTENT ===== */}
        <div className="relative max-w-7xl mx-auto px-6 py-12 space-y-10">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">
                {community.title}
              </h1>
              <p className="text-gray-400 mt-2 max-w-2xl">
                {community.description}
              </p>
            </div>

            {user && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="
                  px-5 py-2.5 rounded-xl font-semibold
                  bg-emerald-500 text-black
                  hover:bg-emerald-400 transition
                "
              >
                {showForm ? "Cancel" : "Create Post"}
              </button>
            )}
          </div>

          {/* CREATE POST */}
          {showForm && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT */}
                <div className="lg:col-span-2 space-y-4">
                  <select
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 p-3"
                    value={postType}
                    onChange={(e) => setPostType(e.target.value)}
                  >
                    <option value="question">Question</option>
                    <option value="error">Error / Bug</option>
                    <option value="discussion">Discussion</option>
                    <option value="showcase">Showcase</option>
                  </select>

                  <input
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 p-3"
                    placeholder="Post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <textarea
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 p-3 min-h-[120px]"
                    placeholder="Explain your question or idea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />

                  <textarea
                    className="w-full rounded-lg bg-black border border-neutral-700 p-3 min-h-[160px] font-mono text-sm"
                    placeholder="Code (optional)"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />

                  {postType === "error" && (
                    <textarea
                      className="w-full rounded-lg bg-neutral-800 border border-red-500/30 p-3 min-h-[80px]"
                      placeholder="Error message"
                      value={errorMessage}
                      onChange={(e) => setErrorMessage(e.target.value)}
                    />
                  )}
                </div>

                {/* RIGHT */}
                <div className="space-y-4">
                  <input
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 p-3"
                    placeholder="Tags (react, firebase, css)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />

                  <button
                    onClick={createPost}
                    className="
                      w-full py-3 rounded-xl
                      bg-emerald-500 text-black font-semibold
                      hover:bg-emerald-400 transition
                    "
                  >
                    Publish Post
                  </button>

                  <p className="text-xs text-gray-400">
                    Clear posts get better answers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* POSTS */}
          <div className="space-y-4">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/community/${slug}/post/${p.id}`}
                className="
                  block rounded-2xl
                  border border-neutral-800
                  bg-neutral-900/60 backdrop-blur
                  p-6
                  transition
                  hover:border-emerald-500/40
                "
              >
                <div className="flex items-center gap-2 text-xs mb-3">
                  <span className="px-2 py-1 rounded bg-neutral-800">
                    {p.postType}
                  </span>
                  {p.solved && (
                    <span className="px-2 py-1 rounded bg-emerald-500 text-black">
                      SOLVED
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-lg">
                  {p.title}
                </h3>

                <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                  {p.content}
                </p>
              </Link>
            ))}
          </div>

        </div>
      </main>
    </>
  );
}
