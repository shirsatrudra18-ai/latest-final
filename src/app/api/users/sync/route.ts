import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Trigger a read from Clerk so we fail early if user is invalid
  await clerkClient.users.getUser(userId);

  await prisma.user.upsert({
    where: { id: userId },
    create: { id: userId },
    update: {},
  });

  return NextResponse.json({ ok: true });
}
