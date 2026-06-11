"use client";

import CopyPromptBox from "./CopyPromptBox";
import { REGISTER_REPO_PROMPT } from "@/lib/prompts";

interface AddRepoModalProps {
  open: boolean;
  onClose: () => void;
}

// 저장소 추가는 Vercel 환경에서 런타임 파일 쓰기가 불가해 API 대신
// Claude Code 가 repos.config.ts PR 을 올리는 방식으로 안내한다.
export default function AddRepoModal({ open, onClose }: AddRepoModalProps) {
  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      {/* Backdrop */}
      <div
        style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.75)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-stone-50 border border-stone-300 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-300">
          <h2 className="text-lg font-semibold text-stone-900">저장소 추가</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-stone-600">
            본인 GitHub 저장소 등록은 Claude Code 가 처리해요. 아래 문장을 복사해서
            Claude Code 에 붙여넣으면 끝 — 팀원 1명 검토 후 머지되면 마켓에 노출됩니다.
          </p>

          <CopyPromptBox
            label="📋 Claude Code 에 복붙 (저장소 주소만 본인 것으로)"
            text={REGISTER_REPO_PROMPT}
          />

          <p className="text-xs text-stone-400">
            저장소가 표준 플러그인 구조가 아니어도 클로드가 알아서 맞춰줘요.
          </p>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
