"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthGuard } from "@/lib/useAuthGuard";
import Navbar from "@/components/Navbar";

export default function CommunityPage() {
  const { user, loading } = useAuthGuard();
  const [communities, setCommunities] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    getDocs(collection(db, "communities"))
      .then((snap) =>
        setCommunities(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      )
      .catch(console.error);
  }, [user]);

  if (loading) return null;

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="text-white p-10">
          Please login to access communities.
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-950 text-white p-6">
        <h1 className="text-2xl font-bold mb-6">Communities</h1>

        <div className="grid gap-4">
          {communities.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-4"
            >
              {c.name}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
