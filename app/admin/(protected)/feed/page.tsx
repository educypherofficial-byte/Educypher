"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminFeedPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    getDocs(collection(db, "feed")).then(s =>
      setPosts(s.docs.map(d => ({ id: d.id, ...d.data() })))
    );
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete post?")) return;
    await deleteDoc(doc(db, "feed", id));
    setPosts(p => p.filter(x => x.id !== id));
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <h1 className="text-2xl font-bold">Feed Moderation</h1>

      {posts.map(p => (
        <div key={p.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded">
          <p className="text-sm">{p.content}</p>
          <button onClick={() => remove(p.id)} className="text-red-400 text-sm mt-2">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
