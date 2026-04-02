"use client";

import { ClientDocConfig, DocFields } from "@/types/document";
import { InlineDateEdit, InlineEdit } from "@/components/InlineEdit";

interface KeyTermsDocumentProps {
  config: ClientDocConfig;
  fields: DocFields;
  onFieldChange: (key: string, value: string) => void;
}

export default function KeyTermsDocument({ config, fields, onFieldChange }: KeyTermsDocumentProps) {
  return (
    <div className="font-serif text-[#1c1814] leading-relaxed">

      {/* ── Heading ─────────────────────────────────── */}
      <div className="text-center mb-8">
        <p className="text-[10px] font-sans font-semibold text-[#a09070] uppercase tracking-[0.2em] mb-2">
          Common Paper
        </p>
        <h1 className="font-heading text-[26px] font-bold text-[#0d1b2a] tracking-tight leading-tight">
          {config.name}
        </h1>
        <div className="flex items-center justify-center gap-3 mt-3">
          <div className="h-px w-12 bg-[#d4c8a8]" />
          <div className="h-1 w-1 rounded-full bg-[#d4c8a8]" />
          <div className="h-px w-12 bg-[#d4c8a8]" />
        </div>
      </div>

      {/* ── Description ─────────────────────────────── */}
      <div className="bg-[#f8f6f0] border border-[#ece7d8] rounded text-[11.5px] font-sans text-[#7a6e58] px-4 py-3 mb-7 leading-relaxed">
        {config.description}
      </div>

      {/* ── Key Terms ───────────────────────────────── */}
      {config.fields.length === 0 ? (
        <div className="text-[13px] font-sans text-[#7a6e58] italic px-1 mb-7">
          This document contains no fill-in fields. The AI assistant can answer questions about what this document covers.
        </div>
      ) : (
        <>
          <h2 className="font-heading text-[16px] font-bold text-[#0d1b2a] mb-3">Key Terms</h2>
          <div className="border border-[#e8e2d0] rounded overflow-hidden mb-7">
            {config.fields.map((fieldDef, idx) => (
              <div
                key={fieldDef.key}
                className={`flex flex-col sm:flex-row border-b border-[#e8e2d0] last:border-b-0 ${idx % 2 === 0 ? "bg-white" : "bg-[#faf8f3]"}`}
              >
                <div className="px-4 pt-3 pb-1 sm:py-3 sm:w-44 shrink-0">
                  <p className="text-[10px] font-sans font-bold text-[#0d1b2a] uppercase tracking-[0.12em]">
                    {fieldDef.label}
                  </p>
                </div>
                <div className="px-4 pb-3 sm:py-3 text-[13px] text-[#2a2318] flex-1 border-t sm:border-t-0 sm:border-l border-[#e8e2d0]">
                  {fieldDef.inputType === "date" ? (
                    <InlineDateEdit
                      value={fields[fieldDef.key] ?? ""}
                      onChange={(v) => onFieldChange(fieldDef.key, v)}
                    />
                  ) : (
                    <InlineEdit
                      value={fields[fieldDef.key] ?? ""}
                      placeholder={fieldDef.label}
                      onChange={(v) => onFieldChange(fieldDef.key, v)}
                      multiline={fieldDef.multiline}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Standard Terms notice ───────────────────── */}
      <div className="border-t border-[#e8e2d0] pt-7">
        <h2 className="font-heading text-[18px] font-bold text-[#0d1b2a] mb-3">Standard Terms</h2>
        <p className="text-[13px] font-sans text-[#7a6e58] leading-relaxed">
          The standard terms for this agreement are incorporated by reference from{" "}
          <a
            href="https://commonpaper.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#209dd7] underline hover:text-[#1a7fad]"
          >
            commonpaper.com
          </a>
          . The key terms above will be used to complete the cover page of this agreement.
        </p>
      </div>

    </div>
  );
}
