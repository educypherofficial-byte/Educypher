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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Create Post</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded bg-neutral-800 px-3 py-2 outline-none"
        />

        <textarea
          placeholder="Write your post..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full rounded bg-neutral-800 px-3 py-2 outline-none"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-700"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
