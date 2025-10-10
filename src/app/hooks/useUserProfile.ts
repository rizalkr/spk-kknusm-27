"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@/app/types";

const STORAGE_KEY = "cepoko-auth" as const;

type StoredSession = {
  userId: string;
};

type FetchUserResponse = {
  user?: User;
  error?: string;
};

type UseUserProfileReturn = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  logout: () => void;
  refresh: () => Promise<void>;
};

const readStoredSession = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredSession | null;
    if (parsed && typeof parsed.userId === "string" && parsed.userId.length > 0) {
      return parsed.userId;
    }
  } catch (error) {
    console.error("Failed to parse stored session", error);
  }

  window.localStorage.removeItem(STORAGE_KEY);
  return null;
};

const clearStoredSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
};

export function useUserProfile(): UseUserProfileReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const fetchProfile = useCallback(
    async (userId: string) => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/users/${userId}`, { cache: "no-store" });
        const payload = (await response.json().catch(() => ({}))) as FetchUserResponse;

        if (response.status === 404) {
          setUser(null);
          setError(payload.error ?? "Pengguna tidak ditemukan.");
          clearStoredSession();
          setSessionUserId(null);
          return;
        }

        if (!response.ok) {
          throw new Error(payload.error ?? "Gagal memuat profil pengguna.");
        }

        if (!payload.user) {
          throw new Error("Respon server tidak sesuai.");
        }

        setUser(payload.user);
        setError(null);
      } catch (err) {
        console.error("Failed to load user profile", err);
        setUser(null);
        const message =
          err instanceof Error ? err.message : "Terjadi kendala saat memuat profil pengguna.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedUserId = readStoredSession();
    setSessionUserId(storedUserId);
    setHasInitialized(true);
  }, []);

  useEffect(() => {
    if (!hasInitialized) {
      return;
    }

    if (!sessionUserId) {
      setUser(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    void fetchProfile(sessionUserId);
  }, [fetchProfile, hasInitialized, sessionUserId]);

  const logout = useCallback(() => {
    clearStoredSession();
    setSessionUserId(null);
    setUser(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    if (!sessionUserId) {
      setUser(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    await fetchProfile(sessionUserId);
  }, [fetchProfile, sessionUserId]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated: Boolean(user),
    logout,
    refresh,
  };
}
