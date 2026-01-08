"use client";

import { useState } from "react";
import { createFeedPost } from "@/lib/feed";
import { useAuthGuard } from "@/lib/useAuthGuard";

type Props = {
  onClose: () => void;
};

// ✅ DEFINE TAGS LOCALLY
const FEED_TAGS: string[] = ["help", "progress", "question", "showcase"];

export default function CreateFeedPostModal({ onClose }: Props) {
  const { user } = useAuthGuard();

  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [posting, setPosting] = useState(false);

  if (!user) return null;

  async function submit() {
  const u = user; // ✅ snapshot user

  if (!u || !text.trim() || posting) return;

  setPosting(true);

  await createFeedPost({
    userId: u.uid,
    userName: u.displayName || "User",
    text,
    tags,
  });

  setPosting(false);
  setText("");
  setTags([]);
  onClose();
}


  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag)
        ? prev.filter((x) => x !== tag)
        : prev.length < 2
        ? [...prev, tag]
        : prev
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-950">
        {/* HEADER */}
        <div className="flex justify-between px-6 py-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold">Create Post</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Share what you're learning..."
            className="w-full rounded-xl bg-neutral-900 p-3 outline-none"
          />

          <div className="flex gap-2 flex-wrap">
            {FEED_TAGS.map((t: string) => (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className={`px-3 py-1 rounded-full text-xs ${
                  tags.includes(t)
                    ? "bg-emerald-600/20 text-emerald-400"
                    : "bg-neutral-800 text-gray-400"
                }`}
              >
                #{t}
              </button>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-6 py-4 border-t border-neutral-800">
          <button onClick={onClose} className="text-gray-400 mr-3">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={posting}
            className="bg-emerald-600 px-5 py-2 rounded-full disabled:opacity-60"
          >
            {posting ? "Posting…" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
