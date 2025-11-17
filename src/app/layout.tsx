import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitBeast Gym | Transform Your Body & Mind",
  description:
    "FitBeast Gym offers strength, conditioning, CrossFit-style classes, and personal training to help you become your strongest self.",
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-zinc-950 text-zinc-50 antialiased`}
        >
          <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-zinc-50">
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

                <Link
                  href="/login"
                  className="hidden rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/40 transition hover:bg-blue-500 md:inline-flex"
                >
                  JOIN NOW
                </Link>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-4 pb-12 pt-10 md:px-6 md:pb-16 md:pt-14">{children}</main>
        </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
