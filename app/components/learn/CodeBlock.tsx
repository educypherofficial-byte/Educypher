"use client";

import { useState } from "react";

export default function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="relative">
      <button
        onClick={copyCode}
        className="absolute right-3 top-3 text-xs text-gray-400 hover:text-white"
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>

      <pre className="bg-black rounded-lg p-4 text-sm overflow-x-auto border border-neutral-800">
        <code>{code}</code>
      </pre>
    </div>
  );
}
