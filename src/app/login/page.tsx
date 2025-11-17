"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/90 px-6 py-8 shadow-xl shadow-black/50 sm:px-8">
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/login?signup=1"
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-lime-500 hover:bg-lime-400 text-black font-semibold shadow-md shadow-lime-500/40", 
              card:
                "bg-transparent shadow-none border-0", 
            },
          }}
        />
      </div>
    </div>
  );
}
