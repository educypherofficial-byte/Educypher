"use client";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import LessonEditor from "../LessonEditor";
import { useParams, useRouter } from "next/navigation";

export default function EditLessonPage() {
  const { lessonId } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    const loadLesson = async () => {
      const snap = await getDoc(doc(db, "learn_lessons", lessonId as string));
      if (!snap.exists()) return;

      const data = snap.data();
      setTitle(data.title);
      setContent(data.content);
      setPublished(data.published);
    };

    loadLesson();
  }, [lessonId]);

  const updateLesson = async () => {
    await updateDoc(doc(db, "learn_lessons", lessonId as string), {
      title,
      content,
      published,
      updatedAt: new Date(),
    });

    router.push("/admin/learn");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Lesson</h1>

      <input
        className="border p-2 w-full mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <LessonEditor value={content} onChange={setContent}lessonId={lessonId as string}/>


      <div className="flex items-center gap-4 mt-4">
        <label>
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />{" "}
          Published
        </label>

        <button
          onClick={updateLesson}
          className="bg-black text-white px-4 py-2"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
