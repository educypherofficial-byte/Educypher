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
  // ✅ REQUIRED for your Next version
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
        <main className="min-h-screen bg-neutral-950 text-white px-4 py-8">
          <div className="max-w-2xl mx-auto text-gray-400">
            Loading post…
          </div>
        </main>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-neutral-950 text-white px-4 py-8">
          <div className="max-w-2xl mx-auto text-gray-400">
            Post not found.
          </div>
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

      <main className="min-h-screen bg-neutral-950 text-white px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 space-y-4">
            <div className="flex justify-between">
              <div className="text-xs text-gray-500">
                {post.userName} • {timeAgo(post.createdAt)}
              </div>
              {isOwner && (
                <button
                  onClick={() => setConfirm(true)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              )}
            </div>

            <p className="text-gray-100">{post.text}</p>

            {post.image && (
              <div className="rounded-lg overflow-hidden border border-neutral-800">
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full object-cover"
                />
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              {post.tags.map((t) => (
                <span key={t} className="text-xs text-emerald-400">
                  #{t}
                </span>
              ))}
            </div>

            <ReactionBar feedId={post.id} initial={post.reactions} />
          </div>

          <CommentBox feedId={post.id} />
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
