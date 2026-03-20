"use client";

interface EmptyRepoStateProps {
  onAddRepo: () => void;
}

export default function EmptyRepoState({ onAddRepo }: EmptyRepoStateProps) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-gray-700 rounded-2xl py-20 px-8 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700 mb-6">
        <svg
          className="w-8 h-8 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v8.25m19.5 0v3a2.25 2.25 0 0 1-2.25 2.25H4.5A2.25 2.25 0 0 1 2.25 19.5v-3m19.5 0h-18"
          />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-white mb-2">
        저장소 등록이 필요합니다
      </h2>
      <p className="text-gray-400 text-sm max-w-sm mb-8">
        GitHub 저장소를 등록하면 스킬을 검색하고 설치할 수 있습니다.
        <br />
        <code className="text-gray-500 text-xs">SKILL.md</code> 파일이 포함된 저장소를 추가해보세요.
      </p>

      <button
        onClick={onAddRepo}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 transition-colors cursor-pointer"
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
        첫 번째 저장소 등록하기
      </button>
    </div>
  );
}
