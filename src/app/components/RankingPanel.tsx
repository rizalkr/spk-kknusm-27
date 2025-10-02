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
    <div className="rounded-3xl bg-slate-900/60 p-6 shadow-xl ring-1 ring-slate-800 backdrop-blur">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Panel Hasil Peringkat</h2>
          <p className="mt-1 text-sm text-slate-300">
            Klik tombol di bawah untuk menjalankan kalkulasi SAW dan lihat prioritas produk berdasarkan skor akhir.
          </p>
        </div>
        <button
          type="button"
          onClick={onCalculate}
          disabled={!canCalculate}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
            canCalculate
              ? "bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 focus-visible:outline-emerald-500"
              : "cursor-not-allowed bg-slate-800 text-slate-500"
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
        <p className="mt-3 text-xs text-amber-300">
          Pastikan total bobot bernilai 100% dan minimal satu produk tersedia untuk mengaktifkan kalkulasi.
        </p>
      )}

      {isResultStale && hasProducts && (
        <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Data terbaru belum dihitung. Tekan tombol kalkulasi untuk memperbarui peringkat.
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
        <div className="max-h-96 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900/80 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Peringkat</th>
                <th className="px-4 py-3">Nama Produk</th>
                <th className="px-4 py-3 text-right">Skor Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rankings.map((result) => (
                <tr key={result.product.id} className="bg-slate-900/40 text-slate-200">
                  <td className="px-4 py-3 text-sm font-semibold">
                    #{result.rank}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {result.product.name}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-400">
                    {formatScore(result.score)}
                  </td>
                </tr>
              ))}
              {rankings.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-sm text-slate-400"
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
