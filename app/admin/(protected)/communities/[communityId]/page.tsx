"use client";

import { useEffect, useState, use } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminCommunityPosts({
  params,
}: {
  params: Promise<{ communityId: string }>;
}) {
  const { communityId } = use(params);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    getDocs(collection(db, "communities", communityId, "posts"))
      .then((snap) =>
        setPosts(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        )
      );
  }, [communityId]);

  async function remove(id: string) {
    if (!confirm("Delete post?")) return;
    await deleteDoc(
      doc(db, "communities", communityId, "posts", id)
    );
    setPosts((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Community Posts</h1>

      {posts.map((p) => (
        <div
          key={p.id}
          className="bg-neutral-900 border border-neutral-800 p-4 rounded"
        >
          <div className="font-semibold">{p.title}</div>
          <p className="text-sm text-gray-400">{p.content}</p>

          <button
            onClick={() => remove(p.id)}
            className="text-red-400 text-sm mt-2"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
