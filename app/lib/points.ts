import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function addPoints(uid: string, points: number) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    points: increment(points),
  });
}
