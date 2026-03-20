"use client";

export default function SkillCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-800 bg-gray-900/50 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="h-6 w-32 rounded bg-gray-800" />
        <div className="h-5 w-12 rounded bg-gray-800" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full rounded bg-gray-800" />
        <div className="h-4 w-4/5 rounded bg-gray-800" />
        <div className="h-4 w-2/3 rounded bg-gray-800" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-5 w-24 rounded-full bg-gray-800" />
        <div className="h-4 w-20 rounded bg-gray-800" />
      </div>
    </div>
  );
}
