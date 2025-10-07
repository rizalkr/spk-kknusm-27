"use client";

import type { ChangeEvent, JSX } from "react";
import type { Weights } from "../types";

export type WeightsPanelProps = {
  weights: Weights;
  totalWeightDisplay: string;
  isWeightValid: boolean;
  onWeightChange: (
    key: keyof Weights
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
};

export function WeightsPanel({
  weights,
  totalWeightDisplay,
  isWeightValid,
  onWeightChange,
}: WeightsPanelProps): JSX.Element {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-white/65 via-white/35 to-white/15 p-6 shadow-xl shadow-[#2f7bff1f] ring-1 ring-white/45 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#0a1d46]">Panel Bobot Kriteria</h2>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Masukkan bobot (%) untuk setiap kriteria. Total bobot wajib sama dengan 100.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
            isWeightValid
              ? "bg-[#d6f5ee] text-[#0f6f60] ring-1 ring-[#69dfc6]"
              : "bg-[#fff4d6] text-[#b6801a] ring-1 ring-[#f7b74066]"
          }`}
        >
          Total: {totalWeightDisplay}%
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-[#0a1d46]">
            Keuntungan <span className="text-xs font-medium text-[#7a94bf]">(Benefit)</span>
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step={1}
            value={weights.profit}
            onChange={onWeightChange("profit")}
            className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-2.5 text-base font-medium text-[#0a1d46] shadow-inner focus:border-[#2f7bff] focus:outline-none focus:ring-2 focus:ring-[#6bb6ff]"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-[#0a1d46]">
            Jumlah Penjualan <span className="text-xs font-medium text-[#7a94bf]">(Benefit)</span>
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step={1}
            value={weights.sales}
            onChange={onWeightChange("sales")}
            className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-2.5 text-base font-medium text-[#0a1d46] shadow-inner focus:border-[#2f7bff] focus:outline-none focus:ring-2 focus:ring-[#6bb6ff]"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-[#0a1d46]">
            Biaya Produksi <span className="text-xs font-medium text-[#7a94bf]">(Cost)</span>
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step={1}
            value={weights.cost}
            onChange={onWeightChange("cost")}
            className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-2.5 text-base font-medium text-[#0a1d46] shadow-inner focus:border-[#2f7bff] focus:outline-none focus:ring-2 focus:ring-[#6bb6ff]"
          />
        </label>
      </div>

      <p
        className={`mt-4 text-sm font-semibold ${
          isWeightValid ? "text-[#1f6f65]" : "text-[#b6801a]"
        }`}
      >
        {isWeightValid
          ? "Bobot valid. Anda siap menghitung peringkat produk."
          : `Total bobot harus 100%. Saat ini ${totalWeightDisplay}%.`}
      </p>
    </div>
  );
}
