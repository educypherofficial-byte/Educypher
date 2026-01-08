"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Community = {
  id: string;
  title: string;
  slug: string;
  description: string;
};

export default function CommunityPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "communities"));
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-400">
          Loading communities…
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-neutral-950 text-white px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Communities</h1>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {communities.map((c) => (
              <Link
                key={c.id}
                href={`/community/${c.slug}`}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-emerald-500/40 transition"
              >
                <h2 className="font-semibold mb-1">{c.title}</h2>
                <p className="text-sm text-gray-400">{c.description}</p>
              </Link>
            ))}

            {communities.length === 0 && (
              <div className="text-gray-400">No communities yet.</div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
