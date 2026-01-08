"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function NewPracticePage() {
  const [title, setTitle] = useState("");
  const router = useRouter();

  async function save() {
    await addDoc(collection(db, "practice"), {
      title,
      published: true,
    });
    router.replace("/admin/practice");
  }

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">New Practice</h1>
      <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <button onClick={save} className="btn-primary">Save</button>
    </div>
  );
}
