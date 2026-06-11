"use client";

import { useState } from "react";

interface CopyPromptBoxProps {
  text: string;
  label?: string;
}

export default function CopyPromptBox({ text, label }: CopyPromptBoxProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg bg-[#ece2d0] border border-stone-300 p-3">
      {label && (
        <div className="text-xs font-medium text-stone-500 mb-2">{label}</div>
      )}
      <div className="flex items-start gap-2">
        <pre className="flex-1 whitespace-pre-wrap break-all font-sans text-xs text-stone-700">
          {text}
        </pre>
        <button
          type="button"
          onClick={handleCopy}
          className="flex-shrink-0 rounded-md border border-stone-400 bg-stone-50 px-2.5 py-1 text-xs text-stone-600 hover:text-stone-900 hover:border-stone-500 transition-colors cursor-pointer"
        >
          {copied ? "복사됨 ✓" : "복사"}
        </button>
      </div>
    </div>
  );
}
