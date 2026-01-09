"use client";

import { useState } from "react";
import { createCommunityPost } from "@/lib/community";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function CreatePostModal({
  communityId,
  onClose,
}: {
  communityId: string;
  onClose: () => void;
}) {
  const { user } = useAuthGuard();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!user || !title || !content) return;
    setLoading(true);

    await createCommunityPost(communityId, {
      title,
      content,
      authorId: user.uid,
      authorName: user.displayName || "Anonymous",
    });

    setLoading(false);
    onClose();
  }

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/60 backdrop-blur-sm
      "
    >
      <div
        className="
          w-full max-w-md
          rounded-2xl
          border border-neutral-800
          bg-neutral-900/80 backdrop-blur
          p-6
          space-y-5
          animate-cardPop
        "
      >
        {/* HEADER */}
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">
            Create Post
          </h2>
          <p className="text-sm text-gray-400">
            Share a question, idea, or discussion
          </p>
        </div>

        {/* TITLE */}
        <input
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="
            w-full rounded-xl
            bg-neutral-800/70
            border border-neutral-700
            px-4 py-2.5
            text-sm text-white
            placeholder-gray-500
            focus:outline-none
            focus:border-emerald-500/40
            transition
          "
        />

        {/* CONTENT */}
        <textarea
          placeholder="Write your post…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="
            w-full rounded-xl
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
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="
              px-4 py-2
              text-sm text-gray-400
              hover:text-white
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="
              px-5 py-2.5 rounded-xl
              text-sm font-semibold
              bg-emerald-500 text-black
              hover:bg-emerald-400
              transition
              disabled:opacity-60
            "
          >
            {loading ? "Posting…" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
