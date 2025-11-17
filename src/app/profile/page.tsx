import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/login?redirect=/profile");
  }

  const user = await currentUser();

  const bookings = await prisma.classBooking.findMany({
    where: { userId },
    include: {
      gymClass: {
        include: {
          trainer: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });

  const primaryEmail = user?.primaryEmailAddress?.emailAddress ?? "";
  const fullName = user?.fullName ?? user?.username ?? "";

  return (
    <main className="space-y-8 pb-16">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-zinc-50">Your Profile</h1>
        <p className="text-sm text-zinc-300">
          View your account information and upcoming class bookings.
        </p>

        <div className="mt-4 grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 text-sm md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs text-zinc-400">Name</p>
            <p className="font-medium text-zinc-50">{fullName || "Not set"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-zinc-400">Email</p>
            <p className="font-medium text-zinc-50">{primaryEmail || "Not set"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-zinc-400">User ID</p>
            <p className="font-mono text-xs text-zinc-300 break-all">{userId}</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-50">Your bookings</h2>
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
                  Trainer: {b.gymClass.trainer.name} · Level: {b.gymClass.level}
                </p>
              </div>
              <div className="text-xs text-zinc-400">
                Date: {new Date(b.date).toLocaleDateString()} · Time: {b.gymClass.startTime}
              </div>
            </div>
          ))}
          {bookings.length === 0 && (
            <p className="text-xs text-zinc-500">You have not booked any classes yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
