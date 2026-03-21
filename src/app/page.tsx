"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import SkillCard from "@/components/SkillCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import SkillCardSkeleton from "@/components/SkillCardSkeleton";
import EmptyRepoState from "@/components/EmptyRepoState";
import { Skill } from "@/lib/types";

const AddRepoModal = dynamic(() => import("@/components/AddRepoModal"), {
  ssr: false,
});
const RepoManageModal = dynamic(() => import("@/components/RepoManageModal"), {
  ssr: false,
});

const SKELETON_ITEMS = Array.from({ length: 9 });

interface ApiResponse {
  skills: Skill[];
  categories: { id: string; name: string }[];
  repos: { id: string; displayName: string }[];
  total: number;
  repoCount: number;
}

export default function Home() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [repoModalOpen, setRepoModalOpen] = useState(false);

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (selectedCategory) params.set("category", selectedCategory);

      const res = await fetch(`/api/skills?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError("Failed to load skills. Please check your GitHub token configuration.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [query, selectedCategory]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const hasNoRepos = !loading && data !== null && data.repoCount === 0;
  const hasNoResults = !loading && data !== null && data.repoCount > 0 && data.total === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Skill Marketplace
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-6">
          AI Agent의 Skills, Agents, Commands를 검색하고 설치하세요.
        </p>
        {data && !loading && data.repoCount > 0 && (
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-800 border border-gray-700 px-3 py-1 text-xs text-gray-300">
              <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
              {data.total} items
            </span>
            <button
              onClick={() => setRepoModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-gray-800 border border-gray-700 hover:border-indigo-500/50 hover:bg-gray-700 px-3 py-1 text-xs text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
              </svg>
              {data.repoCount} repos
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-800 border border-gray-700 px-3 py-1 text-xs text-gray-300">
              <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
              </svg>
              {data.categories.length} categories
            </span>
          </div>
        )}
      </section>

      {/* Search + Add Repo */}
      <section className="max-w-2xl mx-auto mb-8 flex gap-3">
        <div className="flex-1">
          <SearchBar
            onSearch={setQuery}
            placeholder="Search skills by name, keyword, or category..."
          />
        </div>
        <button
          onClick={() => { setModalKey((k) => k + 1); setModalOpen(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-indigo-500/50 text-gray-300 hover:text-white text-sm font-medium px-4 py-2.5 transition-all whitespace-nowrap cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          저장소 추가
        </button>
      </section>

      {/* Category Filter */}
      {data && data.categories.length > 0 && (
        <section className="mb-8 flex justify-center">
          <CategoryFilter
            categories={data.categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </section>
      )}

      {/* Search context */}
      {data && !loading && (query || selectedCategory) && (
        <div className="text-center mb-6">
          <span className="text-sm text-gray-500">
            {data.total} result{data.total !== 1 ? "s" : ""}
            {query && ` for "${query}"`}
            {selectedCategory &&
              ` in ${data.categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}`}
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Skill Grid */}
      <section>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SKELETON_ITEMS.map((_, i) => (
              <SkillCardSkeleton key={i} />
            ))}
          </div>
        ) : hasNoRepos ? (
          <EmptyRepoState onAddRepo={() => { setModalKey((k) => k + 1); setModalOpen(true); }} />
        ) : hasNoResults ? (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg mb-2">No skills found</div>
            <p className="text-gray-600 text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : data && data.skills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.skills.map((skill) => (
              <SkillCard key={`${skill.repoId}-${skill.category}-${skill.name}`} skill={skill} />
            ))}
          </div>
        ) : null}
      </section>

      {/* Add Repo Modal */}
      <AddRepoModal
        key={modalKey}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          fetchSkills();
        }}
      />

      {/* Repo Manage Modal */}
      <RepoManageModal
        open={repoModalOpen}
        onClose={() => setRepoModalOpen(false)}
        onChanged={fetchSkills}
      />
    </div>
  );
}
