"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";
import { FeedPost } from "@/types/feed";

export function useFeed() {
  const [feed, setFeed] = useState<FeedPost[]>([]);

  useEffect(() => {
    const q = query(collection(db, "feed"), orderBy("createdAt", "desc"));

    return onSnapshot(q, snap =>
      setFeed(
        snap.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<FeedPost, "id">),
        }))
      )
    );
  }, []);

  return feed;
}
