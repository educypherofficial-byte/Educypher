import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function logActivity(data: {
  userId: string;
  type: "post" | "comment" | "upvote";
  referenceId: string;
}) {
  await addDoc(collection(db, "activity"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}
