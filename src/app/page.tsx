"use client";

import type { JSX } from "react";

import { FooterPanel } from "./components/FooterPanel";
import { ProductPanel } from "./components/ProductPanel";
import { RankingPanel } from "./components/RankingPanel";
import { UsersPanel } from "./components/UsersPanel";
import { WeightsPanel } from "./components/WeightsPanel";
import { useSawDashboard } from "./hooks/useSawDashboard";
import { useUserProfile } from "./hooks/useUserProfile";

export default function HomePage(): JSX.Element {
  const {
    user,
    isLoading: isLoadingUser,
    error: userError,
    logout,
  } = useUserProfile();

  const {
    weights,
    products,
    formValues,
    formError,
    rankings,
    isResultStale,
    isLoading,
    loadError,
    isSavingWeights,
    isSubmittingProduct,
    deletingProductId,
    isWeightValid,
    isFormValid,
    hasProducts,
    canCalculate,
    totalWeightDisplay,
    formatNumber,
    formatScore,
    handleWeightChange,
    handleFormValueChange,
    handleProductSubmit,
    handleDeleteProduct,
    handleCalculateRanking,
    isUserAuthenticated,
  } = useSawDashboard({ currentUserId: user?.id ?? null });

  const productAuthMessage = isUserAuthenticated
    ? null
    : isLoadingUser
    ? "Memeriksa sesi pengguna..."
    : "Masuk terlebih dahulu untuk menambahkan dan mengelola produk.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#113a7f] via-[#1d4d9f] to-[#f0f6ff] text-[#0a1d46]">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="rounded-3xl border border-[#9bb8e8] bg-white/60 p-4 text-sm font-semibold text-[#1d3f7a] backdrop-blur">
            Memuat data terbaru...
          </div>
        )}

        {loadError && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-4 text-sm font-semibold text-rose-700 backdrop-blur">
            {loadError}
          </div>
        )}

        <header className="rounded-3xl bg-gradient-to-br from-white/70 via-white/40 to-white/20 p-6 shadow-xl shadow-[#2f7bff1f] ring-1 ring-white/50 backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#0a1d46] sm:text-3xl">
                Prioritas Produk UMKM · UMKM CEPOKO
              </h1>
              <p className="mt-1 max-w-2xl text-sm font-medium text-slate-800 sm:text-base">
                Sesuaikan bobot kriteria, kelola daftar produk, lalu hitung peringkat otomatis untuk menentukan prioritas pengembangan produk.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-[#3560a0]">
              <span className="rounded-full border border-[#9bb8e8] bg-white/60 px-3 py-1 font-semibold text-[#1d3f7a]">UMKM</span>
              <span className="rounded-full border border-[#9bb8e8] bg-white/60 px-3 py-1 font-semibold text-[#1d3f7a]">CEPOKO</span>
              <span className="rounded-full border border-[#9bb8e8] bg-white/60 px-3 py-1 font-semibold text-[#1d3f7a]">Produk Prioritas</span>
            </div>
          </div>
        </header>

        <UsersPanel
          user={user}
          isLoading={isLoadingUser}
          error={userError}
          onLogout={logout}
        />

        <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <WeightsPanel
            weights={weights}
            totalWeightDisplay={totalWeightDisplay}
            isWeightValid={isWeightValid}
            onWeightChange={handleWeightChange}
            isSaving={isSavingWeights}
            isLoading={isLoading}
          />
          <ProductPanel
            products={products}
            formValues={formValues}
            formError={formError}
            isFormValid={isFormValid}
            onFormSubmit={handleProductSubmit}
            onFormValueChange={handleFormValueChange}
            onDeleteProduct={handleDeleteProduct}
            formatNumber={formatNumber}
            isSubmitting={isSubmittingProduct}
            deletingProductId={deletingProductId}
            isLoading={isLoading}
            isUserAuthenticated={isUserAuthenticated}
            authMessage={productAuthMessage}
          />
        </section>

        <RankingPanel
          rankings={rankings}
          canCalculate={canCalculate}
          hasProducts={hasProducts}
          isResultStale={isResultStale}
          onCalculate={handleCalculateRanking}
          formatScore={formatScore}
        />

        <FooterPanel />
      </main>
    </div>
  );
}
