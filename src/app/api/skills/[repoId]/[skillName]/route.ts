import { NextRequest, NextResponse } from "next/server";
import { getSkillByName } from "@/lib/skill-service";
import { getAllRepos } from "@/lib/repo-store";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ repoId: string; skillName: string }> }
) {
  try {
    const { repoId, skillName } = await params;
    const repositories = await getAllRepos();
    const skill = await getSkillByName(repositories, repoId, skillName);

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json(skill);
  } catch (error) {
    console.error("Failed to fetch skill:", error);
    return NextResponse.json(
      { error: "Failed to fetch skill" },
      { status: 500 }
    );
  }
}
