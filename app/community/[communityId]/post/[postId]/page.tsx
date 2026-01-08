"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuthGuard } from "@/lib/useAuthGuard";

import {
  getCommunityPost,
  getPostComments,
  addComment,
} from "@/lib/community";
import { CommunityPost, CommunityComment } from "@/types/community";

export default function PostPage({
  params,
}: {
  params: { communityId: string; postId: string };
}) {
  const { user } = useAuthGuard();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    getCommunityPost(params.communityId, params.postId).then(setPost);
    getPostComments(params.communityId, params.postId).then(setComments);
  }, [params]);

  async function submitComment() {
    if (!user || !text) return;

    await addComment(params.communityId, params.postId, {
      content: text,
      authorId: user.uid,
      authorName: user.displayName || "Anonymous",
    });

    setText("");
    getPostComments(params.communityId, params.postId).then(setComments);
  }

  if (!post) return null;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-neutral-950 text-white px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <p className="text-gray-400">{post.content}</p>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Comments</h2>

            {comments.map((c) => (
              <div
                key={c.id}
                className="rounded bg-neutral-900 border border-neutral-800 p-3"
              >
                <p>{c.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {c.authorName}
                </p>
              </div>
            ))}

            {user && (
              <div className="space-y-2">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full rounded bg-neutral-800 px-3 py-2 outline-none"
                />
                <button
                  onClick={submitComment}
                  className="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-700"
                >
                  Comment
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
