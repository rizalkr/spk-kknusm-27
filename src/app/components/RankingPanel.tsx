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
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0a1d46]">Panel Hasil Peringkat</h2>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Klik tombol di bawah untuk menjalankan kalkulasi SAW dan lihat prioritas produk berdasarkan skor akhir.
          </p>
        </div>
        <button
          type="button"
          onClick={onCalculate}
          disabled={!canCalculate}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
            canCalculate
              ? "bg-[#2ecbb0] text-[#063a32] shadow-lg shadow-[#2ecbb033] hover:bg-[#21b29b] focus-visible:outline-[#2ecbb0]"
              : "cursor-not-allowed bg-white/30 text-[#93a8cf]"
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
  <p className="mt-3 text-xs font-semibold text-[#b6801a]">
          Pastikan total bobot bernilai 100% dan minimal satu produk tersedia untuk mengaktifkan kalkulasi.
        </p>
      )}

      {isResultStale && hasProducts && (
  <div className="mt-4 rounded-xl border border-[#f7b74066] bg-white/75 px-4 py-3 text-sm font-semibold text-[#b6801a] backdrop-blur">
          Data terbaru belum dihitung. Tekan tombol kalkulasi untuk memperbarui peringkat.
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/35 bg-white/25 backdrop-blur-lg">
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
                    className="px-4 py-6 text-center text-sm text-[#7a94bf]"
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
