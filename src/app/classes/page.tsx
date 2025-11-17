"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

type Day = (typeof DAYS)[number];

type ClassItem = {
  id: string;
  time: string;
  title: string;
  level: "Low" | "Medium" | "High";
  coach: string;
  duration: string;
  spotsLeft: number;
};

type GymClassFromApi = {
  id: string;
  dayOfWeek:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  title: string;
  category: string;
  level: string;
  startTime: string;
  durationMin: number;
  totalSlots: number;
  trainer: {
    id: string;
    name: string;
  };
  bookings: { id: string }[];
};

const DAY_LABEL_BY_ENUM: Record<GymClassFromApi["dayOfWeek"], Day> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

const SCHEDULE: Record<Day, ClassItem[]> = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

export default function ClassesPage() {
  const [selectedDay, setSelectedDay] = useState<Day>("Monday");
  const [bookingClass, setBookingClass] = useState<ClassItem | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [schedule, setSchedule] = useState<Record<Day, ClassItem[]>>(SCHEDULE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    async function loadClasses() {
      try {
        setLoading(true);
        const res = await fetch("/api/classes");
        if (!res.ok) {
          throw new Error("Failed to load classes");
        }
        const data: { classes: GymClassFromApi[] } = await res.json();

        const nextSchedule: Record<Day, ClassItem[]> = {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
          Sunday: [],
        };

        for (const cls of data.classes) {
          const dayLabel = DAY_LABEL_BY_ENUM[cls.dayOfWeek];
          const spotsLeft = Math.max(cls.totalSlots - cls.bookings.length, 0);
          const item: ClassItem = {
            id: cls.id,
            time: cls.startTime,
            title: cls.title,
            level: cls.level as ClassItem["level"],
            coach: cls.trainer.name,
            duration: `${cls.durationMin} min`,
            spotsLeft,
          };
          nextSchedule[dayLabel].push(item);
        }

        setSchedule(nextSchedule);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Could not load classes. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadClasses();
  }, []);

  const classesForDay = schedule[selectedDay];

  const handleOpenBooking = (item: ClassItem) => {
    setBookingClass(item);
    setSelectedDate("");
  };

  const handleConfirmBooking = async () => {
    if (!bookingClass) return;

    if (!isSignedIn) {
      router.push("/login?redirect=/classes");
      return;
    }

    if (!selectedDate) {
      alert("Please choose a date for your booking.");
      return;
    }

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: bookingClass.id, date: selectedDate }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error(data);
        alert("Something went wrong while booking the class.");
        return;
      }

      alert("Class booked successfully for " + selectedDate + ".");
      setBookingClass(null);
    } catch (error) {
      console.error(error);
      alert("Network error while booking the class.");
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <header className="text-center space-y-3">
        <h1 className="text-3xl font-semibold text-zinc-50 md:text-4xl">Class Schedule</h1>
        <p className="text-sm text-zinc-300">
          Find the perfect class for your fitness journey. Choose a day to see available sessions.
        </p>
      </header>

      {/* Day tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {DAYS.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => setSelectedDay(day)}
            className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
              selectedDay === day
                ? "border-lime-500 bg-lime-500 text-black shadow-md shadow-lime-500/40"
                : "border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-lime-500/70 hover:text-lime-200"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule cards */}
      <div className="space-y-4">
        {loading && (
          <p className="text-center text-sm text-zinc-400">Loading classes...</p>
        )}
        {!loading && error && (
          <p className="text-center text-sm text-red-400">{error}</p>
        )}
        {!loading && !error && classesForDay.length === 0 && (
          <p className="text-center text-sm text-zinc-400">
            No classes scheduled for {selectedDay} yet.
          </p>
        )}
        {!loading && !error &&
          classesForDay.map((item) => (
          <article
            key={item.id}
            className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-sm shadow-black/40"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-sky-400">
                  <span>{item.time}</span>
                  <span className="text-[10px] rounded-full bg-red-600/90 px-2 py-0.5 font-semibold uppercase tracking-wide text-zinc-50">
                    {item.level}
                  </span>
                </div>
                <p className="text-base font-semibold text-zinc-50">{item.title}</p>
                <p className="text-xs text-zinc-400">with {item.coach}</p>
              </div>

              <div className="flex items-center gap-6 text-xs text-zinc-400">
                <div className="flex items-center gap-1">
                  <span className="text-[11px]">⏱</span>
                  <span>{item.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px]">👥</span>
                  <span>{item.spotsLeft} spots left</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenBooking(item)}
              className="mt-4 flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/40 transition hover:bg-blue-500"
            >
              Book Now
            </button>
          </article>
        ))}
      </div>

      {/* Booking modal */}
      {bookingClass && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950/95 p-6 text-zinc-50 shadow-2xl shadow-black/70">
            <h2 className="text-xl font-semibold text-center">Book Class</h2>
            <p className="mt-2 text-sm text-center text-zinc-300">
              {bookingClass.title} — {bookingClass.time}
            </p>

            <div className="mt-6 space-y-2 text-sm">
              <label htmlFor="booking-date" className="text-xs font-medium text-zinc-200">
                Select date
              </label>
              <input
                id="booking-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none ring-lime-500/60 placeholder:text-zinc-500 focus:border-lime-500 focus:ring-2"
              />
            </div>

            {!isSignedIn && (
              <p className="mt-3 text-xs text-amber-400">
                You must log in to confirm booking. The login page will open when you click Book Now.
              </p>
            )}

            <div className="mt-6 flex gap-3 text-sm">
              <button
                type="button"
                onClick={() => setBookingClass(null)}
                className="flex-1 rounded-full border border-zinc-700 px-4 py-2 text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="flex-1 rounded-full bg-blue-600 px-4 py-2 font-semibold text-white shadow-md shadow-blue-500/40 transition hover:bg-blue-500"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
