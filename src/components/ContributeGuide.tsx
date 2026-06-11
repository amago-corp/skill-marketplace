import CopyPromptBox from "./CopyPromptBox";
import { CONTRIBUTE_PROMPT, REGISTER_REPO_PROMPT } from "@/lib/prompts";

export default function ContributeGuide() {
  return (
    <details className="group rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-50/80 to-white/60 shadow-md shadow-emerald-500/10">
      <summary className="cursor-pointer list-none flex items-center justify-between gap-3 px-6 sm:px-7 py-5">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔨</span>
          <h2 className="text-base sm:text-lg font-semibold text-stone-900">
            내 AI 도구 등록하기 (3단계)
          </h2>
        </div>
        <svg
          className="w-5 h-5 text-stone-500 transition-transform group-open:rotate-180 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </summary>

      <div className="px-6 sm:px-7 pb-6 sm:pb-7">
        <p className="text-xs text-stone-400 mb-4">
          코드 직접 짤 필요 없어요. 클로드 코드(Claude Code)에 시키면 됩니다.
        </p>
        <ol className="space-y-3 mb-5">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              1
            </span>
            <span className="text-sm sm:text-base text-stone-600 pt-0.5">
              클로드한테 <span className="text-stone-800">&quot;이런 자동화 만들어 줘&quot;</span> 요청 — 본인이 잘 동작 확인
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              2
            </span>
            <div className="flex-1 min-w-0">
              <span className="block text-sm sm:text-base text-stone-600 pt-0.5">
                클로드한테 <span className="text-stone-800">&quot;이거 amago AI Hub plugin으로 정리해서 올려 줘&quot;</span> 요청
              </span>
              <span className="block text-xs text-stone-400 mt-1 mb-2">
                아래 문장 통째로 복붙하면 클로드가 구조·규칙·예시를 보고 알아서 정리해요
              </span>
              <CopyPromptBox text={CONTRIBUTE_PROMPT} />
              <div className="mt-1.5 flex flex-wrap gap-x-4">
                <a
                  href="https://github.com/amago-corp/agent-hub/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-700 hover:text-emerald-800"
                >
                  기여 규칙 보기 →
                </a>
                <a
                  href="https://github.com/amago-corp/agent-hub/tree/main/plugins/data-analyst"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-700 hover:text-emerald-800"
                >
                  예시 plugin 보기 →
                </a>
              </div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              3
            </span>
            <span className="text-sm sm:text-base text-stone-600 pt-0.5">
              팀원 1명 검토 → 합치면 마켓에 자동 노출 ✨
            </span>
          </li>
        </ol>

        <div className="mb-5 rounded-lg border border-emerald-500/20 bg-emerald-50/60 p-3 space-y-2">
          <div className="text-xs font-medium text-stone-600">
            💡 이미 본인 GitHub 레포로 운영 중인 도구라면 — 레포 옮길 필요 없이 아래 문장을
            Claude Code 에 복붙 (저장소 주소만 본인 것으로)
          </div>
          <CopyPromptBox text={REGISTER_REPO_PROMPT} />
        </div>

        <details className="group/inner border-t border-stone-300 pt-4">
          <summary className="cursor-pointer list-none flex items-center justify-between text-sm text-stone-500 hover:text-stone-700 transition-colors">
            <span>자세한 규칙 (이름·필수파일·금지사항)</span>
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

          <div className="mt-4 space-y-3 text-sm text-stone-600">
            <div>
              <div className="font-medium text-stone-700 mb-1">📛 절대 금지</div>
              <ul className="list-disc list-inside space-y-0.5 text-xs text-stone-500">
                <li>API 키·비밀번호·웹훅 URL 코드에 적기</li>
                <li>본인 컴퓨터 절대경로 (<code>/Users/내이름/...</code>)</li>
                <li>노션 DB ID·슬랙 채널 ID 직접 박기</li>
              </ul>
            </div>

            <div>
              <div className="font-medium text-stone-700 mb-1">📝 이름 규칙</div>
              <p className="text-xs text-stone-500">
                소문자 + 하이픈 (예: <code>weekly-okr-analyzer</code>). 동사+명사 추천.
              </p>
            </div>

            <a
              href="https://github.com/amago-corp/agent-hub/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-emerald-700 hover:text-emerald-800 underline underline-offset-2 text-xs"
            >
              전체 기여 가이드 보기 →
            </a>
          </div>
        </details>
      </div>
    </details>
  );
}
