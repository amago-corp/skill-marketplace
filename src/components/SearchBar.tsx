"use client";

import { useState, useCallback } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search skills...",
}: SearchBarProps) {
  const [value, setValue] = useState("");

  const debouncedSearch = useCallback(
    (() => {
      let timer: NodeJS.Timeout;
      return (q: string) => {
        clearTimeout(timer);
        timer = setTimeout(() => onSearch(q), 300);
      };
    })(),
    [onSearch]
  );

  function handleChange(next: string) {
    setValue(next);
    debouncedSearch(next);
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <svg
          className="h-5 w-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-700 bg-gray-900 py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
      />
      {value && (
        <button
          onClick={() => handleChange("")}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-300"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
