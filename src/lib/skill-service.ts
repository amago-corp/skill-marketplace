import matter from "gray-matter";
import { Skill, SkillRepository, PluginChild } from "./types";
import { SkillEntry } from "./providers/types";
import { getProvider } from "./providers/registry";
import { buildSkillFilePath } from "./providers/constants";
import { resolveSkillVersion, resolveSkillAuthor, resolveRepoVersions } from "./version-resolver";
import { buildInstallPrompt } from "./prompts";

// In-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() });
}

export function invalidateRepoCache(repoId?: string): void {
  if (!repoId) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (
      key.startsWith(`dirs:${repoId}`) ||
      key.startsWith(`content:${repoId}:`) ||
      key.startsWith("all-skills:")
    ) {
      cache.delete(key);
    }
  }
}

export async function getSkillDirectories(
  repo: SkillRepository
): Promise<SkillEntry[]> {
  const cacheKey = `dirs:${repo.id}`;
  const cached = getCached<SkillEntry[]>(cacheKey);
  if (cached) return cached;

  const provider = getProvider(repo.provider);
  const entries = await provider.getSkillDirectories(repo);

  // 루트 .claude-plugin/plugin.json (Claude Code 단일 플러그인 레포 표준) 이 있으면
  // 소속 없는 최상위 자산을 해당 플러그인으로 묶는다
  if (provider.getFileContent && entries.some((e) => !e.pluginName)) {
    const manifest = await provider.getFileContent(repo, ".claude-plugin/plugin.json");
    if (manifest) {
      try {
        const rootPluginName = JSON.parse(manifest).name;
        if (rootPluginName) {
          for (const entry of entries) {
            entry.pluginName ??= rootPluginName;
          }
        }
      } catch { /* JSON 파싱 실패 시 skip */ }
    }
  }

  setCache(cacheKey, entries);
  return entries;
}

export async function getSkillContent(
  repo: SkillRepository,
  skillName: string,
  sourcePath: string,
  flat: boolean
): Promise<string | null> {
  const cacheKey = `content:${repo.id}:${sourcePath}:${skillName}`;
  const cached = getCached<string>(cacheKey);
  if (cached) return cached;

  const provider = getProvider(repo.provider);
  const content = await provider.getSkillContent(repo, skillName, sourcePath, flat);

  if (content) {
    setCache(cacheKey, content);
  }
  return content;
}

const NEW_SKILL_THRESHOLD_DAYS = 7;
const MS_PER_DAY = 86_400_000;

function isWithinDays(dateStr: string, days: number): boolean {
  const time = new Date(dateStr).getTime();
  if (Number.isNaN(time)) return false;
  const diff = Date.now() - time;
  return diff >= 0 && diff <= days * MS_PER_DAY;
}

export function parseSkillMd(
  raw: string,
  skillName: string,
  repo: SkillRepository,
  sourceType: "skill" | "agent" | "command" | "prompt" | "knowledge",
  sourcePath: string,
  pluginName?: string,
  lastCommitDate?: string
): Skill {
  let frontmatter: Record<string, string> = {};
  let content = raw;

  try {
    const parsed = matter(raw);
    frontmatter = parsed.data as Record<string, string>;
    content = parsed.content;
  } catch {
    // YAML 파싱 실패 시 (콜론 등 특수문자) raw 전체를 content로 사용
    console.warn(`Failed to parse frontmatter for ${skillName}, using raw content`);
  }

  const provider = getProvider(repo.provider);
  const sourceUrl = provider.buildSourceUrl(repo, sourcePath, skillName, sourceType);

  const installTarget = pluginName || skillName;
  const marketplaceSource = repo.baseUrl
    ? `${repo.baseUrl}/scm/${repo.owner}/${repo.repo}.git`
    : `${repo.owner}/${repo.repo}`;
  const installCommand = buildInstallPrompt(marketplaceSource, installTarget, repo.repo);

  return {
    slug: skillName,
    name: frontmatter.name || skillName,
    version: "0.0.0",
    description: frontmatter.description || "",
    repoId: repo.id,
    repoDisplayName: repo.displayName,
    category: sourceType,
    categoryId: sourceType,
    sourceType,
    content,
    lastUpdated: lastCommitDate || new Date().toISOString(),
    isNew: lastCommitDate ? isWithinDays(lastCommitDate, NEW_SKILL_THRESHOLD_DAYS) : false,
    githubUrl: sourceUrl, // 하위 호환
    sourceUrl,
    providerType: repo.provider,
    installCommand,
    pluginName,
  };
}

/**
 * 같은 pluginName 을 공유하는 entries 를 1개의 plugin entry 로 묶는다.
 * pluginName 이 없는 standalone skill 은 그대로 통과.
 */
function groupByPlugin(skills: Skill[]): Skill[] {
  const standalone: Skill[] = [];
  const pluginGroups = new Map<string, Skill[]>();

  for (const skill of skills) {
    if (skill.pluginName) {
      const arr = pluginGroups.get(skill.pluginName) ?? [];
      arr.push(skill);
      pluginGroups.set(skill.pluginName, arr);
    } else {
      standalone.push(skill);
    }
  }

  const pluginEntries: Skill[] = [];
  const childOrder: Record<string, number> = { agent: 0, skill: 1, command: 2, prompt: 3, knowledge: 4 };

  for (const [pluginName, members] of pluginGroups) {
    const sorted = [...members].sort(
      (a, b) =>
        (childOrder[a.sourceType] ?? 9) - (childOrder[b.sourceType] ?? 9),
    );
    const children: PluginChild[] = sorted.map((m) => ({
      slug: m.slug,
      name: m.name,
      description: m.description,
      sourceType: m.sourceType as "skill" | "agent" | "command" | "prompt" | "knowledge",
    }));

    const agentChild = sorted.find((m) => m.sourceType === "agent");
    const representative = agentChild ?? sorted[0];

    pluginEntries.push({
      slug: pluginName,
      name: pluginName,
      version: representative.version,
      description: representative.description,
      repoId: representative.repoId,
      repoDisplayName: representative.repoDisplayName,
      category: "plugin",
      categoryId: "plugin",
      sourceType: "plugin",
      content: "", // 상세 페이지가 children 배열 + 각 child content 를 직접 렌더
      lastUpdated: members.reduce(
        (latest, m) => (m.lastUpdated > latest ? m.lastUpdated : latest),
        representative.lastUpdated,
      ),
      githubUrl: representative.sourceUrl,
      sourceUrl: representative.sourceUrl,
      providerType: representative.providerType,
      installCommand: representative.installCommand,
      pluginName,
      author: representative.author,
      children,
      isNew: members.some((m) => m.isNew),
    });
  }

  return [...standalone, ...pluginEntries];
}

export async function getAllSkills(
  repos: SkillRepository[]
): Promise<Skill[]> {
  const repoIds = repos.map((r) => r.id).join(",");
  const cacheKey = `all-skills:${repoIds}`;
  const cached = getCached<Skill[]>(cacheKey);
  if (cached) return cached;

  const allSkills: Skill[] = [];

  for (const repo of repos) {
    const provider = getProvider(repo.provider);

    // repos.config.ts 정적 등록 레포는 추가 시점의 버전 resolve 를 거치지 않으므로 여기서 보충
    if (!repo.versionMap && !repo.repoVersion) {
      Object.assign(repo, await resolveRepoVersions(provider, repo));
    }

    const entries = await getSkillDirectories(repo);

    const skillPromises = entries.map(async (entry) => {
      const raw = await getSkillContent(repo, entry.name, entry.sourcePath, entry.flat);
      if (!raw) return null;

      let lastCommitDate: string | null = null;
      if (provider.getLastCommitDate) {
        const filePath = buildSkillFilePath(entry.sourcePath, entry.name, entry.flat);
        lastCommitDate = await provider.getLastCommitDate(repo, filePath);
      }

      const skill = parseSkillMd(raw, entry.name, repo, entry.sourceType, entry.sourcePath, entry.pluginName, lastCommitDate ?? undefined);
      skill.version = resolveSkillVersion(skill.pluginName, repo);
      skill.author = resolveSkillAuthor(skill.pluginName, repo);
      return skill;
    });

    const skills = await Promise.all(skillPromises);
    allSkills.push(...skills.filter((s): s is Skill => s !== null));
  }

  const grouped = groupByPlugin(allSkills);
  grouped.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  setCache(cacheKey, grouped);
  return grouped;
}

export async function getSkillByName(
  repos: SkillRepository[],
  repoId: string,
  skillName: string
): Promise<Skill | null> {
  // all-skills 캐시에서 먼저 찾기 (목록 API와 동일한 데이터 소스 사용)
  const repoIds = repos.map((r) => r.id).join(",");
  const allCached = getCached<Skill[]>(`all-skills:${repoIds}`);
  if (allCached) {
    return allCached.find(
      (s) => s.repoId === repoId && s.slug === skillName
    ) ?? null;
  }

  // all-skills 캐시 미스 → getAllSkills로 전체 fetch 후 찾기
  const allSkills = await getAllSkills(repos);
  return allSkills.find(
    (s) => s.repoId === repoId && s.slug === skillName
  ) ?? null;
}
