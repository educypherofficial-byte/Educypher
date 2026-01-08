"use client";

import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminCategoriesPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [cats, setCats] = useState<any[]>([]);

  useEffect(() => {
    getDocs(collection(db, "learn_categories")).then((snap) =>
      setCats(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
  }, []);

  async function add() {
    await addDoc(collection(db, "learn_categories"), {
      title,
      slug,
      order: 0,
    });
    location.reload();
  }

  async function remove(id: string) {
    await deleteDoc(doc(db, "learn_categories", id));
    location.reload();
  }

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Categories</h1>

      <input className="input" placeholder="Title" value={title} onChange={e => {
        setTitle(e.target.value);
        setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
      }} />

      <input className="input" placeholder="Slug" value={slug} onChange={e => setSlug(e.target.value)} />

      <button onClick={add} className="btn-primary">Add Category</button>

      {cats.map(c => (
        <div key={c.id} className="flex justify-between bg-neutral-900 p-3 rounded">
          {c.title}
          <button onClick={() => remove(c.id)} className="text-red-400">Delete</button>
        </div>
      ))}
    </div>
  );
}
