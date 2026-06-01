"use client";

interface EmptyRepoStateProps {
  onAddRepo: () => void;
}

export default function EmptyRepoState({ onAddRepo }: EmptyRepoStateProps) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-stone-300 rounded-2xl py-20 px-8 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-stone-100 border border-stone-300 mb-6">
        <span className="text-3xl" aria-hidden="true">🧰</span>
      </div>

      <h2 className="text-xl font-semibold text-stone-900 mb-2">
        AI 도구창고가 비어있어요
      </h2>
      <p className="text-stone-600 text-sm max-w-sm mb-8">
        첫 작업장(workspace)을 연결해 보세요.
        <br />
        <code className="text-stone-500 text-xs bg-stone-100 px-1.5 py-0.5 rounded">SKILL.md</code> 파일이 포함된 GitHub 저장소를 추가하면 됩니다.
      </p>

      <button
        onClick={onAddRepo}
        className="inline-flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-amber-50 text-sm font-medium px-5 py-2.5 transition-colors cursor-pointer"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        외부 작업장 연결
      </button>
    </div>
  );
}
