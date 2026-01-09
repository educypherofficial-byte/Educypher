import type { Community } from "@/types/community";
import Link from "next/link";

export default function CommunityCard({ c }: { c: Community }) {
  return (
    <Link
      href={`/community/${c.id}`}
      className="
        group relative block
        rounded-2xl
        border border-neutral-800
        bg-neutral-900/60 backdrop-blur
        p-5
        transition
        hover:-translate-y-1
        hover:border-emerald-500/40
      "
    >
      {/* subtle hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition" />

      <div className="relative space-y-3">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div
            className="
              h-10 w-10 rounded-xl
              bg-emerald-400/20 text-emerald-300
              flex items-center justify-center
              text-lg
            "
          >
            {c.icon ?? "💬"}
          </div>

          <h2 className="text-lg font-semibold tracking-tight">
            {c.name}
          </h2>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-400 leading-relaxed">
          {c.description}
        </p>

        {/* FOOTER */}
        <div className="pt-2 text-xs text-gray-500">
          {c.postCount ?? 0} posts
        </div>
      </div>
    </Link>
  );
}
