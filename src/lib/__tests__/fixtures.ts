import { SkillRepository } from "../types";

export function createGithubRepo(overrides?: Partial<SkillRepository>): SkillRepository {
  return {
    id: "github:owner-repo",
    provider: "github",
    owner: "owner",
    repo: "repo",
    branch: "main",
    displayName: "Test Repo",
    description: "Test repository",
    ...overrides,
  };
}

export function createBitbucketRepo(overrides?: Partial<SkillRepository>): SkillRepository {
  return {
    id: "bitbucket:PROJ-repo",
    provider: "bitbucket",
    owner: "PROJ",
    repo: "repo",
    branch: "master",
    displayName: "BB Test Repo",
    description: "Bitbucket test repository",
    baseUrl: "https://git.example.com",
    ...overrides,
  };
}
