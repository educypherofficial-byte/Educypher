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

    await addDoc(
      collection(db, "communities", community.id, "posts"),
      {
        title,
        content,
        postType,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        code: code || null,
        errorMessage: postType === "error" ? errorMessage : null,
        solved: false,
        authorId: user.uid,
        communityId: community.id,
        createdAt: serverTimestamp(),
      }
    );

    // reset form
    setTitle("");
    setContent("");
    setCode("");
    setTags("");
    setErrorMessage("");
    setShowForm(false);

    // reload posts
    const snap = await getDocs(
      collection(db, "communities", community.id, "posts")
    );
    setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
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

      <main className="min-h-screen bg-neutral-950 text-white px-6 py-10">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{community.title}</h1>
              <p className="text-gray-400">{community.description}</p>
            </div>

            {user && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-emerald-500 text-black rounded-lg"
              >
                {showForm ? "Cancel" : "Create Post"}
              </button>
            )}
          </div>

          {/* CREATE POST */}
          {showForm && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 space-y-4">
                  <select
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3"
                    value={postType}
                    onChange={(e) => setPostType(e.target.value)}
                  >
                    <option value="question">Question</option>
                    <option value="error">Error / Bug</option>
                    <option value="discussion">Discussion</option>
                    <option value="showcase">Showcase</option>
                  </select>

                  <input
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3"
                    placeholder="Post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <textarea
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 min-h-[120px]"
                    placeholder="Explain the issue or idea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />

                  <textarea
                    className="w-full bg-black border border-neutral-700 rounded-lg p-3 min-h-[160px] font-mono text-sm"
                    placeholder="Code (optional)"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />

                  {postType === "error" && (
                    <textarea
                      className="w-full bg-neutral-800 border border-red-500/30 rounded-lg p-3 min-h-[80px]"
                      placeholder="Error message"
                      value={errorMessage}
                      onChange={(e) => setErrorMessage(e.target.value)}
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <input
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3"
                    placeholder="Tags (react, python, firebase)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />

                  <button
                    onClick={createPost}
                    className="w-full bg-emerald-500 text-black font-semibold py-3 rounded-lg"
                  >
                    Publish Post
                  </button>
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
                className="block bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-emerald-500/40 transition"
              >
                <div className="flex gap-2 text-xs mb-2">
                  <span className="px-2 py-1 bg-neutral-800 rounded">
                    {p.postType}
                  </span>
                  {p.solved && (
                    <span className="px-2 py-1 bg-emerald-500 text-black rounded">
                      SOLVED
                    </span>
                  )}
                </div>

                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-gray-400 mt-1">
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
