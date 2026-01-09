"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getFeedPost, deleteFeedPost } from "@/lib/feed";
import { FeedPost } from "@/types/feed";
import ReactionBar from "@/components/feed/ReactionBar";
import CommentBox from "@/components/feed/CommentBox";
import DeletePostModal from "@/components/feed/DeletePostModal";
import { timeAgo } from "@/lib/time";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function FeedDetail({
  params,
}: {
  params: Promise<{ feedId: string }>;
}) {
  const { feedId } = use(params);

  const router = useRouter();
  const { user } = useAuthGuard();

  const [post, setPost] = useState<FeedPost | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeedPost(feedId).then((data) => {
      setPost(data);
      setLoading(false);
    });
  }, [feedId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center text-gray-400">
          Loading post…
        </main>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center text-gray-400">
          Post not found.
        </main>
      </>
    );
  }

  const isOwner = user?.uid === post.userId;

  async function handleDelete() {
    if (!post) return;
    await deleteFeedPost(post);
    router.push("/feed");
  }

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen text-white overflow-hidden">
        {/* ===== BACKGROUND (MATCH FEED) ===== */}
        <div className="absolute inset-0 -z-10 bg-neutral-950" />
        <div className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-emerald-500/20 blur-[160px]" />
        <div className="absolute top-1/3 -right-32 h-[480px] w-[480px] rounded-full bg-cyan-400/20 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* ===== CONTENT ===== */}
        <div className="relative max-w-2xl mx-auto px-4 py-10 space-y-10">

          {/* POST CARD */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur p-6 space-y-5">

            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div className="text-sm text-gray-400">
                <span className="text-white font-medium">
                  {post.userName}
                </span>{" "}
                • {timeAgo(post.createdAt)}
              </div>

              {isOwner && (
                <button
                  onClick={() => setConfirm(true)}
                  className="text-xs text-red-400 hover:text-red-300 transition"
                >
                  Delete
                </button>
              )}
            </div>

            {/* CONTENT */}
            <p className="text-gray-100 leading-relaxed whitespace-pre-wrap">
              {post.text}
            </p>

            {/* IMAGE */}
            {post.image && (
              <div className="rounded-xl overflow-hidden border border-neutral-800">
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full object-cover"
                />
              </div>
            )}

            {/* TAGS */}
            <div className="flex gap-2 flex-wrap pt-1">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400"
                >
                  #{t}
                </span>
              ))}
            </div>

            {/* REACTIONS */}
            <div className="pt-2">
              <ReactionBar
                feedId={post.id}
                initial={post.reactions}
              />
            </div>
          </div>

          {/* COMMENTS */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Discussion
            </h2>

            <CommentBox feedId={post.id} />
          </div>
        </div>
      </main>

      {confirm && (
        <DeletePostModal
          onConfirm={handleDelete}
          onCancel={() => setConfirm(false)}
        />
      )}
    </>
  );
}
