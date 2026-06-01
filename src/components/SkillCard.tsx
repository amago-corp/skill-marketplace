"use client";

import Link from "next/link";
import { Skill } from "@/lib/types";
import { getCategoryBadgeClass, getCategoryEmoji, NEW_BADGE_CLASS } from "@/lib/categoryColors";

interface SkillCardProps {
  skill: Skill;
}

export default function SkillCard({ skill }: SkillCardProps) {
  const truncatedDesc =
    skill.description.length > 160
      ? skill.description.substring(0, 160) + "..."
      : skill.description;

  return (
    <Link
      href={`/skills/${encodeURIComponent(skill.repoId)}/${skill.slug}`}
      className={`group relative block rounded-xl ${skill.isNew ? "border-2 border-lime-400/60" : "border border-stone-300"} bg-white/80 p-5 transition-all duration-200 hover:border-amber-500/60 hover:bg-white hover:shadow-lg hover:shadow-amber-500/15 hover:rotate-[0.5deg] hover:scale-[1.02]`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl shrink-0" aria-hidden="true">{getCategoryEmoji(skill.category)}</span>
          <h3 className="text-lg font-semibold text-stone-900 group-hover:text-amber-700 transition-colors truncate">
            {skill.name}
          </h3>
          {skill.isNew && (
            <span className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${NEW_BADGE_CLASS}`}>
              NEW
            </span>
          )}
        </div>
        <span className="shrink-0 ml-2 rounded-md bg-stone-100 px-2 py-0.5 text-xs font-mono text-stone-600">
          v{skill.version}
        </span>
      </div>

      <p className="text-xs text-stone-500 mb-3">
        by 장인(maker) <span className="text-stone-700 font-medium">{skill.repoDisplayName}</span>
      </p>

      <p className="text-sm text-stone-600 leading-relaxed mb-4 line-clamp-3">
        {truncatedDesc}
      </p>

      {skill.sourceType === "plugin" && skill.children && skill.children.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {skill.children.map((child) => (
            <span
              key={`${child.sourceType}:${child.slug}`}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium border ${getCategoryBadgeClass(child.sourceType)}`}
            >
              <span aria-hidden="true">{getCategoryEmoji(child.sourceType)}</span>
              {child.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${getCategoryBadgeClass(skill.category)}`}>
          <span aria-hidden="true">{getCategoryEmoji(skill.category)}</span>
          {skill.category}
        </span>
        <span className="text-xs text-amber-700 opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 transition-opacity">
          자세히 보기
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
