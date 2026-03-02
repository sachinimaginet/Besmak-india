"use client";

import { useSession } from "next-auth/react";

export function useAdmin() {
  const { data: session, status } = useSession();
  
  const isAdmin = !!session?.user;
  const isLoading = status === "loading";

  return {
    isAdmin,
    isLoading,
    session
  };
}
