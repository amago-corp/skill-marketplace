import { SkillRepository } from "./types";
import { RepositoryProviderAdapter } from "./providers/types";

export interface RepoVersionInfo {
  versionMap?: Record<string, string>;
  repoVersion?: string;
  authorMap?: Record<string, string>;
  repoAuthor?: string;
}

/** plugin.json 의 author 필드 (string 또는 { name }) 에서 표시명 추출 */
function parseAuthorName(author: unknown): string | undefined {
  if (typeof author === "string" && author.trim()) return author;
  if (author && typeof author === "object" && "name" in author) {
    const name = (author as { name?: unknown }).name;
    if (typeof name === "string" && name.trim()) return name;
  }
  return undefined;
}

export async function resolveRepoVersions(
  provider: RepositoryProviderAdapter,
  repo: SkillRepository
): Promise<RepoVersionInfo> {
  if (!provider.getFileContent || !provider.listDirectoryNames) {
    return {};
  }

  // 우선순위 1: plugins/ 폴더 존재 시
  const pluginNames = await provider.listDirectoryNames(repo, "plugins");
  if (pluginNames.length > 0) {
    const versionMap: Record<string, string> = {};
    const authorMap: Record<string, string> = {};

    await Promise.all(
      pluginNames.map(async (name) => {
        const content = await provider.getFileContent!(
          repo,
          `plugins/${name}/.claude-plugin/plugin.json`
        );
        if (content) {
          try {
            const json = JSON.parse(content);
            if (json.version) {
              versionMap[name] = json.version;
            }
            const author = parseAuthorName(json.author);
            if (author) {
              authorMap[name] = author;
            }
          } catch { /* JSON 파싱 실패 시 skip */ }
        }
      })
    );

    if (Object.keys(versionMap).length > 0) {
      const info: RepoVersionInfo = { versionMap };
      if (Object.keys(authorMap).length > 0) {
        info.authorMap = authorMap;
      }
      return info;
    }
  }

  // 우선순위 2: 루트 .claude-plugin/plugin.json (Claude Code 단일 플러그인 레포 표준)
  const rootPluginContent = await provider.getFileContent(
    repo,
    ".claude-plugin/plugin.json"
  );

  if (rootPluginContent) {
    try {
      const json = JSON.parse(rootPluginContent);
      if (json.version) {
        const info: RepoVersionInfo = { repoVersion: json.version };
        const author = parseAuthorName(json.author);
        if (author) {
          info.repoAuthor = author;
        }
        return info;
      }
    } catch { /* JSON 파싱 실패 시 skip */ }
  }

  // 우선순위 3, 4: marketplace.json
  const marketplaceContent = await provider.getFileContent(
    repo,
    ".claude-plugin/marketplace.json"
  );

  if (marketplaceContent) {
    try {
      const json = JSON.parse(marketplaceContent);

      // 우선순위 3: plugins 필드의 version
      if (json.plugins && Array.isArray(json.plugins) && json.plugins.length > 0) {
        const version = json.plugins[0]?.version;
        if (version) return { repoVersion: version };
      }

      // 우선순위 4: metadata.version
      if (json.metadata?.version) {
        return { repoVersion: json.metadata.version };
      }
    } catch { /* JSON 파싱 실패 시 skip */ }
  }

  return {};
}

export function resolveSkillVersion(
  pluginName: string | undefined,
  repo: SkillRepository
): string {
  if (pluginName && repo.versionMap?.[pluginName]) {
    return repo.versionMap[pluginName];
  }
  if (repo.repoVersion) {
    return repo.repoVersion;
  }
  return "0.0.0";
}

export function resolveSkillAuthor(
  pluginName: string | undefined,
  repo: SkillRepository
): string | undefined {
  if (pluginName && repo.authorMap?.[pluginName]) {
    return repo.authorMap[pluginName];
  }
  return repo.repoAuthor;
}
