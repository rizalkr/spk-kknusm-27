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
    <div className="rounded-3xl bg-gradient-to-br from-white/65 via-white/35 to-white/15 p-6 shadow-xl shadow-[#2f7bff1f] ring-1 ring-white/45 backdrop-blur-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0a1d46]">Panel Manajemen Produk</h2>
          <p className="mt-1 text-sm font-medium text-slate-800">
            Tambahkan produk baru, lengkapi data numerik, dan kelola daftar kandidat prioritas.
          </p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-800 sm:self-end sm:text-right">
          Total Produk: {products.length}
        </span>
      </div>

      <form
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={onFormSubmit}
      >
        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-sm font-semibold text-[#0a1d46]">Nama Produk</span>
          <input
            type="text"
            name="name"
            placeholder="Contoh: Kopi Susu Kekinian"
            value={formValues.name}
            onChange={onFormValueChange}
            className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-2.5 text-base text-[#0a1d46] shadow-inner focus:border-[#2f7bff] focus:outline-none focus:ring-2 focus:ring-[#6bb6ff]"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-[#0a1d46]">Keuntungan</span>
          <input
            type="number"
            name="profit"
            inputMode="decimal"
            min={0}
            step="any"
            value={formValues.profit}
            onChange={onFormValueChange}
            placeholder="Rp"
            className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-2.5 text-base text-[#0a1d46] shadow-inner focus:border-[#2f7bff] focus:outline-none focus:ring-2 focus:ring-[#6bb6ff]"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-[#0a1d46]">Jumlah Penjualan</span>
          <input
            type="number"
            name="sales"
            inputMode="decimal"
            min={0}
            step="any"
            value={formValues.sales}
            onChange={onFormValueChange}
            placeholder="Unit"
            className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-2.5 text-base text-[#0a1d46] shadow-inner focus:border-[#2f7bff] focus:outline-none focus:ring-2 focus:ring-[#6bb6ff]"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-[#0a1d46]">Biaya Produksi</span>
          <input
            type="number"
            name="cost"
            inputMode="decimal"
            min={0}
            step="any"
            value={formValues.cost}
            onChange={onFormValueChange}
            placeholder="Rp"
            className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-2.5 text-base text-[#0a1d46] shadow-inner focus:border-[#2f7bff] focus:outline-none focus:ring-2 focus:ring-[#6bb6ff]"
          />
        </label>

        <div className="sm:col-span-2 lg:col-span-4">
          {formError ? (
            <p className="mb-3 rounded-xl border border-[#f7b74066] bg-white/75 px-4 py-3 text-sm font-semibold text-[#b6801a] backdrop-blur">
              {formError}
            </p>
          ) : (
            <p className="mb-3 text-xs font-semibold text-slate-800">
              Isi seluruh field di atas lalu klik tambah produk. Nilai numerik dapat menggunakan desimal.
            </p>
          )}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto ${
              isFormValid
                ? "bg-[#2ecbb0] text-[#063a32] shadow-lg shadow-[#2ecbb033] hover:bg-[#21b29b] focus-visible:outline-[#2ecbb0]"
                : "cursor-not-allowed bg-[#d6f5ee] text-[#7dad9f]"
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

      <div className="mt-6 space-y-4 md:hidden">
        {hasProducts ? (
          products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-white/35 bg-white/35 p-4 shadow-lg shadow-[#2f7bff1f] backdrop-blur"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#0a1d46]">{product.name}</h3>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-800">
                    Produk Prioritas
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteProduct(product.id)}
                  className="inline-flex items-center justify-center rounded-lg border border-transparent p-2 text-slate-800 transition hover:border-[#ff5c8a4d] hover:bg-white/50 hover:text-[#ff5c8a] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#ff5c8a]"
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
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm font-semibold text-[#1d3f7a]">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-800">
                    Keuntungan
                  </dt>
                  <dd className="text-base">Rp&nbsp;{formatNumber(product.profit)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-800">
                    Penjualan
                  </dt>
                  <dd className="text-base">{formatNumber(product.sales)} unit</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-800">
                    Biaya Produksi
                  </dt>
                  <dd className="text-base">Rp&nbsp;{formatNumber(product.cost)}</dd>
                </div>
              </dl>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-white/35 bg-white/25 p-4 text-center text-sm font-semibold text-slate-800 backdrop-blur">
            Belum ada produk terdaftar. Tambahkan minimal satu produk untuk memulai perhitungan.
          </div>
        )}
      </div>

      <div className="mt-6 hidden overflow-hidden rounded-2xl border border-white/35 bg-white/25 backdrop-blur-lg md:block">
        <div className="max-h-72 overflow-x-auto">
          <table className="min-w-full divide-y divide-white/25 text-sm text-[#0a1d46]">
            <thead className="bg-white/40 text-left text-xs font-semibold uppercase tracking-wide text-[#1d3f7a] backdrop-blur">
              <tr>
                <th className="px-4 py-3 font-bold">Nama Produk</th>
                <th className="px-4 py-3 text-right">Keuntungan</th>
                <th className="px-4 py-3 text-right">Penjualan</th>
                <th className="px-4 py-3 text-right">Biaya Produksi</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {products.map((product) => (
                <tr key={product.id} className="bg-white/35 text-[#0a1d46] backdrop-blur">
                  <td className="px-4 py-3 text-sm font-semibold text-[#0a1d46]">
                    <p>{product.name}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-[#1d3f7a]">
                    Rp&nbsp;{formatNumber(product.profit)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-[#1d3f7a]">
                    {formatNumber(product.sales)} unit
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-[#1d3f7a]">
                    Rp&nbsp;{formatNumber(product.cost)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteProduct(product.id)}
                      className="inline-flex items-center justify-center rounded-lg border border-transparent p-2 text-slate-800 transition hover:border-[#ff5c8a4d] hover:bg-white/40 hover:text-[#ff5c8a] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#ff5c8a]"
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
                    className="px-4 py-6 text-center text-sm text-slate-800"
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
