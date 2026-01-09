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

    // +5 points (SAFE)
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

    // Mark post solved
    await setDoc(
      doc(db, "communities", communityId, "posts", postId),
      {
        solved: true,
        acceptedSolutionId: commentId,
      },
      { merge: true }
    );

    // Mark comment as solution
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

    // +20 points to solution author (SAFE)
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
      <main className="min-h-screen bg-neutral-950 text-white px-6 py-10 max-w-4xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-gray-300">{post.content}</p>

        <h2 className="text-xl font-semibold mt-10">Solutions</h2>

        {comments.map(c => (
          <div
            key={c.id}
            className={`p-4 rounded-lg border ${
              c.isSolution
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-neutral-800 bg-neutral-900"
            }`}
          >
            <p>{c.content}</p>

            {!post.solved &&
              post.authorId === auth.currentUser?.uid && (
                <button
                  onClick={() => acceptSolution(c.id, c.authorId)}
                  className="mt-2 text-xs text-emerald-400"
                >
                  Mark as Solution
                </button>
              )}
          </div>
        ))}

        {auth.currentUser && (
          <div className="mt-4">
            <textarea
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3"
              placeholder="Write your solution…"
              value={solutionText}
              onChange={e => setSolutionText(e.target.value)}
            />
            <button
              onClick={addSolution}
              className="mt-2 px-4 py-2 bg-emerald-500 text-black rounded-lg"
            >
              Submit Solution (+5 pts)
            </button>
          </div>
        )}
      </main>
    </>
  );
}
