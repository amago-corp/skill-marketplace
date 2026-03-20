"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

type Status = "idle" | "clearing" | "done";

export default function CacheClearButton() {
  const [status, setStatus] = useState<Status>("idle");
  const pathname = usePathname();

  async function handleClick() {
    if (status !== "idle") return;

    setStatus("clearing");
    try {
      const res = await fetch("/api/cache/clear", { method: "POST" });
      if (!res.ok) throw new Error("Failed to clear cache");

      setStatus("done");

      // 홈(목록) 페이지이면 자동 리페치 (클라이언트 컴포넌트이므로 location.reload)
      if (pathname === "/") {
        setTimeout(() => window.location.reload(), 800);
        return;
      }

      setTimeout(() => setStatus("idle"), 1500);
    } catch (error) {
      console.error("Cache clear failed:", error);
      setStatus("idle");
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={status === "clearing"}
      title="캐시 초기화"
      className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-wait"
    >
      {status === "done" ? (
        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      ) : (
        <svg
          className={`w-4 h-4 ${status === "clearing" ? "animate-spin text-indigo-400" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
          />
        </svg>
      )}
      <span className={status === "done" ? "text-green-400" : ""}>
        {status === "idle" && "Cache Clear"}
        {status === "clearing" && "Clearing..."}
        {status === "done" && "Cleared!"}
      </span>
    </button>
  );
}
