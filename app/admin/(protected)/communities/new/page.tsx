"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function NewCommunityPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  async function create() {
    if (!title || !slug) {
      alert("Title and slug required");
      return;
    }

    await addDoc(collection(db, "communities"), {
      title,
      slug,
      description,
      createdAt: serverTimestamp(),
    });

    router.replace("/admin/communities");
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">New Community</h1>

      <input
        className="input"
        placeholder="Community title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setSlug(
            e.target.value
              .toLowerCase()
              .replace(/\s+/g, "-")
          );
        }}
      />

      <input
        className="input"
        placeholder="Slug (auto-generated)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />

      <textarea
        className="input"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={create}
        className="px-6 py-3 bg-emerald-500 text-black rounded-lg"
      >
        Create Community
      </button>
    </div>
  );
}
