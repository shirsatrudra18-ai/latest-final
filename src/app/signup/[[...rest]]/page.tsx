"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/90 px-6 py-8 shadow-xl shadow-black/50 sm:px-8">
        <SignUp
          routing="path"
          path="/signup"
          signInUrl="/login"
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-lime-500 hover:bg-lime-400 text-black font-semibold shadow-md shadow-lime-500/40",
              card: "bg-transparent shadow-none border-0",
            },
          }}
        />
      </div>
    </div>
  );
}
