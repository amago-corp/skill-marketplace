import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/providers/registry";
import { SkillRepository } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, owner, repo, branch, baseUrl } = body;

    if (!owner || !repo) {
      return NextResponse.json(
        { valid: false, error: "owner와 repo는 필수입니다." },
        { status: 400 }
      );
    }

    const providerName = provider || "github";
    const providerAdapter = getProvider(providerName);

    const tempRepo: SkillRepository = {
      id: `${providerName}:${owner}-${repo}`,
      provider: providerName,
      owner,
      repo,
      branch: branch || (providerName === "bitbucket" ? "master" : "main"),
      displayName: repo,
      description: "",
      ...(baseUrl ? { baseUrl } : {}),
    };

    const result = await providerAdapter.validateRepository(tempRepo);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Validation error:", error);
    return NextResponse.json(
      { valid: false, error: "저장소 검증 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
