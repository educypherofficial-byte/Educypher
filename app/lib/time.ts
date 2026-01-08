import { Timestamp } from "firebase/firestore";

type FirestoreLike = { seconds: number };

export function timeAgo(
  ts: Timestamp | Date | FirestoreLike | number | null | undefined
) {
  if (!ts) return "just now";

  let date: Date | null = null;

  if (ts instanceof Timestamp) date = ts.toDate();
  else if (ts instanceof Date) date = ts;
  else if (typeof ts === "number") date = new Date(ts);
  else if (typeof ts === "object" && "seconds" in ts)
    date = new Date(ts.seconds * 1000);

  if (!date || isNaN(date.getTime())) return "just now";

  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
