"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";

import type { Product, ProductFormValues, SAWResult, Weights } from "../types";
import { calculateSAWRanking } from "@/lib/calculateSaw";

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

type FetchProductsResponse = {
  products?: Product[];
  error?: string;
};

type FetchWeightsResponse = {
  weights?: Weights;
  error?: string;
};

type UseSawDashboardReturn = {
  weights: Weights;
  products: Product[];
  formValues: ProductFormValues;
  formError: string | null;
  rankings: SAWResult[];
  isResultStale: boolean;
  isLoading: boolean;
  loadError: string | null;
  isSavingWeights: boolean;
  isSubmittingProduct: boolean;
  deletingProductId: string | null;
  isWeightValid: boolean;
  isFormValid: boolean;
  hasProducts: boolean;
  canCalculate: boolean;
  totalWeightDisplay: string;
  formatNumber: (value: number) => string;
  formatScore: (value: number) => string;
  handleWeightChange: (key: keyof Weights) => (event: ChangeEvent<HTMLInputElement>) => void;
  handleFormValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleProductSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleDeleteProduct: (productId: string) => Promise<void>;
  handleCalculateRanking: () => void;
};

export function useSawDashboard(): UseSawDashboardReturn {
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);
  const [products, setProducts] = useState<Product[]>([]);
  const [formValues, setFormValues] = useState<ProductFormValues>(EMPTY_FORM_VALUES);
  const [formError, setFormError] = useState<string | null>(null);
  const [rankings, setRankings] = useState<SAWResult[]>([]);
  const [isResultStale, setIsResultStale] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSavingWeights, setIsSavingWeights] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const hasHydratedRef = useRef(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);

      try {
        const [productsResponse, weightsResponse] = await Promise.all([
          fetch("/api/products", { cache: "no-store" }),
          fetch("/api/weights", { cache: "no-store" }),
        ]);

        const productsPayload = (await productsResponse
          .json()
          .catch(() => ({}))) as FetchProductsResponse;
        const weightsPayload = (await weightsResponse
          .json()
          .catch(() => ({}))) as FetchWeightsResponse;

        if (!productsResponse.ok) {
          throw new Error(productsPayload.error ?? "Gagal memuat data produk.");
        }

        if (!weightsResponse.ok) {
          throw new Error(weightsPayload.error ?? "Gagal memuat bobot kriteria.");
        }

        const fetchedProducts = Array.isArray(productsPayload.products)
          ? productsPayload.products
          : [];

        const fetchedWeights =
          weightsPayload.weights && typeof weightsPayload.weights === "object"
            ? weightsPayload.weights
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
        const payload = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
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
      const nextWeights: Weights = {
        ...previous,
        [key]: Math.max(0, numericValue),
      };

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

        const payload = (await response.json().catch(() => ({}))) as {
          product?: Product;
          error?: string;
        };

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

  const handleDeleteProduct = useCallback(async (productId: string) => {
    setDeletingProductId(productId);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        console.error(payload.error ?? "Gagal menghapus produk.");
        return;
      }

      setProducts((previous) => previous.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Failed to delete product", error);
    } finally {
      setDeletingProductId(null);
    }
  }, []);

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

  return {
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
  };
}
