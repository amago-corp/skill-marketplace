"use client";

import { getCategoryFilterSelectedClass, getCategoryEmoji } from "@/lib/categoryColors";

interface CategoryFilterProps {
  categories: { id: string; name: string }[];
  selected: string;
  onSelect: (categoryId: string) => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect("")}
        className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
          selected === ""
            ? "bg-amber-600 text-amber-50 shadow-sm"
            : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900 border border-stone-300"
        }`}
      >
        전체 AI 도구
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id === selected ? "" : cat.id)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
            selected === cat.id
              ? getCategoryFilterSelectedClass(cat.id)
              : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900 border border-stone-300"
          }`}
        >
          <span aria-hidden="true">{getCategoryEmoji(cat.id)}</span>
          {cat.name}
        </button>
      ))}
    </div>
  );
}
