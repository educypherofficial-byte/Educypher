"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { getFeedPosts } from "@/lib/feed";
import { FeedPost, FEED_TAGS } from "@/types/feed";
import FeedPostCard from "@/components/feed/FeedPostCard";
import { useAuthGuard } from "@/lib/useAuthGuard";
import CreateFeedPostModal from "@/components/feed/CreateFeedPostModal";

export default function FeedPage() {
  const { user } = useAuthGuard();

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState<"latest" | "hot">("latest");
  const [tag, setTag] = useState<string | null>(null);

  const loadFeed = useCallback(() => {
    getFeedPosts().then(setPosts);
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const filtered = useMemo(() => {
    let data = [...posts];

    if (tag) {
      data = data.filter((p) => p.tags.includes(tag));
    }

    if (sort === "hot") {
      data = [...data].sort((a, b) => {
        const score = (p: FeedPost) =>
          p.commentCount +
          p.reactions.like +
          p.reactions.fire +
          p.reactions.laugh;

        return score(b) - score(a);
      });
    }

    return data;
  }, [posts, sort, tag]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-neutral-950 text-white px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Feed</h1>
            {user && (
              <button
                onClick={() => setOpen(true)}
                className="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-700"
              >
                + Post
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex gap-4 text-sm">
            <button
              onClick={() => setSort("latest")}
              className={
                sort === "latest" ? "text-emerald-400" : "text-gray-400"
              }
            >
              Latest
            </button>
            <button
              onClick={() => setSort("hot")}
              className={sort === "hot" ? "text-emerald-400" : "text-gray-400"}
            >
              Hot
            </button>
            {tag && (
              <button
                onClick={() => setTag(null)}
                className="text-gray-400"
              >
                ✕ {tag}
              </button>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {FEED_TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setTag((prev) => (prev === t ? null : t))}
                className={`text-xs px-3 py-1 rounded-full border ${
                  tag === t
                    ? "border-emerald-500 text-emerald-400"
                    : "border-neutral-700 text-gray-400"
                }`}
              >
                #{t}
              </button>
            ))}
          </div>

          {/* Posts */}
          <div className="space-y-8">
            {filtered.map((p) => (
              <FeedPostCard key={p.id} post={p} />
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-gray-500 text-center">
                No posts found.
              </p>
            )}
          </div>
        </div>
      </main>

      {open && (
        <CreateFeedPostModal
          onClose={() => {
            setOpen(false);
            loadFeed(); // ✅ refresh after post
          }}
        />
      )}
    </>
  );
}
