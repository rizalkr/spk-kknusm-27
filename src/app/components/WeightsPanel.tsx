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
    <div className="rounded-3xl bg-slate-900/60 p-6 shadow-xl ring-1 ring-slate-800 backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Panel Bobot Kriteria</h2>
          <p className="mt-1 text-sm text-slate-300">
            Masukkan bobot (%) untuk setiap kriteria. Total bobot wajib sama dengan 100.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            isWeightValid
              ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/40"
              : "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/40"
          }`}
        >
          Total: {totalWeightDisplay}%
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">
            Keuntungan <span className="text-xs text-slate-500">(Benefit)</span>
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step={1}
            value={weights.profit}
            onChange={onWeightChange("profit")}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-base font-medium text-white shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">
            Jumlah Penjualan <span className="text-xs text-slate-500">(Benefit)</span>
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step={1}
            value={weights.sales}
            onChange={onWeightChange("sales")}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-base font-medium text-white shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">
            Biaya Produksi <span className="text-xs text-slate-500">(Cost)</span>
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step={1}
            value={weights.cost}
            onChange={onWeightChange("cost")}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-base font-medium text-white shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </label>
      </div>

      <p
        className={`mt-4 text-sm font-medium ${
          isWeightValid ? "text-emerald-400" : "text-amber-300"
        }`}
      >
        {isWeightValid
          ? "Bobot valid. Anda siap menghitung peringkat produk."
          : `Total bobot harus 100%. Saat ini ${totalWeightDisplay}%.`}
      </p>
    </div>
  );
}
