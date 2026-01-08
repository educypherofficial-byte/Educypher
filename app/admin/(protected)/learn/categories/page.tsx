/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { LearnCategory } from "@/types/admin";

export default function CategoriesAdmin() {
  const [cats, setCats] = useState<LearnCategory[]>([]);

  const load = async () => {
    const snap = await getDocs(collection(db, "learn_categories"));
    const data: LearnCategory[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<LearnCategory, "id">),
    }));
    setCats(data.sort((a, b) => a.order - b.order));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      {cats.map((c) => (
        <div key={c.id} className="admin-row p-3">
          {c.name}
        </div>
      ))}
    </div>
  );
}
