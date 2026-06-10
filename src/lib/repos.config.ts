import { SkillRepository } from "./types";

export const repositories: SkillRepository[] = [
  {
    id: "github:amago-corp/agent-hub",
    provider: "github",
    owner: "amago-corp",
    repo: "agent-hub",
    branch: "main",
    displayName: "amago agent-hub",
    description: "amago AI Hub — 사내 AI 자산 허브",
  },
  {
    id: "github:epoko77-ai/im-not-ai",
    provider: "github",
    owner: "epoko77-ai",
    repo: "im-not-ai",
    branch: "main",
    displayName: "Humanize KR",
    description: "AI가 쓴 글이 아닌 것처럼 윤문해주는 스킬",
  },
];
