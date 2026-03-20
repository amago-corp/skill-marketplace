import { NextRequest, NextResponse } from "next/server";
import { getAllSkills } from "@/lib/skill-service";
import { getAllRepos } from "@/lib/repo-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const repoId = searchParams.get("repo") || "";

    const repositories = await getAllRepos();
    const allSkills = await getAllSkills(repositories);

    // Collect unique categories and repos from all skills (before filtering)
    const categories = [
      ...new Map(
        allSkills.map((s) => [s.categoryId, { id: s.categoryId, name: s.category }])
      ).values(),
    ].sort((a, b) => a.name.localeCompare(b.name));

    const repos = [
      ...new Map(
        allSkills.map((s) => [
          s.repoId,
          { id: s.repoId, displayName: s.repoDisplayName },
        ])
      ).values(),
    ];

    // Apply filters
    let skills = allSkills;

    if (repoId) {
      skills = skills.filter((s) => s.repoId === repoId);
    }

    if (category) {
      skills = skills.filter((s) => s.categoryId === category);
    }

    if (query) {
      const q = query.toLowerCase();
      skills = skills.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      skills,
      categories,
      repos,
      total: skills.length,
      repoCount: repositories.length,
    });
  } catch (error) {
    console.error("Failed to fetch skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}
