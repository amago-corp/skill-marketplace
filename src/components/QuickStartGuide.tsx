export default function QuickStartGuide() {
  return (
    <details className="group rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-gray-900/80 to-gray-900/40 shadow-lg shadow-indigo-500/5 h-full">
        <summary className="cursor-pointer list-none flex items-center justify-between gap-3 px-6 sm:px-7 py-5">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <h2 className="text-base sm:text-lg font-semibold text-white">
              처음 이용하시나요? 3단계로 끝!
            </h2>
          </div>
          <svg
            className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </summary>

        <div className="px-6 sm:px-7 pb-6 sm:pb-7">
          <ol className="space-y-3 mb-5">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                1
              </span>
              <span className="text-sm sm:text-base text-gray-300 pt-0.5">
                원하는 카드 클릭
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                2
              </span>
              <span className="text-sm sm:text-base text-gray-300 pt-0.5">
                상세 페이지의 회색 박스 명령어 복사 📋
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                3
              </span>
              <span className="text-sm sm:text-base text-gray-300 pt-0.5">
                Claude Code 터미널에 붙여넣기 + Enter
              </span>
            </li>
          </ol>

          <details className="group/inner border-t border-gray-800 pt-4">
            <summary className="cursor-pointer list-none flex items-center justify-between text-sm text-gray-400 hover:text-gray-200 transition-colors">
              <span>처음 한 번만 — Claude Code + GitHub 인증 필요</span>
              <svg
                className="w-4 h-4 transition-transform group-open/inner:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </summary>

            <div className="mt-4 space-y-4 text-sm text-gray-300">
              <div>
                <div className="font-medium text-gray-200 mb-1">1. Claude Code 설치</div>
                <a
                  href="https://code.claude.com/docs/en/overview.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                >
                  공식 설치 가이드 보기 →
                </a>
              </div>

              <div>
                <div className="font-medium text-gray-200 mb-1">2. GitHub CLI 설치 + 로그인</div>
                <pre className="rounded-lg bg-gray-950 border border-gray-800 px-3 py-2.5 text-xs text-gray-200 overflow-x-auto">
                  <code>{`brew install gh
gh auth login`}</code>
                </pre>
              </div>

              <div className="text-gray-400">
                3. 끝! 위 3단계대로 카드 누르고 명령어 복사 → 붙여넣기.
              </div>
            </div>
          </details>
        </div>
      </details>
  );
}
