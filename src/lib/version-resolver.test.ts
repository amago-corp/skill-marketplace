import { describe, it, expect, vi } from "vitest";
import { resolveRepoVersions, resolveSkillVersion, resolveSkillAuthor } from "./version-resolver";
import { SkillRepository } from "./types";
import { RepositoryProviderAdapter } from "./providers/types";

function createMockProvider(
  overrides: Partial<RepositoryProviderAdapter> = {}
): RepositoryProviderAdapter {
  return {
    name: "mock",
    displayName: "Mock",
    urlPattern: /mock/,
    parseUrl: () => null,
    getSkillDirectories: async () => [],
    getSkillContent: async () => null,
    buildSourceUrl: () => "",
    validateRepository: async () => ({ valid: true }),
    ...overrides,
  };
}

const baseRepo: SkillRepository = {
  id: "mock:test-repo",
  provider: "mock",
  owner: "owner",
  repo: "repo",
  branch: "main",
  displayName: "Test",
  description: "",
};

describe("resolveRepoVersions", () => {
  it("provider가 getFileContent 미지원 시 빈 객체 반환", async () => {
    const provider = createMockProvider();
    // getFileContent, listDirectoryNames가 없는 provider
    const result = await resolveRepoVersions(provider, baseRepo);
    expect(result).toEqual({});
  });

  it("plugins/ 존재 + plugin.json version 있음 → versionMap 반환", async () => {
    const provider = createMockProvider({
      listDirectoryNames: async (_repo, dirPath) => {
        if (dirPath === "plugins") return ["pluginA", "pluginB"];
        return [];
      },
      getFileContent: async (_repo, filePath) => {
        if (filePath === "plugins/pluginA/.claude-plugin/plugin.json")
          return JSON.stringify({ name: "pluginA", version: "1.0.0" });
        if (filePath === "plugins/pluginB/.claude-plugin/plugin.json")
          return JSON.stringify({ name: "pluginB", version: "2.0.0" });
        return null;
      },
    });

    const result = await resolveRepoVersions(provider, baseRepo);
    expect(result).toEqual({
      versionMap: { pluginA: "1.0.0", pluginB: "2.0.0" },
    });
  });

  it("plugins/ 존재 + 일부만 version 있음 → 해당 플러그인만 포함", async () => {
    const provider = createMockProvider({
      listDirectoryNames: async (_repo, dirPath) => {
        if (dirPath === "plugins") return ["pluginA", "pluginB"];
        return [];
      },
      getFileContent: async (_repo, filePath) => {
        if (filePath === "plugins/pluginA/.claude-plugin/plugin.json")
          return JSON.stringify({ name: "pluginA", version: "1.0.0" });
        if (filePath === "plugins/pluginB/.claude-plugin/plugin.json")
          return JSON.stringify({ name: "pluginB" }); // no version
        return null;
      },
    });

    const result = await resolveRepoVersions(provider, baseRepo);
    expect(result).toEqual({ versionMap: { pluginA: "1.0.0" } });
  });

  it("plugins/ 존재 + plugin.json 없음 → marketplace.json fallback", async () => {
    const provider = createMockProvider({
      listDirectoryNames: async (_repo, dirPath) => {
        if (dirPath === "plugins") return ["pluginA"];
        return [];
      },
      getFileContent: async (_repo, filePath) => {
        if (filePath === "plugins/pluginA/.claude-plugin/plugin.json")
          return null; // plugin.json 없음
        if (filePath === ".claude-plugin/marketplace.json")
          return JSON.stringify({
            plugins: [{ name: "test", version: "3.0.0" }],
          });
        return null;
      },
    });

    const result = await resolveRepoVersions(provider, baseRepo);
    expect(result).toEqual({ repoVersion: "3.0.0" });
  });

  it("plugins/ 존재 + JSON 파싱 실패 → fallback", async () => {
    const provider = createMockProvider({
      listDirectoryNames: async (_repo, dirPath) => {
        if (dirPath === "plugins") return ["pluginA"];
        return [];
      },
      getFileContent: async (_repo, filePath) => {
        if (filePath === "plugins/pluginA/.claude-plugin/plugin.json")
          return "NOT VALID JSON{{{";
        if (filePath === ".claude-plugin/marketplace.json")
          return JSON.stringify({ metadata: { version: "4.0.0" } });
        return null;
      },
    });

    const result = await resolveRepoVersions(provider, baseRepo);
    expect(result).toEqual({ repoVersion: "4.0.0" });
  });

  it("plugins/ 없음 + 루트 plugin.json version → repoVersion", async () => {
    const provider = createMockProvider({
      listDirectoryNames: async () => [],
      getFileContent: async (_repo, filePath) => {
        if (filePath === ".claude-plugin/plugin.json")
          return JSON.stringify({ name: "humanize-korean", version: "1.5.0" });
        return null;
      },
    });

    const result = await resolveRepoVersions(provider, baseRepo);
    expect(result).toEqual({ repoVersion: "1.5.0" });
  });

  it("루트 plugin.json 이 marketplace.json 보다 우선", async () => {
    const provider = createMockProvider({
      listDirectoryNames: async () => [],
      getFileContent: async (_repo, filePath) => {
        if (filePath === ".claude-plugin/plugin.json")
          return JSON.stringify({ version: "1.5.0" });
        if (filePath === ".claude-plugin/marketplace.json")
          return JSON.stringify({ metadata: { version: "9.9.9" } });
        return null;
      },
    });

    const result = await resolveRepoVersions(provider, baseRepo);
    expect(result).toEqual({ repoVersion: "1.5.0" });
  });

  it("plugins/ 없음 + marketplace.json plugins[].version → repoVersion", async () => {
    const provider = createMockProvider({
      listDirectoryNames: async () => [],
      getFileContent: async (_repo, filePath) => {
        if (filePath === ".claude-plugin/marketplace.json")
          return JSON.stringify({
            plugins: [{ name: "main", version: "5.0.0" }],
          });
        return null;
      },
    });

    const result = await resolveRepoVersions(provider, baseRepo);
    expect(result).toEqual({ repoVersion: "5.0.0" });
  });

  it("plugins/ 없음 + marketplace.json metadata.version → repoVersion", async () => {
    const provider = createMockProvider({
      listDirectoryNames: async () => [],
      getFileContent: async (_repo, filePath) => {
        if (filePath === ".claude-plugin/marketplace.json")
          return JSON.stringify({ metadata: { version: "6.0.0" } });
        return null;
      },
    });

    const result = await resolveRepoVersions(provider, baseRepo);
    expect(result).toEqual({ repoVersion: "6.0.0" });
  });

  it("plugins/ 없음 + marketplace.json 없음 → 빈 객체", async () => {
    const provider = createMockProvider({
      listDirectoryNames: async () => [],
      getFileContent: async () => null,
    });

    const result = await resolveRepoVersions(provider, baseRepo);
    expect(result).toEqual({});
  });
});

describe("resolveRepoVersions — author 수집", () => {
  it("plugins/ plugin.json 에 author 있으면 authorMap 포함", async () => {
    const provider = createMockProvider({
      listDirectoryNames: async (_repo, dirPath) => {
        if (dirPath === "plugins") return ["pluginA", "pluginB"];
        return [];
      },
      getFileContent: async (_repo, filePath) => {
        if (filePath === "plugins/pluginA/.claude-plugin/plugin.json")
          return JSON.stringify({ version: "1.0.0", author: { name: "전준완" } });
        if (filePath === "plugins/pluginB/.claude-plugin/plugin.json")
          return JSON.stringify({ version: "2.0.0", author: "서연" });
        return null;
      },
    });

    const result = await resolveRepoVersions(provider, baseRepo);
    expect(result).toEqual({
      versionMap: { pluginA: "1.0.0", pluginB: "2.0.0" },
      authorMap: { pluginA: "전준완", pluginB: "서연" },
    });
  });

  it("루트 plugin.json author → repoAuthor", async () => {
    const provider = createMockProvider({
      listDirectoryNames: async () => [],
      getFileContent: async (_repo, filePath) => {
        if (filePath === ".claude-plugin/plugin.json")
          return JSON.stringify({ version: "1.5.0", author: { name: "epoko77-ai" } });
        return null;
      },
    });

    const result = await resolveRepoVersions(provider, baseRepo);
    expect(result).toEqual({ repoVersion: "1.5.0", repoAuthor: "epoko77-ai" });
  });
});

describe("resolveSkillAuthor", () => {
  it("pluginName + authorMap hit → plugin author 반환", () => {
    const repo: SkillRepository = {
      ...baseRepo,
      authorMap: { myPlugin: "전준완" },
      repoAuthor: "fallback",
    };
    expect(resolveSkillAuthor("myPlugin", repo)).toBe("전준완");
  });

  it("authorMap miss → repoAuthor fallback", () => {
    const repo: SkillRepository = { ...baseRepo, repoAuthor: "epoko77-ai" };
    expect(resolveSkillAuthor("other", repo)).toBe("epoko77-ai");
  });

  it("모두 없음 → undefined", () => {
    expect(resolveSkillAuthor(undefined, baseRepo)).toBeUndefined();
  });
});

describe("resolveSkillVersion", () => {
  it("pluginName + versionMap hit → plugin version 반환", () => {
    const repo: SkillRepository = {
      ...baseRepo,
      versionMap: { myPlugin: "1.5.0" },
      repoVersion: "2.0.0",
    };
    expect(resolveSkillVersion("myPlugin", repo)).toBe("1.5.0");
  });

  it("pluginName 없음 + repoVersion → repo version 반환", () => {
    const repo: SkillRepository = {
      ...baseRepo,
      repoVersion: "2.0.0",
    };
    expect(resolveSkillVersion(undefined, repo)).toBe("2.0.0");
  });

  it("모두 없음 → '0.0.0' 반환", () => {
    expect(resolveSkillVersion(undefined, baseRepo)).toBe("0.0.0");
  });
});
