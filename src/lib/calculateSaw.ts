import type { Product, SAWResult, Weights } from "@/app/types";

/**
 * Jalankan algoritma Simple Additive Weighting untuk menghitung ranking produk.
 * Langkah-langkahnya:
 * 1. Cari nilai maksimum (benefit) & minimum (cost) untuk normalisasi matriks.
 * 2. Normalisasikan setiap kriteria sesuai jenisnya (benefit atau cost).
 * 3. Hitung skor akhir dengan mengalikan bobot dan menjumlahkan seluruh kriteria.
 * 4. Urutkan produk dari skor tertinggi ke terendah untuk mendapatkan peringkat.
 */
export function calculateSAWRanking(products: Product[], weights: Weights): SAWResult[] {
  if (products.length === 0) {
    return [];
  }

  const profitMax = Math.max(...products.map((product) => product.profit));
  const salesMax = Math.max(...products.map((product) => product.sales));
  const costMin = Math.min(...products.map((product) => product.cost));

  const weightFactor = {
    profit: weights.profit / 100,
    sales: weights.sales / 100,
    cost: weights.cost / 100,
  } satisfies Record<keyof Weights, number>;

  const scoredProducts = products.map((product) => {
    const normalizedProfit = profitMax === 0 ? 0 : product.profit / profitMax;
    const normalizedSales = salesMax === 0 ? 0 : product.sales / salesMax;
    const normalizedCost = product.cost === 0 ? 1 : costMin === 0 ? 1 : costMin / product.cost;

    const score =
      normalizedProfit * weightFactor.profit +
      normalizedSales * weightFactor.sales +
      normalizedCost * weightFactor.cost;

    return { product, score } satisfies { product: Product; score: number };
  });

  return scoredProducts
    .sort((first, second) => second.score - first.score)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}
