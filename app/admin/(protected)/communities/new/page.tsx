"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function NewCommunityPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  function makeSlug(val: string) {
    return val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function create() {
    if (!title) return alert("Title required");

    setSaving(true);
    await addDoc(collection(db, "communities"), {
      title,
      slug: slug || makeSlug(title),
      description,
      membersCount: 0,
      createdAt: serverTimestamp(),
    });

    router.replace("/admin/communities");
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-black tracking-tight">
            Create Community
          </h1>
          <p className="text-gray-400 mt-2 max-w-xl">
            Communities are where developers collaborate, ask questions and grow together.
          </p>
        </div>

        {/* FORM */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur p-8 space-y-6">

          {/* TITLE */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Community name</label>
            <input
              className="
                w-full rounded-xl
                bg-neutral-950 border border-neutral-800
                px-4 py-3
                text-white
                focus:outline-none focus:border-emerald-500/50
              "
              placeholder="e.g. React Developers"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSlug(makeSlug(e.target.value));
              }}
            />
          </div>

          {/* SLUG */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">URL slug</label>
            <input
              className="
                w-full rounded-xl
                bg-neutral-950 border border-neutral-800
                px-4 py-3
                text-gray-300
                focus:outline-none focus:border-emerald-500/50
              "
              placeholder="react-developers"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              This becomes: <span className="text-emerald-400">educypher.in/community/{slug || "your-community"}</span>
            </p>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Description</label>
            <textarea
              className="
                w-full min-h-[120px] rounded-xl
                bg-neutral-950 border border-neutral-800
                px-4 py-3
                text-white
                focus:outline-none focus:border-emerald-500/50
              "
              placeholder="What is this community about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end pt-4 gap-4">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>

            <button
              onClick={create}
              disabled={saving}
              className="
                px-6 py-3 rounded-xl
                bg-emerald-500 text-black font-semibold
                hover:bg-emerald-400 transition
                shadow-[0_20px_60px_-15px_rgba(52,211,153,0.6)]
                disabled:opacity-60
              "
            >
              {saving ? "Creating…" : "Create Community"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
