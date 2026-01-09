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
    <div
      className="
        rounded-2xl
        border border-neutral-800
        bg-neutral-900/70 backdrop-blur
        p-5 mb-6
        transition
      "
    >
      {/* TEXTAREA */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        placeholder="Write something for the community…"
        className="
          w-full resize-none
          rounded-xl
          bg-neutral-800/70
          border border-neutral-700
          px-4 py-3
          text-sm text-white
          placeholder-gray-500
          focus:outline-none
          focus:border-emerald-500/40
          transition
        "
      />

      {/* ACTIONS */}
      <div className="flex justify-end mt-4">
        <button
          onClick={submit}
          disabled={posting}
          className="
            px-5 py-2.5 rounded-xl
            text-sm font-semibold
            bg-emerald-500 text-black
            hover:bg-emerald-400
            transition
            disabled:opacity-60
          "
        >
          {posting ? "Posting…" : "Post"}
        </button>
      </div>
    </div>
  );
}
