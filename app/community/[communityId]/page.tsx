"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CreatePostModal from "@/components/community/CreatePostModal";
import { getCommunityPosts } from "@/lib/community";
import { useAuthGuard } from "@/lib/useAuthGuard";
import { CommunityPost } from "@/types/community";

export default function CommunityDetail({
  params,
}: {
  params: { communityId: string };
}) {
  const { user } = useAuthGuard();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getCommunityPosts(params.communityId).then(setPosts);
  }, [params.communityId]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-neutral-950 text-white px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Community Posts</h1>

            {user && (
              <button
                onClick={() => setOpen(true)}
                className="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-700"
              >
                + Create Post
              </button>
            )}
          </div>

          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/community/${params.communityId}/post/${post.id}`}
              className="block rounded-lg border border-neutral-800 bg-neutral-900 p-4 hover:border-emerald-500"
            >
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-400">
                {post.upvotes} upvotes • {post.authorName}
              </p>
            </Link>
          ))}
        </div>
      </main>

      {open && (
        <CreatePostModal
          communityId={params.communityId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
