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
    it("skills/agents/commands 3개 항목을 포함", () => {
      expect(SOURCE_DIRS).toHaveLength(3);
      expect(SOURCE_DIRS).toEqual([
        { path: "skills", type: "skill" },
        { path: "agents", type: "agent" },
        { path: "commands", type: "command" },
      ]);
    });
  });
});
