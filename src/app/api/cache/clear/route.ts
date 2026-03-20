import { NextResponse } from "next/server";
import { invalidateRepoCache } from "@/lib/skill-service";

export const runtime = "nodejs";

export async function POST() {
  try {
    invalidateRepoCache();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to clear cache:", error);
    return NextResponse.json(
      { error: "Failed to clear cache" },
      { status: 500 }
    );
  }
}
