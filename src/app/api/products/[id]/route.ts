import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
): Promise<Response> {
  const productId = context.params.id;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!productId) {
    return NextResponse.json({ error: "ID produk tidak valid." }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ error: "Parameter userId wajib disertakan." }, { status: 400 });
  }

  try {
    const deleted = await db
      .delete(schema.products)
      .where(
        and(eq(schema.products.id, productId), eq(schema.products.userId, userId))
      )
      .returning({ id: schema.products.id });

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product", error);
    return NextResponse.json({ error: "Gagal menghapus produk." }, { status: 500 });
  }
}
