import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
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

    const email: unknown = body?.email;
    const password: unknown = body?.password;

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

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "Email atau kata sandi tidak sesuai." },
        { status: 401 }
      );
    }

    const isValidPassword = await compare(password.trim(), user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Email atau kata sandi tidak sesuai." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: mapUser(user),
      message: "Login berhasil.",
    });
  } catch (error) {
    console.error("Failed to authenticate user", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses login." },
      { status: 500 }
    );
  }
}
