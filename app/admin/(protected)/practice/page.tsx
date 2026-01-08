"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminPracticePage() {
  const [labs, setLabs] = useState<any[]>([]);

  useEffect(() => {
    getDocs(collection(db, "practice")).then(s =>
      setLabs(s.docs.map(d => ({ id: d.id, ...d.data() })))
    );
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Practice Labs</h1>

      <Link href="/admin/practice/new" className="btn-primary">
        + New Lab
      </Link>

      {labs.map(l => (
        <div key={l.id} className="bg-neutral-900 p-4 rounded">
          {l.title}
        </div>
      ))}
    </div>
  );
}
