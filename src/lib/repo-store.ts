import fs from "fs/promises";
import path from "path";
import { SkillRepository } from "./types";
import { repositories as staticRepos } from "./repos.config";

const DATA_FILE = path.join(process.cwd(), "data", "custom-repos.json");

/** 기존 데이터에 provider/id 마이그레이션 적용 */
function migrateRepo(repo: SkillRepository): SkillRepository {
  let changed = false;
  if (!repo.provider) {
    repo.provider = "github";
    changed = true;
  }
  if (!repo.id.includes(":")) {
    repo.id = `${repo.provider}:${repo.id}`;
    changed = true;
  }
  return changed ? { ...repo } : repo;
}

/** 읽기 시 마이그레이션이 필요하면 자동으로 파일에 반영 */
export async function readCustomRepos(): Promise<SkillRepository[]> {
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    const repos = JSON.parse(content) as SkillRepository[];
    const migrated = repos.map(migrateRepo);

    // 마이그레이션 발생 시 파일에 반영 (이후 read에서는 skip)
    const needsPersist = repos.some((r, i) => r.id !== migrated[i].id || r.provider !== migrated[i].provider);
    if (needsPersist) {
      await fs.writeFile(DATA_FILE, JSON.stringify(migrated, null, 2), "utf-8");
    }

    return migrated;
  } catch {
    return [];
  }
}

export async function addCustomRepo(repo: SkillRepository): Promise<void> {
  const existing = await readCustomRepos();
  existing.push(repo);
  await fs.writeFile(DATA_FILE, JSON.stringify(existing, null, 2), "utf-8");
}

export async function deleteCustomRepo(repoId: string): Promise<boolean> {
  const repos = await readCustomRepos();
  const filtered = repos.filter((r) => r.id !== repoId);
  if (filtered.length === repos.length) return false;
  await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}

export async function getAllRepos(): Promise<SkillRepository[]> {
  const customRepos = await readCustomRepos();
  const staticIds = new Set(staticRepos.map((r) => r.id));
  const filtered = customRepos.filter((r) => !staticIds.has(r.id));
  return [...staticRepos, ...filtered];
}
