import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const { userId } = auth();
  if (!userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const user = await clerkClient.users.getUser(userId);
  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

  if (!email || !adminEmail || email !== adminEmail) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { user };
}

const DAY_ENUM_BY_LABEL: Record<string, string> = {
  Monday: "MONDAY",
  Tuesday: "TUESDAY",
  Wednesday: "WEDNESDAY",
  Thursday: "THURSDAY",
  Friday: "FRIDAY",
  Saturday: "SATURDAY",
  Sunday: "SUNDAY",
};

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const classes = await prisma.gymClass.findMany({
    include: { trainer: true, bookings: true },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return NextResponse.json({ classes });
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const {
    dayLabel,
    title,
    category,
    level,
    startTime,
    durationMin,
    totalSlots,
    trainerId,
  } = body as {
    dayLabel?: string;
    title?: string;
    category?: string;
    level?: string;
    startTime?: string;
    durationMin?: number;
    totalSlots?: number;
    trainerId?: string;
  };

  if (!dayLabel || !DAY_ENUM_BY_LABEL[dayLabel]) {
    return NextResponse.json({ error: "dayLabel is required" }, { status: 400 });
  }
  if (!title || !category || !level || !startTime || !durationMin || !totalSlots || !trainerId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const gymClass = await prisma.gymClass.create({
    data: {
      dayOfWeek: DAY_ENUM_BY_LABEL[dayLabel] as unknown as typeof DAY_ENUM_BY_LABEL[keyof typeof DAY_ENUM_BY_LABEL],
      title: title.trim(),
      category: category.trim(),
      level: level.trim(),
      startTime: startTime.trim(),
      durationMin,
      totalSlots,
      trainerId,
    },
  });

  return NextResponse.json({ gymClass }, { status: 201 });
}
