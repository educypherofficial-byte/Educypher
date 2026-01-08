import type { CommunityPost } from "@/types/community";

export default function CommunityPost({
  post,
}: {
  post: CommunityPost;
}) {
  return (
    <div className="border border-gray-800 rounded-lg p-4">
      <p className="text-sm text-gray-400">{post.authorName}</p>

      <p className="mt-2">{post.content}</p>

      <div className="mt-3 text-xs text-gray-500">
        {post.likeCount} likes · {post.commentCount} comments
      </div>
    </div>
  );
}
