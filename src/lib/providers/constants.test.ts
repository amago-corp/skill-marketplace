import { describe, it, expect } from "vitest";
import { buildSkillFilePath, SOURCE_DIRS } from "./constants";

describe("constants", () => {
  describe("buildSkillFilePath", () => {
    it("flat=true일 때 {path}/{name}.md 반환", () => {
      expect(buildSkillFilePath("skills", "my-skill", true)).toBe(
        "skills/my-skill.md"
      );
    });

    it("flat=false일 때 {path}/{name}/SKILL.md 반환", () => {
      expect(buildSkillFilePath("skills", "my-skill", false)).toBe(
        "skills/my-skill/SKILL.md"
      );
    });
  });

  describe("SOURCE_DIRS", () => {
    it("루트 + .claude/ prefix 합쳐 10개 항목 포함", () => {
      expect(SOURCE_DIRS).toHaveLength(10);
      expect(SOURCE_DIRS).toEqual([
        { path: "skills", type: "skill" },
        { path: "agents", type: "agent" },
        { path: "commands", type: "command" },
        { path: "prompts", type: "prompt" },
        { path: "knowledge", type: "knowledge" },
        { path: ".claude/skills", type: "skill" },
        { path: ".claude/agents", type: "agent" },
        { path: ".claude/commands", type: "command" },
        { path: ".claude/prompts", type: "prompt" },
        { path: ".claude/knowledge", type: "knowledge" },
      ]);
    });
  });
});
