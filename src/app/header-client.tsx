"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/classes", label: "Classes" },
  { href: "/shop", label: "Shop" },
  { href: "/trainers", label: "Trainers" },
  { href: "/programs", label: "Programs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function HeaderClient() {
  const { isSignedIn } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="border-b border-zinc-900 bg-black/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-500 text-xl font-extrabold text-black shadow-lg shadow-lime-500/40">
            FB
          </span>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-100">
              FITBEAST
            </p>
            <p className="text-xs text-zinc-400">Strength • Conditioning • Community</p>
          </div>
        </Link>

        {/* Center nav */}
        <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative pb-1 font-medium text-zinc-300 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-black text-zinc-100 shadow-sm transition hover:border-lime-500 hover:text-lime-400"
            aria-label="Open cart"
          >
            {/* Simple cart icon */}
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 6h15l-1.5 8.5H8z" />
              <path d="M6 6 4 3H2" />
              <circle cx="9" cy="18" r="1.25" />
              <circle cx="17" cy="18" r="1.25" />
            </svg>
          </Link>

          {!isSignedIn && (
            <Link
              href="/signup"
              className="hidden rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/40 transition hover:bg-blue-500 md:inline-flex"
            >
              JOIN NOW
            </Link>
          )}

          {isSignedIn && (
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-black text-zinc-100 shadow-sm transition hover:border-lime-500 hover:text-lime-400"
              aria-label="Open user menu"
            >
              {/* Simple menu icon */}
              <span className="flex flex-col gap-0.5">
                <span className="h-0.5 w-4 rounded-full bg-zinc-200" />
                <span className="h-0.5 w-4 rounded-full bg-zinc-200" />
                <span className="h-0.5 w-4 rounded-full bg-zinc-200" />
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Sidebar overlay */}
      {isSignedIn && isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="h-full w-64 bg-zinc-950 border-l border-zinc-800 p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-zinc-100">Account</span>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:border-zinc-500"
                aria-label="Close menu"
              >
                ×
              </button>
            </div>

            <div className="mt-2 flex flex-col gap-2 text-sm">
              <Link
                href="/profile"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-left text-zinc-100 hover:border-lime-500 hover:text-lime-200"
                onClick={() => setIsSidebarOpen(false)}
              >
                Profile
              </Link>

              <SignOutButton>
                <button
                  type="button"
                  className="w-full rounded-lg border border-red-600/70 bg-red-600/10 px-3 py-2 text-left text-xs font-semibold text-red-300 hover:bg-red-600/20"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Sign out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
