"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

const DAY_OPTIONS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

type Trainer = {
  id: string;
  name: string;
  classes: { id: string }[];
};

type GymClass = {
  id: string;
  dayOfWeek: string;
  title: string;
  category: string;
  level: string;
  startTime: string;
  durationMin: number;
  totalSlots: number;
  trainer: { id: string; name: string };
  bookings: { id: string }[];
};

type Booking = {
  id: string;
  createdAt: string;
  date: string;
  user: { id: string };
  gymClass: {
    id: string;
    title: string;
    startTime: string;
    dayOfWeek: string;
    trainer: { name: string };
  };
};

export default function AdminPage() {
  const { user, isSignedIn } = useUser();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newTrainerName, setNewTrainerName] = useState("");

  const [newClass, setNewClass] = useState({
    dayLabel: "Monday" as (typeof DAY_OPTIONS)[number],
    title: "",
    category: "",
    level: "Medium",
    startTime: "06:00",
    durationMin: 60,
    totalSlots: 10,
    trainerId: "",
  });

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();
  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();

  const isAdmin = isSignedIn && !!adminEmail && userEmail === adminEmail;

  useEffect(() => {
    if (!isAdmin) return;

    async function loadAll() {
      try {
        setLoading(true);

        const [trainersRes, classesRes, bookingsRes] = await Promise.all([
          fetch("/api/admin/trainers"),
          fetch("/api/admin/classes"),
          fetch("/api/admin/bookings"),
        ]);

        if (!trainersRes.ok || !classesRes.ok || !bookingsRes.ok) {
          throw new Error("Admin API error");
        }

        const trainersData = (await trainersRes.json()) as { trainers: Trainer[] };
        const classesData = (await classesRes.json()) as { classes: GymClass[] };
        const bookingsData = (await bookingsRes.json()) as { bookings: Booking[] };

        setTrainers(trainersData.trainers);
        setClasses(classesData.classes);
        setBookings(bookingsData.bookings);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, [isAdmin]);

  async function handleAddTrainer(e: React.FormEvent) {
    e.preventDefault();
    if (!newTrainerName.trim()) return;

    const res = await fetch("/api/admin/trainers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTrainerName.trim() }),
    });

    if (!res.ok) {
      alert("Failed to create trainer");
      return;
    }

    setNewTrainerName("");
    // reload trainers
    const trainersRes = await fetch("/api/admin/trainers");
    const trainersData = (await trainersRes.json()) as { trainers: Trainer[] };
    setTrainers(trainersData.trainers);
  }

  async function handleAddClass(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...newClass,
      durationMin: Number(newClass.durationMin),
      totalSlots: Number(newClass.totalSlots),
    };

    const res = await fetch("/api/admin/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Failed to create class");
      return;
    }

    // reload classes
    const classesRes = await fetch("/api/admin/classes");
    const classesData = (await classesRes.json()) as { classes: GymClass[] };
    setClasses(classesData.classes);
  }

  if (!isSignedIn) {
    return (
      <main className="space-y-4">
        <h1 className="text-2xl font-semibold text-zinc-50">Admin</h1>
        <p className="text-sm text-zinc-300">Please sign in to access the admin panel.</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="space-y-4">
        <h1 className="text-2xl font-semibold text-zinc-50">Admin</h1>
        <p className="text-sm text-red-400">You do not have permission to view this page.</p>
      </main>
    );
  }

  return (
    <main className="space-y-8 pb-16">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-50">Admin Dashboard</h1>
        <p className="text-sm text-zinc-300">
          Manage trainers, classes, and view bookings. Changes are stored in the database and reflected on the
          classes page.
        </p>
      </header>

      {loading && <p className="text-sm text-zinc-400">Loading admin data...</p>}
      {!loading && error && <p className="text-sm text-red-400">{error}</p>}

      {/* Trainers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-50">Trainers</h2>
          <span className="text-xs text-zinc-400">Total: {trainers.length}</span>
        </div>

        <form onSubmit={handleAddTrainer} className="flex flex-wrap items-center gap-2 text-sm">
          <input
            type="text"
            value={newTrainerName}
            onChange={(e) => setNewTrainerName(e.target.value)}
            placeholder="Trainer name"
            className="min-w-[200px] flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/50"
          />
          <button
            type="submit"
            className="rounded-full bg-lime-500 px-4 py-2 text-xs font-semibold text-black shadow-sm shadow-lime-500/40 hover:bg-lime-400"
          >
            Add trainer
          </button>
        </form>

        <div className="space-y-2 text-sm">
          {trainers.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2"
            >
              <span className="text-zinc-100">{t.name}</span>
              <span className="text-xs text-zinc-400">Classes: {t.classes.length}</span>
            </div>
          ))}
          {trainers.length === 0 && (
            <p className="text-xs text-zinc-500">No trainers yet. Add one above.</p>
          )}
        </div>
      </section>

      {/* Classes */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-50">Classes</h2>
          <span className="text-xs text-zinc-400">Total: {classes.length}</span>
        </div>

        <form onSubmit={handleAddClass} className="grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 text-xs md:grid-cols-4">
          <div className="space-y-1">
            <label className="block text-[11px] text-zinc-400">Day</label>
            <select
              value={newClass.dayLabel}
              onChange={(e) =>
                setNewClass((c) => ({ ...c, dayLabel: e.target.value as (typeof DAY_OPTIONS)[number] }))
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-50"
            >
              {DAY_OPTIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] text-zinc-400">Title</label>
            <input
              type="text"
              value={newClass.title}
              onChange={(e) => setNewClass((c) => ({ ...c, title: e.target.value }))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-50"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] text-zinc-400">Category</label>
            <input
              type="text"
              value={newClass.category}
              onChange={(e) => setNewClass((c) => ({ ...c, category: e.target.value }))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-50"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] text-zinc-400">Level</label>
            <select
              value={newClass.level}
              onChange={(e) => setNewClass((c) => ({ ...c, level: e.target.value }))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-50"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] text-zinc-400">Start time (HH:MM)</label>
            <input
              type="text"
              value={newClass.startTime}
              onChange={(e) => setNewClass((c) => ({ ...c, startTime: e.target.value }))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-50"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] text-zinc-400">Duration (min)</label>
            <input
              type="number"
              value={newClass.durationMin}
              onChange={(e) => setNewClass((c) => ({ ...c, durationMin: Number(e.target.value) }))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-50"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] text-zinc-400">Total slots</label>
            <input
              type="number"
              value={newClass.totalSlots}
              onChange={(e) => setNewClass((c) => ({ ...c, totalSlots: Number(e.target.value) }))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-50"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] text-zinc-400">Trainer</label>
            <select
              value={newClass.trainerId}
              onChange={(e) => setNewClass((c) => ({ ...c, trainerId: e.target.value }))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-50"
            >
              <option value="">Select trainer</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/40 hover:bg-blue-500"
            >
              Add class
            </button>
          </div>
        </form>

        <div className="space-y-2 text-xs">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="flex flex-col gap-1 rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-zinc-50">
                  {cls.title} <span className="text-xs text-zinc-400">({cls.category})</span>
                </p>
                <p className="text-xs text-zinc-400">
                  {cls.dayOfWeek} · {cls.startTime} · {cls.durationMin} min · Trainer: {cls.trainer.name}
                </p>
              </div>
              <div className="text-xs text-zinc-400">
                Slots: {cls.totalSlots} · Bookings: {cls.bookings.length}
              </div>
            </div>
          ))}
          {classes.length === 0 && (
            <p className="text-xs text-zinc-500">No classes yet. Use the form above to add one.</p>
          )}
        </div>
      </section>

      {/* Bookings */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-50">Bookings</h2>
          <span className="text-xs text-zinc-400">Total: {bookings.length}</span>
        </div>

        <div className="space-y-2 text-xs">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="flex flex-col gap-1 rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm text-zinc-50">{b.gymClass.title}</p>
                <p className="text-xs text-zinc-400">
                  User: {b.user.id} · Trainer: {b.gymClass.trainer.name}
                </p>
              </div>
              <div className="text-xs text-zinc-400">
                Date: {new Date(b.date).toLocaleDateString()} · Class time: {b.gymClass.startTime}
              </div>
            </div>
          ))}
          {bookings.length === 0 && (
            <p className="text-xs text-zinc-500">No bookings yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
