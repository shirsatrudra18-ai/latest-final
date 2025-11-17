import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch Clerk user so we can store profile info
  const user = await clerkClient.users.getUser(userId);
  const email = user.primaryEmailAddress?.emailAddress ?? null;
  const fullName = user.fullName ?? user.username ?? null;

  await prisma.user.upsert({
    where: { id: userId },
    create: {
      id: userId,
      email: email ?? undefined,
      fullName: fullName ?? undefined,
    },
    update: {
      email: email ?? undefined,
      fullName: fullName ?? undefined,
    },
  });

  return NextResponse.json({ ok: true });
}
