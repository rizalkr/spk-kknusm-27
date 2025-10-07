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
    <div className="rounded-3xl border border-blue-200 bg-white p-6 shadow-lg">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-blue-900">Panel Manajemen Produk</h2>
          <p className="mt-1 text-sm text-blue-700">
            Tambahkan produk baru, lengkapi data numerik, dan kelola daftar kandidat prioritas.
          </p>
        </div>
        <span className="text-xs uppercase tracking-wide text-blue-700">
          Total Produk: {products.length}
        </span>
      </div>

      <form
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={onFormSubmit}
      >
        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-lg font-bold text-blue-900">Nama Produk</span>
          <input
            type="text"
            name="name"
            placeholder="Contoh: Kopi Susu Kekinian"
            value={formValues.name}
            onChange={onFormValueChange}
            className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-base text-blue-900 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-lg font-bold text-blue-800">Keuntungan</span>
          <input
            type="number"
            name="profit"
            inputMode="decimal"
            min={0}
            step="any"
            value={formValues.profit}
            onChange={onFormValueChange}
            placeholder="Rp"
            className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-base text-blue-900 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-lg font-bold text-blue-800">Jumlah Penjualan</span>
          <input
            type="number"
            name="sales"
            inputMode="decimal"
            min={0}
            step="any"
            value={formValues.sales}
            onChange={onFormValueChange}
            placeholder="Unit"
            className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-base text-blue-900 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-lg font-bold text-blue-800">Biaya Produksi</span>
          <input
            type="number"
            name="cost"
            inputMode="decimal"
            min={0}
            step="any"
            value={formValues.cost}
            onChange={onFormValueChange}
            placeholder="Rp"
            className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-base text-blue-900 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <div className="sm:col-span-2 lg:col-span-4">
          {formError ? (
            <p className="mb-3 rounded-xl border border-amber-200 bg-amber-100 px-4 py-3 text-sm text-amber-800">
              {formError}
            </p>
          ) : (
            <p className="mb-3 text-xs text-blue-700">
              Isi seluruh field di atas lalu klik tambah produk. Nilai numerik dapat menggunakan desimal.
            </p>
          )}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto ${
              isFormValid
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 focus-visible:outline-blue-600"
                : "cursor-not-allowed bg-blue-100 text-blue-300"
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

      <div className="mt-6 overflow-hidden rounded-2xl border border-blue-200">
        <div className="max-h-72 overflow-x-auto">
          <table className="min-w-full divide-y divide-blue-100 text-sm">
            <thead className="bg-blue-50 text-left text-xs uppercase tracking-wide text-blue-700">
              <tr>
                <th className="px-4 py-3 font-bold">Nama Produk</th>
                <th className="px-4 py-3 text-right">Keuntungan</th>
                <th className="px-4 py-3 text-right">Penjualan</th>
                <th className="px-4 py-3 text-right">Biaya Produksi</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {products.map((product) => (
                <tr key={product.id} className="text-blue-900 transition hover:bg-blue-50">
                  <td className="px-4 py-3 text-lg font-bold">
                    <p>{product.name}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-800">
                    Rp&nbsp;{formatNumber(product.profit)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-800">
                    {formatNumber(product.sales)} unit
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-800">
                    Rp&nbsp;{formatNumber(product.cost)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteProduct(product.id)}
                      className="inline-flex items-center justify-center rounded-lg p-2 text-lg font-bold text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 bg-red-500 hover:bg-red-600"
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
                    className="px-4 py-6 text-center text-sm text-blue-700"
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
