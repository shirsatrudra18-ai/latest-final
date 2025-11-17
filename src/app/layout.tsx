import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserSync } from "./user-sync";
import { HeaderClient } from "./header-client";

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
            <HeaderClient />
            <UserSync />
            <main className="mx-auto max-w-6xl px-4 pb-12 pt-10 md:px-6 md:pb-16 md:pt-14">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
