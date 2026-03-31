"use client";

import { NDAFormData } from "@/types/nda";

interface NDADocumentProps {
  data: NDAFormData;
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function NDADocument({ data }: NDADocumentProps) {
  const mndaTermText =
    data.mndaTerm === "expires"
      ? `Expires ${data.mndaTermYears} year${Number(data.mndaTermYears) !== 1 ? "s" : ""} from Effective Date.`
      : "Continues until terminated in accordance with the terms of the MNDA.";

  const confidentialityTermText =
    data.confidentialityTerm === "fixed"
      ? `${data.confidentialityTermYears} year${Number(data.confidentialityTermYears) !== 1 ? "s" : ""} from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.`
      : "In perpetuity.";

  return (
    <div className="nda-document font-serif text-gray-900 leading-relaxed">
      <h1 className="text-2xl font-bold text-center mb-2">Mutual Non-Disclosure Agreement</h1>

      <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6 text-sm text-gray-600">
        This Mutual Non-Disclosure Agreement (the &ldquo;MNDA&rdquo;) consists of: (1) this Cover Page
        (&ldquo;<strong>Cover Page</strong>&rdquo;) and (2) the Common Paper Mutual NDA Standard Terms Version 1.0
        (&ldquo;<strong>Standard Terms</strong>&rdquo;) identical to those posted at{" "}
        <a
          href="https://commonpaper.com/standards/mutual-nda/1.0"
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          commonpaper.com/standards/mutual-nda/1.0
        </a>
        . Any modifications of the Standard Terms should be made on the Cover Page, which will control over
        conflicts with the Standard Terms.
      </div>

      {/* Cover Page Fields */}
      <div className="space-y-5 mb-8">
        <Field label="Purpose" sublabel="How Confidential Information may be used">
          {data.purpose}
        </Field>

        <Field label="Effective Date">{formatDate(data.effectiveDate)}</Field>

        <Field label="MNDA Term" sublabel="The length of this MNDA">
          {mndaTermText}
        </Field>

        <Field label="Term of Confidentiality" sublabel="How long Confidential Information is protected">
          {confidentialityTermText}
        </Field>

        <Field label="Governing Law &amp; Jurisdiction">
          <p><strong>Governing Law:</strong> {data.governingLaw}</p>
          <p><strong>Jurisdiction:</strong> {data.jurisdiction}</p>
        </Field>

        {data.modifications && (
          <Field label="MNDA Modifications">{data.modifications}</Field>
        )}
      </div>

      <p className="text-sm mb-6">
        By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.
      </p>

      {/* Signature Table */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 px-3 py-2 text-left bg-gray-50 w-1/4"></th>
              <th className="border border-gray-300 px-3 py-2 text-center bg-gray-50">PARTY 1</th>
              <th className="border border-gray-300 px-3 py-2 text-center bg-gray-50">PARTY 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-3 py-2 font-medium">Signature</td>
              <td className="border border-gray-300 px-3 py-8"></td>
              <td className="border border-gray-300 px-3 py-8"></td>
            </tr>
            {[
              { key: "name", label: "Print Name" },
              { key: "title", label: "Title" },
              { key: "company", label: "Company" },
              { key: "noticeAddress", label: "Notice Address" },
            ].map(({ key, label }) => (
              <tr key={key}>
                <td className="border border-gray-300 px-3 py-2 font-medium">{label}</td>
                <td className="border border-gray-300 px-3 py-2">
                  {data.party1[key as keyof typeof data.party1]}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {data.party2[key as keyof typeof data.party2]}
                </td>
              </tr>
            ))}
            <tr>
              <td className="border border-gray-300 px-3 py-2 font-medium">Date</td>
              <td className="border border-gray-300 px-3 py-2">{formatDate(data.effectiveDate)}</td>
              <td className="border border-gray-300 px-3 py-2">{formatDate(data.effectiveDate)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Standard Terms */}
      <hr className="border-gray-300 mb-6" />
      <h2 className="text-xl font-bold mb-4">Standard Terms</h2>
      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          <strong>1. Introduction.</strong> This Mutual Non-Disclosure Agreement (which incorporates these Standard
          Terms and the Cover Page (defined below)) (&ldquo;<strong>MNDA</strong>&rdquo;) allows each party
          (&ldquo;<strong>Disclosing Party</strong>&rdquo;) to disclose or make available information in connection
          with the <em>{data.purpose}</em> which (1) the Disclosing Party identifies to the receiving party
          (&ldquo;<strong>Receiving Party</strong>&rdquo;) as &ldquo;confidential&rdquo;,
          &ldquo;proprietary&rdquo;, or the like or (2) should be reasonably understood as confidential or
          proprietary due to its nature and the circumstances of its disclosure (&ldquo;
          <strong>Confidential Information</strong>&rdquo;). Each party&rsquo;s Confidential Information also
          includes the existence and status of the parties&rsquo; discussions and information on the Cover Page.
          Confidential Information includes technical or business information, product designs or roadmaps,
          requirements, pricing, security and compliance documentation, technology, inventions and know-how. To use
          this MNDA, the parties must complete and sign a cover page incorporating these Standard Terms (&ldquo;
          <strong>Cover Page</strong>&rdquo;). Each party is identified on the Cover Page and capitalized terms have
          the meanings given herein or on the Cover Page.
        </p>
        <p>
          <strong>2. Use and Protection of Confidential Information.</strong> The Receiving Party shall: (a) use
          Confidential Information solely for the <em>{data.purpose}</em>; (b) not disclose Confidential Information
          to third parties without the Disclosing Party&rsquo;s prior written approval, except that the Receiving
          Party may disclose Confidential Information to its employees, agents, advisors, contractors and other
          representatives having a reasonable need to know for the <em>{data.purpose}</em>, provided these
          representatives are bound by confidentiality obligations no less protective of the Disclosing Party than
          the applicable terms in this MNDA and the Receiving Party remains responsible for their compliance with
          this MNDA; and (c) protect Confidential Information using at least the same protections the Receiving
          Party uses for its own similar information but no less than a reasonable standard of care.
        </p>
        <p>
          <strong>3. Exceptions.</strong> The Receiving Party&rsquo;s obligations in this MNDA do not apply to
          information that it can demonstrate: (a) is or becomes publicly available through no fault of the
          Receiving Party; (b) it rightfully knew or possessed prior to receipt from the Disclosing Party without
          confidentiality restrictions; (c) it rightfully obtained from a third party without confidentiality
          restrictions; or (d) it independently developed without using or referencing the Confidential Information.
        </p>
        <p>
          <strong>4. Disclosures Required by Law.</strong> The Receiving Party may disclose Confidential
          Information to the extent required by law, regulation or regulatory authority, subpoena or court order,
          provided (to the extent legally permitted) it provides the Disclosing Party reasonable advance notice of
          the required disclosure and reasonably cooperates, at the Disclosing Party&rsquo;s expense, with the
          Disclosing Party&rsquo;s efforts to obtain confidential treatment for the Confidential Information.
        </p>
        <p>
          <strong>5. Term and Termination.</strong> This MNDA commences on the{" "}
          <strong>{formatDate(data.effectiveDate)}</strong> and {mndaTermText} Either party may terminate this MNDA
          for any or no reason upon written notice to the other party. The Receiving Party&rsquo;s obligations
          relating to Confidential Information will survive for the {confidentialityTermText}, despite any
          expiration or termination of this MNDA.
        </p>
        <p>
          <strong>6. Return or Destruction of Confidential Information.</strong> Upon expiration or termination of
          this MNDA or upon the Disclosing Party&rsquo;s earlier request, the Receiving Party will: (a) cease using
          Confidential Information; (b) promptly after the Disclosing Party&rsquo;s written request, destroy all
          Confidential Information in the Receiving Party&rsquo;s possession or control or return it to the
          Disclosing Party; and (c) if requested by the Disclosing Party, confirm its compliance with these
          obligations in writing. As an exception to subsection (b), the Receiving Party may retain Confidential
          Information in accordance with its standard backup or record retention policies or as required by law, but
          the terms of this MNDA will continue to apply to the retained Confidential Information.
        </p>
        <p>
          <strong>7. Proprietary Rights.</strong> The Disclosing Party retains all of its intellectual property and
          other rights in its Confidential Information and its disclosure to the Receiving Party grants no license
          under such rights.
        </p>
        <p>
          <strong>8. Disclaimer.</strong> ALL CONFIDENTIAL INFORMATION IS PROVIDED &ldquo;AS IS&rdquo;, WITH ALL
          FAULTS, AND WITHOUT WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND FITNESS FOR
          A PARTICULAR PURPOSE.
        </p>
        <p>
          <strong>9. Governing Law and Jurisdiction.</strong> This MNDA and all matters relating hereto are
          governed by, and construed in accordance with, the laws of the State of{" "}
          <strong>{data.governingLaw}</strong>, without regard to the conflict of laws provisions of such{" "}
          <strong>{data.governingLaw}</strong>. Any legal suit, action, or proceeding relating to this MNDA must be
          instituted in the federal or state courts located in <strong>{data.jurisdiction}</strong>. Each party
          irrevocably submits to the exclusive jurisdiction of such <strong>{data.jurisdiction}</strong> in any such
          suit, action, or proceeding.
        </p>
        <p>
          <strong>10. Equitable Relief.</strong> A breach of this MNDA may cause irreparable harm for which
          monetary damages are an insufficient remedy. Upon a breach of this MNDA, the Disclosing Party is entitled
          to seek appropriate equitable relief, including an injunction, in addition to its other remedies.
        </p>
        <p>
          <strong>11. General.</strong> Neither party has an obligation under this MNDA to disclose Confidential
          Information to the other or proceed with any proposed transaction. Neither party may assign this MNDA
          without the prior written consent of the other party, except that either party may assign this MNDA in
          connection with a merger, reorganization, acquisition or other transfer of all or substantially all its
          assets or voting securities. Any assignment in violation of this Section is null and void. This MNDA will
          bind and inure to the benefit of each party&rsquo;s permitted successors and assigns. Waivers must be
          signed by the waiving party&rsquo;s authorized representative and cannot be implied from conduct. If any
          provision of this MNDA is held unenforceable, it will be limited to the minimum extent necessary so the
          rest of this MNDA remains in effect. This MNDA (including the Cover Page) constitutes the entire
          agreement of the parties with respect to its subject matter, and supersedes all prior and contemporaneous
          understandings, agreements, representations, and warranties, whether written or oral, regarding such
          subject matter. This MNDA may only be amended, modified, waived, or supplemented by an agreement in
          writing signed by both parties. Notices, requests and approvals under this MNDA must be sent in writing
          to the email or postal addresses on the Cover Page and are deemed delivered on receipt. This MNDA may be
          executed in counterparts, including electronic copies, each of which is deemed an original and which
          together form the same agreement.
        </p>
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          CC BY 4.0
        </a>
        .
      </p>
    </div>
  );
}

function Field({
  label,
  sublabel,
  children,
}: {
  label: string;
  sublabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-100 pb-4">
      <h3
        className="font-semibold text-gray-800 mb-0.5"
        dangerouslySetInnerHTML={{ __html: label }}
      />
      {sublabel && <p className="text-xs text-gray-500 mb-1">{sublabel}</p>}
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  );
}
