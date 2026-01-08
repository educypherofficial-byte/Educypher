"use client";

import { useAdminAuth } from "./AdminAuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!admin) router.replace("/admin/login");
  }, [admin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Checking admin session…
      </div>
    );
  }

  if (!admin) return null;

  return <>{children}</>;
}
