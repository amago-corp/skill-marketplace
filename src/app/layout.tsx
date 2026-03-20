import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import CacheClearButton from "@/components/CacheClearButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skill Marketplace — Browse & Discover Agent Skills",
  description:
    "Discover, search, and install AI agent skills from curated GitHub repositories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen`}>
        <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center text-cyan-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
                <span className="text-xl font-semibold text-white">
                  Skill Marketplace
                </span>
              </Link>
              <nav className="flex items-center gap-6">
                <CacheClearButton />
                <a
                  href="https://github.com/ghostflare76/skill-marketplace"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-gray-800 mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-sm text-gray-500">
              Skill Marketplace — Browse agent skills from GitHub repositories
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
