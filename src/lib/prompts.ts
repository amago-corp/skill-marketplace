/**
 * 가이드 UI 에서 "Claude Code 에 복붙" 용으로 노출하는 프롬프트 모음.
 * 비개발 팀원이 터미널 명령 대신 이 문장만 복사하면 되도록 유지한다.
 */

export const SETUP_PROMPT =
  "GitHub CLI(gh) 설치하고 GitHub 로그인까지 도와줘. 비개발자니까 단계마다 쉽게 알려줘.";

/**
 * 스킬 상세 페이지의 설치 프롬프트.
 * 슬래시 커맨드(/plugin ...)는 여러 줄 붙여넣기 시 실행되지 않으므로,
 * 클로드가 비대화형 CLI(claude plugin ...)를 Bash 로 실행하게 시키는 문장을 만든다.
 */
export function buildInstallPrompt(
  marketplaceSource: string,
  installTarget: string,
  marketplaceName: string
): string {
  return `이 플러그인 설치해줘. 터미널 명령:
claude plugin marketplace add ${marketplaceSource}
claude plugin install ${installTarget}@${marketplaceName}
설치 끝나면 사용법 알려줘.`;
}

export const CONTRIBUTE_PROMPT = `방금 만든 이 자동화를 amago AI Hub plugin 으로 정리해서 올려줘.

기여 규칙: https://github.com/amago-corp/agent-hub/blob/main/CONTRIBUTING.md
예시 plugin: https://github.com/amago-corp/agent-hub/tree/main/plugins/data-analyst

위 두 링크의 구조·규칙·예시를 따라 정리하고, amago-corp/agent-hub 에 PR 올린 뒤 링크 알려줘.`;

export const REGISTER_REPO_PROMPT = `내 GitHub 저장소를 amago AI Hub 마켓에 등록해줘.

저장소: https://github.com/아이디/레포이름 ← 본인 것으로 변경

방법:
1. 저장소가 Claude Code 표준 플러그인 구조(루트 .claude-plugin/plugin.json)인지 확인하고, 아니면 맞춰줘.
2. amago-corp/skill-marketplace 레포의 src/lib/repos.config.ts 에 내 저장소 항목을 추가하는 PR 을 올려줘. (push 권한 없으면 fork 해서)
3. PR 링크 알려줘. 팀원 1명이 검토하고 머지되면 마켓에 노출돼.`;
