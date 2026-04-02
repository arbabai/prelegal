"""
Registry of supported document types and their field definitions.

IMPORTANT: Field `key` values here must exactly match the keys in
frontend/src/lib/docConfigs.ts. Any mismatch means the AI field patch
will be silently ignored by the frontend.
"""

from dataclasses import dataclass, field


@dataclass
class FieldDef:
    key: str
    label: str
    description: str
    multiline: bool = False


@dataclass
class DocConfig:
    slug: str
    name: str
    description: str
    fields: list[FieldDef]
    prompt_fragment: str = ""


REGISTRY: dict[str, DocConfig] = {
    "mutual-nda-standard": DocConfig(
        slug="mutual-nda-standard",
        name="Mutual NDA (Standard Terms)",
        description="The standard legal terms for a Mutual Non-Disclosure Agreement.",
        fields=[],
        prompt_fragment=(
            "This document is a reference-only standard terms document with no fill-in fields. "
            "Explain to the user that this is the legal body of the Mutual NDA and that to create "
            "a complete, personalized NDA they should use the Mutual NDA Creator at /nda. "
            "Offer to answer any questions they have about what the standard terms cover."
        ),
    ),
    "cloud-service-agreement": DocConfig(
        slug="cloud-service-agreement",
        name="Cloud Service Agreement",
        description=(
            "Comprehensive standard terms for selling and buying cloud software and SaaS products, "
            "covering service access, payment, liability, and confidentiality."
        ),
        fields=[
            FieldDef("provider", "Provider", "The company providing the cloud service"),
            FieldDef("customer", "Customer", "The company receiving the cloud service"),
            FieldDef("effectiveDate", "Effective Date", "When the agreement starts (ISO YYYY-MM-DD)"),
            FieldDef("cloudServiceDescription", "Cloud Service Description", "Description of the cloud service being provided", multiline=True),
            FieldDef("subscriptionPeriod", "Subscription Period", "Duration of the subscription (e.g. '1 year', '24 months')"),
            FieldDef("fees", "Fees", "The subscription fees (e.g. '$500/month', '$5,000/year')"),
            FieldDef("paymentProcess", "Payment Process", "How and when payments are made (e.g. 'Net 30, monthly invoicing')"),
            FieldDef("generalCapAmount", "Liability Cap Amount", "Maximum liability exposure (e.g. 'fees paid in prior 12 months')"),
            FieldDef("governingLaw", "Governing Law", "State governing this agreement (e.g. 'Delaware')"),
            FieldDef("chosenCourts", "Chosen Courts", "Court jurisdiction (e.g. 'courts located in New Castle, DE')"),
        ],
    ),
    "design-partner-agreement": DocConfig(
        slug="design-partner-agreement",
        name="Design Partner Agreement",
        description=(
            "Agreement for granting a design partner early access to a product in exchange for "
            "structured feedback to help develop and improve the product."
        ),
        fields=[
            FieldDef("provider", "Provider", "The company providing early product access"),
            FieldDef("partner", "Partner", "The design partner company receiving early access"),
            FieldDef("effectiveDate", "Effective Date", "When the agreement starts (ISO YYYY-MM-DD)"),
            FieldDef("productDescription", "Product", "Name or description of the product the partner will access", multiline=True),
            FieldDef("programDescription", "Design Program", "Description of the design partner program and feedback activities", multiline=True),
            FieldDef("feedbackSchedule", "Feedback Schedule", "How often feedback sessions occur (e.g. 'bi-weekly calls and written feedback')"),
            FieldDef("term", "Term", "Duration of the agreement (e.g. '6 months', '1 year')"),
            FieldDef("fees", "Fees", "Any fees the partner pays (enter 'none' if no fees apply)"),
            FieldDef("governingLaw", "Governing Law", "State governing this agreement (e.g. 'California')"),
            FieldDef("chosenCourts", "Chosen Courts", "Court jurisdiction (e.g. 'courts located in San Francisco, CA')"),
            FieldDef("noticeAddress", "Notice Address", "Postal or email address for formal notices"),
        ],
    ),
    "service-level-agreement": DocConfig(
        slug="service-level-agreement",
        name="Service Level Agreement",
        description=(
            "Standard terms defining uptime and response time commitments for cloud services, "
            "including service credits and termination rights."
        ),
        fields=[
            FieldDef("provider", "Provider", "The company providing the service"),
            FieldDef("customer", "Customer", "The customer receiving the service"),
            FieldDef("effectiveDate", "Effective Date", "When the SLA takes effect (ISO YYYY-MM-DD)"),
            FieldDef("serviceDescription", "Service Description", "The service covered by this SLA"),
            FieldDef("uptimeCommitment", "Uptime Commitment", "Target availability percentage (e.g. '99.9%')"),
            FieldDef("measurementPeriod", "Measurement Period", "Period over which uptime is measured (e.g. 'calendar month')"),
            FieldDef("excludedDowntime", "Excluded Downtime", "Maintenance windows or events excluded from uptime calculation"),
            FieldDef("serviceCreditPercentage", "Service Credit", "Credit percentage for SLA breaches (e.g. '10% of monthly fees')"),
            FieldDef("maximumCredit", "Maximum Monthly Credit", "Cap on service credits per month (e.g. '30% of monthly fees')"),
            FieldDef("terminationThreshold", "Termination Threshold", "Downtime level triggering termination rights (e.g. '3 breaches in 12 months')"),
        ],
    ),
    "professional-services-agreement": DocConfig(
        slug="professional-services-agreement",
        name="Professional Services Agreement",
        description=(
            "Standard terms for professional services engagements covering deliverables, "
            "IP assignment, payment, warranties, and liability."
        ),
        fields=[
            FieldDef("provider", "Provider", "The company delivering professional services"),
            FieldDef("customer", "Customer", "The company receiving professional services"),
            FieldDef("effectiveDate", "Effective Date", "When the agreement starts (ISO YYYY-MM-DD)"),
            FieldDef("servicesDescription", "Services Description", "Description of the professional services to be provided", multiline=True),
            FieldDef("fees", "Fees", "Service fees (e.g. '$200/hour', '$10,000 fixed fee')"),
            FieldDef("paymentSchedule", "Payment Schedule", "When payments are due (e.g. 'Net 30 from invoice date')"),
            FieldDef("ipOwnership", "IP Ownership", "Who owns deliverables and work product (e.g. 'Customer owns all deliverables')"),
            FieldDef("liabilityCap", "Liability Cap", "Maximum liability (e.g. 'fees paid in prior 3 months')"),
            FieldDef("governingLaw", "Governing Law", "State governing this agreement"),
            FieldDef("chosenCourts", "Chosen Courts", "Court jurisdiction for disputes"),
            FieldDef("noticeAddress", "Notice Address", "Addresses for formal notices to each party"),
        ],
    ),
    "data-processing-agreement": DocConfig(
        slug="data-processing-agreement",
        name="Data Processing Agreement",
        description=(
            "Standard terms governing how a provider processes personal data on behalf of a customer, "
            "including GDPR compliance, security, and breach notification."
        ),
        fields=[
            FieldDef("provider", "Processor", "The company processing personal data (the processor)"),
            FieldDef("customer", "Controller", "The company controlling personal data (the controller)"),
            FieldDef("effectiveDate", "Effective Date", "When the DPA takes effect (ISO YYYY-MM-DD)"),
            FieldDef("processingPurpose", "Processing Purpose", "Why personal data is being processed", multiline=True),
            FieldDef("dataSubjectCategories", "Data Subject Categories", "Categories of individuals whose data is processed (e.g. 'employees, end users')"),
            FieldDef("personalDataCategories", "Personal Data Categories", "Types of personal data processed (e.g. 'names, email addresses, usage data')"),
            FieldDef("retentionPeriod", "Retention Period", "How long personal data is retained (e.g. '90 days after termination')"),
            FieldDef("subprocessors", "Sub-Processors", "Third parties the processor may use to process data"),
            FieldDef("governingLaw", "Governing Law", "State or jurisdiction governing this agreement"),
        ],
    ),
    "partnership-agreement": DocConfig(
        slug="partnership-agreement",
        name="Partnership Agreement",
        description=(
            "Standard terms for business partnership arrangements covering mutual obligations, "
            "trademark licensing, payment, and confidentiality."
        ),
        fields=[
            FieldDef("provider", "Provider", "The company offering the partnership program"),
            FieldDef("partner", "Partner", "The partner company joining the program"),
            FieldDef("effectiveDate", "Effective Date", "When the partnership starts (ISO YYYY-MM-DD)"),
            FieldDef("partnershipDescription", "Partnership Description", "Nature and goals of the partnership", multiline=True),
            FieldDef("providerObligations", "Provider Obligations", "What the provider commits to deliver to the partner", multiline=True),
            FieldDef("partnerObligations", "Partner Obligations", "What the partner commits to deliver to the provider", multiline=True),
            FieldDef("fees", "Fees", "Any fees exchanged between the parties (enter 'none' if no fees)"),
            FieldDef("term", "Term", "Duration of the partnership (e.g. '1 year', 'ongoing until terminated')"),
            FieldDef("governingLaw", "Governing Law", "State governing this agreement"),
            FieldDef("chosenCourts", "Chosen Courts", "Court jurisdiction for disputes"),
        ],
    ),
    "software-license-agreement": DocConfig(
        slug="software-license-agreement",
        name="Software License Agreement",
        description=(
            "Standard terms for licensing on-premise software, covering installation rights, "
            "usage restrictions, updates, payment, and liability."
        ),
        fields=[
            FieldDef("licensor", "Licensor", "The company granting the software license"),
            FieldDef("licensee", "Licensee", "The company receiving the software license"),
            FieldDef("effectiveDate", "Effective Date", "When the license takes effect (ISO YYYY-MM-DD)"),
            FieldDef("softwareDescription", "Software", "Name and description of the licensed software", multiline=True),
            FieldDef("licenseScope", "License Scope", "Permitted uses (e.g. 'internal business use, up to 50 named users')"),
            FieldDef("fees", "License Fees", "Fees for the license (e.g. '$10,000/year annual license fee')"),
            FieldDef("term", "License Term", "Duration of the license (e.g. '1 year, auto-renewing')"),
            FieldDef("liabilityCap", "Liability Cap", "Maximum liability (e.g. 'fees paid in prior 12 months')"),
            FieldDef("governingLaw", "Governing Law", "State governing this agreement"),
            FieldDef("chosenCourts", "Chosen Courts", "Court jurisdiction for disputes"),
        ],
    ),
    "pilot-agreement": DocConfig(
        slug="pilot-agreement",
        name="Pilot Agreement",
        description=(
            "Short-term agreement allowing a prospective customer to evaluate a product before "
            "committing to a longer-term commercial deal."
        ),
        fields=[
            FieldDef("provider", "Provider", "The company offering the product for evaluation"),
            FieldDef("customer", "Customer", "The company evaluating the product"),
            FieldDef("effectiveDate", "Effective Date", "When the pilot starts (ISO YYYY-MM-DD)"),
            FieldDef("productDescription", "Product", "Name and description of the product being piloted", multiline=True),
            FieldDef("pilotPeriod", "Pilot Period", "Duration of the evaluation (e.g. '90 days', '3 months')"),
            FieldDef("evaluationPurpose", "Evaluation Purpose", "What the customer is evaluating the product for", multiline=True),
            FieldDef("generalCapAmount", "Liability Cap", "Maximum liability cap (e.g. '$10,000', 'fees paid during pilot period')"),
            FieldDef("governingLaw", "Governing Law", "State governing this agreement"),
            FieldDef("chosenCourts", "Chosen Courts", "Court jurisdiction for disputes"),
            FieldDef("noticeAddress", "Notice Address", "Addresses for formal notices to each party"),
        ],
    ),
    "business-associate-agreement": DocConfig(
        slug="business-associate-agreement",
        name="Business Associate Agreement",
        description=(
            "Standard HIPAA-compliant terms governing the handling of protected health information "
            "between a covered entity and a business associate."
        ),
        fields=[
            FieldDef("coveredEntity", "Covered Entity", "The HIPAA covered entity (healthcare provider, health plan, or clearinghouse)"),
            FieldDef("businessAssociate", "Business Associate", "The company handling PHI on behalf of the covered entity"),
            FieldDef("effectiveDate", "Effective Date", "When the BAA takes effect (ISO YYYY-MM-DD)"),
            FieldDef("permittedUses", "Permitted Uses of PHI", "How the business associate may use protected health information", multiline=True),
            FieldDef("permittedDisclosures", "Permitted Disclosures of PHI", "When the business associate may disclose PHI to third parties", multiline=True),
            FieldDef("safeguards", "Safeguards", "Security measures the business associate will implement to protect PHI", multiline=True),
            FieldDef("breachNotificationPeriod", "Breach Notification Period", "How quickly breaches must be reported (e.g. '60 days of discovery')"),
            FieldDef("governingLaw", "Governing Law", "State governing this agreement"),
        ],
    ),
    "ai-addendum": DocConfig(
        slug="ai-addendum",
        name="AI Addendum",
        description=(
            "Addendum to a base software agreement covering AI and machine learning services, "
            "including input/output ownership and model training restrictions."
        ),
        fields=[
            FieldDef("provider", "Provider", "The company providing the AI service"),
            FieldDef("customer", "Customer", "The company using the AI service"),
            FieldDef("effectiveDate", "Effective Date", "When this addendum takes effect (ISO YYYY-MM-DD)"),
            FieldDef("baseAgreementName", "Base Agreement", "Name of the underlying agreement this addendum applies to (e.g. 'Cloud Service Agreement dated January 1, 2026')"),
            FieldDef("aiServiceDescription", "AI Service Description", "Description of the AI/ML service covered by this addendum", multiline=True),
            FieldDef("inputOwnership", "Input Ownership", "Who owns the inputs submitted to the AI service (e.g. 'Customer retains all rights to inputs')"),
            FieldDef("outputOwnership", "Output Ownership", "Who owns the outputs generated by the AI service (e.g. 'Customer owns outputs, subject to provider license')"),
            FieldDef("trainingRestrictions", "Training Restrictions", "Whether provider may use customer data to train models (e.g. 'Provider may not use customer inputs or outputs to train models')"),
            FieldDef("governingLaw", "Governing Law", "State governing this addendum"),
            FieldDef("chosenCourts", "Chosen Courts", "Court jurisdiction for disputes"),
        ],
    ),
}


def get_config(slug: str) -> DocConfig | None:
    return REGISTRY.get(slug)


SUPPORTED_SLUGS: frozenset[str] = frozenset(REGISTRY.keys())
