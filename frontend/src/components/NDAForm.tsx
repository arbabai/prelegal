"use client";

import { useState } from "react";
import { NDAFormData } from "@/types/nda";

interface NDAFormProps {
  onSubmit: (data: NDAFormData) => void;
}

const defaultValues: NDAFormData = {
  purpose: "Evaluating whether to enter into a business relationship with the other party.",
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

export default function NDAForm({ onSubmit }: NDAFormProps) {
  const [form, setForm] = useState<NDAFormData>(defaultValues);

  function set(path: string, value: string) {
    setForm((prev) => {
      const next = { ...prev };
      if (path.startsWith("party1.")) {
        next.party1 = { ...prev.party1, [path.slice(7)]: value };
      } else if (path.startsWith("party2.")) {
        next.party2 = { ...prev.party2, [path.slice(7)]: value };
      } else {
        (next as Record<string, unknown>)[path] = value;
      }
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Purpose */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Purpose</h2>
        <p className="text-sm text-gray-500 mb-2">How Confidential Information may be used</p>
        <textarea
          required
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.purpose}
          onChange={(e) => set("purpose", e.target.value)}
        />
      </section>

      {/* Effective Date */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Effective Date</h2>
        <input
          type="date"
          required
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.effectiveDate}
          onChange={(e) => set("effectiveDate", e.target.value)}
        />
      </section>

      {/* MNDA Term */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">MNDA Term</h2>
        <p className="text-sm text-gray-500 mb-2">The length of this MNDA</p>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="mndaTerm"
              value="expires"
              checked={form.mndaTerm === "expires"}
              onChange={() => set("mndaTerm", "expires")}
            />
            Expires after
            <input
              type="number"
              min="1"
              className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.mndaTermYears}
              onChange={(e) => set("mndaTermYears", e.target.value)}
              disabled={form.mndaTerm !== "expires"}
            />
            year(s) from Effective Date
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="mndaTerm"
              value="until_terminated"
              checked={form.mndaTerm === "until_terminated"}
              onChange={() => set("mndaTerm", "until_terminated")}
            />
            Continues until terminated in accordance with the terms of the MNDA
          </label>
        </div>
      </section>

      {/* Term of Confidentiality */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Term of Confidentiality</h2>
        <p className="text-sm text-gray-500 mb-2">How long Confidential Information is protected</p>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="confidentialityTerm"
              value="fixed"
              checked={form.confidentialityTerm === "fixed"}
              onChange={() => set("confidentialityTerm", "fixed")}
            />
            <input
              type="number"
              min="1"
              className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.confidentialityTermYears}
              onChange={(e) => set("confidentialityTermYears", e.target.value)}
              disabled={form.confidentialityTerm !== "fixed"}
            />
            year(s) from Effective Date (trade secrets protected until no longer a trade secret)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="confidentialityTerm"
              value="perpetual"
              checked={form.confidentialityTerm === "perpetual"}
              onChange={() => set("confidentialityTerm", "perpetual")}
            />
            In perpetuity
          </label>
        </div>
      </section>

      {/* Governing Law & Jurisdiction */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Governing Law &amp; Jurisdiction</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Governing Law (State)</label>
            <input
              required
              type="text"
              placeholder="e.g. Delaware"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.governingLaw}
              onChange={(e) => set("governingLaw", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdiction</label>
            <input
              required
              type="text"
              placeholder="e.g. courts located in New Castle, DE"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.jurisdiction}
              onChange={(e) => set("jurisdiction", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Modifications */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">MNDA Modifications <span className="text-gray-400 font-normal text-sm">(optional)</span></h2>
        <textarea
          rows={2}
          placeholder="List any modifications to the standard MNDA terms..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.modifications}
          onChange={(e) => set("modifications", e.target.value)}
        />
      </section>

      {/* Parties */}
      {(["party1", "party2"] as const).map((party, i) => (
        <section key={party}>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Party {i + 1}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { field: "name", label: "Print Name", placeholder: "Full name" },
              { field: "title", label: "Title", placeholder: "e.g. CEO" },
              { field: "company", label: "Company", placeholder: "Company name" },
              { field: "noticeAddress", label: "Notice Address", placeholder: "Email or postal address" },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  required={field !== "noticeAddress"}
                  type="text"
                  placeholder={placeholder}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form[party][field as keyof typeof form[typeof party]]}
                  onChange={(e) => set(`${party}.${field}`, e.target.value)}
                />
              </div>
            ))}
          </div>
        </section>
      ))}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 transition-colors text-sm"
      >
        Preview Document
      </button>
    </form>
  );
}
