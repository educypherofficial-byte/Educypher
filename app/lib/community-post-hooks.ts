"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CommunityPost } from "@/types/community-post";

export function useCommunityPosts(communityId?: string) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    if (!communityId) return;

    const q = query(
      collection(db, "communities", communityId, "posts"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snap) => {
      setPosts(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<CommunityPost, "id">),
        }))
      );
    });
  }, [communityId]);

  return posts;
}
