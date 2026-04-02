"use client";

import { DOC_CONFIGS_LIST } from "@/lib/docConfigs";

// Mutual NDA (cover page) is handled by /nda
const NDA_CARD = {
  slug: "nda",
  name: "Mutual Non-Disclosure Agreement",
  shortName: "Mutual NDA",
  description:
    "Standard terms for a mutual non-disclosure agreement allowing both parties to share confidential information, with obligations on use, protection, and return.",
  href: "/nda",
};

const ALL_DOCS = [
  NDA_CARD,
  ...DOC_CONFIGS_LIST.filter((c) => c.slug !== "mutual-nda-standard").map((c) => ({
    ...c,
    href: `/document/${c.slug}`,
  })),
  {
    slug: "mutual-nda-standard",
    name: "Mutual NDA (Standard Terms)",
    shortName: "NDA Standard Terms",
    description:
      "The reference standard terms for the Mutual Non-Disclosure Agreement. View the legal body that governs your NDA.",
    href: "/document/mutual-nda-standard",
  },
];

export default function DocumentsPage() {
  return (
    <div className="min-h-full flex flex-col bg-[#032147]">

      {/* ── Header ──────────────────────────────────── */}
      <header className="shrink-0 flex items-center px-8 h-14 border-b border-white/[0.08]">
        <span className="font-heading font-bold text-white text-[18px] tracking-tight leading-none">
          Prelegal
        </span>
      </header>

      {/* ── Content ─────────────────────────────────── */}
      <main className="flex-1 px-8 py-10 max-w-[1100px] mx-auto w-full">

        <div className="mb-8">
          <h1 className="font-heading text-[28px] font-bold text-white tracking-tight mb-2">
            Legal Documents
          </h1>
          <p className="text-white/50 text-[14px] font-sans">
            Select a document type to get started. Our AI will guide you through filling in the details.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_DOCS.map((doc) => (
            <a
              key={doc.slug}
              href={doc.href}
              className="group bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#209dd7]/50 rounded-xl p-5 flex flex-col gap-3 transition-all duration-150 cursor-pointer no-underline"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-heading text-[15px] font-bold text-white leading-tight group-hover:text-[#ecad0a] transition-colors">
                  {doc.name}
                </h2>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 mt-0.5 text-white/20 group-hover:text-[#209dd7] transition-colors"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-white/45 text-[12px] font-sans leading-relaxed flex-1">
                {doc.description}
              </p>
              <span className="text-[#209dd7] text-[11px] font-sans font-medium tracking-wide uppercase">
                Create document →
              </span>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
