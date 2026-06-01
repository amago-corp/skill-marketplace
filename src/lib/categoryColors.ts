export type CategoryType = "command" | "agent" | "skill" | "plugin" | "prompt" | "knowledge";

interface CategoryStyle {
  badge: string;
  filterSelected: string;
  icon: string;
  emoji: string;
}

const categoryStyles: Record<CategoryType, CategoryStyle> = {
  command: {
    badge:
      "bg-amber-50 text-amber-900 border-amber-200",
    filterSelected:
      "bg-amber-700 text-amber-50 shadow-sm",
    icon: "terminal",
    emoji: "⚡",
  },
  agent: {
    badge:
      "bg-violet-50 text-violet-900 border-violet-200",
    filterSelected:
      "bg-violet-700 text-violet-50 shadow-sm",
    icon: "cpu",
    emoji: "🤖",
  },
  skill: {
    badge:
      "bg-teal-50 text-teal-900 border-teal-200",
    filterSelected:
      "bg-teal-700 text-teal-50 shadow-sm",
    icon: "zap",
    emoji: "🔨",
  },
  plugin: {
    badge:
      "bg-stone-100 text-stone-800 border-stone-300",
    filterSelected:
      "bg-stone-700 text-stone-50 shadow-sm",
    icon: "package",
    emoji: "📦",
  },
  prompt: {
    badge:
      "bg-sky-50 text-sky-900 border-sky-200",
    filterSelected:
      "bg-sky-700 text-sky-50 shadow-sm",
    icon: "message-square",
    emoji: "📜",
  },
  knowledge: {
    badge:
      "bg-rose-50 text-rose-900 border-rose-200",
    filterSelected:
      "bg-rose-700 text-rose-50 shadow-sm",
    icon: "book-open",
    emoji: "📚",
  },
};

const fallback: CategoryStyle = {
  badge: "bg-stone-50 text-stone-800 border-stone-200",
  filterSelected: "bg-stone-700 text-stone-50 shadow-sm",
  icon: "box",
  emoji: "📦",
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

export function getCategoryEmoji(category: string): string {
  return (categoryStyles[category as CategoryType] ?? fallback).emoji;
}

export const NEW_BADGE_CLASS = "bg-emerald-50 text-emerald-800 border-emerald-200";
