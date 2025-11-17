"use client";

import { useState } from "react";
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

const SCHEDULE: Record<Day, ClassItem[]> = {
  Monday: [
    {
      id: "mon-6-hiit",
      time: "6:00 AM",
      title: "Morning HIIT",
      level: "High",
      coach: "Sarah Johnson",
      duration: "45 min",
      spotsLeft: 5,
    },
    {
      id: "mon-9-yoga",
      time: "9:00 AM",
      title: "Yoga Flow",
      level: "Low",
      coach: "Emma Lee",
      duration: "60 min",
      spotsLeft: 8,
    },
    {
      id: "mon-12-strength",
      time: "12:00 PM",
      title: "Strength Training",
      level: "Medium",
      coach: "Mike Chen",
      duration: "60 min",
      spotsLeft: 3,
    },
    {
      id: "mon-17-crossfit",
      time: "5:00 PM",
      title: "CrossFit",
      level: "High",
      coach: "Jake Williams",
      duration: "50 min",
      spotsLeft: 2,
    },
  ],
  Tuesday: [
    {
      id: "tue-6-strength",
      time: "6:00 AM",
      title: "Barbell Strength",
      level: "Medium",
      coach: "Alex Carter",
      duration: "60 min",
      spotsLeft: 4,
    },
    {
      id: "tue-18-conditioning",
      time: "6:00 PM",
      title: "Conditioning Circuit",
      level: "High",
      coach: "Maya Singh",
      duration: "45 min",
      spotsLeft: 6,
    },
  ],
  Wednesday: [
    {
      id: "wed-7-mobility",
      time: "7:00 AM",
      title: "Mobility & Core",
      level: "Low",
      coach: "Diego Morales",
      duration: "40 min",
      spotsLeft: 10,
    },
    {
      id: "wed-19-hiit",
      time: "7:00 PM",
      title: "Evening HIIT",
      level: "High",
      coach: "Sarah Johnson",
      duration: "45 min",
      spotsLeft: 5,
    },
  ],
  Thursday: [
    {
      id: "thu-6-strength",
      time: "6:00 AM",
      title: "Strength Foundations",
      level: "Medium",
      coach: "Alex Carter",
      duration: "60 min",
      spotsLeft: 7,
    },
    {
      id: "thu-18-yoga",
      time: "6:00 PM",
      title: "Yoga & Recovery",
      level: "Low",
      coach: "Emma Lee",
      duration: "60 min",
      spotsLeft: 6,
    },
  ],
  Friday: [
    {
      id: "fri-6-conditioning",
      time: "6:00 AM",
      title: "Engine Builder",
      level: "High",
      coach: "Maya Singh",
      duration: "45 min",
      spotsLeft: 5,
    },
    {
      id: "fri-17-hypertrophy",
      time: "5:00 PM",
      title: "Upper Body Pump",
      level: "Medium",
      coach: "Mike Chen",
      duration: "60 min",
      spotsLeft: 4,
    },
  ],
  Saturday: [
    {
      id: "sat-9-team",
      time: "9:00 AM",
      title: "Team Conditioning",
      level: "High",
      coach: "Coaching Team",
      duration: "60 min",
      spotsLeft: 12,
    },
  ],
  Sunday: [
    {
      id: "sun-10-recovery",
      time: "10:00 AM",
      title: "Recovery & Mobility Lab",
      level: "Low",
      coach: "Diego Morales",
      duration: "45 min",
      spotsLeft: 15,
    },
  ],
};

export default function ClassesPage() {
  const [selectedDay, setSelectedDay] = useState<Day>("Monday");
  const [bookingClass, setBookingClass] = useState<ClassItem | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const { isSignedIn } = useUser();
  const router = useRouter();

  const classesForDay = SCHEDULE[selectedDay];

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
        {classesForDay.map((item) => (
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
