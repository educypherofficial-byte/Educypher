"use client";

import Link from "next/link";
import Image from "next/image";
import { FeedPost } from "@/types/feed";
import { timeAgo } from "@/lib/time";
import ReactionBar from "@/components/feed/ReactionBar";

export default function FeedPostCard({ post }: { post: FeedPost }) {
  return (
    <div className="group relative rounded-3xl border border-neutral-800 bg-neutral-950 px-6 py-5 space-y-5 transition hover:border-neutral-700">
      {/* Accent bar */}
      <div className="absolute left-0 top-0 h-full w-[4px] rounded-l-3xl bg-gradient-to-b from-emerald-400 to-emerald-700" />

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-black font-bold text-lg">
            {post.userName[0]}
          </div>

          {/* Meta */}
          <div>
            <p className="text-sm font-semibold text-gray-100">
              {post.userName}
            </p>
            <p className="text-xs text-gray-500">
              {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>

        {/* View discussion */}
        <Link
          href={`/feed/${post.id}`}
          className="text-xs text-gray-400 hover:text-emerald-400 transition"
        >
          View →
        </Link>
      </div>

      {/* CONTENT */}
      <div className="space-y-3">
        <p className="text-base leading-relaxed text-gray-100">
          {post.text}
        </p>

       {post.image && (
  <div className="mt-3 relative h-64 rounded-xl overflow-hidden border border-neutral-800">
    <img
      src={post.image}
      alt="Post image"
      className="w-full h-full object-cover"
    />
  </div>
)}

      </div>

      {/* TAGS */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
        <ReactionBar feedId={post.id} initial={post.reactions} />

        <Link
          href={`/feed/${post.id}`}
          className="text-sm font-medium text-gray-400 hover:text-emerald-400 transition"
        >
          💬 {post.commentCount} discussions
        </Link>
      </div>
    </div>
  );
}
