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
    <div className="rounded-3xl border border-blue-200 bg-white p-6 shadow-lg">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-blue-900">Panel Hasil Peringkat</h2>
          <p className="mt-1 text-sm text-blue-700">
            Klik tombol di bawah untuk menjalankan kalkulasi SAW dan lihat prioritas produk berdasarkan skor akhir.
          </p>
        </div>
        <button
          type="button"
          onClick={onCalculate}
          disabled={!canCalculate}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
            canCalculate
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 focus-visible:outline-blue-600"
              : "cursor-not-allowed bg-blue-100 text-blue-300"
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
        <p className="mt-3 text-xs text-blue-700">
          Pastikan total bobot bernilai 100% dan minimal satu produk tersedia untuk mengaktifkan kalkulasi.
        </p>
      )}

      {isResultStale && hasProducts && (
        <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-blue-900">
          Data terbaru belum dihitung. Tekan tombol kalkulasi untuk memperbarui peringkat.
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-blue-200">
        <div className="max-h-96 overflow-x-auto">
          <table className="min-w-full divide-y divide-blue-100 text-sm">
            <thead className="bg-blue-50 text-left text-xs uppercase tracking-wide text-blue-700">
              <tr>
                <th className="px-4 py-3">Peringkat</th>
                <th className="px-4 py-3">Nama Produk</th>
                <th className="px-4 py-3 text-right">Skor Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {rankings.map((result) => (
                <tr
                  key={result.product.id}
                  className={`text-blue-900 transition hover:bg-blue-50 ${
                    result.rank === 1 ? "bg-cyan-50" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-sm font-semibold">
                    #{result.rank}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {result.product.name}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-cyan-600">
                    {formatScore(result.score)}
                  </td>
                </tr>
              ))}
              {rankings.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-sm text-blue-700"
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
