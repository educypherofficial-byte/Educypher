"use client";

import Link from "next/link";
import { FeedPost } from "@/types/feed";
import { timeAgo } from "@/lib/time";
import ReactionBar from "@/components/feed/ReactionBar";

export default function FeedPostCard({ post }: { post: FeedPost }) {
  return (
    <div
      className="
        group relative
        rounded-3xl
        border border-neutral-800
        bg-neutral-900/70 backdrop-blur
        px-6 py-6
        space-y-6
        transition-all
        hover:-translate-y-1
        hover:border-neutral-700
      "
    >
      {/* Accent bar */}
      <div
        className="
          absolute left-0 top-0 h-full w-[3px]
          rounded-l-3xl
          bg-gradient-to-b from-emerald-400/80 to-emerald-600/80
        "
      />

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="
              h-10 w-10 rounded-full
              bg-gradient-to-br from-emerald-400 to-emerald-600
              flex items-center justify-center
              text-black font-bold text-lg
              shrink-0
            "
          >
            {post.userName[0]}
          </div>

          {/* Meta */}
          <div className="leading-tight">
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
          className="
            text-xs text-gray-400
            hover:text-emerald-400
            transition
          "
        >
          View →
        </Link>
      </div>

      {/* CONTENT */}
      <div className="space-y-4">
        <p className="text-base leading-relaxed text-gray-100 whitespace-pre-wrap">
          {post.text}
        </p>

        {post.image && (
          <div
            className="
              relative h-64
              rounded-2xl overflow-hidden
              border border-neutral-800
            "
          >
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
        <div className="flex flex-wrap gap-2 pt-1">
          {post.tags.map((t) => (
            <span
              key={t}
              className="
                rounded-full
                border border-emerald-500/30
                bg-emerald-500/10
                px-3 py-1
                text-xs font-medium
                text-emerald-400
              "
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
        <ReactionBar
          feedId={post.id}
          initial={post.reactions}
        />

        <Link
          href={`/feed/${post.id}`}
          className="
            text-sm font-medium
            text-gray-400
            hover:text-emerald-400
            transition
          "
        >
          💬 {post.commentCount} discussions
        </Link>
      </div>
    </div>
  );
}
