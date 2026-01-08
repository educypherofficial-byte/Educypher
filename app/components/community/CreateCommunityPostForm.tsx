"use client";

import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function CreateCommunityPostForm({
  communityId,
  onCreated,
}: {
  communityId: string;
  onCreated?: () => void;
}) {
  const { user } = useAuthGuard();
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  if (!user) return null;

  async function submit() {
    const u = user;
    if (!u || !content.trim() || posting) return;

    setPosting(true);

    await addDoc(collection(db, "communityPosts"), {
      communityId,
      content,
      authorId: u.uid,
      authorName: u.displayName || "User",
      likeCount: 0,
      commentCount: 0,
      createdAt: Date.now(),
    });

    setContent("");
    setPosting(false);
    onCreated?.();
  }

  return (
    <div className="border border-gray-800 rounded-lg p-4 mb-6 bg-neutral-900">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        placeholder="Write something for the community…"
        className="w-full resize-none rounded-md bg-neutral-800 px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500"
      />

      <div className="flex justify-end mt-3">
        <button
          onClick={submit}
          disabled={posting}
          className="bg-emerald-600 px-4 py-2 rounded text-sm disabled:opacity-60"
        >
          {posting ? "Posting…" : "Post"}
        </button>
      </div>
    </div>
  );
}
