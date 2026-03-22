export type CategoryType = "command" | "agent" | "skill";

interface CategoryStyle {
  badge: string;
  filterSelected: string;
  icon: string;
}

const categoryStyles: Record<CategoryType, CategoryStyle> = {
  command: {
    badge:
      "bg-amber-500/15 text-amber-300 border-amber-400/30",
    filterSelected:
      "bg-amber-600 text-white shadow-sm",
    icon: "terminal",
  },
  agent: {
    badge:
      "bg-violet-500/15 text-violet-300 border-violet-400/30",
    filterSelected:
      "bg-violet-600 text-white shadow-sm",
    icon: "cpu",
  },
  skill: {
    badge:
      "bg-teal-500/15 text-teal-300 border-teal-400/30",
    filterSelected:
      "bg-teal-600 text-white shadow-sm",
    icon: "zap",
  },
};

const fallback: CategoryStyle = {
  badge: "bg-slate-500/15 text-slate-300 border-slate-400/30",
  filterSelected: "bg-slate-600 text-white shadow-sm",
  icon: "box",
};

export function getCategoryBadgeClass(category: string): string {
  return (categoryStyles[category as CategoryType] ?? fallback).badge;
}

export function getCategoryFilterSelectedClass(category: string): string {
  return (categoryStyles[category as CategoryType] ?? fallback).filterSelected;
}

export function getCategoryIcon(category: string): string {
  return (categoryStyles[category as CategoryType] ?? fallback).icon;
}

export const NEW_BADGE_CLASS = "bg-lime-400/15 text-lime-300 border-lime-400/40";
