import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fs/promises and repos.config
vi.mock("fs/promises");
vi.mock("./repos.config", () => ({
  repositories: [
    {
      id: "github:static-repo",
      provider: "github",
      owner: "static",
      repo: "repo",
      branch: "main",
      displayName: "Static Repo",
      description: "Static",
    },
  ],
}));

import fs from "fs/promises";
import { readCustomRepos, getAllRepos } from "./repo-store";

const mockReadFile = vi.mocked(fs.readFile);
const mockWriteFile = vi.mocked(fs.writeFile);

describe("repo-store", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("migrateRepo (readCustomRepos 경유 간접 테스트)", () => {
    it("provider 누락 → 'github' 자동 추가", async () => {
      mockReadFile.mockResolvedValue(
        JSON.stringify([
          { id: "owner-repo", owner: "o", repo: "r", branch: "main", displayName: "D", description: "D" },
        ])
      );

      const repos = await readCustomRepos();

      expect(repos[0].provider).toBe("github");
      expect(repos[0].id).toBe("github:owner-repo");
    });

    it("id에 : 없으면 prefix 자동 추가", async () => {
      mockReadFile.mockResolvedValue(
        JSON.stringify([
          { id: "owner-repo", provider: "github", owner: "o", repo: "r", branch: "main", displayName: "D", description: "D" },
        ])
      );

      const repos = await readCustomRepos();

      expect(repos[0].id).toBe("github:owner-repo");
    });

    it("provider + id 둘 다 누락", async () => {
      mockReadFile.mockResolvedValue(
        JSON.stringify([
          { id: "o-r", owner: "o", repo: "r", branch: "main", displayName: "D", description: "D" },
        ])
      );

      const repos = await readCustomRepos();

      expect(repos[0].provider).toBe("github");
      expect(repos[0].id).toBe("github:o-r");
    });

    it("이미 마이그레이션된 데이터는 writeFile 미호출", async () => {
      mockReadFile.mockResolvedValue(
        JSON.stringify([
          { id: "github:o-r", provider: "github", owner: "o", repo: "r", branch: "main", displayName: "D", description: "D" },
        ])
      );

      await readCustomRepos();

      expect(mockWriteFile).not.toHaveBeenCalled();
    });

    it("bitbucket provider의 id prefix", async () => {
      mockReadFile.mockResolvedValue(
        JSON.stringify([
          { id: "o-r", provider: "bitbucket", owner: "o", repo: "r", branch: "master", displayName: "D", description: "D" },
        ])
      );

      const repos = await readCustomRepos();

      expect(repos[0].id).toBe("bitbucket:o-r");
    });
  });

  describe("readCustomRepos / getAllRepos", () => {
    it("파일 미존재 시 빈 배열 반환", async () => {
      mockReadFile.mockRejectedValue(new Error("ENOENT"));

      const repos = await readCustomRepos();

      expect(repos).toEqual([]);
    });

    it("readCustomRepos 정상 JSON 파싱", async () => {
      mockReadFile.mockResolvedValue(
        JSON.stringify([
          { id: "github:o-r", provider: "github", owner: "o", repo: "r", branch: "main", displayName: "D", description: "D" },
        ])
      );

      const repos = await readCustomRepos();

      expect(repos).toHaveLength(1);
      expect(repos[0].id).toBe("github:o-r");
    });

    it("getAllRepos static + custom 중복 제거", async () => {
      mockReadFile.mockResolvedValue(
        JSON.stringify([
          { id: "github:static-repo", provider: "github", owner: "static", repo: "repo", branch: "main", displayName: "Dup", description: "Dup" },
          { id: "github:custom-repo", provider: "github", owner: "custom", repo: "repo", branch: "main", displayName: "Custom", description: "Custom" },
        ])
      );

      const repos = await getAllRepos();

      // static-repo(static 우선) + custom-repo(unique)
      expect(repos).toHaveLength(2);
      expect(repos[0].displayName).toBe("Static Repo"); // static 우선
      expect(repos[1].id).toBe("github:custom-repo");
    });
  });
});
