/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Community } from "@/types/admin";

export default function CommunitiesAdmin() {
  const [communities, setCommunities] = useState<Community[]>([]);

  const load = async () => {
    const snap = await getDocs(collection(db, "communities"));
    const data: Community[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Community, "id">),
    }));
    setCommunities(data);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (id: string, active: boolean) => {
    await updateDoc(doc(db, "communities", id), { active: !active });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Communities</h1>

      {communities.map((c) => (
        <div key={c.id} className="admin-row p-4 mb-2 flex justify-between">
          <span>{c.name}</span>
          <button onClick={() => toggle(c.id, c.active)}>
            {c.active ? "Disable" : "Enable"}
          </button>
        </div>
      ))}
    </div>
  );
}
