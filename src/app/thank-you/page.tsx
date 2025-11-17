import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-950 via-zinc-900 to-black px-6">
      <div className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 text-center text-zinc-50 shadow-xl shadow-black/40">
        <h1 className="text-2xl font-semibold">We&apos;ve received your request ✅</h1>
        <p className="mt-3 text-sm text-zinc-300">
          A member of the FitBeast coaching team will contact you shortly to schedule your free
          trial session and answer any questions you may have.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-lime-500 px-6 py-2.5 text-sm font-semibold text-black shadow-md shadow-lime-500/40 transition hover:bg-lime-400"
        >
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
