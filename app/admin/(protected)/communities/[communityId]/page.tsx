"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EditCommunityPage({
  params,
}: {
  params: Promise<{ communityId: string }>;
}) {
  const { communityId } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "communities", communityId));
      const d = snap.data();
      setTitle(d?.title || "");
      setSlug(d?.slug || "");
      setDescription(d?.description || "");
    }
    load();
  }, [communityId]);

  async function save() {
    setSaving(true);
    await updateDoc(doc(db, "communities", communityId), {
      title,
      slug,
      description,
    });
    setSaving(false);
    alert("Saved");
  }

  async function remove() {
    if (!confirm("Delete this community? This cannot be undone.")) return;
    await deleteDoc(doc(db, "communities", communityId));
    router.replace("/admin/communities");
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-black tracking-tight">
            Edit Community
          </h1>
          <p className="text-gray-400 mt-2">
            Update details or remove this community from the platform.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur p-8 space-y-6">

          {/* TITLE */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Community name</label>
            <input
              className="
                w-full rounded-xl
                bg-neutral-950 border border-neutral-800
                px-4 py-3 text-white
                focus:outline-none focus:border-emerald-500/50
              "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* SLUG */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">URL slug</label>
            <input
              className="
                w-full rounded-xl
                bg-neutral-950 border border-neutral-800
                px-4 py-3 text-gray-300
                focus:outline-none focus:border-emerald-500/50
              "
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Description</label>
            <textarea
              className="
                w-full min-h-[120px] rounded-xl
                bg-neutral-950 border border-neutral-800
                px-4 py-3 text-white
                focus:outline-none focus:border-emerald-500/50
              "
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-between pt-6 border-t border-neutral-800">

            <button
              onClick={remove}
              className="
                px-4 py-2 rounded-lg
                border border-red-500/40
                bg-red-500/10 text-red-400
                hover:bg-red-500/20 transition
              "
            >
              Delete Community
            </button>

            <div className="flex gap-4">
              <button
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>

              <button
                onClick={save}
                disabled={saving}
                className="
                  px-6 py-3 rounded-xl
                  bg-emerald-500 text-black font-semibold
                  hover:bg-emerald-400 transition
                  shadow-[0_20px_60px_-15px_rgba(52,211,153,0.6)]
                  disabled:opacity-60
                "
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
