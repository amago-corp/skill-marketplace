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
      "bg-amber-100 text-amber-800 border-amber-300",
    filterSelected:
      "bg-amber-600 text-amber-50 shadow-sm",
    icon: "terminal",
    emoji: "⚡",
  },
  agent: {
    badge:
      "bg-violet-100 text-violet-800 border-violet-300",
    filterSelected:
      "bg-violet-600 text-violet-50 shadow-sm",
    icon: "cpu",
    emoji: "🤖",
  },
  skill: {
    badge:
      "bg-teal-100 text-teal-800 border-teal-300",
    filterSelected:
      "bg-teal-600 text-teal-50 shadow-sm",
    icon: "zap",
    emoji: "🔨",
  },
  plugin: {
    badge:
      "bg-stone-200 text-stone-800 border-stone-400",
    filterSelected:
      "bg-stone-700 text-stone-50 shadow-sm",
    icon: "package",
    emoji: "📦",
  },
  prompt: {
    badge:
      "bg-sky-100 text-sky-800 border-sky-300",
    filterSelected:
      "bg-sky-600 text-sky-50 shadow-sm",
    icon: "message-square",
    emoji: "📜",
  },
  knowledge: {
    badge:
      "bg-rose-100 text-rose-800 border-rose-300",
    filterSelected:
      "bg-rose-600 text-rose-50 shadow-sm",
    icon: "book-open",
    emoji: "📚",
  },
};

const fallback: CategoryStyle = {
  badge: "bg-stone-100 text-stone-700 border-stone-300",
  filterSelected: "bg-stone-600 text-stone-50 shadow-sm",
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

export const NEW_BADGE_CLASS = "bg-lime-100 text-lime-800 border-lime-400";
