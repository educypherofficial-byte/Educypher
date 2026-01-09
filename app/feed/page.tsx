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

      <main className="relative min-h-screen text-white overflow-hidden">
        {/* ===== MATCHED BACKGROUND ===== */}
        <div className="absolute inset-0 -z-10 bg-neutral-950" />
        <div className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-emerald-500/20 blur-[160px]" />
        <div className="absolute top-1/3 -right-32 h-[480px] w-[480px] rounded-full bg-cyan-400/20 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* ===== CONTENT ===== */}
        <div className="relative max-w-2xl mx-auto px-4 py-10 space-y-8">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Feed
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Developer updates, tips, and discussions
              </p>
            </div>

            {user && (
              <button
                onClick={() => setOpen(true)}
                className="
                  px-5 py-2.5 rounded-xl
                  bg-emerald-500 text-black font-semibold
                  hover:bg-emerald-400 transition
                "
              >
                + Post
              </button>
            )}
          </div>

          {/* CONTROLS */}
          <div className="space-y-4">

            {/* SORT */}
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => setSort("latest")}
                className={`transition ${
                  sort === "latest"
                    ? "text-emerald-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Latest
              </button>

              <button
                onClick={() => setSort("hot")}
                className={`transition ${
                  sort === "hot"
                    ? "text-emerald-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Hot
              </button>

              {tag && (
                <button
                  onClick={() => setTag(null)}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  ✕ #{tag}
                </button>
              )}
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2">
              {FEED_TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag((prev) => (prev === t ? null : t))}
                  className={`
                    text-xs px-3 py-1 rounded-full border transition
                    ${
                      tag === t
                        ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                        : "border-neutral-700 text-gray-400 hover:border-neutral-600"
                    }
                  `}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>

          {/* POSTS */}
          <div className="space-y-10 pt-2">
            {filtered.map((p) => (
              <FeedPostCard key={p.id} post={p} />
            ))}

            {filtered.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-10">
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
            loadFeed();
          }}
        />
      )}
    </>
  );
}
