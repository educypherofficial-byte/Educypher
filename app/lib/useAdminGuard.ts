"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthGuard } from "@/lib/useAuthGuard";
import { useRouter } from "next/navigation";

export function useAdminGuard() {
  const { user, loading } = useAuthGuard();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    getDoc(doc(db, "admins", user.uid)).then((snap) => {
      if (!snap.exists()) {
        router.replace("/feed");
        return;
      }
      setIsAdmin(true);
    });
  }, [user, loading, router]);

  return { isAdmin };
}
