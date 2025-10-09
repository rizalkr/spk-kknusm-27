import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { DEFAULT_WEIGHTS, DEFAULT_WEIGHTS_ID, weights as weightsTable } from "@/lib/schema";
import type { Weights } from "@/app/types";

const toNumber = (value: string | number | null) => Number(value ?? 0);

const mapWeights = (row: typeof weightsTable.$inferSelect): Weights => ({
  profit: toNumber(row.profit),
  sales: toNumber(row.sales),
  cost: toNumber(row.cost),
});

async function ensureWeightsRow(): Promise<typeof weightsTable.$inferSelect> {
  const existing = await db
    .select()
    .from(weightsTable)
    .where(eq(weightsTable.id, DEFAULT_WEIGHTS_ID));

  if (existing.length > 0) {
    return existing[0];
  }

  const [inserted] = await db
    .insert(weightsTable)
    .values({
      id: DEFAULT_WEIGHTS_ID,
      profit: DEFAULT_WEIGHTS.profit.toString(),
      sales: DEFAULT_WEIGHTS.sales.toString(),
      cost: DEFAULT_WEIGHTS.cost.toString(),
    })
    .returning();

  if (!inserted) {
    throw new Error("Failed to initialise default weights");
  }

  return inserted;
}

export async function GET(): Promise<Response> {
  try {
    const row = await ensureWeightsRow();

    return NextResponse.json({
      weights: mapWeights(row),
    });
  } catch (error) {
    console.error("Failed to fetch weights", error);
    return NextResponse.json({ error: "Gagal memuat bobot." }, { status: 500 });
  }
}

export async function PUT(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const profitInput: unknown = body?.profit;
    const salesInput: unknown = body?.sales;
    const costInput: unknown = body?.cost;

    const nextProfit = Number(profitInput);
    const nextSales = Number(salesInput);
    const nextCost = Number(costInput);

    if ([nextProfit, nextSales, nextCost].some((value) => !Number.isFinite(value) || value < 0)) {
      return NextResponse.json(
        { error: "Bobot harus berupa angka positif." },
        { status: 400 }
      );
    }

    await ensureWeightsRow();

    const [updated] = await db
      .update(weightsTable)
      .set({
        profit: nextProfit.toString(),
        sales: nextSales.toString(),
        cost: nextCost.toString(),
        updatedAt: new Date(),
      })
      .where(eq(weightsTable.id, DEFAULT_WEIGHTS_ID))
      .returning();

    if (!updated) {
      throw new Error("Failed to update weights");
    }

    return NextResponse.json({
      weights: mapWeights(updated),
    });
  } catch (error) {
    console.error("Failed to update weights", error);
    return NextResponse.json({ error: "Gagal memperbarui bobot." }, { status: 500 });
  }
}
