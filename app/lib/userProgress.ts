import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  increment,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function updateUserProgress(
  uid: string,
  pointsToAdd: number
) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  let streak = 1;
  let badges: string[] = [];

  if (snap.exists()) {
    const data = snap.data();
    badges = data.badges || [];

    if (data.lastActive) {
      const last = data.lastActive.toDate();
      const today = new Date();

      const diff =
        (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);

      if (diff < 1) {
        streak = data.streak || 1; // same day
      } else if (diff < 2) {
        streak = (data.streak || 0) + 1; // next day
      } else {
        streak = 1; // broken streak
      }
    }
  }

  // 🎖️ BADGES
  if (streak >= 3 && !badges.includes("streak-3")) {
    badges.push("streak-3");
  }
  if (streak >= 7 && !badges.includes("streak-7")) {
    badges.push("streak-7");
  }

  await setDoc(
    ref,
    {
      points: increment(pointsToAdd),
      streak,
      lastActive: serverTimestamp(),
      badges,
    },
    { merge: true }
  );
}
