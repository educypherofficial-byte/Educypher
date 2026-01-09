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
    const u = user;
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div
        className="
          w-full max-w-2xl
          rounded-3xl
          border border-neutral-800
          bg-neutral-900/90
          backdrop-blur
          animate-cardPop
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold tracking-tight">
            Create Post
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-5 space-y-5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder="Share what you're learning, building, or struggling with…"
            className="
              w-full resize-none
              rounded-2xl
              bg-neutral-950
              border border-neutral-800
              p-4
              text-sm text-gray-100
              placeholder-gray-500
              outline-none
              focus:border-emerald-500/40
              transition
            "
          />

          {/* TAGS */}
          <div className="space-y-2">
            <p className="text-xs text-gray-400">
              Select up to 2 tags
            </p>

            <div className="flex gap-2 flex-wrap">
              {FEED_TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-medium
                    border transition
                    ${
                      tags.includes(t)
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                        : "border-neutral-700 text-gray-400 hover:border-neutral-600"
                    }
                  `}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end items-center gap-4 px-6 py-4 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={posting}
            className="
              px-6 py-2 rounded-full
              bg-emerald-500 text-black
              text-sm font-semibold
              hover:bg-emerald-400
              disabled:opacity-60
              transition
            "
          >
            {posting ? "Posting…" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
