import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import type { User } from "@/app/types";

const mapUser = (row: typeof schema.users.$inferSelect): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id: userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: "ID pengguna tidak valid." }, { status: 400 });
  }

  try {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ user: mapUser(user) });
  } catch (error) {
    console.error("Failed to fetch user", error);
    return NextResponse.json({ error: "Gagal memuat data pengguna." }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id: userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: "ID pengguna tidak valid." }, { status: 400 });
  }

  try {
    const deleted = await db
      .delete(schema.users)
      .where(eq(schema.users.id, userId))
      .returning({ id: schema.users.id });

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete user", error);
    return NextResponse.json({ error: "Gagal menghapus pengguna." }, { status: 500 });
  }
}
