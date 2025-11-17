import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const classes = await prisma.gymClass.findMany({
      include: {
        trainer: true,
        bookings: true,
      },
      orderBy: [
        { dayOfWeek: "asc" },
        { startTime: "asc" },
      ],
    });

    return NextResponse.json({ classes });
  } catch (error) {
    console.error("Error loading classes", error);
    return NextResponse.json({ error: "Failed to load classes" }, { status: 500 });
  }
}
