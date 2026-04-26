export const SOURCE_DIRS: { path: string; type: "skill" | "agent" | "command" }[] = [
  { path: "skills", type: "skill" },
  { path: "agents", type: "agent" },
  { path: "commands", type: "command" },
  { path: ".claude/skills", type: "skill" },
  { path: ".claude/agents", type: "agent" },
  { path: ".claude/commands", type: "command" },
];

export function buildSkillFilePath(sourcePath: string, skillName: string, flat: boolean): string {
  return flat
    ? `${sourcePath}/${skillName}.md`
    : `${sourcePath}/${skillName}/SKILL.md`;
}
