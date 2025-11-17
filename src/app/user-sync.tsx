"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export function UserSync() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) return;

    fetch("/api/users/sync", { method: "POST" }).catch((err) => {
      console.error("Failed to sync user to database", err);
    });
  }, [isSignedIn]);

  return null;
}
