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
    <div className="rounded-3xl border border-blue-200 bg-white p-6 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-blue-900">Panel Bobot Kriteria</h2>
          <p className="mt-1 text-sm text-blue-700">
            Masukkan bobot (%) untuk setiap kriteria. Total bobot wajib sama dengan 100.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            isWeightValid
              ? "bg-cyan-100 text-cyan-800 ring-1 ring-cyan-200"
              : "bg-amber-100 text-amber-800 ring-1 ring-amber-200"
          }`}
        >
          Total: {totalWeightDisplay}%
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-blue-700">
            Keuntungan <span className="text-xs text-blue-600">(Benefit)</span>
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step={1}
            value={weights.profit}
            onChange={onWeightChange("profit")}
            className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-base font-medium text-blue-900 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-blue-700">
            Jumlah Penjualan <span className="text-xs text-blue-600">(Benefit)</span>
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step={1}
            value={weights.sales}
            onChange={onWeightChange("sales")}
            className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-base font-medium text-blue-900 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-blue-700">
            Biaya Produksi <span className="text-xs text-blue-600">(Cost)</span>
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step={1}
            value={weights.cost}
            onChange={onWeightChange("cost")}
            className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-base font-medium text-blue-900 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>

      <p
        className={`mt-4 text-sm font-medium ${
          isWeightValid ? "text-cyan-600" : "text-amber-600"
        }`}
      >
        {isWeightValid
          ? "Bobot valid. Anda siap menghitung peringkat produk."
          : `Total bobot harus 100%. Saat ini ${totalWeightDisplay}%.`}
      </p>
    </div>
  );
}
