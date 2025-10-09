import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import type { User } from "@/app/types";

const mapUser = (row: typeof schema.users.$inferSelect): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
});

export async function GET(): Promise<Response> {
  try {
    const records = await db.select().from(schema.users).orderBy(asc(schema.users.createdAt));

    return NextResponse.json({ users: records.map(mapUser) });
  } catch (error) {
    console.error("Failed to fetch users", error);
    return NextResponse.json({ error: "Gagal memuat data pengguna." }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const name: unknown = body?.name;
    const email: unknown = body?.email;
    const role: unknown = body?.role;

    if (typeof name !== "string" || name.trim().length < 3) {
      return NextResponse.json(
        { error: "Nama pengguna wajib diisi minimal 3 karakter." },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Alamat email tidak valid." },
        { status: 400 }
      );
    }

    const normalizedRole =
      typeof role === "string" && role.trim().length > 0 ? role.trim().toLowerCase() : "member";

    const [inserted] = await db
      .insert(schema.users)
      .values({
        id: randomUUID(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: normalizedRole,
      })
      .returning();

    if (!inserted) {
      throw new Error("Insert returned no result");
    }

    return NextResponse.json({ user: mapUser(inserted) }, { status: 201 });
  } catch (error) {
    console.error("Failed to create user", error);
    return NextResponse.json({ error: "Gagal menambahkan pengguna." }, { status: 500 });
  }
}
