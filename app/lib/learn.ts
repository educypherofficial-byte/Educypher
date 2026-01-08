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

export async function getLessonsByCategory(
  category: string
): Promise<Lesson[]> {
  const snap = await getDocs(
    query(
      collection(db, "learn_lessons"),
      where("category", "==", category),
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

  return { id: snap.id, ...snap.data() } as Lesson;
}
