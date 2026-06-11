"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Skill } from "@/lib/types";
import { getCategoryBadgeClass } from "@/lib/categoryColors";
import { ProviderIcon, getProviderLabel } from "@/components/ProviderIcon";
import CategoryIcon from "@/components/CategoryIcon";
import CopyPromptBox from "@/components/CopyPromptBox";
import { formatDate } from "@/lib/format-date";

const RELATED_PATTERN = /see\s+([\w-]+)/gi;

const MarkdownRenderer = dynamic(() => import("@/components/MarkdownRenderer"), {
  ssr: false,
  loading: () => <div className="animate-pulse h-64 bg-stone-100 rounded-xl" />,
});

export default function SkillDetailPage() {
  const params = useParams();
  const repoId = params.repoId as string;
  const skillName = params.skillName as string;

  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchSkill() {
      try {
        const res = await fetch(`/api/skills/${repoId}/${skillName}`);
        if (!res.ok) throw new Error("Skill not found");
        const data = await res.json();
        setSkill(data);
      } catch (err) {
        setError("Failed to load skill details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSkill();
  }, [repoId, skillName]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-32 bg-stone-100 rounded" />
          <div className="h-10 w-64 bg-stone-100 rounded" />
          <div className="h-6 w-full bg-stone-100 rounded" />
          <div className="h-6 w-3/4 bg-stone-100 rounded" />
          <div className="h-64 bg-stone-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-red-400 text-lg mb-4">{error || "Skill not found"}</div>
        <Link
          href="/"
          className="text-amber-700 hover:text-amber-700 text-sm"
        >
          Back to all skills
        </Link>
      </div>
    );
  }

  // Parse related skills from description (e.g., "see signup-flow-cro")
  const relatedSkills = Array.from(
    skill.description.matchAll(RELATED_PATTERN),
    (m) => m[1]
  );

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-stone-400">
        <Link href="/" className="hover:text-stone-600 transition-colors">
          Skills
        </Link>
        <span>/</span>
        <span className="text-stone-600">{skill.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 mb-2">{skill.name}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${getCategoryBadgeClass(skill.category)}`}>
                {skill.category}
              </span>
              <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-mono text-stone-500">
                v{skill.version}
              </span>
              {skill.pluginName && (
                <span className="inline-flex items-center rounded-md bg-cyan-500/10 px-2 py-0.5 text-xs font-medium text-cyan-400 border border-cyan-500/20">
                  plugin: {skill.pluginName}
                </span>
              )}
              <span className="text-sm text-stone-400">
                from {skill.repoDisplayName}
              </span>
              {skill.lastUpdated && (
                <>
                  <span className="text-stone-400">·</span>
                  <span className="text-sm text-stone-400">
                    Updated {formatDate(skill.lastUpdated)}
                  </span>
                </>
              )}
            </div>
          </div>
          <a
            href={skill.sourceUrl || skill.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-stone-100 px-4 py-2 text-sm text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition-colors"
          >
            <ProviderIcon provider={skill.providerType || "github"} className="h-4 w-4" />
            View on {getProviderLabel(skill.providerType || "github")}
          </a>
        </div>

        <p className="text-stone-500 leading-relaxed">{skill.description}</p>
      </div>

      {/* Install Prompt */}
      <div className="mb-8 rounded-xl border border-stone-300 bg-stone-50 p-4">
        <div className="text-sm font-medium text-stone-700 mb-1">
          🛠️ 설치하기
        </div>
        <p className="text-xs text-stone-400 mb-2">
          아래 문장을 복사해서 Claude Code 에 붙여넣고 Enter — 설치는 클로드가 해줘요.
        </p>
        <CopyPromptBox text={skill.installCommand} />
      </div>

      {/* Plugin children — agent + skill 묶음 */}
      {skill.sourceType === "plugin" && skill.children && skill.children.length > 0 && (
        <div className="mb-8 rounded-xl border border-stone-300 bg-white/70 p-5">
          <span className="text-sm font-medium text-stone-500 block mb-3">
            이 plugin 에 포함된 컴포넌트 ({skill.children.length}개)
          </span>
          <div className="space-y-2">
            {skill.children.map((child) => (
              <div
                key={`${child.sourceType}:${child.slug}`}
                className="flex items-start gap-3 rounded-lg border border-stone-300 bg-white/80 p-3"
              >
                <span
                  className={`flex-shrink-0 mt-0.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold border ${getCategoryBadgeClass(child.sourceType)}`}
                >
                  <CategoryIcon category={child.sourceType} className="w-2.5 h-2.5" />
                  {child.sourceType}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-stone-800">{child.name}</div>
                  {child.description && (
                    <div className="text-xs text-stone-400 line-clamp-2 mt-0.5">
                      {child.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-400 mt-3">
            💡 위 설치 문장 한 번이면 이 컴포넌트들이 모두 함께 설치됩니다.
          </p>
        </div>
      )}

      {/* Related Skills */}
      {relatedSkills.length > 0 && (
        <div className="mb-8 rounded-xl border border-stone-300 bg-white/70 p-4">
          <span className="text-sm font-medium text-stone-500 block mb-2">
            Related Skills
          </span>
          <div className="flex flex-wrap gap-2">
            {relatedSkills.map((rs) => (
              <Link
                key={rs}
                href={`/skills/${repoId}/${rs}`}
                className="inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition-colors"
              >
                {rs}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {skill.content.trim().length > 0 && (
        <div className="rounded-xl border border-stone-300 bg-white/60 p-6 sm:p-8">
          <MarkdownRenderer content={skill.content} />
        </div>
      )}
    </div>
  );
}
