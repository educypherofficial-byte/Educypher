"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      // 🔐 CHECK ADMIN
      const adminRef = doc(db, "admins", user.uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        router.replace("/dashboard");
        return;
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-gray-400">
        Checking admin access…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 p-5">
        <h1 className="text-xl font-bold text-emerald-400 mb-6">
          EduCypher Admin
        </h1>

        <nav className="space-y-2 text-sm">
          <AdminLink href="/admin">Dashboard</AdminLink>
          <AdminLink href="/admin/learn">Learn</AdminLink>
          <AdminLink href="/admin/communities">Communities</AdminLink>
          <AdminLink href="/admin/feed">Feed</AdminLink>
          <AdminLink href="/admin/users">Users</AdminLink>
          <AdminLink href="/admin/practice">Practice</AdminLink>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function AdminLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-lg hover:bg-neutral-800"
    >
      {children}
    </Link>
  );
}
