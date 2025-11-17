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

  const trainers = await prisma.trainer.findMany({
    include: { classes: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ trainers });
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const { name } = body as { name?: string };

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const trainer = await prisma.trainer.create({
    data: { name: name.trim() },
  });

  return NextResponse.json({ trainer }, { status: 201 });
}
