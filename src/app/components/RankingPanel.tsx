"use client";

import type { JSX } from "react";
import type { SAWResult } from "../types";

export type RankingPanelProps = {
  rankings: SAWResult[];
  canCalculate: boolean;
  hasProducts: boolean;
  isResultStale: boolean;
  onCalculate: () => void;
  formatScore: (value: number) => string;
};

export function RankingPanel({
  rankings,
  canCalculate,
  hasProducts,
  isResultStale,
  onCalculate,
  formatScore,
}: RankingPanelProps): JSX.Element {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-white/65 via-white/35 to-white/15 p-6 shadow-xl shadow-[#2f7bff1f] ring-1 ring-white/45 backdrop-blur-xl">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0a1d46]">Panel Hasil Peringkat</h2>
          <p className="mt-1 text-sm font-medium text-slate-800">
            Klik tombol di bawah untuk menjalankan kalkulasi SAW dan lihat prioritas produk berdasarkan skor akhir.
          </p>
        </div>
        <button
          type="button"
          onClick={onCalculate}
          disabled={!canCalculate}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto ${
            canCalculate
              ? "bg-[#2ecbb0] text-[#063a32] shadow-lg shadow-[#2ecbb033] hover:bg-[#21b29b] focus-visible:outline-[#2ecbb0]"
              : "cursor-not-allowed bg-[#d6f5ee] text-[#7dad9f]"
          }`}
        >
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
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
          <span>Hitung &amp; Tampilkan Peringkat</span>
        </button>
      </div>

      {!canCalculate && (
        <p className="mt-3 text-xs font-semibold text-slate-800">
          Pastikan total bobot bernilai 100% dan minimal satu produk tersedia untuk mengaktifkan kalkulasi.
        </p>
      )}

      {isResultStale && hasProducts && (
        <div className="mt-4 rounded-xl border border-[#f7b74066] bg-white/75 px-4 py-3 text-sm font-semibold text-[#b6801a] backdrop-blur">
          Data terbaru belum dihitung. Tekan tombol kalkulasi untuk memperbarui peringkat.
        </div>
      )}

      <div className="mt-6 space-y-4 md:hidden">
        {rankings.length > 0 ? (
          rankings.map((result) => (
            <div
              key={result.product.id}
              className="rounded-2xl border border-white/35 bg-white/35 p-4 shadow-lg shadow-[#2f7bff1f] backdrop-blur"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-800">
                    Peringkat
                  </p>
                  <p className="text-2xl font-bold text-[#1d3f7a]">#{result.rank}</p>
                </div>
                <span className="rounded-full border border-[#9bb8e8] bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1d3f7a]">
                  Skor&nbsp;{formatScore(result.score)}
                </span>
              </div>
              <p className="mt-4 text-base font-semibold text-[#0a1d46]">
                {result.product.name}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-white/35 bg-white/25 p-4 text-center text-sm font-semibold text-slate-800 backdrop-blur">
            Belum ada hasil yang dapat ditampilkan. Tambahkan produk dan lakukan kalkulasi untuk melihat peringkat.
          </div>
        )}
      </div>

      <div className="mt-6 hidden overflow-hidden rounded-2xl border border-white/35 bg-white/25 backdrop-blur-lg md:block">
        <div className="max-h-96 overflow-x-auto">
          <table className="min-w-full divide-y divide-white/25 text-sm text-[#0a1d46]">
            <thead className="bg-white/40 text-left text-xs font-semibold uppercase tracking-wide text-[#1d3f7a] backdrop-blur">
              <tr>
                <th className="px-4 py-3">Peringkat</th>
                <th className="px-4 py-3">Nama Produk</th>
                <th className="px-4 py-3 text-right">Skor Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {rankings.map((result) => (
                <tr key={result.product.id} className="bg-white/35 text-[#0a1d46] backdrop-blur">
                  <td className="px-4 py-3 text-sm font-bold text-[#1d3f7a]">
                    #{result.rank}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#0a1d46]">
                    {result.product.name}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-[#2f7bff]">
                    {formatScore(result.score)}
                  </td>
                </tr>
              ))}
              {rankings.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-sm text-slate-800"
                    colSpan={3}
                  >
                    Belum ada hasil yang dapat ditampilkan. Tambahkan produk dan lakukan kalkulasi untuk melihat peringkat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
