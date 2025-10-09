import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import type { Product } from "@/app/types";

const toNumber = (value: string | number | null) => Number(value ?? 0);

const mapProduct = (row: typeof schema.products.$inferSelect): Product => ({
  id: row.id,
  name: row.name,
  profit: toNumber(row.profit),
  sales: toNumber(row.sales),
  cost: toNumber(row.cost),
});

export async function GET(): Promise<Response> {
  try {
    const records = await db
      .select()
      .from(schema.products)
      .orderBy(asc(schema.products.createdAt));

    return NextResponse.json({
      products: records.map(mapProduct),
    });
  } catch (error) {
    console.error("Failed to fetch products", error);
    return NextResponse.json({ error: "Gagal memuat data produk." }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const name: unknown = body?.name;
    const profitInput: unknown = body?.profit;
    const salesInput: unknown = body?.sales;
    const costInput: unknown = body?.cost;

    if (typeof name !== "string" || name.trim().length < 3) {
      return NextResponse.json(
        { error: "Nama produk wajib diisi minimal 3 karakter." },
        { status: 400 }
      );
    }

    const parsedProfit = Number(profitInput);
    const parsedSales = Number(salesInput);
    const parsedCost = Number(costInput);

    if ([parsedProfit, parsedSales, parsedCost].some((value) => !Number.isFinite(value) || value <= 0)) {
      return NextResponse.json(
        { error: "Keuntungan, penjualan, dan biaya harus berupa angka positif." },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(schema.products)
      .values({
        id: randomUUID(),
        name: name.trim(),
        profit: parsedProfit.toString(),
        sales: parsedSales.toString(),
        cost: parsedCost.toString(),
      })
      .returning();

    if (!inserted) {
      throw new Error("Insert returned no result");
    }

    return NextResponse.json(
      {
        product: mapProduct(inserted),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create product", error);
    return NextResponse.json({ error: "Gagal menambahkan produk." }, { status: 500 });
  }
}
