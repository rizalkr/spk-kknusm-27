"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent, type JSX } from "react";

type RegisterFormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage(): JSX.Element {
  const [formValues, setFormValues] = useState<RegisterFormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
    setInfoMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = formValues.name.trim();
    const trimmedEmail = formValues.email.trim();
    const trimmedPassword = formValues.password.trim();
    const trimmedConfirm = formValues.confirmPassword.trim();

    if (trimmedName.length < 3) {
      setFormError("Nama lengkap minimal 3 karakter.");
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setFormError("Mohon isi email yang valid.");
      return;
    }

    if (trimmedPassword.length < 6) {
      setFormError("Kata sandi minimal 6 karakter.");
      return;
    }

    if (trimmedPassword !== trimmedConfirm) {
      setFormError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        setFormError(payload.error ?? "Registrasi gagal. Mohon coba lagi.");
        setInfoMessage(null);
        return;
      }

      setFormValues({ name: "", email: "", password: "", confirmPassword: "" });
      setInfoMessage(payload.message ?? "Registrasi berhasil. Silakan masuk untuk melanjutkan.");
    } catch (error) {
      console.error("Register error", error);
      setFormError("Terjadi kendala jaringan. Coba beberapa saat lagi.");
      setInfoMessage(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const normalizedEmail = formValues.email.trim();
  const isFormValid =
    formValues.name.trim().length >= 3 &&
    normalizedEmail.includes("@") &&
    formValues.password.trim().length >= 6 &&
    formValues.password.trim() === formValues.confirmPassword.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#113a7f] via-[#1d4d9f] to-[#f0f6ff] text-[#0a1d46]">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl rounded-3xl bg-gradient-to-br from-white/70 via-white/35 to-white/20 p-10 shadow-2xl shadow-[#2f7bff2b] ring-1 ring-white/50 backdrop-blur-xl">
          <div className="space-y-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#9bb8e8] bg-white/60 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-[#1d3f7a]">
              UMKM Cepoko · Registrasi
            </span>
            <div>
              <h1 className="text-3xl font-bold text-[#0a1d46] sm:text-4xl">Buat Akun Baru</h1>
              <p className="mt-2 text-sm font-medium text-slate-800 sm:text-base">
                Gabung untuk mengelola data produk dan memprioritaskan keputusan pengembangan UMKM secara kolaboratif.
              </p>
            </div>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-left">
              <span className="text-sm font-semibold text-[#0a1d46]">Nama Lengkap</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Contoh: Siti Andini"
                value={formValues.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-base text-[#0a1d46] shadow-inner focus:border-[#2f7bff] focus:outline-none focus:ring-2 focus:ring-[#6bb6ff]"
              />
            </label>

            <label className="flex flex-col gap-2 text-left">
              <span className="text-sm font-semibold text-[#0a1d46]">Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="nama@contoh.com"
                value={formValues.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-base text-[#0a1d46] shadow-inner focus:border-[#2f7bff] focus:outline-none focus:ring-2 focus:ring-[#6bb6ff]"
              />
              <p className="text-xs font-medium text-[#3560a0]">
                Pastikan alamat email valid dan berisi simbol @.
              </p>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-left">
                <span className="text-sm font-semibold text-[#0a1d46]">Kata Sandi</span>
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="Minimal 6 karakter"
                  value={formValues.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-base text-[#0a1d46] shadow-inner focus:border-[#2f7bff] focus:outline-none focus:ring-2 focus:ring-[#6bb6ff]"
                />
                <p className="text-xs font-medium text-[#3560a0]">
                  Minimal 6 karakter dan mudah diingat oleh Anda.
                </p>
              </label>
              <label className="flex flex-col gap-2 text-left">
                <span className="text-sm font-semibold text-[#0a1d46]">Konfirmasi Kata Sandi</span>
                <input
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Ulangi kata sandi"
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-base text-[#0a1d46] shadow-inner focus:border-[#2f7bff] focus:outline-none focus:ring-2 focus:ring-[#6bb6ff]"
                />
              </label>
            </div>

            {formError && (
              <div className="rounded-xl border border-[#f7b74066] bg-white/80 px-4 py-3 text-sm font-semibold text-[#b6801a] backdrop-blur">
                {formError}
              </div>
            )}

            {infoMessage && !formError && (
              <div className="rounded-xl border border-[#9bb8e8] bg-white/80 px-4 py-3 text-sm font-semibold text-[#1d3f7a] backdrop-blur">
                {infoMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isFormValid && !isSubmitting
                  ? "bg-[#2ecbb0] text-[#063a32] shadow-lg shadow-[#2ecbb033] hover:bg-[#21b29b] focus-visible:outline-[#2ecbb0]"
                  : "cursor-not-allowed bg-[#d6f5ee] text-[#7dad9f]"
              }`}
            >
              {isSubmitting ? "Memproses..." : "Daftar"}
              {!isSubmitting && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
              )}
            </button>
          </form>

          <div className="mt-10 flex flex-col items-center gap-3 text-sm font-semibold text-slate-800 sm:flex-row sm:justify-between">
            <span>Sudah memiliki akun?</span>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-[#9bb8e8] bg-white/60 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#1d3f7a] transition hover:bg-white/80"
            >
              Masuk Sekarang
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
