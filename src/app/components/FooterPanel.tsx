"use client";

import type { JSX } from "react";

export function FooterPanel(): JSX.Element {
	return (
		<footer className="rounded-3xl bg-gradient-to-br from-white/60 via-white/30 to-white/15 p-6 shadow-lg shadow-[#2f7bff1f] ring-1 ring-white/40 backdrop-blur-xl">
			<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
				<div className="space-y-2">
					<p className="text-sm font-semibold uppercase tracking-wide text-slate-800">
						Butuh Bantuan?
					</p>
					<h2 className="text-2xl font-bold text-[#0a1d46]">
						Kami siap membantu kendala penggunaan aplikasi.
					</h2>
					<p className="max-w-2xl text-sm font-medium text-slate-800">
						Hubungi tim pengembang melalui email atau WhatsApp berikut untuk pelaporan bug,
						permintaan fitur tambahan, maupun dukungan teknis lainnya.
					</p>
				</div>

				<div className="flex flex-col gap-3 sm:flex-row">
					<a
						href="mailto:support@umkm-saw.id"
						className="group inline-flex items-center gap-3 rounded-2xl border border-white/35 bg-white/35 px-5 py-4 text-left shadow-lg shadow-[#2f7bff1f] transition hover:border-[#2f7bff66] hover:bg-white/50 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#2f7bff]"
					>
						<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2f7bff1a] text-[#2f7bff]">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={2}
								strokeLinecap="round"
								strokeLinejoin="round"
								className="h-5 w-5"
							>
								<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
								<polyline points="22,6 12,13 2,6" />
							</svg>
						</span>
						<span>
							<span className="block text-xs font-semibold uppercase tracking-wide text-slate-800">
								Email Dukungan
							</span>
							<span className="block text-base font-bold text-[#0a1d46]">
								support@umkm-saw.id
							</span>
						</span>
					</a>

					<a
						href="https://wa.me/6285191294341"
						target="_blank"
						rel="noopener noreferrer"
						className="group inline-flex items-center gap-3 rounded-2xl border border-white/35 bg-white/35 px-5 py-4 text-left shadow-lg shadow-[#2f7bff1f] transition hover:border-[#21b29b66] hover:bg-white/50 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#21b29b]"
					>
						<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2ecbb01a] text-[#1f6f65]">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={2}
								strokeLinecap="round"
								strokeLinejoin="round"
								className="h-5 w-5"
							>
								<path d="M20.52 3.48A11.77 11.77 0 0 0 12 0a11.94 11.94 0 0 0-10 18.63L0 24l5.5-1.43A12 12 0 1 0 20.52 3.48ZM12 21.3a9.3 9.3 0 0 1-4.74-1.3l-.34-.2-3.26.85.87-3.18-.22-.33A9.3 9.3 0 1 1 12 21.3Zm4.84-6.7c-.26-.13-1.53-.76-1.77-.85s-.41-.13-.58.13-.66.85-.82 1s-.3.19-.56.06a7.58 7.58 0 0 1-2.23-1.37 8.38 8.38 0 0 1-1.55-1.92c-.16-.26 0-.4.12-.53s.26-.3.39-.45a1.77 1.77 0 0 0 .26-.43.48.48 0 0 0-.02-.45c-.06-.13-.58-1.4-.79-1.91s-.42-.44-.58-.45-.32 0-.49 0a.94.94 0 0 0-.68.32A2.83 2.83 0 0 0 7 10.21a4.92 4.92 0 0 0 1 2.6 11.18 11.18 0 0 0 4.3 3.8 14.63 14.63 0 0 0 1.45.53 3.48 3.48 0 0 0 1.6.1 2.61 2.61 0 0 0 1.71-1.18 2.14 2.14 0 0 0 .15-1.18c-.07-.12-.24-.19-.5-.32Z" />
							</svg>
						</span>
						<span>
							<span className="block text-xs font-semibold uppercase tracking-wide text-slate-800">
								WhatsApp Bantuan
							</span>
							<span className="block text-base font-bold text-[#0a1d46]">
								+62 851-9129-4341
							</span>
						</span>
					</a>
				</div>
			</div>
		</footer>
	);
}
