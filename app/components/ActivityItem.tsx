"use client";

import { CheckCircle, BookOpen, MessageSquare } from "lucide-react";
import { Activity } from "@/types/activity";

export default function ActivityItem({ activity }: { activity: Activity }) {
  const icon =
    activity.type === "practice" ? (
      <CheckCircle className="text-emerald-400" />
    ) : activity.type === "learn" ? (
      <BookOpen className="text-blue-400" />
    ) : (
      <MessageSquare className="text-purple-400" />
    );

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4">
      {icon}

      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{activity.title}</p>
        <p className="text-xs text-gray-500">
          {activity.user} • {activity.createdAt}
        </p>
      </div>
    </div>
  );
}
