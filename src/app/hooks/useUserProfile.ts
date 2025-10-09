"use client";

import { useEffect, useState } from "react";
import type { User } from "@/app/types";

type FetchUsersResponse = {
  users?: User[];
  error?: string;
};

type UseUserProfileReturn = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

export function useUserProfile(): UseUserProfileReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/users", { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as FetchUsersResponse;

        if (!response.ok) {
          throw new Error(payload.error ?? "Gagal memuat profil pengguna.");
        }

        const nextUser = Array.isArray(payload.users) && payload.users.length > 0
          ? payload.users[0]!
          : null;

        setUser(nextUser);
        setError(null);
      } catch (err) {
        console.error("Failed to load user profile", err);
        setUser(null);
        setError(
          err instanceof Error ? err.message : "Terjadi kendala saat memuat profil pengguna."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProfile();
  }, []);

  return {
    user,
    isLoading,
    error,
  };
}
