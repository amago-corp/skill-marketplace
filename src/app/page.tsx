"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import SkillCard from "@/components/SkillCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import SkillCardSkeleton from "@/components/SkillCardSkeleton";
import EmptyRepoState from "@/components/EmptyRepoState";
import QuickStartGuide from "@/components/QuickStartGuide";
import ContributeGuide from "@/components/ContributeGuide";
import CountUp from "@/components/CountUp";
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
        <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-4">
          🧰 amago AI Hub
        </h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-6">
          장인의 손길이 담긴 AI 도구를 자유롭게 가져가세요
        </p>
        {data && !loading && data.repoCount > 0 && (
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 border border-stone-300 px-3 py-1 text-xs text-stone-700">
              <span aria-hidden="true">🧰</span>
              AI 도구(AI asset) <CountUp value={data.total} />
            </span>
            <button
              onClick={() => setRepoModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 border border-stone-300 hover:border-amber-500/60 hover:bg-stone-200 px-3 py-1 text-xs text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <span aria-hidden="true">🏘</span>
              작업장(workspace) <CountUp value={data.repoCount} />
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 border border-stone-300 px-3 py-1 text-xs text-stone-700">
              <span aria-hidden="true">🗂</span>
              분류 <CountUp value={data.categories.length} />
            </span>
          </div>
        )}
      </section>

      {/* Guides — usage + contribution */}
      <section className="max-w-5xl mx-auto mb-10 grid lg:grid-cols-2 gap-4">
        <QuickStartGuide />
        <ContributeGuide />
      </section>

      {/* Search + Add Repo */}
      <section className="max-w-2xl mx-auto mb-8 flex gap-3">
        <div className="flex-1">
          <SearchBar
            onSearch={setQuery}
            placeholder="어떤 AI 도구가 필요하세요? (이름·설명·태그)"
          />
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 hover:border-amber-500/60 text-stone-600 hover:text-stone-900 text-sm font-medium px-4 py-2.5 transition-all whitespace-nowrap cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          외부 작업장 연결
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
          <span className="text-sm text-stone-400">
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
          <EmptyRepoState onAddRepo={() => setModalOpen(true)} />
        ) : hasNoResults ? (
          <div className="text-center py-16">
            <div className="text-stone-400 text-lg mb-2">No skills found</div>
            <p className="text-stone-400 text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : data && data.skills.length > 0 ? (
          <motion.div
            key={`${query}|${selectedCategory}`}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
            }}
          >
            {data.skills.map((skill) => (
              <SkillCard key={`${skill.repoId}-${skill.category}-${skill.name}`} skill={skill} />
            ))}
          </motion.div>
        ) : null}
      </section>

      {/* Add Repo Modal */}
      <AddRepoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
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
