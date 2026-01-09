"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Community = {
  id: string;
  title: string;
  slug: string;
  description: string;
};

export default function AdminCommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const q = query(collection(db, "communities"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setCommunities(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Community, "id">),
        }))
      );
      setLoading(false);
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        Loading communities…
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Communities</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage all learning communities on EduCypher
          </p>
        </div>

        <Link
          href="/admin/communities/new"
          className="
            px-5 py-2.5 rounded-xl
            bg-emerald-500 text-black font-semibold
            hover:bg-emerald-400 transition
            shadow-[0_12px_40px_-10px_rgba(52,211,153,0.6)]
          "
        >
          + New Community
        </Link>
      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-12 text-xs uppercase text-gray-500 border-b border-neutral-800 pb-3">
        <div className="col-span-5">Community</div>
        <div className="col-span-5">Slug</div>
        <div className="col-span-2 text-right">Manage</div>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {communities.map((c) => (
          <Link
            key={c.id}
            href={`/admin/communities/${c.id}`}
            className="
              group grid grid-cols-12 items-center
              rounded-xl border border-neutral-800
              bg-neutral-900/70 backdrop-blur
              px-5 py-4
              hover:border-emerald-500/40
              hover:bg-neutral-900 transition
            "
          >
            {/* TITLE */}
            <div className="col-span-5">
              <p className="font-semibold text-gray-100 group-hover:text-white">
                {c.title}
              </p>
            </div>

            {/* SLUG */}
            <div className="col-span-5 text-sm text-gray-500">
              /{c.slug}
            </div>

            {/* ACTION */}
            <div className="col-span-2 text-right text-sm text-emerald-400 opacity-0 group-hover:opacity-100 transition">
              Open →
            </div>
          </Link>
        ))}

        {communities.length === 0 && (
          <div className="text-gray-400 text-sm">
            No communities created yet.
          </div>
        )}
      </div>
    </div>
  );
}
