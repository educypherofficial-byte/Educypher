import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type PracticeLab = {
  id: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  problem: string;
  output: string;
};

export async function getPracticeLabs(): Promise<PracticeLab[]> {
  const snap = await getDocs(collection(db, "practice"));
  return snap.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as PracticeLab
  );
}

export async function getPracticeLab(
  id: string
): Promise<PracticeLab | null> {
  const snap = await getDoc(doc(db, "practice", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as PracticeLab;
}
