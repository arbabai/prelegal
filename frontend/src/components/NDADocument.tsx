"use client";

import { useEffect, useState } from "react";
import { NDAFormData } from "@/types/nda";

interface NDADocumentProps {
  data: NDAFormData;
  onFieldChange?: (field: string, value: string) => void;
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/** Renders user value or a light-gray placeholder (read-only, used inside legal text) */
function Val({ v, p }: { v: string; p: string }) {
  if (v && v.trim()) {
    return (
      <span className="text-indigo-900 underline decoration-indigo-200 underline-offset-2">{v}</span>
    );
  }
  return <span className="italic text-gray-300">[{p}]</span>;
}

/** Inline-editable text field for the cover page and signature table */
function InlineEdit({
  value,
  placeholder,
  onChange,
  multiline = false,
}: {
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const safeValue = value ?? "";
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(safeValue);

  // Keep draft in sync when the AI updates the value externally
  useEffect(() => {
    if (!editing) setDraft(safeValue);
  }, [safeValue, editing]);

  function startEditing() {
    setDraft(safeValue);
    setEditing(true);
  }

  function commit() {
    onChange(draft);
    setEditing(false);
  }

  const inputCls =
    "w-full bg-white border border-[#209dd7] rounded px-2 py-1 text-[13px] " +
    "focus:outline-none focus:ring-2 focus:ring-[#209dd7]/30";

  if (!editing) {
    return (
      <span
        onClick={startEditing}
        title="Click to edit"
        className="cursor-text hover:bg-[#ecad0a]/10 rounded px-0.5 -mx-0.5 transition-colors"
      >
        {safeValue.trim() ? safeValue : <span className="italic text-gray-300">[{placeholder}]</span>}
      </span>
    );
  }

  if (multiline) {
    return (
      <textarea
        autoFocus
        rows={3}
        className={inputCls + " resize-none block"}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
      />
    );
  }

  return (
    <input
      autoFocus
      type="text"
      className={inputCls + " block"}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") {
          setDraft(value);
          setEditing(false);
        }
      }}
    />
  );
}

/** Inline-editable date field — displays formatted date, edits as ISO string */
function InlineDateEdit({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <span
        onClick={() => setEditing(true)}
        title="Click to edit"
        className="cursor-text hover:bg-[#ecad0a]/10 rounded px-0.5 -mx-0.5 transition-colors"
      >
        {value ? formatDate(value) : <span className="italic text-gray-300">[Date]</span>}
      </span>
    );
  }

  return (
    <input
      autoFocus
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => setEditing(false)}
      className="bg-white border border-[#209dd7] rounded px-2 py-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#209dd7]/30"
    />
  );
}

export default function NDADocument({ data, onFieldChange }: NDADocumentProps) {
  const edit = onFieldChange ?? (() => {});

  const mndaTermLabel =
    data.mndaTerm === "expires"
      ? `Expires ${data.mndaTermYears} year${Number(data.mndaTermYears) !== 1 ? "s" : ""} from Effective Date.`
      : "Continues until terminated in accordance with the terms of the MNDA.";

  const mndaTermInline =
    data.mndaTerm === "expires"
      ? `expires ${data.mndaTermYears} year${Number(data.mndaTermYears) !== 1 ? "s" : ""} from the Effective Date`
      : "continues until terminated in accordance with the terms of the MNDA";

  const confTermLabel =
    data.confidentialityTerm === "fixed"
      ? `${data.confidentialityTermYears} year${Number(data.confidentialityTermYears) !== 1 ? "s" : ""} from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.`
      : "In perpetuity.";

  const confTermInline =
    data.confidentialityTerm === "fixed"
      ? `${data.confidentialityTermYears} year${Number(data.confidentialityTermYears) !== 1 ? "s" : ""} from the Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws`
      : "in perpetuity";

  const effectiveDateDisplay = data.effectiveDate ? formatDate(data.effectiveDate) : null;

  return (
    <div className="font-serif text-[#1c1814] leading-relaxed">

      {/* ── Heading ─────────────────────────────────── */}
      <div className="text-center mb-8">
        <p className="text-[10px] font-sans font-semibold text-[#a09070] uppercase tracking-[0.2em] mb-2">
          Common Paper · Version 1.0
        </p>
        <h1 className="font-heading text-[26px] font-bold text-[#0d1b2a] tracking-tight leading-tight">
          Mutual Non-Disclosure Agreement
        </h1>
        <div className="flex items-center justify-center gap-3 mt-3">
          <div className="h-px w-12 bg-[#d4c8a8]" />
          <div className="h-1 w-1 rounded-full bg-[#d4c8a8]" />
          <div className="h-px w-12 bg-[#d4c8a8]" />
        </div>
      </div>

      {/* ── Usage notice ────────────────────────────── */}
      <div className="bg-[#f8f6f0] border border-[#ece7d8] rounded text-[11.5px] font-sans text-[#7a6e58] px-4 py-3 mb-7 leading-relaxed">
        This Mutual Non-Disclosure Agreement (the &ldquo;<strong>MNDA</strong>&rdquo;) consists of: (1) this
        Cover Page (&ldquo;<strong>Cover Page</strong>&rdquo;) and (2) the Common Paper Mutual NDA Standard
        Terms Version 1.0 (&ldquo;<strong>Standard Terms</strong>&rdquo;) identical to those posted at{" "}
        <a
          href="https://commonpaper.com/standards/mutual-nda/1.0"
          className="underline text-[#6a5e48]"
          target="_blank"
          rel="noopener noreferrer"
        >
          commonpaper.com/standards/mutual-nda/1.0
        </a>
        . Any modifications of the Standard Terms should be made on the Cover Page, which will control over
        conflicts with the Standard Terms.
      </div>

      {/* ── Cover page fields ───────────────────────── */}
      <div className="border border-[#e8e2d0] rounded overflow-hidden mb-7">
        <CoverField label="Purpose" sublabel="How Confidential Information may be used">
          <InlineEdit
            value={data.purpose}
            placeholder="Purpose"
            onChange={(v) => edit("purpose", v)}
            multiline
          />
        </CoverField>

        <CoverField label="Effective Date">
          <InlineDateEdit value={data.effectiveDate} onChange={(v) => edit("effectiveDate", v)} />
        </CoverField>

        <CoverField label="MNDA Term" sublabel="The length of this MNDA">
          {mndaTermLabel}
        </CoverField>

        <CoverField label="Term of Confidentiality" sublabel="How long Confidential Information is protected">
          {confTermLabel}
        </CoverField>

        <CoverField label="Governing Law & Jurisdiction">
          <p>
            <span className="font-medium text-[#3a3020]">Governing Law: </span>
            <InlineEdit
              value={data.governingLaw}
              placeholder="State"
              onChange={(v) => edit("governingLaw", v)}
            />
          </p>
          <p className="mt-0.5">
            <span className="font-medium text-[#3a3020]">Jurisdiction: </span>
            <InlineEdit
              value={data.jurisdiction}
              placeholder="City, State"
              onChange={(v) => edit("jurisdiction", v)}
            />
          </p>
        </CoverField>

        <CoverField label="MNDA Modifications">
          <InlineEdit
            value={data.modifications}
            placeholder="None"
            onChange={(v) => edit("modifications", v)}
            multiline
          />
        </CoverField>
      </div>

      <p className="text-[13px] font-sans mb-6 text-[#4a4030]">
        By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.
      </p>

      {/* ── Signature table ─────────────────────────── */}
      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="border border-[#e8e2d0] px-3 py-2 text-left bg-[#f8f6f0] text-[#6a5e48] text-[10px] font-sans font-semibold uppercase tracking-wider w-[28%]" />
              <th className="border border-[#e8e2d0] px-3 py-2.5 text-center bg-[#f8f6f0] text-[#6a5e48] text-[10px] font-sans font-semibold uppercase tracking-wider">
                {data.party1.company || "PARTY 1"}
              </th>
              <th className="border border-[#e8e2d0] px-3 py-2.5 text-center bg-[#f8f6f0] text-[#6a5e48] text-[10px] font-sans font-semibold uppercase tracking-wider">
                {data.party2.company || "PARTY 2"}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[#e8e2d0] px-3 py-2 text-[11px] font-sans font-semibold text-[#6a5e48]">
                Signature
              </td>
              <td className="border border-[#e8e2d0] px-3 py-8" />
              <td className="border border-[#e8e2d0] px-3 py-8" />
            </tr>
            {(
              [
                { key: "name", label: "Print Name" },
                { key: "title", label: "Title" },
                { key: "company", label: "Company" },
                { key: "noticeAddress", label: "Notice Address" },
              ] as { key: keyof typeof data.party1; label: string }[]
            ).map(({ key, label }) => (
              <tr key={key}>
                <td className="border border-[#e8e2d0] px-3 py-2 text-[11px] font-sans font-semibold text-[#6a5e48]">
                  {label}
                </td>
                <td className="border border-[#e8e2d0] px-3 py-2 text-[13px]">
                  <InlineEdit
                    value={data.party1[key]}
                    placeholder={label}
                    onChange={(v) => edit(`party1.${key}`, v)}
                  />
                </td>
                <td className="border border-[#e8e2d0] px-3 py-2 text-[13px]">
                  <InlineEdit
                    value={data.party2[key]}
                    placeholder={label}
                    onChange={(v) => edit(`party2.${key}`, v)}
                  />
                </td>
              </tr>
            ))}
            <tr>
              <td className="border border-[#e8e2d0] px-3 py-2 text-[11px] font-sans font-semibold text-[#6a5e48]">
                Date
              </td>
              <td className="border border-[#e8e2d0] px-3 py-2 text-[13px]">
                {effectiveDateDisplay || <span className="text-gray-300 font-sans italic text-xs">—</span>}
              </td>
              <td className="border border-[#e8e2d0] px-3 py-2 text-[13px]">
                {effectiveDateDisplay || <span className="text-gray-300 font-sans italic text-xs">—</span>}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Standard Terms ──────────────────────────── */}
      <div className="border-t border-[#e8e2d0] pt-7">
        <h2 className="font-heading text-[18px] font-bold text-[#0d1b2a] mb-5">Standard Terms</h2>

        <div className="space-y-4 text-[13px] leading-[1.85] text-[#2a2318]">

          <p>
            <strong>1. Introduction.</strong> This Mutual Non-Disclosure Agreement (which incorporates these
            Standard Terms and the Cover Page (defined below)) (&ldquo;<strong>MNDA</strong>&rdquo;) allows each
            party (&ldquo;<strong>Disclosing Party</strong>&rdquo;) to disclose or make available information in
            connection with the <Val v={data.purpose} p="Purpose" /> which (1) the Disclosing Party identifies
            to the receiving party (&ldquo;<strong>Receiving Party</strong>&rdquo;) as &ldquo;confidential&rdquo;,
            &ldquo;proprietary&rdquo;, or the like or (2) should be reasonably understood as confidential or
            proprietary due to its nature and the circumstances of its disclosure (&ldquo;
            <strong>Confidential Information</strong>&rdquo;). Each party&rsquo;s Confidential Information also
            includes the existence and status of the parties&rsquo; discussions and information on the Cover
            Page. Confidential Information includes technical or business information, product designs or
            roadmaps, requirements, pricing, security and compliance documentation, technology, inventions and
            know-how. To use this MNDA, the parties must complete and sign a cover page incorporating these
            Standard Terms (&ldquo;<strong>Cover Page</strong>&rdquo;). Each party is identified on the Cover
            Page and capitalized terms have the meanings given herein or on the Cover Page.
          </p>

          <p>
            <strong>2. Use and Protection of Confidential Information.</strong> The Receiving Party shall:
            (a)&nbsp;use Confidential Information solely for the <Val v={data.purpose} p="Purpose" />;
            (b)&nbsp;not disclose Confidential Information to third parties without the Disclosing
            Party&rsquo;s prior written approval, except that the Receiving Party may disclose Confidential
            Information to its employees, agents, advisors, contractors and other representatives having a
            reasonable need to know for the <Val v={data.purpose} p="Purpose" />, provided these
            representatives are bound by confidentiality obligations no less protective of the Disclosing Party
            than the applicable terms in this MNDA and the Receiving Party remains responsible for their
            compliance with this MNDA; and (c)&nbsp;protect Confidential Information using at least the same
            protections the Receiving Party uses for its own similar information but no less than a reasonable
            standard of care.
          </p>

          <p>
            <strong>3. Exceptions.</strong> The Receiving Party&rsquo;s obligations in this MNDA do not apply
            to information that it can demonstrate: (a)&nbsp;is or becomes publicly available through no fault
            of the Receiving Party; (b)&nbsp;it rightfully knew or possessed prior to receipt from the
            Disclosing Party without confidentiality restrictions; (c)&nbsp;it rightfully obtained from a third
            party without confidentiality restrictions; or (d)&nbsp;it independently developed without using or
            referencing the Confidential Information.
          </p>

          <p>
            <strong>4. Disclosures Required by Law.</strong> The Receiving Party may disclose Confidential
            Information to the extent required by law, regulation or regulatory authority, subpoena or court
            order, provided (to the extent legally permitted) it provides the Disclosing Party reasonable
            advance notice of the required disclosure and reasonably cooperates, at the Disclosing
            Party&rsquo;s expense, with the Disclosing Party&rsquo;s efforts to obtain confidential treatment
            for the Confidential Information.
          </p>

          <p>
            <strong>5. Term and Termination.</strong> This MNDA commences on the{" "}
            {effectiveDateDisplay ? (
              <Val v={effectiveDateDisplay} p="Effective Date" />
            ) : (
              <span className="italic text-gray-300">[Effective Date]</span>
            )}{" "}
            and {mndaTermInline}. Either party may terminate this MNDA for any or no reason upon written
            notice to the other party. The Receiving Party&rsquo;s obligations relating to Confidential
            Information will survive {confTermInline}, despite any expiration or termination of this MNDA.
          </p>

          <p>
            <strong>6. Return or Destruction of Confidential Information.</strong> Upon expiration or
            termination of this MNDA or upon the Disclosing Party&rsquo;s earlier request, the Receiving Party
            will: (a)&nbsp;cease using Confidential Information; (b)&nbsp;promptly after the Disclosing
            Party&rsquo;s written request, destroy all Confidential Information in the Receiving Party&rsquo;s
            possession or control or return it to the Disclosing Party; and (c)&nbsp;if requested by the
            Disclosing Party, confirm its compliance with these obligations in writing. As an exception to
            subsection (b), the Receiving Party may retain Confidential Information in accordance with its
            standard backup or record retention policies or as required by law, but the terms of this MNDA will
            continue to apply to the retained Confidential Information.
          </p>

          <p>
            <strong>7. Proprietary Rights.</strong> The Disclosing Party retains all of its intellectual
            property and other rights in its Confidential Information and its disclosure to the Receiving Party
            grants no license under such rights.
          </p>

          <p>
            <strong>8. Disclaimer.</strong> ALL CONFIDENTIAL INFORMATION IS PROVIDED &ldquo;AS IS&rdquo;, WITH
            ALL FAULTS, AND WITHOUT WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND
            FITNESS FOR A PARTICULAR PURPOSE.
          </p>

          <p>
            <strong>9. Governing Law and Jurisdiction.</strong> This MNDA and all matters relating hereto are
            governed by, and construed in accordance with, the laws of the State of{" "}
            <Val v={data.governingLaw} p="Governing Law" />, without regard to the conflict of laws provisions
            of such <Val v={data.governingLaw} p="Governing Law" />. Any legal suit, action, or proceeding
            relating to this MNDA must be instituted in the federal or state courts located in{" "}
            <Val v={data.jurisdiction} p="Jurisdiction" />. Each party irrevocably submits to the exclusive
            jurisdiction of such <Val v={data.jurisdiction} p="Jurisdiction" /> in any such suit, action, or
            proceeding.
          </p>

          <p>
            <strong>10. Equitable Relief.</strong> A breach of this MNDA may cause irreparable harm for which
            monetary damages are an insufficient remedy. Upon a breach of this MNDA, the Disclosing Party is
            entitled to seek appropriate equitable relief, including an injunction, in addition to its other
            remedies.
          </p>

          <p>
            <strong>11. General.</strong> Neither party has an obligation under this MNDA to disclose
            Confidential Information to the other or proceed with any proposed transaction. Neither party may
            assign this MNDA without the prior written consent of the other party, except that either party may
            assign this MNDA in connection with a merger, reorganization, acquisition or other transfer of all
            or substantially all its assets or voting securities. Any assignment in violation of this Section
            is null and void. This MNDA will bind and inure to the benefit of each party&rsquo;s permitted
            successors and assigns. Waivers must be signed by the waiving party&rsquo;s authorized
            representative and cannot be implied from conduct. If any provision of this MNDA is held
            unenforceable, it will be limited to the minimum extent necessary so the rest of this MNDA remains
            in effect. This MNDA (including the Cover Page) constitutes the entire agreement of the parties
            with respect to its subject matter, and supersedes all prior and contemporaneous understandings,
            agreements, representations, and warranties, whether written or oral, regarding such subject
            matter. This MNDA may only be amended, modified, waived, or supplemented by an agreement in
            writing signed by both parties. Notices, requests and approvals under this MNDA must be sent in
            writing to the email or postal addresses on the Cover Page and are deemed delivered on receipt.
            This MNDA may be executed in counterparts, including electronic copies, each of which is deemed an
            original and which together form the same agreement.
          </p>

        </div>
      </div>

      {/* ── Footer ──────────────────────────────────── */}
      <p className="text-[11px] font-sans text-[#b0a488] mt-10 text-center leading-relaxed">
        Common Paper Mutual Non-Disclosure Agreement (Version 1.0)
        <br />
        Free to use under{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          CC BY 4.0
        </a>
      </p>
    </div>
  );
}

/* ── Cover page field row ───────────────────────────── */
function CoverField({
  label,
  sublabel,
  children,
}: {
  label: string;
  sublabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row border-b border-[#e8e2d0] last:border-b-0 odd:bg-white even:bg-[#faf8f3]">
      <div className="px-4 pt-3 pb-1 sm:py-3 sm:w-44 shrink-0">
        <p className="text-[10px] font-sans font-bold text-[#0d1b2a] uppercase tracking-[0.12em]">
          {label}
        </p>
        {sublabel && (
          <p className="text-[10px] font-sans italic text-[#9a8e78] mt-0.5 leading-tight">{sublabel}</p>
        )}
      </div>
      <div className="px-4 pb-3 sm:py-3 text-[13px] text-[#2a2318] flex-1 border-t sm:border-t-0 sm:border-l border-[#e8e2d0]">
        {children}
      </div>
    </div>
  );
}
