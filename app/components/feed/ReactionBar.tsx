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
    <div className="flex items-center gap-3">
      <ReactionButton
        label="👍"
        count={reactions.like}
        onClick={() => react("like")}
      />
      <ReactionButton
        label="🔥"
        count={reactions.fire}
        onClick={() => react("fire")}
      />
      <ReactionButton
        label="😂"
        count={reactions.laugh}
        onClick={() => react("laugh")}
      />
    </div>
  );
}

/* ---------- UI-ONLY SUB COMPONENT ---------- */

function ReactionButton({
  label,
  count,
  onClick,
}: {
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center gap-2
        px-3 py-1.5
        rounded-full
        border border-neutral-800
        bg-neutral-900/60 backdrop-blur
        text-sm text-gray-300
        hover:border-neutral-700
        hover:bg-neutral-900
        active:scale-95
        transition
      "
    >
      <span className="text-base">{label}</span>
      <span className="text-xs font-medium text-gray-400">
        {count}
      </span>
    </button>
  );
}
