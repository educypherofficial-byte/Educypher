"use client";

import { v4 as uuid } from "uuid";
import { LessonSection, SectionType } from "@/types/admin";

export default function SectionEditor({
  sections,
  setSections,
}: {
  sections: LessonSection[];
  setSections: (s: LessonSection[]) => void;
}) {
  const addSection = (type: SectionType) => {
    setSections([
      ...sections,
      {
        id: uuid(),
        type,
        content: "",
        language: type === "code" ? "javascript" : undefined,
      },
    ]);
  };

  const updateSection = (
    id: string,
    key: keyof LessonSection,
    value: string
  ) => {
    setSections(
      sections.map((s) =>
        s.id === id ? { ...s, [key]: value } : s
      )
    );
  };

  const removeSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-4">
      {sections.map((s) => (
        <div key={s.id} className="admin-card p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">{s.type}</span>
            <button
              onClick={() => removeSection(s.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>

          {s.type === "heading" && (
            <input
              className="admin-input w-full"
              placeholder="Heading"
              value={s.content}
              onChange={(e) =>
                updateSection(s.id, "content", e.target.value)
              }
            />
          )}

          {s.type === "text" && (
            <textarea
              className="admin-input w-full min-h-[120px]"
              placeholder="Explanation"
              value={s.content}
              onChange={(e) =>
                updateSection(s.id, "content", e.target.value)
              }
            />
          )}

          {s.type === "code" && (
            <>
              <select
                className="admin-input mb-2"
                value={s.language}
                onChange={(e) =>
                  updateSection(s.id, "language", e.target.value)
                }
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
              </select>

              <textarea
                className="admin-input w-full font-mono min-h-[150px]"
                placeholder="Code"
                value={s.content}
                onChange={(e) =>
                  updateSection(s.id, "content", e.target.value)
                }
              />
            </>
          )}
        </div>
      ))}

      <div className="flex gap-2">
        <button onClick={() => addSection("heading")} className="admin-btn">
          + Heading
        </button>
        <button onClick={() => addSection("text")} className="admin-btn">
          + Text
        </button>
        <button onClick={() => addSection("code")} className="admin-btn">
          + Code
        </button>
      </div>
    </div>
  );
}
