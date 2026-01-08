import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LearnCategory, Lesson } from "@/types/learn";

export async function getCategories(): Promise<LearnCategory[]> {
  const snap = await getDocs(
    query(collection(db, "learn_categories"), orderBy("order"))
  );

  return snap.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as LearnCategory
  );
}

export async function getLessons(): Promise<Lesson[]> {
  const snap = await getDocs(
    query(
      collection(db, "learn_lessons"),
      where("published", "==", true),
      orderBy("order")
    )
  );

  return snap.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as Lesson
  );
}

export async function getLesson(id: string): Promise<Lesson | null> {
  const ref = doc(db, "learn_lessons", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;
  if (snap.data().published !== true) return null;

  return { id: snap.id, ...snap.data() } as Lesson;
}
