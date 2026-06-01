export const SOURCE_DIRS: { path: string; type: "skill" | "agent" | "command" | "prompt" | "knowledge" }[] = [
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
];

export function buildSkillFilePath(sourcePath: string, skillName: string, flat: boolean): string {
  return flat
    ? `${sourcePath}/${skillName}.md`
    : `${sourcePath}/${skillName}/SKILL.md`;
}
