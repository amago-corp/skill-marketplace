import { Octokit } from "@octokit/rest";
import { SkillRepository } from "../types";
import { RepositoryProviderAdapter, SkillEntry } from "./types";
import { SOURCE_DIRS, buildSkillFilePath } from "./constants";

export class GitHubProvider implements RepositoryProviderAdapter {
  readonly name = "github";
  readonly displayName = "GitHub";
  readonly urlPattern = /github\.com\/([^/]+)\/([^/]+)/;

  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  }

  parseUrl(url: string): { owner: string; repo: string } | null {
    const match = url.match(this.urlPattern);
    if (!match) return null;
    return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
  }

  buildSourceUrl(
    repo: SkillRepository,
    sourcePath: string,
    skillName: string,
    sourceType: string
  ): string {
    return sourceType === "skill"
      ? `https://github.com/${repo.owner}/${repo.repo}/tree/${repo.branch}/${sourcePath}/${skillName}`
      : `https://github.com/${repo.owner}/${repo.repo}/blob/${repo.branch}/${sourcePath}/${skillName}.md`;
  }

  async validateRepository(
    repo: SkillRepository
  ): Promise<{ valid: boolean; error?: string; skillCount?: number }> {
    try {
      const entries = await this.getSkillDirectories(repo);
      if (entries.length === 0) {
        return {
          valid: false,
          error:
            "skills, agents, commands 경로에서 SKILL.md 파일을 찾을 수 없습니다.",
        };
      }
      return { valid: true, skillCount: entries.length };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("Not Found") || message.includes("404")) {
        return {
          valid: false,
          error:
            "GitHub 저장소를 찾을 수 없습니다. owner/repo와 branch를 확인해주세요.",
        };
      }
      return { valid: false, error: "저장소 검증 중 오류가 발생했습니다." };
    }
  }

  async getSkillDirectories(repo: SkillRepository): Promise<SkillEntry[]> {
    const allEntries: SkillEntry[] = [];

    await Promise.all(
      SOURCE_DIRS.map(async ({ path, type }) => {
        try {
          const { data: contents } = await this.octokit.rest.repos.getContent({
            owner: repo.owner,
            repo: repo.repo,
            path,
            ref: repo.branch,
          });

          if (!Array.isArray(contents)) return;

          if (type === "skill") {
            const subDirs = contents.filter((item) => item.type === "dir");
            if (subDirs.length > 0) {
              const results = await Promise.all(
                subDirs.map(async (dir) => {
                  try {
                    const { data: tree } =
                      await this.octokit.rest.git.getTree({
                        owner: repo.owner,
                        repo: repo.repo,
                        tree_sha: dir.sha,
                      });
                    const hasSkillMd = tree.tree.some(
                      (f) => f.path === "SKILL.md" && f.type === "blob"
                    );
                    return hasSkillMd
                      ? {
                          name: dir.name,
                          sourceType: type,
                          sourcePath: path,
                          flat: false,
                        }
                      : null;
                  } catch {
                    return null;
                  }
                })
              );
              allEntries.push(
                ...(results.filter((e) => e !== null) as SkillEntry[])
              );
            } else {
              const flatFiles = contents.filter(
                (item) => item.type === "file" && item.name.endsWith(".md")
              );
              allEntries.push(
                ...flatFiles.map((file) => ({
                  name: file.name.replace(/\.md$/, ""),
                  sourceType: type,
                  sourcePath: path,
                  flat: true,
                }))
              );
            }
          } else {
            const flatFiles = contents.filter(
              (item) => item.type === "file" && item.name.endsWith(".md")
            );
            allEntries.push(
              ...flatFiles.map((file) => ({
                name: file.name.replace(/\.md$/, ""),
                sourceType: type,
                sourcePath: path,
                flat: true,
              }))
            );
          }
        } catch {
          // 디렉토리가 없으면 skip
        }
      })
    );

    // Plugin 디렉토리 스캔
    try {
      const { data: pluginRoot } = await this.octokit.rest.repos.getContent({
        owner: repo.owner,
        repo: repo.repo,
        path: "plugins",
        ref: repo.branch,
      });

      if (Array.isArray(pluginRoot)) {
        const pluginDirs = pluginRoot.filter((item) => item.type === "dir");

        await Promise.all(
          pluginDirs.map(async (pluginDir) => {
            await Promise.all(
              SOURCE_DIRS.map(async ({ path, type }) => {
                try {
                  const pluginPath = `plugins/${pluginDir.name}/${path}`;
                  const { data: contents } =
                    await this.octokit.rest.repos.getContent({
                      owner: repo.owner,
                      repo: repo.repo,
                      path: pluginPath,
                      ref: repo.branch,
                    });

                  if (!Array.isArray(contents)) return;

                  if (type === "skill") {
                    const subDirs = contents.filter(
                      (item) => item.type === "dir"
                    );
                    if (subDirs.length > 0) {
                      const results = await Promise.all(
                        subDirs.map(async (dir) => {
                          try {
                            const { data: tree } =
                              await this.octokit.rest.git.getTree({
                                owner: repo.owner,
                                repo: repo.repo,
                                tree_sha: dir.sha,
                              });
                            const hasSkillMd = tree.tree.some(
                              (f) =>
                                f.path === "SKILL.md" && f.type === "blob"
                            );
                            return hasSkillMd
                              ? {
                                  name: dir.name,
                                  sourceType: type,
                                  sourcePath: pluginPath,
                                  flat: false,
                                  pluginName: pluginDir.name,
                                }
                              : null;
                          } catch {
                            return null;
                          }
                        })
                      );
                      allEntries.push(
                        ...(results.filter((e) => e !== null) as SkillEntry[])
                      );
                    } else {
                      const flatFiles = contents.filter(
                        (item) =>
                          item.type === "file" && item.name.endsWith(".md")
                      );
                      allEntries.push(
                        ...flatFiles.map((file) => ({
                          name: file.name.replace(/\.md$/, ""),
                          sourceType: type,
                          sourcePath: pluginPath,
                          flat: true,
                          pluginName: pluginDir.name,
                        }))
                      );
                    }
                  } else {
                    const flatFiles = contents.filter(
                      (item) =>
                        item.type === "file" && item.name.endsWith(".md")
                    );
                    allEntries.push(
                      ...flatFiles.map((file) => ({
                        name: file.name.replace(/\.md$/, ""),
                        sourceType: type,
                        sourcePath: pluginPath,
                        flat: true,
                        pluginName: pluginDir.name,
                      }))
                    );
                  }
                } catch {
                  // 해당 디렉토리가 없으면 skip
                }
              })
            );
          })
        );
      }
    } catch {
      // plugins/ 디렉토리가 없으면 skip
    }

    return allEntries;
  }

  async getSkillContent(
    repo: SkillRepository,
    skillName: string,
    sourcePath: string,
    flat: boolean
  ): Promise<string | null> {
    const filePath = buildSkillFilePath(sourcePath, skillName, flat);

    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner: repo.owner,
        repo: repo.repo,
        path: filePath,
        ref: repo.branch,
      });

      if ("content" in data && data.content) {
        return Buffer.from(data.content, "base64").toString("utf-8");
      }
      return null;
    } catch (error) {
      console.error(`Failed to get skill content for ${skillName}:`, error);
      return null;
    }
  }
}
