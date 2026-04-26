export interface SkillRepository {
  id: string;
  provider: string; // "github" | "bitbucket" | ...
  owner: string;    // GitHub: owner, Bitbucket Server: project key
  repo: string;
  branch: string;
  displayName: string;
  description: string;
  baseUrl?: string;  // 자체 호스팅 인스턴스 URL (e.g. "https://git.ncsoft.net")
  categories?: CategoryDefinition[];
  /** 플러그인별 버전 맵 (plugins/{name}/.claude-plugin/plugin.json → version) */
  versionMap?: Record<string, string>;
  /** 레포 단일 버전 (marketplace.json → plugins[].version 또는 metadata.version) */
  repoVersion?: string;
}

export interface CategoryDefinition {
  id: string;
  name: string;
  icon: string;
  skills: string[];
}

export interface PluginChild {
  slug: string;
  name: string;
  description: string;
  sourceType: "skill" | "agent" | "command";
}

export interface Skill {
  slug: string;
  name: string;
  version: string;
  description: string;
  repoId: string;
  repoDisplayName: string;
  category: string;
  categoryId: string;
  sourceType: "skill" | "agent" | "command" | "plugin";
  content: string;
  lastUpdated: string;
  githubUrl: string; // deprecated: sourceUrl 사용 권장
  sourceUrl: string;
  providerType: string;
  installCommand: string;
  pluginName?: string;
  /** sourceType === "plugin" 일 때만 채워짐 — 이 plugin에 포함된 agent/skill 목록 */
  children?: PluginChild[];
  isNew: boolean;
}

export interface SkillsResponse {
  skills: Skill[];
  categories: CategoryDefinition[];
  repos: { id: string; displayName: string }[];
}
