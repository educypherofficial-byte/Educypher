"use client";

import { useUserAuth } from "@/providers/UserAuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // ⛔ wait for Firebase
    if (!user) router.replace("/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Checking session…
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
