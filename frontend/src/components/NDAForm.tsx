"use client";

import { NDAFormData } from "@/types/nda";

interface NDAFormProps {
  value: NDAFormData;
  onChange: (data: NDAFormData) => void;
}

export default function NDAForm({ value, onChange }: NDAFormProps) {
  function set(path: string, v: string) {
    const next = { ...value };
    if (path.startsWith("party1.")) {
      next.party1 = { ...value.party1, [path.slice(7)]: v };
    } else if (path.startsWith("party2.")) {
      next.party2 = { ...value.party2, [path.slice(7)]: v };
    } else {
      (next as Record<string, unknown>)[path] = v;
    }
    onChange(next);
  }

  return (
    <div className="divide-y divide-[#e0e4ec]">

      {/* 1 · Purpose */}
      <Section number={1} title="Purpose" hint="How Confidential Information may be used">
        <textarea
          rows={3}
          placeholder="e.g. Evaluating whether to enter into a business relationship with the other party."
          className={inputCls}
          value={value.purpose}
          onChange={(e) => set("purpose", e.target.value)}
        />
      </Section>

      {/* 2 · Effective Date */}
      <Section number={2} title="Effective Date">
        <input
          type="date"
          className={inputCls + " w-44"}
          value={value.effectiveDate}
          onChange={(e) => set("effectiveDate", e.target.value)}
        />
      </Section>

      {/* 3 · MNDA Term */}
      <Section number={3} title="MNDA Term" hint="The length of this agreement">
        <div className="space-y-2">
          <RadioCard
            selected={value.mndaTerm === "expires"}
            onClick={() => set("mndaTerm", "expires")}
          >
            <span>Expires after</span>
            <input
              type="number"
              min="1"
              className="mx-1.5 w-14 border border-gray-200 rounded-md px-2 py-0.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-40"
              value={value.mndaTermYears}
              onChange={(e) => set("mndaTermYears", e.target.value)}
              onClick={(e) => e.stopPropagation()}
              disabled={value.mndaTerm !== "expires"}
            />
            <span>year(s) from Effective Date</span>
          </RadioCard>
          <RadioCard
            selected={value.mndaTerm === "until_terminated"}
            onClick={() => set("mndaTerm", "until_terminated")}
          >
            Continues until terminated
          </RadioCard>
        </div>
      </Section>

      {/* 4 · Term of Confidentiality */}
      <Section number={4} title="Term of Confidentiality" hint="How long Confidential Information is protected">
        <div className="space-y-2">
          <RadioCard
            selected={value.confidentialityTerm === "fixed"}
            onClick={() => set("confidentialityTerm", "fixed")}
          >
            <input
              type="number"
              min="1"
              className="mr-1.5 w-14 border border-gray-200 rounded-md px-2 py-0.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-40"
              value={value.confidentialityTermYears}
              onChange={(e) => set("confidentialityTermYears", e.target.value)}
              onClick={(e) => e.stopPropagation()}
              disabled={value.confidentialityTerm !== "fixed"}
            />
            <span>year(s) from Effective Date</span>
          </RadioCard>
          <RadioCard
            selected={value.confidentialityTerm === "perpetual"}
            onClick={() => set("confidentialityTerm", "perpetual")}
          >
            In perpetuity
          </RadioCard>
        </div>
      </Section>

      {/* 5 · Governing Law & Jurisdiction */}
      <Section number={5} title="Governing Law & Jurisdiction">
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Governing Law (State)</label>
            <input
              type="text"
              placeholder="e.g. Delaware"
              className={inputCls}
              value={value.governingLaw}
              onChange={(e) => set("governingLaw", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Jurisdiction</label>
            <input
              type="text"
              placeholder="e.g. courts located in New Castle, DE"
              className={inputCls}
              value={value.jurisdiction}
              onChange={(e) => set("jurisdiction", e.target.value)}
            />
          </div>
        </div>
      </Section>

      {/* 6 · Modifications */}
      <Section
        number={6}
        title="MNDA Modifications"
        hint="Optional — list any modifications to the standard terms"
      >
        <textarea
          rows={2}
          placeholder="Leave blank if none…"
          className={inputCls}
          value={value.modifications}
          onChange={(e) => set("modifications", e.target.value)}
        />
      </Section>

      {/* 7 · Party 1 */}
      <Section number={7} title="Party 1">
        <PartyFields
          label="Party 1"
          accentColor="indigo"
          data={value.party1}
          onFieldChange={(field, v) => set(`party1.${field}`, v)}
        />
      </Section>

      {/* 8 · Party 2 */}
      <Section number={8} title="Party 2">
        <PartyFields
          label="Party 2"
          accentColor="teal"
          data={value.party2}
          onFieldChange={(field, v) => set(`party2.${field}`, v)}
        />
      </Section>

    </div>
  );
}

/* ── Shared style strings ───────────────────────────── */

const inputCls =
  "w-full bg-white border border-[#dde1ea] rounded-lg px-3 py-2 text-sm text-gray-800 " +
  "placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 " +
  "focus:border-transparent transition-all duration-150";

const labelCls = "block text-[11px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wide";

/* ── Section wrapper ────────────────────────────────── */

function Section({
  number,
  title,
  hint,
  children,
}: {
  number: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-6 py-5">
      <div className="flex items-center gap-2.5 mb-2.5">
        <span className="h-5 w-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 leading-none">
          {number}
        </span>
        <h2 className="text-[13px] font-semibold text-gray-800">{title}</h2>
      </div>
      {hint && (
        <p className="text-[11px] italic text-gray-400 mb-3 pl-[30px]">{hint}</p>
      )}
      <div className="pl-[30px]">{children}</div>
    </div>
  );
}

/* ── Radio pill card ────────────────────────────────── */

function RadioCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={onClick}
      className={
        "cursor-pointer rounded-lg border px-3.5 py-2.5 flex items-start gap-3 text-sm " +
        "transition-all duration-150 select-none " +
        (selected
          ? "border-indigo-400 bg-indigo-50 text-indigo-900"
          : "border-[#dde1ea] bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50/70")
      }
    >
      {/* Custom radio dot */}
      <div
        className={
          "mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors " +
          (selected ? "border-indigo-600" : "border-gray-300")
        }
      >
        {selected && <div className="h-2 w-2 rounded-full bg-indigo-600" />}
      </div>
      <div className="flex items-center flex-wrap gap-1 leading-snug">{children}</div>
    </div>
  );
}

/* ── Party fields ───────────────────────────────────── */

function PartyFields({
  label,
  accentColor,
  data,
  onFieldChange,
}: {
  label: string;
  accentColor: "indigo" | "teal";
  data: { name: string; title: string; company: string; noticeAddress: string };
  onFieldChange: (field: string, value: string) => void;
}) {
  const accent =
    accentColor === "indigo"
      ? { border: "border-indigo-300", bg: "bg-indigo-50", text: "text-indigo-700" }
      : { border: "border-teal-300", bg: "bg-teal-50", text: "text-teal-700" };

  const fields = [
    { key: "name", label: "Print Name", placeholder: "Full legal name" },
    { key: "title", label: "Title", placeholder: "e.g. CEO, General Counsel" },
    { key: "company", label: "Company", placeholder: "Legal entity name" },
    { key: "noticeAddress", label: "Notice Address", placeholder: "Email or postal address" },
  ];

  return (
    <div className={`border-l-2 ${accent.border} pl-4`}>
      <span
        className={`inline-block ${accent.bg} ${accent.text} text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded mb-3`}
      >
        {label}
      </span>
      <div className="space-y-3">
        {fields.map(({ key, label: fieldLabel, placeholder }) => (
          <div key={key}>
            <label className={labelCls}>{fieldLabel}</label>
            <input
              type="text"
              placeholder={placeholder}
              className={inputCls}
              value={data[key as keyof typeof data]}
              onChange={(e) => onFieldChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
