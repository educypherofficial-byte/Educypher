"use client";

import { useEffect, useState, use } from "react";
import Navbar from "@/components/Navbar";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  setDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function CommunityPostPage({
  params,
}: {
  params: Promise<{ slug: string; postId: string }>;
}) {
  const { slug, postId } = use(params);

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [solutionText, setSolutionText] = useState("");
  const [communityId, setCommunityId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const commSnap = await getDocs(
        query(collection(db, "communities"), where("slug", "==", slug))
      );

      if (commSnap.empty) return;

      const cid = commSnap.docs[0].id;
      setCommunityId(cid);

      const postSnap = await getDoc(
        doc(db, "communities", cid, "posts", postId)
      );

      if (postSnap.exists()) {
        setPost({ id: postSnap.id, ...postSnap.data() });
      }

      const commentsSnap = await getDocs(
        collection(db, "communities", cid, "posts", postId, "comments")
      );

      setComments(commentsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }

    load();
  }, [slug, postId]);

  async function addSolution() {
    if (!auth.currentUser || !solutionText || !communityId) return;

    await addDoc(
      collection(db, "communities", communityId, "posts", postId, "comments"),
      {
        content: solutionText,
        authorId: auth.currentUser.uid,
        isSolution: false,
        createdAt: serverTimestamp(),
      }
    );

    await setDoc(
      doc(db, "users", auth.currentUser.uid),
      { points: increment(5) },
      { merge: true }
    );

    setSolutionText("");

    const snap = await getDocs(
      collection(db, "communities", communityId, "posts", postId, "comments")
    );
    setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  async function acceptSolution(commentId: string, authorId: string) {
    if (!communityId) return;

    await setDoc(
      doc(db, "communities", communityId, "posts", postId),
      { solved: true, acceptedSolutionId: commentId },
      { merge: true }
    );

    await setDoc(
      doc(
        db,
        "communities",
        communityId,
        "posts",
        postId,
        "comments",
        commentId
      ),
      { isSolution: true },
      { merge: true }
    );

    await setDoc(
      doc(db, "users", authorId),
      { points: increment(20) },
      { merge: true }
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-400">
          Loading…
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-400">
          Post not found
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen text-white overflow-hidden">
        {/* BACKGROUND */}
        <div className="absolute inset-0 -z-10 bg-neutral-950" />

        <div className="relative max-w-4xl mx-auto px-6 py-12 space-y-10">

          {/* POST */}
          <article className="space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight">
              {post.title}
            </h1>

            <p className="text-gray-300 leading-relaxed">
              {post.content}
            </p>

            {/* 🔥 CODE BLOCK (THIS WAS MISSING) */}
            {post.code && (
              <div className="rounded-xl border border-neutral-800 bg-black overflow-hidden">
                <div className="px-4 py-2 text-xs text-gray-400 border-b border-neutral-800">
                  Code
                </div>
                <pre className="p-4 overflow-x-auto text-sm text-gray-200 font-mono">
                  <code>{post.code}</code>
                </pre>
              </div>
            )}

            {post.solved && (
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs">
                ✔ Solved
              </span>
            )}
          </article>

          {/* SOLUTIONS */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Solutions</h2>

            {comments.map(c => (
              <div
                key={c.id}
                className={`rounded-xl border p-5 ${
                  c.isSolution
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-neutral-800 bg-neutral-900"
                }`}
              >
                <p className="text-sm">{c.content}</p>

                {!post.solved &&
                  post.authorId === auth.currentUser?.uid && (
                    <button
                      onClick={() => acceptSolution(c.id, c.authorId)}
                      className="mt-3 text-xs text-emerald-400 hover:underline"
                    >
                      Mark as accepted solution
                    </button>
                  )}
              </div>
            ))}
          </section>

          {/* ADD SOLUTION */}
          {auth.currentUser && (
            <section className="space-y-3">
              <textarea
                className="w-full rounded-xl bg-neutral-900 border border-neutral-800 p-4 text-sm min-h-[120px]"
                placeholder="Write your solution…"
                value={solutionText}
                onChange={e => setSolutionText(e.target.value)}
              />

              <button
                onClick={addSolution}
                className="px-5 py-2.5 rounded-xl font-semibold bg-emerald-500 text-black hover:bg-emerald-400"
              >
                Submit Solution (+5 pts)
              </button>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
