"use client";

import type { ChangeEvent, FormEvent, JSX } from "react";
import type { Product, ProductFormValues } from "../types";

export type ProductPanelProps = {
  products: Product[];
  formValues: ProductFormValues;
  formError: string | null;
  isFormValid: boolean;
  onFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFormValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDeleteProduct: (productId: string) => void;
  formatNumber: (value: number) => string;
};

export function ProductPanel({
  products,
  formValues,
  formError,
  isFormValid,
  onFormSubmit,
  onFormValueChange,
  onDeleteProduct,
  formatNumber,
}: ProductPanelProps): JSX.Element {
  const hasProducts = products.length > 0;

  return (
    <div className="rounded-3xl bg-slate-900/60 p-6 shadow-xl ring-1 ring-slate-800 backdrop-blur">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Panel Manajemen Produk</h2>
          <p className="mt-1 text-sm text-slate-300">
            Tambahkan produk baru, lengkapi data numerik, dan kelola daftar kandidat prioritas.
          </p>
        </div>
        <span className="text-xs uppercase tracking-wide text-slate-500">
          Total Produk: {products.length}
        </span>
      </div>

      <form
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={onFormSubmit}
      >
        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-sm font-medium text-slate-300">Nama Produk</span>
          <input
            type="text"
            name="name"
            placeholder="Contoh: Kopi Susu Kekinian"
            value={formValues.name}
            onChange={onFormValueChange}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-base text-white shadow-inner focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">Keuntungan</span>
          <input
            type="number"
            name="profit"
            inputMode="decimal"
            min={0}
            step="any"
            value={formValues.profit}
            onChange={onFormValueChange}
            placeholder="Rp"
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-base text-white shadow-inner focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">Jumlah Penjualan</span>
          <input
            type="number"
            name="sales"
            inputMode="decimal"
            min={0}
            step="any"
            value={formValues.sales}
            onChange={onFormValueChange}
            placeholder="Unit"
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-base text-white shadow-inner focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">Biaya Produksi</span>
          <input
            type="number"
            name="cost"
            inputMode="decimal"
            min={0}
            step="any"
            value={formValues.cost}
            onChange={onFormValueChange}
            placeholder="Rp"
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-base text-white shadow-inner focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
        </label>

        <div className="sm:col-span-2 lg:col-span-4">
          {formError ? (
            <p className="mb-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              {formError}
            </p>
          ) : (
            <p className="mb-3 text-xs text-slate-400">
              Isi seluruh field di atas lalu klik tambah produk. Nilai numerik dapat menggunakan desimal.
            </p>
          )}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto ${
              isFormValid
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30 hover:bg-sky-400 focus-visible:outline-sky-500"
                : "cursor-not-allowed bg-slate-800 text-slate-500"
            }`}
          >
            <span>Tambah Produk</span>
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
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
        <div className="max-h-72 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900/80 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Nama Produk</th>
                <th className="px-4 py-3 text-right">Keuntungan</th>
                <th className="px-4 py-3 text-right">Penjualan</th>
                <th className="px-4 py-3 text-right">Biaya Produksi</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.map((product) => (
                <tr key={product.id} className="bg-slate-900/40 text-slate-200">
                  <td className="px-4 py-3 text-sm font-medium">
                    <p>{product.name}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    Rp&nbsp;{formatNumber(product.profit)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatNumber(product.sales)} unit
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    Rp&nbsp;{formatNumber(product.cost)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteProduct(product.id)}
                      className="inline-flex items-center justify-center rounded-lg border border-transparent p-2 text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-rose-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
                      aria-label={`Hapus ${product.name}`}
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
                        <path d="M3 6h18" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {!hasProducts && (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-sm text-slate-400"
                    colSpan={5}
                  >
                    Belum ada produk terdaftar. Tambahkan minimal satu produk untuk memulai perhitungan.
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
