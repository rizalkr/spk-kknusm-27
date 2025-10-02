"use client";

import type { JSX } from "react";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ProductPanel } from "./components/ProductPanel";
import { RankingPanel } from "./components/RankingPanel";
import { WeightsPanel } from "./components/WeightsPanel";
import type {
  Product,
  ProductFormValues,
  SAWResult,
  Weights,
} from "./types";

const INITIAL_WEIGHTS: Weights = {
  profit: 40,
  sales: 40,
  cost: 20,
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prd-1",
    name: "Keripik Pisang Madina",
    profit: 7500000,
    sales: 1250,
    cost: 3200000,
  },
  {
    id: "prd-2",
    name: "Kopi Arabika Gayo",
    profit: 6800000,
    sales: 980,
    cost: 2800000,
  },
  {
    id: "prd-3",
    name: "Sambal Botol Andaliman",
    profit: 5200000,
    sales: 1410,
    cost: 2400000,
  },
];

const integerFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0,
});

const scoreFormatter = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

const generateProductId = (): string =>
  `prd-${Math.random().toString(36).slice(2, 7)}-${Date.now().toString(36)}`;

/**
 * Jalankan algoritma Simple Additive Weighting untuk menghitung ranking produk.
 * Langkah-langkahnya:
 * 1. Cari nilai maksimum (benefit) & minimum (cost) untuk normalisasi matriks.
 * 2. Normalisasikan setiap kriteria sesuai jenisnya (benefit atau cost).
 * 3. Hitung skor akhir dengan mengalikan bobot dan menjumlahkan seluruh kriteria.
 * 4. Urutkan produk dari skor tertinggi ke terendah untuk mendapatkan peringkat.
 */
const calculateSAWRanking = (products: Product[], weights: Weights): SAWResult[] => {
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
  };

  const scoredProducts = products.map((product) => {
    // Normalisasi kriteria benefit menggunakan nilai maksimum.
    const normalizedProfit = profitMax === 0 ? 0 : product.profit / profitMax;
    const normalizedSales = salesMax === 0 ? 0 : product.sales / salesMax;

    // Normalisasi kriteria cost menggunakan nilai minimum.
    const normalizedCost =
      product.cost === 0
        ? 1
        : costMin === 0
        ? 1
        : costMin / product.cost;

    const score =
      normalizedProfit * weightFactor.profit +
      normalizedSales * weightFactor.sales +
      normalizedCost * weightFactor.cost;

    return { product, score };
  });

  return scoredProducts
    .sort((first, second) => second.score - first.score)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
};

export default function HomePage(): JSX.Element {
  const [weights, setWeights] = useState<Weights>(INITIAL_WEIGHTS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [formValues, setFormValues] = useState<ProductFormValues>({
    name: "",
    profit: "",
    sales: "",
    cost: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [rankings, setRankings] = useState<SAWResult[]>(() =>
    calculateSAWRanking(INITIAL_PRODUCTS, INITIAL_WEIGHTS)
  );
  const [isResultStale, setIsResultStale] = useState<boolean>(false);

  const initialRenderRef = useRef<boolean>(true);

  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }

    if (products.length === 0) {
      setRankings([]);
      setIsResultStale(false);
      return;
    }

    setIsResultStale(true);
  }, [products, weights]);

  const totalWeight = useMemo(
    () => weights.profit + weights.sales + weights.cost,
    [weights]
  );

  const isWeightValid = useMemo(
    () => Math.abs(totalWeight - 100) < 1e-6,
    [totalWeight]
  );

  const isFormValid = useMemo(() => {
    if (formValues.name.trim().length < 3) {
      return false;
    }

    const numericFields = [formValues.profit, formValues.sales, formValues.cost];
    return numericFields.every((value) => {
      if (value.trim() === "") {
        return false;
      }

      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed > 0;
    });
  }, [formValues]);

  const handleWeightChange = (key: keyof Weights) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = event.target.value;
    const numericValue = rawValue === "" ? 0 : Number(rawValue);

    if (Number.isNaN(numericValue)) {
      return;
    }

    setWeights((previous) => ({
      ...previous,
      [key]: Math.max(0, numericValue),
    }));
  };

  const handleFormValueChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setFormValues((previous) => ({ ...previous, [name]: value }));
    setFormError(null);
  };

  const handleProductSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const trimmedName = formValues.name.trim();
    const profit = Number(formValues.profit);
    const sales = Number(formValues.sales);
    const cost = Number(formValues.cost);

    if (!trimmedName) {
      setFormError("Nama produk wajib diisi (min. 3 karakter).");
      return;
    }

    if (
      [profit, sales, cost].some(
        (value) => !Number.isFinite(value) || value <= 0
      )
    ) {
      setFormError(
        "Keuntungan, jumlah penjualan, dan biaya produksi harus berupa angka positif."
      );
      return;
    }

    const newProduct: Product = {
      id: generateProductId(),
      name: trimmedName,
      profit,
      sales,
      cost,
    };

    setProducts((previous) => [...previous, newProduct]);
    setFormValues({ name: "", profit: "", sales: "", cost: "" });
  };

  const handleDeleteProduct = (productId: string): void => {
    setProducts((previous) => previous.filter((product) => product.id !== productId));
  };

  const handleCalculateRanking = (): void => {
    const results = calculateSAWRanking(products, weights);
    setRankings(results);
    setIsResultStale(false);
  };

  const hasProducts = products.length > 0;
  const canCalculate = isWeightValid && hasProducts;
  const totalWeightDisplay = totalWeight.toFixed(2).replace(/\.00$/, ".0");
  const formatNumber = useCallback(
    (value: number) => integerFormatter.format(value),
    []
  );
  const formatScore = useCallback(
    (value: number) => scoreFormatter.format(value),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <header className="rounded-3xl bg-slate-900/60 p-6 shadow-xl ring-1 ring-slate-800 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Prioritas Produk UMKM · Metode SAW
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-300 sm:text-base">
                Sesuaikan bobot kriteria, kelola daftar produk, lalu hitung peringkat
                otomatis untuk menentukan prioritas pengembangan produk.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-slate-400">
              <span className="rounded-full border border-slate-700 px-3 py-1">Client-side</span>
              <span className="rounded-full border border-slate-700 px-3 py-1">Simple Additive Weighting</span>
              <span className="rounded-full border border-slate-700 px-3 py-1">Next.js · TSX</span>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <WeightsPanel
            weights={weights}
            totalWeightDisplay={totalWeightDisplay}
            isWeightValid={isWeightValid}
            onWeightChange={handleWeightChange}
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
      </main>
    </div>
  );
}
