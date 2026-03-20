"use client";

import { getCategoryFilterSelectedClass } from "@/lib/categoryColors";
import CategoryIcon from "@/components/CategoryIcon";

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
            ? "bg-indigo-600 text-white shadow-sm"
            : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id === selected ? "" : cat.id)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
            selected === cat.id
              ? getCategoryFilterSelectedClass(cat.id)
              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
          }`}
        >
          <CategoryIcon category={cat.id} className="w-3.5 h-3.5" />
          {cat.name}
        </button>
      ))}
    </div>
  );
}
