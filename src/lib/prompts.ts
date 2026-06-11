/**
 * 가이드 UI 에서 "Claude Code 에 복붙" 용으로 노출하는 프롬프트 모음.
 * 비개발 팀원이 터미널 명령 대신 이 문장만 복사하면 되도록 유지한다.
 */

export const SETUP_PROMPT =
  "GitHub CLI(gh) 설치하고 GitHub 로그인까지 도와줘. 비개발자니까 단계마다 쉽게 알려줘.";

export const REGISTER_REPO_PROMPT = `내 GitHub 저장소를 amago AI Hub 마켓에 등록해줘.

저장소: https://github.com/아이디/레포이름 ← 본인 것으로 변경

방법:
1. 저장소가 Claude Code 표준 플러그인 구조(루트 .claude-plugin/plugin.json)인지 확인하고, 아니면 맞춰줘.
2. amago-corp/skill-marketplace 레포의 src/lib/repos.config.ts 에 내 저장소 항목을 추가하는 PR 을 올려줘. (push 권한 없으면 fork 해서)
3. PR 링크 알려줘. 팀원 1명이 검토하고 머지되면 마켓에 노출돼.`;
