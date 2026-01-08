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
    <div className="space-y-4">
      {comments.map((c) => (
        <div key={c.id} className="bg-neutral-900 p-3 rounded-lg">
          <p className="text-sm text-gray-100">{c.text}</p>
          <p className="text-xs text-gray-500">
            {c.userName} • {timeAgo(c.createdAt)}
          </p>
        </div>
      ))}

      {user && (
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-neutral-800 rounded-full px-4 py-2"
          />
          <button
            onClick={submit}
            className="bg-emerald-600 px-4 rounded-full"
          >
            Post
          </button>
        </div>
      )}
    </div>
  );
}
