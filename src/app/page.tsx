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

import { calculateSAWRanking } from "@/lib/calculateSaw";
import { ProductPanel } from "./components/ProductPanel";
import { RankingPanel } from "./components/RankingPanel";
import { WeightsPanel } from "./components/WeightsPanel";
import { FooterPanel } from "./components/FooterPanel";
import type {
  Product,
  ProductFormValues,
  SAWResult,
  Weights,
} from "./types";

const DEFAULT_WEIGHTS: Weights = {
  profit: 40,
  sales: 40,
  cost: 20,
};

const EMPTY_FORM_VALUES: ProductFormValues = {
  name: "",
  profit: "",
  sales: "",
  cost: "",
};

const integerFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0,
});

const scoreFormatter = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

export default function HomePage(): JSX.Element {
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);
  const [products, setProducts] = useState<Product[]>([]);
  const [formValues, setFormValues] = useState<ProductFormValues>(EMPTY_FORM_VALUES);
  const [formError, setFormError] = useState<string | null>(null);
  const [rankings, setRankings] = useState<SAWResult[]>([]);
  const [isResultStale, setIsResultStale] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isSavingWeights, setIsSavingWeights] = useState(false);

  const hasHydratedRef = useRef(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);

      try {
        const [productsResponse, weightsResponse] = await Promise.all([
          fetch("/api/products", { cache: "no-store" }),
          fetch("/api/weights", { cache: "no-store" }),
        ]);

        const productsPayload = await productsResponse.json().catch(() => ({} as { products?: Product[]; error?: string }));
        const weightsPayload = await weightsResponse.json().catch(() => ({} as { weights?: Weights; error?: string }));

        if (!productsResponse.ok) {
          throw new Error(productsPayload.error ?? "Gagal memuat data produk.");
        }

        if (!weightsResponse.ok) {
          throw new Error(weightsPayload.error ?? "Gagal memuat bobot kriteria.");
        }

        const fetchedProducts = Array.isArray(productsPayload.products)
          ? (productsPayload.products as Product[])
          : [];

        const fetchedWeights =
          weightsPayload.weights && typeof weightsPayload.weights === "object"
            ? (weightsPayload.weights as Weights)
            : DEFAULT_WEIGHTS;

        setProducts(fetchedProducts);
        setWeights(fetchedWeights);
        setRankings(calculateSAWRanking(fetchedProducts, fetchedWeights));
        setLoadError(null);
      } catch (error) {
        console.error("Failed to load initial data", error);
        setLoadError(
          error instanceof Error
            ? error.message
            : "Terjadi kendala saat memuat data awal aplikasi."
        );
        setProducts([]);
        setWeights(DEFAULT_WEIGHTS);
        setRankings([]);
      } finally {
        hasHydratedRef.current = true;
        setIsLoading(false);
      }
    };

    void loadInitialData();
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current) {
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

  const persistWeights = useCallback(async (nextWeights: Weights) => {
    try {
      setIsSavingWeights(true);
      const response = await fetch("/api/weights", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextWeights),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({} as { error?: string }));
        console.error(payload.error ?? "Gagal menyimpan bobot ke server.");
      }
    } catch (error) {
      console.error("Failed to persist weights", error);
    } finally {
      setIsSavingWeights(false);
    }
  }, []);

  const handleWeightChange = (key: keyof Weights) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = event.target.value;
    const numericValue = rawValue === "" ? 0 : Number(rawValue);

    if (Number.isNaN(numericValue)) {
      return;
    }

    setWeights((previous) => {
      const nextWeights = {
        ...previous,
        [key]: Math.max(0, numericValue),
      } satisfies Weights;

      if (hasHydratedRef.current) {
        void persistWeights(nextWeights);
      }

      return nextWeights;
    });
  };

  const handleFormValueChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setFormValues((previous) => ({ ...previous, [name]: value }));
    setFormError(null);
  };

  const handleProductSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmedName = formValues.name.trim();
      const profit = Number(formValues.profit);
      const sales = Number(formValues.sales);
      const cost = Number(formValues.cost);

      if (!trimmedName) {
        setFormError("Nama produk wajib diisi (min. 3 karakter).");
        return;
      }

      if ([profit, sales, cost].some((value) => !Number.isFinite(value) || value <= 0)) {
        setFormError(
          "Keuntungan, jumlah penjualan, dan biaya produksi harus berupa angka positif."
        );
        return;
      }

      setIsSubmittingProduct(true);

      try {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trimmedName,
            profit,
            sales,
            cost,
          }),
        });

        const payload = await response.json().catch(() => ({} as { product?: Product; error?: string }));

        if (!response.ok) {
          setFormError(payload.error ?? "Gagal menambahkan produk. Coba lagi.");
          return;
        }

        if (!payload.product) {
          throw new Error("Respon server tidak sesuai.");
        }

        setProducts((previous) => [...previous, payload.product as Product]);
        setFormValues(EMPTY_FORM_VALUES);
        setFormError(null);
      } catch (error) {
        console.error("Failed to submit product", error);
        setFormError("Terjadi kendala saat menambahkan produk. Coba lagi.");
      } finally {
        setIsSubmittingProduct(false);
      }
    },
    [formValues]
  );

  const handleDeleteProduct = useCallback(
    async (productId: string) => {
      setDeletingProductId(productId);

      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({} as { error?: string }));
          console.error(payload.error ?? "Gagal menghapus produk.");
          return;
        }

        setProducts((previous) => previous.filter((product) => product.id !== productId));
      } catch (error) {
        console.error("Failed to delete product", error);
      } finally {
        setDeletingProductId(null);
      }
    },
    []
  );

  const handleCalculateRanking = useCallback(() => {
    const results = calculateSAWRanking(products, weights);
    setRankings(results);
    setIsResultStale(false);
  }, [products, weights]);

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
