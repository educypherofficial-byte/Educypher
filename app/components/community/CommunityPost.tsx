import type { CommunityPost } from "@/types/community";

export default function CommunityPost({
  post,
}: {
  post: CommunityPost;
}) {
  return (
    <div
      className="
        rounded-2xl
        border border-neutral-800
        bg-neutral-900/60 backdrop-blur
        p-5
        transition
        hover:border-emerald-500/40
      "
    >
      {/* AUTHOR */}
      <p className="text-xs text-gray-500">
        {post.authorName}
      </p>

      {/* CONTENT */}
      <p className="mt-3 text-sm text-gray-200 leading-relaxed">
        {post.content}
      </p>

      {/* META */}
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
        <span>{post.likeCount} likes</span>
        <span>•</span>
        <span>{post.commentCount} comments</span>
      </div>
    </div>
  );
}
