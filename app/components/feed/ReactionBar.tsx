"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { reactOnce } from "@/lib/feed";
import { FeedReactions } from "@/types/feed";
import { useAuthGuard } from "@/lib/useAuthGuard";

const EMPTY: FeedReactions = { like: 0, fire: 0, laugh: 0 };

export default function ReactionBar({
  feedId,
  initial,
}: {
  feedId: string;
  initial: FeedReactions;
}) {
  const { user } = useAuthGuard();
  const [reactions, setReactions] = useState(initial ?? EMPTY);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "feed", feedId), (snap) => {
      const data = snap.data();
      if (data?.reactions) setReactions(data.reactions);
    });
    return () => unsub();
  }, [feedId]);

  function react(type: keyof FeedReactions) {
    if (!user) return;
    reactOnce(feedId, user.uid, type);
  }

  return (
    <div className="flex gap-4 text-sm text-gray-400">
      <button onClick={() => react("like")}>👍 {reactions.like}</button>
      <button onClick={() => react("fire")}>🔥 {reactions.fire}</button>
      <button onClick={() => react("laugh")}>😂 {reactions.laugh}</button>
    </div>
  );
}
