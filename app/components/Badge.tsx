import { Trophy, Flame, Star } from "lucide-react";

export function Badge({ type }: { type: string }) {
  const map: any = {
    "first-lesson": {
      icon: <Star size={14} />,
      label: "First Lesson",
    },
    "streak-3": {
      icon: <Flame size={14} />,
      label: "3 Day Streak",
    },
    "streak-7": {
      icon: <Trophy size={14} />,
      label: "7 Day Streak",
    },
    helper: {
      icon: <Star size={14} />,
      label: "Community Helper",
    },
  };

  const badge = map[type];
  if (!badge) return null;

  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-800 text-xs text-emerald-400">
      {badge.icon}
      {badge.label}
    </div>
  );
}
