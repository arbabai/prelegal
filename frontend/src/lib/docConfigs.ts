/**
 * Frontend document configuration registry.
 *
 * IMPORTANT: Field `key` values here must exactly match the keys defined in
 * backend/services/doc_registry.py. Any mismatch means AI field patches will
 * be silently ignored by the frontend.
 */

import { ClientDocConfig } from "@/types/document";

const DOC_CONFIGS_LIST: ClientDocConfig[] = [
  {
    slug: "mutual-nda-standard",
    name: "Mutual NDA (Standard Terms)",
    shortName: "NDA Standard Terms",
    description:
      "The standard legal terms for a Mutual Non-Disclosure Agreement. This is a reference document with no fill-in fields.",
    fields: [],
  },
  {
    slug: "cloud-service-agreement",
    name: "Cloud Service Agreement",
    shortName: "Cloud Service Agreement",
    description:
      "Comprehensive standard terms for selling and buying cloud software and SaaS products.",
    fields: [
      { key: "provider", label: "Provider" },
      { key: "customer", label: "Customer" },
      { key: "effectiveDate", label: "Effective Date", inputType: "date" as const },
      { key: "cloudServiceDescription", label: "Cloud Service Description", multiline: true },
      { key: "subscriptionPeriod", label: "Subscription Period" },
      { key: "fees", label: "Fees" },
      { key: "paymentProcess", label: "Payment Process" },
      { key: "generalCapAmount", label: "Liability Cap Amount" },
      { key: "governingLaw", label: "Governing Law" },
      { key: "chosenCourts", label: "Chosen Courts" },
    ],
  },
  {
    slug: "design-partner-agreement",
    name: "Design Partner Agreement",
    shortName: "Design Partner Agreement",
    description:
      "Agreement for granting a design partner early product access in exchange for structured feedback.",
    fields: [
      { key: "provider", label: "Provider" },
      { key: "partner", label: "Partner" },
      { key: "effectiveDate", label: "Effective Date", inputType: "date" as const },
      { key: "productDescription", label: "Product", multiline: true },
      { key: "programDescription", label: "Design Program", multiline: true },
      { key: "feedbackSchedule", label: "Feedback Schedule" },
      { key: "term", label: "Term" },
      { key: "fees", label: "Fees" },
      { key: "governingLaw", label: "Governing Law" },
      { key: "chosenCourts", label: "Chosen Courts" },
      { key: "noticeAddress", label: "Notice Address", multiline: true },
    ],
  },
  {
    slug: "service-level-agreement",
    name: "Service Level Agreement",
    shortName: "Service Level Agreement",
    description:
      "Standard terms defining uptime commitments, service credits, and termination rights for cloud services.",
    fields: [
      { key: "provider", label: "Provider" },
      { key: "customer", label: "Customer" },
      { key: "effectiveDate", label: "Effective Date", inputType: "date" as const },
      { key: "serviceDescription", label: "Service Description" },
      { key: "uptimeCommitment", label: "Uptime Commitment" },
      { key: "measurementPeriod", label: "Measurement Period" },
      { key: "excludedDowntime", label: "Excluded Downtime", multiline: true },
      { key: "serviceCreditPercentage", label: "Service Credit" },
      { key: "maximumCredit", label: "Maximum Monthly Credit" },
      { key: "terminationThreshold", label: "Termination Threshold" },
    ],
  },
  {
    slug: "professional-services-agreement",
    name: "Professional Services Agreement",
    shortName: "Professional Services",
    description:
      "Standard terms for professional services engagements covering deliverables, IP, and payment.",
    fields: [
      { key: "provider", label: "Provider" },
      { key: "customer", label: "Customer" },
      { key: "effectiveDate", label: "Effective Date", inputType: "date" as const },
      { key: "servicesDescription", label: "Services Description", multiline: true },
      { key: "fees", label: "Fees" },
      { key: "paymentSchedule", label: "Payment Schedule" },
      { key: "ipOwnership", label: "IP Ownership" },
      { key: "liabilityCap", label: "Liability Cap" },
      { key: "governingLaw", label: "Governing Law" },
      { key: "chosenCourts", label: "Chosen Courts" },
      { key: "noticeAddress", label: "Notice Address", multiline: true },
    ],
  },
  {
    slug: "data-processing-agreement",
    name: "Data Processing Agreement",
    shortName: "Data Processing Agreement",
    description:
      "GDPR-compliant terms governing how a processor handles personal data on behalf of a controller.",
    fields: [
      { key: "provider", label: "Processor" },
      { key: "customer", label: "Controller" },
      { key: "effectiveDate", label: "Effective Date", inputType: "date" as const },
      { key: "processingPurpose", label: "Processing Purpose", multiline: true },
      { key: "dataSubjectCategories", label: "Data Subject Categories" },
      { key: "personalDataCategories", label: "Personal Data Categories" },
      { key: "retentionPeriod", label: "Retention Period" },
      { key: "subprocessors", label: "Sub-Processors", multiline: true },
      { key: "governingLaw", label: "Governing Law" },
    ],
  },
  {
    slug: "partnership-agreement",
    name: "Partnership Agreement",
    shortName: "Partnership Agreement",
    description:
      "Standard terms for business partnership arrangements covering mutual obligations and confidentiality.",
    fields: [
      { key: "provider", label: "Provider" },
      { key: "partner", label: "Partner" },
      { key: "effectiveDate", label: "Effective Date", inputType: "date" as const },
      { key: "partnershipDescription", label: "Partnership Description", multiline: true },
      { key: "providerObligations", label: "Provider Obligations", multiline: true },
      { key: "partnerObligations", label: "Partner Obligations", multiline: true },
      { key: "fees", label: "Fees" },
      { key: "term", label: "Term" },
      { key: "governingLaw", label: "Governing Law" },
      { key: "chosenCourts", label: "Chosen Courts" },
    ],
  },
  {
    slug: "software-license-agreement",
    name: "Software License Agreement",
    shortName: "Software License",
    description:
      "Standard terms for licensing on-premise software, covering usage rights, payment, and liability.",
    fields: [
      { key: "licensor", label: "Licensor" },
      { key: "licensee", label: "Licensee" },
      { key: "effectiveDate", label: "Effective Date", inputType: "date" as const },
      { key: "softwareDescription", label: "Software", multiline: true },
      { key: "licenseScope", label: "License Scope" },
      { key: "fees", label: "License Fees" },
      { key: "term", label: "License Term" },
      { key: "liabilityCap", label: "Liability Cap" },
      { key: "governingLaw", label: "Governing Law" },
      { key: "chosenCourts", label: "Chosen Courts" },
    ],
  },
  {
    slug: "pilot-agreement",
    name: "Pilot Agreement",
    shortName: "Pilot Agreement",
    description:
      "Short-term evaluation agreement allowing a prospective customer to trial a product before committing.",
    fields: [
      { key: "provider", label: "Provider" },
      { key: "customer", label: "Customer" },
      { key: "effectiveDate", label: "Effective Date", inputType: "date" as const },
      { key: "productDescription", label: "Product", multiline: true },
      { key: "pilotPeriod", label: "Pilot Period" },
      { key: "evaluationPurpose", label: "Evaluation Purpose", multiline: true },
      { key: "generalCapAmount", label: "Liability Cap" },
      { key: "governingLaw", label: "Governing Law" },
      { key: "chosenCourts", label: "Chosen Courts" },
      { key: "noticeAddress", label: "Notice Address", multiline: true },
    ],
  },
  {
    slug: "business-associate-agreement",
    name: "Business Associate Agreement",
    shortName: "BAA",
    description:
      "HIPAA-compliant terms governing how a business associate handles protected health information.",
    fields: [
      { key: "coveredEntity", label: "Covered Entity" },
      { key: "businessAssociate", label: "Business Associate" },
      { key: "effectiveDate", label: "Effective Date", inputType: "date" as const },
      { key: "permittedUses", label: "Permitted Uses of PHI", multiline: true },
      { key: "permittedDisclosures", label: "Permitted Disclosures of PHI", multiline: true },
      { key: "safeguards", label: "Safeguards", multiline: true },
      { key: "breachNotificationPeriod", label: "Breach Notification Period" },
      { key: "governingLaw", label: "Governing Law" },
    ],
  },
  {
    slug: "ai-addendum",
    name: "AI Addendum",
    shortName: "AI Addendum",
    description:
      "Addendum to a base software agreement covering AI service usage, input/output ownership, and training restrictions.",
    fields: [
      { key: "provider", label: "Provider" },
      { key: "customer", label: "Customer" },
      { key: "effectiveDate", label: "Effective Date", inputType: "date" as const },
      { key: "baseAgreementName", label: "Base Agreement" },
      { key: "aiServiceDescription", label: "AI Service Description", multiline: true },
      { key: "inputOwnership", label: "Input Ownership" },
      { key: "outputOwnership", label: "Output Ownership" },
      { key: "trainingRestrictions", label: "Training Restrictions", multiline: true },
      { key: "governingLaw", label: "Governing Law" },
      { key: "chosenCourts", label: "Chosen Courts" },
    ],
  },
];

export const DOC_CONFIGS: Record<string, ClientDocConfig> = Object.fromEntries(
  DOC_CONFIGS_LIST.map((c) => [c.slug, c]),
);

export function getDocConfig(slug: string): ClientDocConfig | null {
  return DOC_CONFIGS[slug] ?? null;
}

export { DOC_CONFIGS_LIST };
