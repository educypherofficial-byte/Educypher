"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

const lowlight = createLowlight();
lowlight.register("javascript", javascript);
lowlight.register("python", python);

export default function LessonEditor({
  value,
  onChange,
  lessonId,
}: {
  value: string;
  onChange: (val: string) => void;
  lessonId: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap prose max-w-none min-h-[300px]",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const uploadImage = async (file: File) => {
    const imgRef = ref(
      storage,
      `lessons/${lessonId}/${Date.now()}-${file.name}`
    );
    await uploadBytes(imgRef, file);
    return await getDownloadURL(imgRef);
  };

  const onImageSelect = async (e: any) => {
    const file = e.target.files[0];
    if (!file || !editor) return;
    const url = await uploadImage(file);
    editor.chain().focus().setImage({ src: url }).run();
  };

  if (!editor) return null;

  return (
    <div className="border rounded bg-[#020617] text-white">
      <div className="flex gap-2 p-2 border-b border-[#1f2937]">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>List</button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code</button>

        <label className="cursor-pointer text-sm underline">
          Image
          <input type="file" hidden accept="image/*" onChange={onImageSelect} />
        </label>
      </div>

      <EditorContent editor={editor} className="p-4" />
    </div>
  );
}
