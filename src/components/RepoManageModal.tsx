"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ProviderIcon } from "./ProviderIcon";
import { SkillRepository } from "@/lib/types";

interface RepoManageModalProps {
  open: boolean;
  onClose: () => void;
  onChanged: () => void;
}

export default function RepoManageModal({ open, onClose, onChanged }: RepoManageModalProps) {
  const [repos, setRepos] = useState<SkillRepository[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setConfirmId(null);
    setErrorId(null);
    fetch("/api/repos")
      .then((res) => res.json())
      .then((data) => setRepos(data.repos ?? []))
      .catch(() => setRepos([]))
      .finally(() => setLoading(false));
  }, [open]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    setErrorId(null);
    try {
      const res = await fetch("/api/repos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setRepos((prev) => prev.filter((r) => r.id !== id));
        onChanged();
      } else {
        setErrorId(id);
      }
    } catch {
      setErrorId(id);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  if (!open) return null;

  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      {/* Backdrop */}
      <div
        style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.75)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">저장소 관리</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <svg className="w-5 h-5 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          ) : repos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">등록된 저장소가 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {repos.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-gray-800/50 border border-gray-700/50 px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <ProviderIcon provider={r.provider} className="h-5 w-5 shrink-0 text-gray-400" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">{r.displayName}</div>
                      <div className="text-xs text-gray-500 truncate">{r.owner}/{r.repo}</div>
                      {errorId === r.id && (
                        <div className="text-xs text-red-400 mt-0.5">삭제에 실패했습니다.</div>
                      )}
                    </div>
                  </div>

                  {confirmId === r.id ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={deletingId === r.id}
                        className="inline-flex items-center gap-1 rounded-md bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white text-xs font-medium px-2.5 py-1.5 transition-colors cursor-pointer"
                      >
                        {deletingId === r.id ? (
                          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                        ) : null}
                        삭제
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        disabled={deletingId === r.id}
                        className="rounded-md text-gray-400 hover:text-white text-xs px-2 py-1.5 transition-colors cursor-pointer"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(r.id)}
                      className="shrink-0 text-gray-500 hover:text-red-400 transition-colors cursor-pointer p-1.5 rounded-md hover:bg-gray-700/50"
                      title="저장소 삭제"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
