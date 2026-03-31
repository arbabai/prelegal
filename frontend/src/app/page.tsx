"use client";

import { useState } from "react";
import NDAForm from "@/components/NDAForm";
import NDADocument from "@/components/NDADocument";
import { NDAFormData } from "@/types/nda";

const defaultValues: NDAFormData = {
  purpose: "",
  effectiveDate: new Date().toISOString().split("T")[0],
  mndaTerm: "expires",
  mndaTermYears: "1",
  confidentialityTerm: "fixed",
  confidentialityTermYears: "1",
  governingLaw: "",
  jurisdiction: "",
  modifications: "",
  party1: { name: "", title: "", company: "", noticeAddress: "" },
  party2: { name: "", title: "", company: "", noticeAddress: "" },
};

export default function Home() {
  const [form, setForm] = useState<NDAFormData>(defaultValues);

  return (
    <div className="h-full flex flex-col bg-[#0d1b2a] print:h-auto print:block print:bg-white overflow-hidden print:overflow-visible">

      {/* ── Top bar ──────────────────────────────────── */}
      <header className="no-print shrink-0 flex items-center justify-between px-6 h-14 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <span className="font-heading font-bold text-white text-[18px] tracking-tight leading-none">
            Prelegal
          </span>
          <span className="w-px h-4 bg-white/20" />
          <span className="text-white/45 text-[13px] font-sans">Mutual NDA Creator</span>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors duration-150 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download PDF
        </button>
      </header>

      {/* ── Split content ─────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden print:block print:overflow-visible print:h-auto">

        {/* Left: Form panel */}
        <aside className="no-print w-[42%] shrink-0 bg-[#f4f5f8] border-r border-[#e0e4ec] overflow-y-auto custom-scroll">
          <div className="px-1 pb-10">
            <div className="px-6 pt-6 pb-2">
              <p className="text-[10px] font-bold text-[#a0a8bb] uppercase tracking-[0.15em]">
                Document Details
              </p>
            </div>
            <NDAForm value={form} onChange={setForm} />
          </div>
        </aside>

        {/* Right: Document preview */}
        <main className="flex-1 bg-[#d4d8e2] overflow-y-auto custom-scroll print:block print:overflow-visible print:bg-white">
          <div className="min-h-full flex justify-center py-10 px-8 print:p-0 print:block">
            <div className="paper-card relative w-full max-w-[700px] bg-[#fffef9] shadow-[0_8px_48px_rgba(0,0,0,0.18),0_1px_3px_rgba(0,0,0,0.08)] rounded-[3px] px-14 py-14">
              {/* DRAFT badge */}
              <div className="draft-badge absolute top-5 right-5 bg-amber-50 text-amber-600 border border-amber-200 text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-sm">
                Draft
              </div>
              <NDADocument data={form} />
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}
