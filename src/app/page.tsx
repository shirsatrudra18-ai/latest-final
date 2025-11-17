import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero with background image */}
      <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/1552104/pexels-photo-1552104.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />

        <div className="relative z-10 grid gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)] lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-400">
              Strength • Conditioning • Community
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Transform your body.
              <span className="block text-lime-400">Unleash your inner beast.</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-zinc-200 md:text-base">
              Train in a high performance environment with structured programs, expert coaches, and a
              community that keeps you consistent.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-lime-500 px-7 py-3 text-sm font-semibold text-black shadow-lg shadow-lime-500/40 transition hover:bg-lime-400"
              >
                START FREE TRIAL
              </Link>
              <Link
                href="/classes"
                className="inline-flex items-center justify-center rounded-full border border-lime-500/70 bg-black/60 px-6 py-3 text-sm font-medium text-zinc-50 backdrop-blur transition hover:border-lime-400 hover:text-lime-200"
              >
                View Classes
              </Link>
              <p className="w-full text-xs text-zinc-400 sm:w-auto">
                No join fee • Cancel anytime • First 7 days free
              </p>
            </div>

            <dl className="mt-8 grid max-w-lg grid-cols-3 gap-4 text-xs text-zinc-300 md:text-sm">
              <div>
                <dt className="font-semibold text-zinc-50">500+ members</dt>
                <dd>Training with FitBeast every month.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-50">30+ weekly classes</dt>
                <dd>Strength, conditioning, HIIT, and mobility.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-50">Open 18+ hours</dt>
                <dd>Morning and late night training windows.</dd>
              </div>
            </dl>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="h-44 w-44 rounded-full bg-gradient-to-tr from-lime-500 via-emerald-400 to-sky-500 blur-3xl opacity-40" />
            <div className="absolute inset-x-4 top-6 rounded-3xl border border-zinc-700/80 bg-black/70 px-6 py-5 text-xs text-zinc-200 backdrop-blur sm:inset-x-auto sm:right-6 sm:w-72">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-lime-400">
                Today in the gym
              </p>
              <p className="mt-2 text-sm font-semibold text-zinc-50">Strength & Conditioning Blocks</p>
              <p className="mt-1 text-[11px] text-zinc-300">
                Rotating blocks focused on strength, conditioning, and mobility so you make progress all
                year.
              </p>
              <div className="mt-4 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Coach team on floor</span>
                <span>Every 60 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose FitBeast section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-zinc-50 md:text-3xl">Why Choose FitBeast?</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Serious training, supportive coaching, and a facility built for performance and longevity.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-500/15 text-lime-400">
              <span className="text-lg font-bold">🏋️</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-50">State of the art equipment</p>
              <p className="mt-1 text-xs text-zinc-300">
                Platforms, racks, machines, and conditioning tools selected for serious strength training.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-500/15 text-lime-400">
              <span className="text-lg font-bold">🎯</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-50">Expert trainers</p>
              <p className="mt-1 text-xs text-zinc-300">
                Certified coaches who focus on technique, progression, and sustainable results.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-500/15 text-lime-400">
              <span className="text-lg font-bold">🥗</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-50">Nutrition guidance</p>
              <p className="mt-1 text-xs text-zinc-300">
                Simple frameworks for meals that support training, recovery, and body composition.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-500/15 text-lime-400">
              <span className="text-lg font-bold">⭐</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-50">Results focused programs</p>
              <p className="mt-1 text-xs text-zinc-300">
                Clear plans for strength, fat loss, and performance so you always know what is next.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-500/15 text-lime-400">
              <span className="text-lg font-bold">🕒</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-50">Flexible hours</p>
              <p className="mt-1 text-xs text-zinc-300">
                Open from early morning to late evening so training fits your schedule.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-500/15 text-lime-400">
              <span className="text-lg font-bold">🏠</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-50">Premium facility</p>
              <p className="mt-1 text-xs text-zinc-300">
                Clean, well lit training space with showers, lockers, and recovery tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Classes preview section */}
      <section className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-50 md:text-3xl">Explore our classes</h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-300">
              A mix of strength, conditioning, and recovery focused sessions so you can train hard and stay
              healthy.
            </p>
          </div>
          <Link
            href="/classes"
            className="inline-flex items-center justify-center rounded-full border border-lime-500/70 bg-black/60 px-5 py-2 text-xs font-medium text-zinc-50 transition hover:border-lime-400 hover:text-lime-200"
          >
            View all classes
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <article className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-70"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3)), url('https://images.pexels.com/photos/6456291/pexels-photo-6456291.jpeg?auto=compress&cs=tinysrgb&w=1600')",
              }}
            />
            <div className="relative z-10 flex h-56 flex-col justify-end p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-400">
                Strength
              </p>
              <h3 className="mt-1 text-sm font-semibold text-zinc-50">Barbell Fundamentals</h3>
              <p className="mt-1 text-xs text-zinc-300">Level: Beginner to Intermediate</p>
              <p className="text-xs text-zinc-400">Duration: 60 minutes</p>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-70"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3)), url('https://images.pexels.com/photos/1552108/pexels-photo-1552108.jpeg?auto=compress&cs=tinysrgb&w=1600')",
              }}
            />
            <div className="relative z-10 flex h-56 flex-col justify-end p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-400">Conditioning</p>
              <h3 className="mt-1 text-sm font-semibold text-zinc-50">HIIT Engine</h3>
              <p className="mt-1 text-xs text-zinc-300">Level: All levels</p>
              <p className="text-xs text-zinc-400">Duration: 45 minutes</p>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-70"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3)), url('https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=1600')",
              }}
            />
            <div className="relative z-10 flex h-56 flex-col justify-end p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-400">Recovery</p>
              <h3 className="mt-1 text-sm font-semibold text-zinc-50">Mobility & Core Lab</h3>
              <p className="mt-1 text-xs text-zinc-300">Level: All levels</p>
              <p className="text-xs text-zinc-400">Duration: 30 minutes</p>
            </div>
          </article>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-zinc-50 md:text-3xl">Member success stories</h2>
          <p className="mt-2 text-sm text-zinc-300">
            A few examples from members who committed to the process and stayed consistent.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <article className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
            <div>
              <p className="text-xs text-lime-400">★★★★★</p>
              <p className="mt-3 text-sm font-semibold text-zinc-50">Sarah Johnson</p>
              <p className="text-xs text-zinc-400">Member since 2023</p>
              <p className="mt-3 text-xs text-zinc-300">
                FitBeast completely transformed my training. I lost fat, gained strength, and feel more
                confident in the gym.
              </p>
            </div>
          </article>

          <article className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
            <div>
              <p className="text-xs text-lime-400">★★★★★</p>
              <p className="mt-3 text-sm font-semibold text-zinc-50">Mike Chen</p>
              <p className="text-xs text-zinc-400">Member since 2022</p>
              <p className="mt-3 text-xs text-zinc-300">
                The coaches are focused on technique and long term progress. This is the best gym I have
                ever joined.
              </p>
            </div>
          </article>

          <article className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
            <div>
              <p className="text-xs text-lime-400">★★★★★</p>
              <p className="mt-3 text-sm font-semibold text-zinc-50">Emma Rodriguez</p>
              <p className="text-xs text-zinc-400">Member since 2024</p>
              <p className="mt-3 text-xs text-zinc-300">
                Group classes keep me consistent and motivated. I actually look forward to training days
                now.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Final CTA section */}
      <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-slate-900 via-slate-950 to-black py-10 text-center">
        <h2 className="text-2xl font-semibold text-zinc-50 md:text-3xl">
          Ready to start your transformation?
        </h2>
        <p className="mt-2 text-sm text-zinc-300">
          Join FitBeast today and get 7 days free on your membership.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-lime-500 px-8 py-3 text-sm font-semibold text-black shadow-lg shadow-lime-500/40 transition hover:bg-lime-400"
          >
            Join Now
          </Link>
        </div>
      </section>
    </div>
  );
}
