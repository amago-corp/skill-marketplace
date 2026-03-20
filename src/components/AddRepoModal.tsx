"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ProviderIcon } from "./ProviderIcon";

interface AddRepoModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type ProviderType = "github" | "bitbucket";

interface ProviderOption {
  id: ProviderType;
  label: string;
  urlPattern: RegExp;
  placeholder: string;
  ownerLabel: string;
}

// Bitbucket Server clone URL: https://{host}/scm/{project}/{repo}.git
const BB_SERVER_PATTERN = /^https?:\/\/([^/]+)\/scm\/([^/]+)\/([^/]+?)(?:\.git)?$/;

const PROVIDERS: ProviderOption[] = [
  {
    id: "github",
    label: "GitHub",
    urlPattern: /github\.com\/([^/]+)\/([^/]+)/,
    placeholder: "https://github.com/owner/repo",
    ownerLabel: "Owner",
  },
  {
    id: "bitbucket",
    label: "Bitbucket Server",
    urlPattern: BB_SERVER_PATTERN,
    placeholder: "https://git.example.com/scm/project/repo.git",
    ownerLabel: "Project",
  },
];

interface FormState {
  provider: ProviderType;
  repoUrl: string;
  owner: string;
  repo: string;
  branch: string;
  displayName: string;
  description: string;
  baseUrl: string;
}

const INITIAL_FORM: FormState = {
  provider: "github",
  repoUrl: "",
  owner: "",
  repo: "",
  branch: "main",
  displayName: "",
  description: "",
  baseUrl: "",
};

export default function AddRepoModal({ open, onClose, onSuccess }: AddRepoModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<"idle" | "validating" | "saving" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentProvider = PROVIDERS.find((p) => p.id === form.provider) ?? PROVIDERS[0];

  function detectAndParseUrl(url: string) {
    // GitHub: https://github.com/{owner}/{repo}
    const ghMatch = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (ghMatch) {
      const owner = ghMatch[1];
      const repo = ghMatch[2].replace(/\.git$/, "");
      setForm((prev) => ({
        ...prev,
        provider: "github",
        owner,
        repo,
        baseUrl: "",
        displayName: prev.displayName || repo,
      }));
      return;
    }

    // Bitbucket Server: https://{host}/scm/{project}/{repo}.git
    const bbMatch = url.match(BB_SERVER_PATTERN);
    if (bbMatch) {
      const host = bbMatch[1];
      const project = bbMatch[2];
      const repo = bbMatch[3].replace(/\.git$/, "");
      const protocol = url.startsWith("https") ? "https" : "http";
      setForm((prev) => ({
        ...prev,
        provider: "bitbucket",
        owner: project,
        repo,
        baseUrl: `${protocol}://${host}`,
        branch: prev.branch === "main" ? "master" : prev.branch,
        displayName: prev.displayName || repo,
      }));
      return;
    }
  }

  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    const url = e.target.value;
    setForm((prev) => ({ ...prev, repoUrl: url }));
    detectAndParseUrl(url);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    const { provider, owner, repo, branch, displayName } = form;
    if (!owner.trim() || !repo.trim() || !displayName.trim()) {
      setErrorMsg(`${currentProvider.ownerLabel}, repo, 표시 이름은 필수입니다.`);
      return;
    }

    setStatus("validating");
    try {
      const validateRes = await fetch("/api/repos/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, owner, repo, branch, baseUrl: form.baseUrl || undefined }),
      });
      const validateData = await validateRes.json();
      if (!validateData.valid) {
        setStatus("error");
        setErrorMsg(validateData.error || "저장소 검증에 실패했습니다.");
        return;
      }

      setStatus("saving");
      const addRes = await fetch("/api/repos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          owner,
          repo,
          branch,
          displayName: displayName.trim(),
          description: form.description.trim(),
          baseUrl: form.baseUrl || undefined,
        }),
      });
      const addData = await addRes.json();
      if (!addRes.ok) {
        setStatus("error");
        setErrorMsg(addData.error || "저장소 추가에 실패했습니다.");
        return;
      }

      setStatus("idle");
      onSuccess();
    } catch {
      setStatus("error");
      setErrorMsg("네트워크 오류가 발생했습니다.");
    }
  }

  const isLoading = status === "validating" || status === "saving";

  if (!open || !mounted) return null;

  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      {/* Backdrop */}
      <div
        style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.75)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">저장소 추가</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Provider 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Provider</label>
            <div className="flex gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, provider: p.id }))}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border transition-colors cursor-pointer ${
                    form.provider === p.id
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                      : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-300"
                  }`}
                >
                  <ProviderIcon provider={p.id} className="h-4 w-4" />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Repository URL */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              저장소 URL <span className="text-gray-600 font-normal">(선택 — 자동 파싱)</span>
            </label>
            <input
              type="text"
              name="repoUrl"
              value={form.repoUrl}
              onChange={handleUrlChange}
              placeholder="https://github.com/owner/repo"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 text-white text-sm px-3.5 py-2.5 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Owner / Repo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                {currentProvider.ownerLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="owner"
                value={form.owner}
                onChange={handleChange}
                placeholder={form.provider === "bitbucket" ? "project-key" : "username"}
                required
                className="w-full rounded-lg bg-gray-800 border border-gray-700 text-white text-sm px-3.5 py-2.5 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Repo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="repo"
                value={form.repo}
                onChange={handleChange}
                placeholder="repository-name"
                required
                className="w-full rounded-lg bg-gray-800 border border-gray-700 text-white text-sm px-3.5 py-2.5 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Branch */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Branch</label>
            <input
              type="text"
              name="branch"
              value={form.branch}
              onChange={handleChange}
              placeholder="main"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 text-white text-sm px-3.5 py-2.5 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              표시 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              placeholder="My Skills"
              required
              className="w-full rounded-lg bg-gray-800 border border-gray-700 text-white text-sm px-3.5 py-2.5 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              설명 <span className="text-gray-600 font-normal">(선택)</span>
            </label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="저장소 설명"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 text-white text-sm px-3.5 py-2.5 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3.5 py-3 text-red-400 text-sm">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              {errorMsg}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 transition-colors cursor-pointer"
            >
              {isLoading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {status === "validating" ? "검증 중..." : status === "saving" ? "저장 중..." : "저장소 추가"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
