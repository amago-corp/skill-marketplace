"use client";

export default function SkillCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-stone-300 bg-white/70 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="h-6 w-32 rounded bg-stone-100" />
        <div className="h-5 w-12 rounded bg-stone-100" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full rounded bg-stone-100" />
        <div className="h-4 w-4/5 rounded bg-stone-100" />
        <div className="h-4 w-2/3 rounded bg-stone-100" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-5 w-24 rounded-full bg-stone-100" />
        <div className="h-4 w-20 rounded bg-stone-100" />
      </div>
    </div>
  );
}
