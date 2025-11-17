import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { classId, date } = body as { classId?: string; date?: string };

  if (!classId || !date) {
    return NextResponse.json({ error: "classId and date are required" }, { status: 400 });
  }

  const bookingDate = new Date(date);
  if (isNaN(bookingDate.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  // Ensure user exists
  await prisma.user.upsert({
    where: { id: userId },
    create: { id: userId },
    update: {},
  });

  // NOTE: For now we assume the class already exists in the GymClass table.
  // Later the admin panel will manage these records.

  const booking = await prisma.classBooking.create({
    data: {
      userId,
      classId,
      date: bookingDate,
    },
  });

  return NextResponse.json({ booking }, { status: 201 });
}
