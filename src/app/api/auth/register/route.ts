import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { db, schema } from "@/lib/db";
import type { User } from "@/app/types";

const mapUser = (row: typeof schema.users.$inferSelect): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
});

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();

    const name: unknown = body?.name;
    const email: unknown = body?.email;
    const password: unknown = body?.password;

    if (typeof name !== "string" || name.trim().length < 3) {
      return NextResponse.json(
        { error: "Nama lengkap minimal 3 karakter." },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Alamat email tidak valid." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.trim().length < 6) {
      return NextResponse.json(
        { error: "Kata sandi minimal 6 karakter." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [existing] = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, normalizedEmail))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan gunakan email lain." },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password.trim(), 12);

    const [inserted] = await db
      .insert(schema.users)
      .values({
        id: randomUUID(),
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: "member",
      })
      .returning();

    if (!inserted) {
      throw new Error("Insert returned no result");
    }

    return NextResponse.json(
      {
        user: mapUser(inserted),
        message: "Registrasi berhasil. Silakan masuk untuk melanjutkan.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to register user", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat registrasi pengguna." },
      { status: 500 }
    );
  }
}
