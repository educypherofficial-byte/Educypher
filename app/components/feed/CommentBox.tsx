"use client";

import { useEffect, useState } from "react";
import { addFeedComment, getFeedComments } from "@/lib/feed";
import { FeedComment } from "@/types/feed";
import { timeAgo } from "@/lib/time";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function CommentBox({ feedId }: { feedId: string }) {
  const { user } = useAuthGuard();
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    getFeedComments(feedId).then(setComments);
  }, [feedId]);

  async function submit() {
    if (!user || !text.trim()) return;

    await addFeedComment(feedId, {
      text,
      userId: user.uid,
      userName: user.displayName || "User",
    });

    setText("");
    getFeedComments(feedId).then(setComments);
  }

  return (
    <div className="space-y-6">

      {/* COMMENTS */}
      <div className="space-y-4">
        {comments.map((c) => (
          <div
            key={c.id}
            className="
              rounded-xl border border-neutral-800
              bg-neutral-900/60 backdrop-blur
              p-4 space-y-2
            "
          >
            <p className="text-sm text-gray-100 leading-relaxed">
              {c.text}
            </p>

            <div className="text-xs text-gray-500">
              <span className="text-gray-300 font-medium">
                {c.userName}
              </span>{" "}
              • {timeAgo(c.createdAt)}
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-sm text-gray-500">
            No comments yet. Be the first to reply.
          </p>
        )}
      </div>

      {/* INPUT */}
      {user && (
        <div
          className="
            flex items-center gap-3
            rounded-2xl border border-neutral-800
            bg-neutral-900/70 backdrop-blur
            px-4 py-3
          "
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment…"
            className="
              flex-1 bg-transparent
              outline-none text-sm
              placeholder-gray-500
            "
          />

          <button
            onClick={submit}
            className="
              px-4 py-1.5 rounded-full
              bg-emerald-500 text-black
              text-sm font-semibold
              hover:bg-emerald-400 transition
            "
          >
            Post
          </button>
        </div>
      )}
    </div>
  );
}
