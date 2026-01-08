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
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function CommunityPostPage({
  params,
}: {
  params: Promise<{ slug: string; postId: string }>;
}) {
  const { slug, postId } = use(params);

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // 1️⃣ Get community by slug
      const communitySnap = await getDocs(
        query(
          collection(db, "communities"),
          where("slug", "==", slug)
        )
      );

      if (communitySnap.empty) {
        setLoading(false);
        return;
      }

      const communityId = communitySnap.docs[0].id;

      // 2️⃣ Get post inside that community
      const postRef = doc(
        db,
        "communities",
        communityId,
        "posts",
        postId
      );

      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        setPost(postSnap.data());
      }

      setLoading(false);
    }

    load();
  }, [slug, postId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-400">
          Loading post…
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

      <main className="min-h-screen bg-neutral-950 text-white px-6 py-10">
        <div className="max-w-3xl mx-auto space-y-6">

          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 rounded bg-neutral-800">
              {post.postType}
            </span>
            {post.solved && (
              <span className="px-2 py-1 rounded bg-emerald-500 text-black">
                SOLVED
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold">{post.title}</h1>

          <p className="text-gray-300 leading-relaxed">
            {post.content}
          </p>

          {post.code && (
            <pre className="bg-black text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
              <code>{post.code}</code>
            </pre>
          )}

          {post.errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
              <h3 className="font-semibold text-red-400">
                Error Message
              </h3>
              <p className="text-red-300 mt-2">
                {post.errorMessage}
              </p>
            </div>
          )}

        </div>
      </main>
    </>
  );
}
