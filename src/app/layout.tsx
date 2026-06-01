import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import CacheClearButton from "@/components/CacheClearButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "amago AI Hub",
  description: "amago AI Hub — 사내 AI 자산 검색·탐색·설치",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#ece2d0] text-stone-800 min-h-screen`}>
        <header className="sticky top-0 z-50 border-b border-stone-300 bg-[#ece2d0]/90 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">🧰</span>
                <span className="text-xl font-semibold text-stone-900">
                  amago AI Hub
                </span>
              </Link>
              <nav className="flex items-center gap-6">
                <CacheClearButton />
                <a
                  href="https://github.com/ghostflare76/skill-marketplace"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
                >
                  GitHub
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-stone-300 mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-sm text-stone-500">
              amago AI Hub — 군도 공동 AI 도구창고(AI 마켓플레이스) · 장인의 AI 도구 검색·설치
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
