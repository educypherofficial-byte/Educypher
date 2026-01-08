import type { Community } from "@/types/community";
import Link from "next/link";

export default function CommunityCard({ c }: { c: Community }) {
  return (
    <Link
      href={`/community/${c.id}`}
      className="block border border-gray-800 rounded-lg p-4 hover:bg-gray-900 transition"
    >
      <h2 className="text-xl font-bold flex items-center gap-2">
        <span>{c.icon ?? "💬"}</span>
        <span>{c.name}</span>
      </h2>

      <p className="text-gray-400 mt-1">{c.description}</p>

      <p className="text-xs text-gray-500 mt-3">
        {(c.postCount ?? 0)} posts
      </p>
    </Link>
  );
}
