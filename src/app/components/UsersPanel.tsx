"use client";

import Link from "next/link";
import type { JSX } from "react";
import type { User } from "../types";

export type UsersPanelProps = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  onLogout?: () => void;
};

const ROLE_LABELS: Record<string, string> = {
  member: "Anggota",
  admin: "Admin",
  mentor: "Mentor",
};

const formatRole = (role: string): string => ROLE_LABELS[role] ?? role;

export function UsersPanel({ user, isLoading, error, onLogout }: UsersPanelProps): JSX.Element {
  const handleLogout = () => {
    if (typeof onLogout === "function") {
      onLogout();
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-white/65 via-white/35 to-white/15 p-6 shadow-xl shadow-[#2f7bff1f] ring-1 ring-white/45 backdrop-blur-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0a1d46]">Profil Pengguna</h2>
          <p className="mt-1 text-sm font-medium text-slate-800">
            Lihat informasi akun yang sedang aktif dan perannya dalam pengambilan keputusan UMKM.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#9bb8e8] bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1d3f7a]">
          {user ? "Akun Aktif" : isLoading ? "Memeriksa sesi" : "Belum Masuk"}
        </span>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm font-semibold text-rose-700 backdrop-blur">
          {error}
        </div>
      )}

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-4 w-48 animate-pulse rounded-full bg-white/40" />
            <div className="h-24 animate-pulse rounded-2xl bg-white/30" />
          </div>
        ) : user ? (
          <div className="rounded-2xl border border-white/35 bg-white/40 p-6 shadow-lg shadow-[#2f7bff1f] backdrop-blur">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#3560a0]">
                  Nama Pengguna
                </p>
                <h3 className="text-xl font-bold text-[#0a1d46]">{user.name}</h3>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#9bb8e8] bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1d3f7a]">
                {formatRole(user.role)}
              </span>
            </div>
            <dl className="mt-6 grid gap-4 text-sm font-semibold text-[#1d3f7a] sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-800">Email</dt>
                <dd className="mt-1 text-base">{user.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-800">Status</dt>
                <dd className="mt-1 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/70 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Terautentikasi
                </dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-800">
                Kelola sesi Anda
              </p>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-[#ff5c8a3d] bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#c03e62] shadow-lg shadow-[#ff5c8a26] transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5c8a]"
              >
                Keluar
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" x2="3" y1="12" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/35 bg-white/35 p-6 text-center shadow-lg shadow-[#2f7bff1f] backdrop-blur">
            <p className="text-sm font-semibold text-slate-800">
              Belum ada sesi yang aktif. Masuk untuk menyimpan preferensi dan riwayat perhitungan.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2ecbb0] px-4 py-3 text-sm font-bold text-[#063a32] shadow-lg shadow-[#2ecbb033] transition hover:bg-[#21b29b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2ecbb0] sm:w-auto"
            >
              Masuk ke Akun
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
