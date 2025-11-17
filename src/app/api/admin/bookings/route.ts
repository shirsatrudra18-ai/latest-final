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

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const bookings = await prisma.classBooking.findMany({
    include: {
      user: true,
      gymClass: {
        include: {
          trainer: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ bookings });
}
